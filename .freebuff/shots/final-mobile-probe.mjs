import fs from "node:fs";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const run = async () => {
  const { spawn } = await import("node:child_process");
  const exe = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const profile = process.cwd().replace(/\//g, "\\") + "\\.freebuff\\chrome-p2";
  const child = spawn(exe, [
    "--headless=new",
    "--remote-debugging-port=9225",
    `--user-data-dir=${profile}`,
    "--no-first-run",
    "--disable-gpu",
    "--window-size=390,844",
    "about:blank",
  ], { stdio: "ignore" });
  child.unref();

  let targets = null;
  for (let i = 0; i < 30; i++) {
    await sleep(500);
    try {
      const res = await fetch("http://localhost:9225/json/list");
      targets = await res.json();
      if (targets?.some((t) => t.type === "page")) break;
    } catch { /* retry */ }
  }
  const page = targets.find((t) => t.type === "page");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res) => ws.addEventListener("open", res, { once: true }));

  let id = 0;
  const pending = new Map();
  ws.addEventListener("message", (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  });
  const send = (method, params = {}) => new Promise((res) => {
    const mid = ++id;
    pending.set(mid, res);
    ws.send(JSON.stringify({ id: mid, method, params }));
  });
  const evalFull = async (expr) => {
    const res = await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true });
    if (res.result?.exceptionDetails) {
      return { threw: res.result.exceptionDetails.exception?.description ?? res.result.exceptionDetails.text };
    }
    return { value: res.result?.result?.value };
  };

  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await send("Page.navigate", { url: "http://localhost:8082/about" });
  await sleep(5000);

  const errors = [];
  ws.addEventListener("message", (ev) => {
    const m = JSON.parse(ev.data);
    if (m.method === "Runtime.exceptionThrown") errors.push("exception");
  });

  // overflow check
  const ovf = await evalFull(`document.documentElement.scrollWidth - window.innerWidth`);
  console.log("390 overflow px:", ovf.value);

  // story plate with verified scroll
  for (let attempt = 0; attempt < 3; attempt++) {
    await evalFull(`(function(){
      var el = document.querySelector('[aria-label="Our story"]');
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 40);
      return true;
    })()`);
    await sleep(1200);
    const y = (await evalFull(`Math.round(window.scrollY)`)).value;
    if (y > 2000) { console.log("scroll landed at", y); break; }
  }
  await sleep(2200);
  const plate = await evalFull(`(function(){
    var img = document.querySelector('[aria-label="Our story"] img');
    if (!img) return "no-img";
    return JSON.stringify({
      complete: img.complete,
      clip: getComputedStyle(img.parentElement).clipPath
    });
  })()`);
  console.log("STORY PLATE (390):", JSON.stringify(plate));

  // process meta line renders the new punctuation
  await evalFull(`(function(){
    var el = document.querySelector('[aria-label="How the work moves"]');
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 40);
    return true;
  })()`);
  await sleep(1500);
  const meta = await evalFull(`(function(){
    var p = document.querySelector('[aria-label="How the work moves"] ol div p.font-tech, [aria-label="How the work moves"] ol p');
    return p ? p.textContent.trim() : "not-found";
  })()`);
  console.log("PROCESS META:", JSON.stringify(meta));
  console.log("exceptions:", errors.length || "none");

  ws.close();
  process.exit(0);
};

run().catch((e) => { console.error("FAIL:", e.message); process.exit(1); });
