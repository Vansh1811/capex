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

  const pre = await ev(`JSON.stringify({
    scrollY: Math.round(window.scrollY),
    docH: document.documentElement.scrollHeight,
    storyTop: Math.round(document.querySelector('[aria-label=\"Our story\"]').getBoundingClientRect().top + window.scrollY)
  })`);
  console.log("PRE:", pre);

  await ev(`window.__s = document.querySelector('[aria-label=\"Our story\"]').getBoundingClientRect().top + window.scrollY - 60;
    window.scrollTo({top: window.__s, behavior: 'instant'}); true`);
  await sleep(2500);

  const post = await ev(`(() => {
    const story = document.querySelector('[aria-label=\"Our story\"]');
    const plate = story.querySelector('img').closest('.overflow-hidden');
    const stickyWrap = plate.closest('.lg\\\\:sticky');
    const cs = stickyWrap ? getComputedStyle(stickyWrap) : null;
    const pr = plate.getBoundingClientRect();
    const sr = stickyWrap ? stickyWrap.getBoundingClientRect() : null;
    return JSON.stringify({
      scrollY: Math.round(window.scrollY),
      plateRect: { top: Math.round(pr.top), h: Math.round(pr.height), w: Math.round(pr.width) },
      stickyRect: sr ? { top: Math.round(sr.top), position: cs.position } : null,
      stickyProp: cs ? (cs.top + " / " + cs.position) : "none"
    });
  })()`);
  console.log("POST:", post);

  // fresh observers on both plates — story (suspect) and range (control)
  const io = await ev(`new Promise((resolve) => {
    const storyPlate = document.querySelector('[aria-label=\"Our story\"] img').closest('.overflow-hidden');
    const rangePlate = document.querySelector('[aria-label=\"Where the work lives\"] img, [aria-label=\"Sectors\"] img');
    const out = {};
    const seen = { story: false, range: false };
    const done = () => { if (seen.story && seen.range) resolve(JSON.stringify(out)); };
    const mk = (key, el) => {
      if (!el) { out[key] = "element-not-found"; seen[key] = true; done(); return; }
      const o = new IntersectionObserver((entries) => {
        const e = entries[entries.length - 1];
        out[key] = { isIntersecting: e.isIntersecting, ratio: Math.round(e.intersectionRatio * 100) / 100, top: Math.round(e.boundingClientRect.top) };
        seen[key] = true;
        o.disconnect();
        done();
      }, { threshold: 0.2, rootMargin: "0px 0px -10% 0px" });
      o.observe(el);
    };
    mk("story", storyPlate);
    const rangeSection = [...document.querySelectorAll("section")].find((s) => (s.textContent || "").includes("Beneath cities"));
    mk("range", rangeSection ? rangeSection.querySelector(".overflow-hidden") : null);
    setTimeout(() => resolve(JSON.stringify({ ...out, timeout: true })), 1500);
  })`);
  console.log("IO:", io);

  ws.close();
  process.exit(0);
};

run().catch((e) => { console.error("FAIL:", e.message); process.exit(1); });
