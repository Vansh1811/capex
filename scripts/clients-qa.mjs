// QA probe for the /clients page (marquee completeness, text-only index).
// Usage: node scripts/clients-qa.mjs [port]
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
const port = process.argv[2] || "8080";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
});
const page = await ctx.newPage();
const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text().slice(0, 160));
});
page.on("pageerror", (e) => errors.push(`pageerror: ${String(e).slice(0, 120)}`));

await page.goto(`http://localhost:${port}/clients`, { waitUntil: "networkidle" });

const viewports = [
  { name: "1920", width: 1920, height: 1080 },
  { name: "1440", width: 1440, height: 900 },
  { name: "1280", width: 1280, height: 800 },
  { name: "1024", width: 1024, height: 768 },
  { name: "768", width: 768, height: 1024 },
  { name: "430", width: 430, height: 932 },
  { name: "414", width: 414, height: 896 },
  { name: "390", width: 390, height: 844 },
  { name: "375", width: 375, height: 812 },
  { name: "320", width: 320, height: 568 },
];

const results = [];
for (const vp of viewports) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.waitForTimeout(250);
  const r = await page.evaluate(() => {
    const marquee = document.querySelector('[aria-label="Client logo showcase"]');
    const track = document.querySelector(".animate-marquee");
    const imgs = [...document.querySelectorAll('[aria-label="Client logo showcase"] img')];
    const uniqueSrcs = new Set(imgs.map((i) => i.getAttribute("src")));
    const indexSection = document.querySelector('[aria-label="Client categories"]');
    const exhibition = document.querySelector('[aria-label$="— client exhibition"]');
    const exhibitionImgs = exhibition ? [...exhibition.querySelectorAll("img")] : [];
    const exhibitionLogos = exhibitionImgs.filter((i) =>
      (i.getAttribute("src") || "").includes("/uploads/clients/logos/"),
    );
    const rowLogos = exhibition
      ? [...exhibition.querySelectorAll("button img")].filter((i) =>
          (i.getAttribute("src") || "").includes("/uploads/clients/logos/"),
        )
      : [];
    const indexRows = exhibition ? exhibition.querySelectorAll("button").length : 0;
    const names = exhibition ? [...exhibition.querySelectorAll("button span span")] : [];
    const marqueeRect = marquee ? marquee.getBoundingClientRect() : null;
    return {
      marqueeExists: !!marquee,
      trackCount: document.querySelectorAll(".animate-marquee > div").length,
      marqueeImgs: imgs.length,
      uniqueLogoSrcs: uniqueSrcs.size,
      alts: imgs.map((i) => i.getAttribute("alt")),
      indexRows,
      indexLogoImgs: rowLogos.length,
      exhibitionImgSrcs: exhibitionImgs.map((i) => i.getAttribute("src")).slice(0, 8),
      overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      marqueeWidth: marqueeRect ? Math.round(marqueeRect.width) : null,
      marqueeOverflow: marquee ? marquee.scrollWidth > marquee.clientWidth + 1 : null,
      trackWidth: track ? track.scrollWidth : null,
      half0: (() => {
        const halves = document.querySelectorAll(".animate-marquee > div");
        return halves[0] ? Math.round(halves[0].getBoundingClientRect().width) : null;
      })(),
      half1: (() => {
        const halves = document.querySelectorAll(".animate-marquee > div");
        return halves[1] ? Math.round(halves[1].getBoundingClientRect().width) : null
      })(),
    };
  });
  results.push({ viewport: vp.name, ...r });
}

// Desktop-only: animation running, seamless loop, hover pause, category filter.
await page.setViewportSize({ width: 1440, height: 900 });
await page.waitForTimeout(300);
const anim = await page.evaluate(() => {
  const track = document.querySelector(".animate-marquee");
  const cs = getComputedStyle(track);
  return {
    animationName: cs.animationName,
    duration: cs.animationDuration,
    playState: cs.animationPlayState,
  };
});
const x1 = await page.evaluate(
  () => document.querySelector(".animate-marquee").getBoundingClientRect().x,
);
await page.waitForTimeout(1000);
const x2 = await page.evaluate(
  () => document.querySelector(".animate-marquee").getBoundingClientRect().x,
);

// Hover pause check
const trackBox = await page.locator(".animate-marquee").boundingBox();
await page.mouse.move(trackBox.x + 200, trackBox.y + 20);
await page.waitForTimeout(400);
const hoverPlay = await page.evaluate(() => {
  const track = document.querySelector(".animate-marquee");
  return getComputedStyle(track).animationPlayState;
});

// Category switching
const catButtons = await page.locator('[aria-label="Select a client category"] button').all();
const catCount = catButtons.length;
await catButtons[2].click();
await page.waitForTimeout(300);
const oilGasFirst = await page.evaluate(() => {
  const ex = document.querySelector('[aria-label$="— client exhibition"]');
  const first = ex?.querySelector("button span span");
  return first ? first.textContent : null;
});
const oilGasRows = await page.evaluate(
  () => document.querySelectorAll('[aria-label$="— client exhibition"] button').length,
);

// Keyboard: arrows on category row
await page.locator('[aria-label="Select a client category"] button').first().focus();
await page.keyboard.press("ArrowRight");
await page.waitForTimeout(200);
const activeAfterArrow = await page.evaluate(() => {
  const pressed = document.querySelector('[aria-pressed="true"]');
  return pressed ? pressed.textContent.trim() : null;
});

// Mobile tap expansion (index interaction)
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(300);
const firstRow = page.locator('[aria-label$="— client exhibition"] button').first();
await firstRow.click();
await page.waitForTimeout(600);
const mobileExpanded = await page.evaluate(() => {
  const ex = document.querySelector('[aria-label$="— client exhibition"]');
  const expanded = ex?.querySelector('button[aria-expanded="true"]');
  return !!expanded && expanded.getBoundingClientRect().height > 0;
});

console.log(
  JSON.stringify(
    { results, anim, movedX: Math.round((x1 - x2) * 100) / 100, hoverPlay, catCount, oilGasFirst, oilGasRows, activeAfterArrow, mobileExpanded, consoleErrors: errors },
    null,
    1,
  ),
);
await browser.close();
