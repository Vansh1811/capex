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
  const evalFull = async (expr) => {
    const res = await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true });
    if (res.result?.exceptionDetails) {
      return { threw: res.result.exceptionDetails.exception?.description ?? res.result.exceptionDetails.text };
    }
    return { value: res.result?.result?.value };
  };

  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: "http://localhost:8082/about" });
  await sleep(5000);

  // scroll with verification + retry
  let scrollY = 0;
  for (let attempt = 0; attempt < 3 && scrollY < 3000; attempt++) {
    const r = await evalFull(`(function(){
      var el = document.querySelector('[aria-label="Our story"]');
      if (!el) return "no-element";
      var y = el.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo(0, y);
      return "ok:" + Math.round(y);
    })()`);
    await sleep(1200);
    scrollY = (await evalFull(`Math.round(window.scrollY)`)).value ?? 0;
    console.log(`attempt ${attempt}: ${JSON.stringify(r)} → scrollY=${scrollY}`);
  }

  await sleep(2500);
  const plate = await evalFull(`(function(){
    var img = document.querySelector('[aria-label="Our story"] img');
    if (!img) return "no-img";
    var inner = img.parentElement;
    var cs = getComputedStyle(inner);
    var outer = inner.parentElement;
    var or = outer.getBoundingClientRect();
    return JSON.stringify({
      complete: img.complete,
      natural: img.naturalWidth + "x" + img.naturalHeight,
      src: img.currentSrc.split("/").pop() || img.src.split("/").pop(),
      clip: cs.clipPath,
      outerInVp: or.top >= 0 && or.top < window.innerHeight,
      outerTopVp: Math.round(or.top),
      outerH: Math.round(or.height)
    });
  })()`);
  console.log("PLATE:", JSON.stringify(plate));

  const res = await send("Page.captureScreenshot", { format: "png", clip: { x: 1000, y: 100, width: 440, height: 800, scale: 1 } });
  fs.writeFileSync(".freebuff/shots/story-plate-probe4.png", Buffer.from(res.result.data, "base64"));
  console.log("shot written");
  ws.close();
  process.exit(0);
};

run().catch((e) => { console.error("FAIL:", e.message); process.exit(1); });
