/* Genererer app-ikoner + og-image til AP Klar.
 * Kør: node scripts/gen-icons.mjs
 * Bruger public/mascot/welcome.webp som motiv og brandfarverne fra globals.css.
 */
import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const mascotWebp = readFileSync(join(root, "public/mascot/welcome.webp"));
// Konvertér maskotten til en PNG-buffer, før den indlejres i SVG'ens
// data-URI (librsvg indlejrer PNG/JPEG mest pålideligt).
const mascot = await sharp(mascotWebp).png().toBuffer();

// App-ikon: lilla gradient + hvid "tallerken" + maskotten i en cirkel.
// rx: hjørnerunding i forhold til størrelsen (0 = skarpe hjørner).
async function appIcon(size, rxRatio, outName) {
  const rx = Math.round(size * rxRatio);
  const plateR = Math.round(size * 0.315); // hvid tallerken
  const plateGap = Math.round(size * 0.02);
  const imgR = Math.round(size * 0.30); // maskot-cirkel (lidt mindre end tallerkenen)
  const c = size / 2;

  const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8b63e8"/>
      <stop offset="0.55" stop-color="#7c4fe0"/>
      <stop offset="1" stop-color="#5b32b8"/>
    </linearGradient>
    <clipPath id="round"><rect width="${size}" height="${size}" rx="${rx}"/></clipPath>
    <clipPath id="maskot"><circle cx="${c}" cy="${c}" r="${imgR}"/></clipPath>
  </defs>
  <g clip-path="url(#round)">
    <rect width="${size}" height="${size}" fill="url(#g)"/>
    <circle cx="${c}" cy="${c}" r="${plateR + plateGap}" fill="rgba(255,255,255,0.18)"/>
    <circle cx="${c}" cy="${c}" r="${plateR}" fill="#ffffff"/>
    <image href="data:image/png;base64,${mascot.toString("base64")}"
           x="${c - imgR - 6}" y="${c - imgR - 6}"
           width="${(imgR + 6) * 2}" height="${(imgR + 6) * 2}"
           clip-path="url(#maskot)" preserveAspectRatio="xMidYMid slice"/>
  </g>
</svg>`;

  // Format vælges ud fra filendelsen (.webp til manifest-ikoner, .png til
  // apple-touch-icon + favicon, som Safari kræver som PNG).
  await sharp(Buffer.from(svg), { density: 72 }).toFile(join(root, "public", outName));
  console.log("skrevet", outName, `${size}x${size}`);
}

async function ogImage() {
  const W = 1200;
  const H = 630;
  const c = 300; // maskot-cirkel-center
  const r = 168;
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#8b63e8"/>
      <stop offset="0.5" stop-color="#7c4fe0"/>
      <stop offset="1" stop-color="#4a2a8f"/>
    </linearGradient>
    <clipPath id="maskot"><circle cx="${c}" cy="${c}" r="${r}"/></clipPath>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <circle cx="1060" cy="80" r="230" fill="rgba(255,255,255,0.06)"/>
  <circle cx="80" cy="590" r="280" fill="rgba(255,255,255,0.05)"/>
  <circle cx="160" cy="40" r="70" fill="rgba(255,255,255,0.08)"/>
  <circle cx="${c}" cy="${c}" r="${r + 10}" fill="rgba(255,255,255,0.2)"/>
  <circle cx="${c}" cy="${c}" r="${r}" fill="#ffffff"/>
  <image href="data:image/png;base64,${mascot.toString("base64")}"
         x="${c - r - 14}" y="${c - r - 14}" width="${(r + 14) * 2}" height="${(r + 14) * 2}"
         clip-path="url(#maskot)" preserveAspectRatio="xMidYMid slice"/>
  <text x="72" y="268" font-family="DejaVu Sans" font-weight="bold" font-size="92" fill="#ffffff">AP Klar</text>
  <text x="74" y="342" font-family="DejaVu Sans" font-weight="bold" font-size="34" fill="#f2ecff">Træn Almen Sprogforståelse på STX og HHX</text>
  <text x="74" y="392" font-family="DejaVu Sans" font-size="24" fill="rgba(255,255,255,0.75)">Gratis øvelser i grammatik, latin, kommunikation og sproghistorie</text>
  <text x="74" y="566" font-family="DejaVu Sans" font-size="20" fill="rgba(255,255,255,0.55)">apklar.vercel.app</text>
</svg>`;

  await sharp(Buffer.from(svg), { density: 72 }).toFile(join(root, "public", "og-image.webp"));
  console.log("skrevet og-image.webp 1200x630");
}

await appIcon(512, 0.22, "icon-512.webp");
await appIcon(192, 0.22, "icon-192.webp");
await appIcon(180, 0, "apple-touch-icon.png");
await appIcon(64, 0.22, "favicon.png");
await ogImage();

// Sanity-tjek: er maskotten faktisk i ikonet (ikke gennemsigtig/ensfarvet)?
const buf = await sharp(join(root, "public", "icon-192.webp")).raw().toBuffer({ resolveWithObject: true });
const { data, info } = buf;
let nonBg = 0;
const stride = info.channels;
for (let i = 0; i < data.length; i += stride) {
  // Tæl pixels, der hverken er gradient-lilla eller hvid (dvs. maskottens farver)
  const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
  const isWhite = r > 240 && g > 240 && b > 240;
  const isPurple = r > 90 && r < 160 && b > 180 && g < 120;
  if (!isWhite && !isPurple) nonBg++;
}
console.log("ikke-baggrunds-pixels (maskot):", nonBg, "af", data.length / stride);
