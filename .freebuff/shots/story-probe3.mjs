import fs from "node:fs";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const run = async () => {
  const { spawn } = await import("node:child_process");
  const exe = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const profile = process.cwd().replace(/\//g, "\\") + "\\.freebuff\\chrome-p2";
  const child = spawn(exe, [
    "--headless=new",
    "--remote-debugging-port=9224",
    `--user-data-dir=${profile}`,
    "--no-first-run",
    "--disable-gpu",
    "--window-size=1440,1000",
    "about:blank",
  ], { stdio: "ignore" });
  child.unref();

  let targets = null;
  for (let i = 0; i < 30; i++) {
    await sleep(500);
    try {
      const res = await fetch("http://localhost:9224/json/list");
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
  const evRaw = async (expr) =>
    await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true });
  const ev = async (expr) => (await evRaw(expr)).result?.result?.value;

  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: "http://localhost:8082/about" });
  await sleep(4000);

  // 1: options-object scrollTo with error capture
  const r1 = await evRaw(`(function(){
    try { window.scrollTo({top: 2200, behavior: 'instant'}); return "ok:" + Math.round(window.scrollY); }
    catch (e) { return "threw:" + e.message; }
  })()`);
  console.log("method1 options-scrollTo:", JSON.stringify(r1.result));
  await sleep(800);
  console.log("  scrollY now:", await ev(`Math.round(window.scrollY)`));

  // 2: two-arg scrollTo
  const r2 = await evRaw(`(function(){
    try { window.scrollTo(0, 2200); return "ok:" + Math.round(window.scrollY); }
    catch (e) { return "threw:" + e.message; }
  })()`);
  console.log("method2 two-arg:", JSON.stringify(r2.result));
  await sleep(800);
  console.log("  scrollY now:", await ev(`Math.round(window.scrollY)`));

  // 3: scrollingElement.scrollTop
  const r3 = await evRaw(`(function(){
    try { document.scrollingElement.scrollTop = 2200; return "ok:" + Math.round(document.scrollingElement.scrollTop); }
    catch (e) { return "threw:" + e.message; }
  })()`);
  console.log("method3 scrollTop:", JSON.stringify(r3.result));
  await sleep(800);
  console.log("  scrollY now:", await ev(`Math.round(window.scrollY)`));

  // where does the scroll land relative to the story section?
  const pos = await ev(`JSON.stringify({
    scrollY: Math.round(window.scrollY),
    storyTopVp: Math.round(document.querySelector('[aria-label=\"Our story\"]').getBoundingClientRect().top)
  })`);
  console.log("POS:", pos);

  ws.close();
  process.exit(0);
};

run().catch((e) => { console.error("FAIL:", e.message); process.exit(1); });
