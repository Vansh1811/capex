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
  const ev = async (expr) =>
    (await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true })).result?.result?.value;

  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: "http://localhost:8082/about" });
  await sleep(4000);
  await ev(`window.scrollTo({top: document.querySelector('[aria-label="Our story"]').getBoundingClientRect().top + window.scrollY - 40, behavior: 'instant'}); true`);
  await sleep(3200);
  const probe = await ev(`(() => {
    const img = document.querySelector('[aria-label="Our story"] img');
    const r = img.getBoundingClientRect();
    const cs = getComputedStyle(img.parentElement);
    return JSON.stringify({
      complete: img.complete,
      natural: img.naturalWidth + "x" + img.naturalHeight,
      rect: Math.round(r.width) + "x" + Math.round(r.height),
      clip: cs.clipPath,
      opacity: cs.opacity,
      src: img.currentSrc.split("/").pop()
    });
  })()`);
  console.log("STORY PLATE:", probe);
  const res = await send("Page.captureScreenshot", { format: "png", clip: { x: 1000, y: 200, width: 440, height: 700, scale: 1 } });
  fs.writeFileSync(".freebuff/shots/story-plate-probe.png", Buffer.from(res.result.data, "base64"));
  console.log("probe shot written");
  ws.close();
  process.exit(0);
};

run().catch((e) => { console.error("FAIL:", e.message); process.exit(1); });
