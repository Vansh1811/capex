import fs from "node:fs";

const CDP_PORT = 9223;
const BASE = "http://localhost:8082/about";
const OUT = ".freebuff/shots";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function connect() {
  // Launch Chrome with the debugging port
  const { spawn } = await import("node:child_process");
  const exe = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const profile = process.cwd().replace(/\//g, "\\") + "\\.freebuff\\chrome-profile";
  const child = spawn(exe, [
    "--headless=new",
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${profile}`,
    "--no-first-run",
    "--disable-gpu",
    "--window-size=1440,1000",
    "about:blank",
  ], { stdio: "ignore" });
  child.unref();

  // wait for the devtools endpoint
  let targets = null;
  for (let i = 0; i < 30; i++) {
    await sleep(500);
    try {
      const res = await fetch(`http://localhost:${CDP_PORT}/json/list`);
      targets = await res.json();
      if (targets?.some((t) => t.type === "page")) break;
    } catch { /* retry */ }
  }
  const page = targets.find((t) => t.type === "page");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res) => ws.addEventListener("open", res, { once: true }));

  let id = 0;
  const pending = new Map();
  const listeners = [];
  ws.addEventListener("message", (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
    for (const fn of listeners) fn(msg);
  });
  const send = (method, params = {}) =>
    new Promise((res) => {
      const mid = ++id;
      pending.set(mid, res);
      ws.send(JSON.stringify({ id: mid, method, params }));
    });

  return { ws, send, listeners };
}

async function evalJS(send, expression) {
  const res = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  return res.result?.result?.value;
}

async function shot(send, path) {
  const res = await send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path, Buffer.from(res.result.data, "base64"));
}

async function scrollTo(send, expr) {
  await evalJS(send, `window.__scrollTo(${expr}); true`);
  await sleep(1400);
}

// scroll helper injected before use
const SCROLL_HELPER = `
window.__scrollTo = (y) => window.scrollTo({ top: y, behavior: 'instant' });
true;
`;

const run = async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const { ws, send, listeners } = await connect();
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Log.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });

  const errors = [];
  // collect page exceptions
  listeners.push((msg) => {
    if (msg.method === "Runtime.exceptionThrown") {
      errors.push(msg.params.exceptionDetails?.exception?.description ?? "exception");
    }
  });

  await send("Page.navigate", { url: BASE });
  await sleep(4500);
  await evalJS(send, SCROLL_HELPER);

  // find section offsets
  const offsets = await evalJS(send, `(() => {
    const q = (label) => document.querySelector('[aria-label="' + label + '"]');
    const top = (el) => el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : -1;
    return JSON.stringify({
      why: top(q('Why Capex')),
      proc: top(q('How the work moves')),
      story: top(q('Our story')),
      overflow: document.documentElement.scrollWidth - window.innerWidth
    });
  })()`);
  console.log("1440 offsets:", offsets);
  const o = JSON.parse(offsets);

  await scrollTo(send, `${o.why} - 60`);
  await shot(send, `${OUT}/w-why.png`);
  await scrollTo(send, `${o.proc} - 60`);
  await shot(send, `${OUT}/w-proc.png`);
  // click stage 5 in the real desktop browser to capture the live sheet
  await evalJS(send, `(() => {
    const proc = document.querySelector('[aria-label="How the work moves"]');
    const buttons = [...proc.querySelectorAll('ol button')];
    buttons[4].click();
    return true;
  })()`);
  await sleep(700);
  await shot(send, `${OUT}/w-proc-live.png`);
  await scrollTo(send, `${o.story} - 60`);
  await shot(send, `${OUT}/w-story.png`);

  // ---- mobile pass ----
  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await send("Page.navigate", { url: BASE });
  await sleep(4000);
  await evalJS(send, SCROLL_HELPER);
  const mOff = JSON.parse(await evalJS(send, `(() => {
    const q = (label) => document.querySelector('[aria-label="' + label + '"]');
    const top = (el) => el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : -1;
    return JSON.stringify({
      why: top(q('Why Capex')),
      proc: top(q('How the work moves')),
      story: top(q('Our story')),
      overflow: document.documentElement.scrollWidth - window.innerWidth
    });
  })()`));
  console.log("390 offsets:", JSON.stringify(mOff));

  await scrollTo(send, `${mOff.why} - 40`);
  await shot(send, `${OUT}/m-why.png`);
  await scrollTo(send, `${mOff.proc} - 40`);
  // open stage 2 disclosure on mobile
  await evalJS(send, `(() => {
    const proc = document.querySelector('[aria-label="How the work moves"]');
    const buttons = [...proc.querySelectorAll('ol button')];
    buttons[1].click();
    return true;
  })()`);
  await sleep(600);
  await shot(send, `${OUT}/m-proc.png`);
  await scrollTo(send, `${mOff.story} - 40`);
  await shot(send, `${OUT}/m-story.png`);

  console.log("console errors:", errors.length ? errors : "none");
  ws.close();
  process.exit(0);
};

run().catch((e) => { console.error("CAPTURE FAILED:", e.message); process.exit(1); });
