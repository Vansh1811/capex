// Generates public/og.png — 1200x630 interim OG card (navy field + amber rule).
// Dependency-free PNG writer (IHDR/IDAT/IEND, filter 0 scanlines, zlib deflate).
// Replaced in Phase 6I by the branded media-library asset per Phase 5 §7.6.4.
import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";

const W = 1200;
const H = 630;

// Phase 4 §2.2 tokens (oklch → sRGB approximations for raster use)
const NAVY = [32, 39, 66]; // --brand oklch(0.28 0.09 262)
const NAVY_DEEP = [23, 27, 49]; // --brand-deep
const AMBER = [228, 169, 61]; // --accent family
const WHITE = [240, 242, 247];

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

// Pixel: vertical navy→navy-deep field, amber keyline, white lower band
function px(x, y) {
  const t = y / H;
  const base = [
    Math.round(NAVY[0] + (NAVY_DEEP[0] - NAVY[0]) * t),
    Math.round(NAVY[1] + (NAVY_DEEP[1] - NAVY[1]) * t),
    Math.round(NAVY[2] + (NAVY_DEEP[2] - NAVY[2]) * t),
  ];
  // amber keyline at y 540..552 full width
  if (y >= 540 && y < 552) return AMBER;
  // subtle white plate bottom-right (drawing-sheet corner mark zone)
  if (x >= W - 160 && y >= 552 && y < 566) return WHITE;
  return base;
}

const raw = Buffer.alloc(H * (1 + W * 3));
let o = 0;
for (let y = 0; y < H; y++) {
  raw[o++] = 0; // filter: none
  for (let x = 0; x < W; x++) {
    const [r, g, b] = px(x, y);
    raw[o++] = r;
    raw[o++] = g;
    raw[o++] = b;
  }
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 2; // color type: truecolor

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk("IHDR", ihdr),
  chunk("IDAT", deflateSync(raw, { level: 9 })),
  chunk("IEND", Buffer.alloc(0)),
]);

writeFileSync(new URL("../public/og.png", import.meta.url), png);
console.log(`og.png written: ${W}x${H}, ${png.length} bytes`);
