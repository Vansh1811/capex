// Reduced-motion verification (Projects QA): uses the npx-cached playwright-core.
// Usage: node scripts/rm-check.mjs
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const candidates = [
  "C:/Users/svans/AppData/Local/npm-cache/_npx/31e32ef8478fbf80/node_modules/playwright-core",
  "C:/Users/svans/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/playwright-core",
];
let chromium;
for (const c of candidates) {
  try {
    ({ chromium } = require(c));
    break;
  } catch {}
}
if (!chromium) {
  console.error("playwright-core not found in npx cache");
  process.exit(1);
}
const browser = await chromium.launch({ channel: "chrome", headless: true });
const ctx = await browser.newContext({
  reducedMotion: "reduce",
  viewport: { width: 1280, height: 900 },
});
const page = await ctx.newPage();
const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text().slice(0, 120));
});
await page.goto("http://localhost:8080/projects/ongoing", { waitUntil: "networkidle" });
const probe = await page.evaluate(() => {
  const anyTransition = [...document.querySelectorAll("*")].some((el) => {
    const d = getComputedStyle(el).transitionDuration;
    return d && parseFloat(d) > 0.05;
  });
  return {
    stations: document.querySelectorAll("article").length,
    statusMarks: [...document.querySelectorAll("span")].filter(
      (s) => s.textContent.trim() === "Ongoing",
    ).length,
    anyLongTransition: anyTransition,
    overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    h1: document.querySelector("h1")?.textContent.trim(),
  };
});
console.log(JSON.stringify({ probe, consoleErrors: errors }, null, 1));
await browser.close();
