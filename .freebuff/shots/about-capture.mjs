import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const URL = "http://localhost:8082/about";
const OUT = ".freebuff/shots";
mkdirSync(OUT, { recursive: true });

const chrome = spawn(CHROME, [
  "--headless=new",
  "--remote-debugging-port=9333",
  `--user-data-dir=${process.env.TEMP}\\capex-cdp-${Date.now()}`,
  "--no-first-run",
  "--disable-gpu",
  "--window-size=1440,900",
  "about:blank",
]);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function target() {
  for (let i = 0; i < 30; i++) {
    try {
      const list = await (await fetch("http://127.0.0.1:9333/json/list")).json();
      const page = list.find((t) => t.type === "page");
      if (page) return page;
    } catch {}
    await sleep(500);
  }
  throw new Error("no CDP target");
}

const t = await target();
const ws = new WebSocket(t.webSocketDebuggerUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

let id = 0;
const pending = new Map();
const consoleErrors = [];
ws.onmessage = (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); }
  if (m.method === "Runtime.consoleAPICalled" && ["error", "warning"].includes(m.params.type))
    consoleErrors.push(m.params.args.map(a => a.value ?? a.description ?? "").join(" ").slice(0, 200));
  if (m.method === "Runtime.exceptionThrown")
    consoleErrors.push("EXC: " + (m.params.exceptionDetails?.exception?.description ?? "").slice(0, 200));
};
const send = (method, params = {}) =>
  new Promise((res) => { id += 1; pending.set(id, res); ws.send(JSON.stringify({ id, method, params })); });
const evalJs = async (expr) => (await send("Runtime.evaluate", { expression: expr, returnByValue: true })).result?.value;

await send("Page.enable");
await send("Runtime.enable");
await send("Page.navigate", { url: URL });
await sleep(6000);
// force all lazy images to load for capture
await evalJs(
  `document.querySelectorAll('img[loading=lazy]').forEach(i=>{i.loading='eager';}); 'ok'`,
);
await evalJs(
  `(async function(){window.scrollTo({top:document.body.scrollHeight,behavior:'instant'});await new Promise(r=>setTimeout(r,800));window.scrollTo({top:0,behavior:'instant'});await new Promise(r=>setTimeout(r,600));return document.images.length;})()`,
);
await sleep(2500);

async function shoot(name, selector) {
  if (selector) {
    const y = await evalJs(
      `(function(){var el=document.querySelector("${selector}");if(!el)return -1;var r=el.getBoundingClientRect();var y=r.top+window.scrollY-70;window.scrollTo({top:y,behavior:'instant'});return Math.round(window.scrollY);})()`,
    );
    console.log("  scrollY:", y);
    await sleep(1800);
  }
  const shot = await send("Page.captureScreenshot", { format: "png" });
  writeFileSync(`${OUT}/${name}.png`, Buffer.from(shot.data, "base64"));
  console.log("shot:", name);
}

// ---------- DESKTOP 1440 ----------
await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await sleep(800);
await shoot("a-hero", "section[aria-label^='About Capex']");
await shoot("a-twoworlds", "section[aria-label='The engineered world']");
await shoot("a-why", "section[aria-label='Why Capex']");
await shoot("a-why2", "section[aria-label='Why Capex']");
await shoot("a-process", "section[aria-label='How the work moves']");
await shoot("a-process2", "section[aria-label='How the work moves']");
await shoot("a-story", "section[aria-label='Our story']");
await shoot("a-range", "section[aria-label='The range of work']");
await shoot("a-people", "section[aria-label='The people behind the work']");
await shoot("a-presence", "section[aria-label='Where Capex works from']");
await shoot("a-trust", "section[aria-label='Trust and proof']");
await shoot("a-closing", "footer[aria-label='Continue through the site']");
const desktop = await evalJs(`({ow: document.documentElement.scrollWidth - document.documentElement.clientWidth})`);

// hover stage 3 in the process section
await evalJs(`const b=[...document.querySelectorAll('button[aria-expanded]')][2]; b.dispatchEvent(new MouseEvent('mouseover',{bubbles:true})); b.focus(); 'ok'`);
await sleep(700);
await shoot("a-process-hover", "section[aria-label='How the work moves']");

// ---------- MOBILE 390 ----------
await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await evalJs(`window.scrollTo(0,0); 'ok'`);
await sleep(900);
await shoot("m-hero", "section[aria-label^='About Capex']");
await shoot("m-why", "section[aria-label='Why Capex']");
await shoot("m-process", "section[aria-label='How the work moves']");
await evalJs(`[...document.querySelectorAll('button[aria-expanded]')][1]?.click(); 'ok'`);
await sleep(700);
await shoot("m-process-open", "section[aria-label='How the work moves']");
await shoot("m-story", "section[aria-label='Our story']");
await shoot("m-presence", "section[aria-label='Where Capex works from']");
await shoot("m-people", "section[aria-label='The people behind the work']");
const mobile = await evalJs(`({ow: document.documentElement.scrollWidth - document.documentElement.clientWidth})`);

console.log("overflow desktop:", JSON.stringify(desktop), "mobile:", JSON.stringify(mobile));
console.log("console errors:", consoleErrors.length ? consoleErrors : "none");

ws.close();
chrome.kill();
process.exit(0);
