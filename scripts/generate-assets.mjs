import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const TILE = "#0B0F0E";
const GRADIENT_START = "#34D399";
const GRADIENT_END = "#10B981";

const here = dirname(fileURLToPath(import.meta.url));
const assetsDir = join(here, "..", "assets");
mkdirSync(assetsDir, { recursive: true });

function archSvg({ size, tile = true, archW = 56, archH = 66, top = 14 }) {
  const x0 = (100 - archW) / 2;
  const x1 = x0 + archW;
  const yTop = top;
  const yBottom = yTop + archH;
  const r = archW / 2;
  const path = `M${x0} ${yBottom} L${x0} ${yTop} A${r} ${r} 0 0 1 ${x1} ${yTop} L${x1} ${yBottom} Z`;
  const bg = tile ? `<rect width="100" height="100" fill="${TILE}"/>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
${bg}
<defs>
  <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${GRADIENT_START}"/>
    <stop offset="1" stop-color="${GRADIENT_END}"/>
  </linearGradient>
</defs>
<path d="${path}" fill="url(#g)"/>
</svg>`;
}

const targets = [
  { file: "icon.png", size: 1024, tile: true, archW: 54, archH: 64, top: 16 },
  {
    file: "android-icon-foreground.png",
    size: 1024,
    tile: false,
    archW: 44,
    archH: 54,
    top: 22,
  },
  {
    file: "splash-icon.png",
    size: 512,
    tile: false,
    archW: 56,
    archH: 66,
    top: 14,
  },
  { file: "logo.png", size: 512, tile: true, archW: 56, archH: 66, top: 14 },
  { file: "favicon.png", size: 64, tile: true, archW: 56, archH: 66, top: 14 },
];

for (const target of targets) {
  const svg = archSvg(target);
  await sharp(Buffer.from(svg))
    .png()
    .toFile(join(assetsDir, target.file));
  console.log(`generated ${target.file} (${target.size}x${target.size})`);
}
