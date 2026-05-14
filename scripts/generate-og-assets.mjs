// Generates favicon, icon, apple-icon, opengraph-image, twitter-image
// from brand assets. Run once: `node scripts/generate-og-assets.mjs`.
// Output files land in src/app/ as Next.js metadata file conventions.

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = join(__dirname, '..')
const APP = join(ROOT, 'src', 'app')

const BG = '#0E1428'
const HONEY = '#D4A562'
const CREAM = '#F5F0E6'
const MUTED = '#A8A095'

// --- Shield SVG (matches src/components/Logo.tsx ShieldMark exactly) ---
function shieldSvg({ size, color = HONEY, glow = false }) {
  // viewBox 0 0 60 66 from Logo.tsx
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size * (66 / 60)}" viewBox="0 0 60 66" fill="none">
  ${glow ? `<defs>
    <filter id="g" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1.2" />
    </filter>
  </defs>` : ''}
  <path d="M30 2 L54 9 C55 9 55.5 9.5 55.5 10.5 L55.5 32 C55.5 47 44.5 58 30 64 C15.5 58 4.5 47 4.5 32 L4.5 10.5 C4.5 9.5 5 9 6 9 Z"
    stroke="${color}" stroke-width="2.4" stroke-linejoin="round" fill="none" />
  <path d="M30 7 L50 13 L50 32 C50 44 41 53 30 58 C19 53 10 44 10 32 L10 13 Z"
    stroke="${color}" stroke-width="0.6" stroke-opacity="0.3" fill="none" />
  <path d="M22 20 C18 26 18 36 22 43 C25 47 29 48 31 47 C27 43 25 37 25 31 C25 25 27 21 31 17 C28 17 24 18 22 20 Z"
    fill="${color}" opacity="0.92" />
  <path d="M35 15 C33 19 33 23 35 27 C37 31 41 32 43 30 C45 26 45 21 43 17 C41 14 37 13 35 15 Z"
    fill="${color}" opacity="0.55" />
  <circle cx="30" cy="36" r="1.8" fill="${BG}" />
</svg>`.trim()
}

// --- OG canvas ---
function ogSvg({ width, height, locale = 'uk' }) {
  const taglines = {
    uk: { brand: 'Royal Honey VIP', sub: "Натуральні БАДи для чоловічого здоров'я", domain: 'manprime-store.vercel.app' },
    ru: { brand: 'Royal Honey VIP', sub: 'Натуральные БАДы для мужского здоровья', domain: 'manprime-store.vercel.app' },
    en: { brand: 'Royal Honey VIP', sub: "Natural supplements for men's health", domain: 'manprime-store.vercel.app' },
  }
  const t = taglines[locale]

  // Layout: centered column. Shield ~220px tall on top, wordmark below.
  const shieldSize = Math.round(height * 0.34)        // ~214 for 630
  const shieldX = width / 2 - shieldSize / 2
  const shieldY = Math.round(height * 0.10)            // ~63

  const wordmarkY = shieldY + Math.round(shieldSize * (66 / 60)) + 50
  const brandY = wordmarkY + 70
  const subY = brandY + 60
  const domainY = height - 50

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <radialGradient id="glow" cx="50%" cy="38%" r="48%">
      <stop offset="0%" stop-color="${HONEY}" stop-opacity="0.16" />
      <stop offset="60%" stop-color="${HONEY}" stop-opacity="0.04" />
      <stop offset="100%" stop-color="${BG}" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#101730" />
      <stop offset="100%" stop-color="${BG}" />
    </linearGradient>
  </defs>

  <!-- background -->
  <rect width="${width}" height="${height}" fill="url(#bg)" />
  <rect width="${width}" height="${height}" fill="url(#glow)" />

  <!-- decorative top-left mark -->
  <text x="60" y="68" font-family="Georgia, serif" font-size="22" fill="${HONEY}" letter-spacing="6" font-weight="500">MANPRIME</text>
  <line x1="60" y1="86" x2="220" y2="86" stroke="${HONEY}" stroke-opacity="0.4" stroke-width="1"/>

  <!-- decorative top-right tagline -->
  <text x="${width - 60}" y="68" text-anchor="end" font-family="Georgia, serif" font-size="20" fill="${MUTED}" letter-spacing="4" font-style="italic">est. 2026</text>

  <!-- shield -->
  <g transform="translate(${shieldX} ${shieldY})">
    <g transform="scale(${shieldSize / 60})">
      <path d="M30 2 L54 9 C55 9 55.5 9.5 55.5 10.5 L55.5 32 C55.5 47 44.5 58 30 64 C15.5 58 4.5 47 4.5 32 L4.5 10.5 C4.5 9.5 5 9 6 9 Z"
        stroke="${HONEY}" stroke-width="2.4" stroke-linejoin="round" fill="none" />
      <path d="M30 7 L50 13 L50 32 C50 44 41 53 30 58 C19 53 10 44 10 32 L10 13 Z"
        stroke="${HONEY}" stroke-width="0.6" stroke-opacity="0.3" fill="none" />
      <path d="M22 20 C18 26 18 36 22 43 C25 47 29 48 31 47 C27 43 25 37 25 31 C25 25 27 21 31 17 C28 17 24 18 22 20 Z"
        fill="${HONEY}" opacity="0.92" />
      <path d="M35 15 C33 19 33 23 35 27 C37 31 41 32 43 30 C45 26 45 21 43 17 C41 14 37 13 35 15 Z"
        fill="${HONEY}" opacity="0.55" />
      <circle cx="30" cy="36" r="1.8" fill="${BG}" />
    </g>
  </g>

  <!-- ManPrime wordmark -->
  <text x="${width / 2}" y="${wordmarkY}" text-anchor="middle"
    font-family="Georgia, 'Times New Roman', serif" font-size="92" font-weight="500"
    fill="${CREAM}" letter-spacing="-1">ManPrime</text>

  <!-- Royal Honey VIP -->
  <text x="${width / 2}" y="${brandY}" text-anchor="middle"
    font-family="Georgia, serif" font-size="34" font-style="italic"
    fill="${HONEY}" letter-spacing="2">${t.brand}</text>

  <!-- subtitle -->
  <text x="${width / 2}" y="${subY}" text-anchor="middle"
    font-family="Helvetica, Arial, sans-serif" font-size="26"
    fill="${MUTED}" letter-spacing="0.5">${t.sub}</text>

  <!-- bottom domain -->
  <text x="${width / 2}" y="${domainY}" text-anchor="middle"
    font-family="Helvetica, Arial, sans-serif" font-size="18"
    fill="${HONEY}" letter-spacing="6">${t.domain.toUpperCase()}</text>
</svg>`.trim()
}

// Encode 32-bit PNG buffer into a single-image ICO container
function pngToIco(pngBuffer, size) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)                      // reserved
  header.writeUInt16LE(1, 2)                      // type=1 ICO
  header.writeUInt16LE(1, 4)                      // count=1

  const dir = Buffer.alloc(16)
  dir.writeUInt8(size >= 256 ? 0 : size, 0)       // width
  dir.writeUInt8(size >= 256 ? 0 : size, 1)       // height
  dir.writeUInt8(0, 2)                            // palette
  dir.writeUInt8(0, 3)                            // reserved
  dir.writeUInt16LE(1, 4)                         // color planes
  dir.writeUInt16LE(32, 6)                        // bpp
  dir.writeUInt32LE(pngBuffer.length, 8)          // size
  dir.writeUInt32LE(22, 12)                       // offset

  return Buffer.concat([header, dir, pngBuffer])
}

async function renderShieldPng(pixelSize) {
  // Render shield centered on a transparent square canvas with subtle padding
  const padding = Math.round(pixelSize * 0.12)
  const inner = pixelSize - padding * 2
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${pixelSize}" height="${pixelSize}" viewBox="0 0 ${pixelSize} ${pixelSize}">
  <rect width="${pixelSize}" height="${pixelSize}" rx="${Math.round(pixelSize * 0.18)}" fill="${BG}" />
  <g transform="translate(${padding} ${padding}) scale(${inner / 60})">
    <path d="M30 2 L54 9 C55 9 55.5 9.5 55.5 10.5 L55.5 32 C55.5 47 44.5 58 30 64 C15.5 58 4.5 47 4.5 32 L4.5 10.5 C4.5 9.5 5 9 6 9 Z"
      stroke="${HONEY}" stroke-width="2.4" stroke-linejoin="round" fill="none" />
    <path d="M22 20 C18 26 18 36 22 43 C25 47 29 48 31 47 C27 43 25 37 25 31 C25 25 27 21 31 17 C28 17 24 18 22 20 Z"
      fill="${HONEY}" opacity="0.95" />
    <path d="M35 15 C33 19 33 23 35 27 C37 31 41 32 43 30 C45 26 45 21 43 17 C41 14 37 13 35 15 Z"
      fill="${HONEY}" opacity="0.6" />
  </g>
</svg>`.trim()
  return sharp(Buffer.from(svg)).png().toBuffer()
}

async function main() {
  // 1) icon.png (32x32) — for <link rel="icon">
  const icon32 = await renderShieldPng(64)         // 2x for crispness; browser will scale
  await writeFile(join(APP, 'icon.png'), icon32)
  console.log('✓ src/app/icon.png (64x64)')

  // 2) apple-icon.png (180x180)
  const appleIcon = await renderShieldPng(180)
  await writeFile(join(APP, 'apple-icon.png'), appleIcon)
  console.log('✓ src/app/apple-icon.png (180x180)')

  // 3) favicon.ico (32x32 PNG inside ICO)
  const fav32 = await renderShieldPng(32)
  const icoBuffer = pngToIco(fav32, 32)
  await writeFile(join(APP, 'favicon.ico'), icoBuffer)
  console.log('✓ src/app/favicon.ico (32x32 ICO)')

  // 4) opengraph-image.png (1200x630)
  const ogPng = await sharp(Buffer.from(ogSvg({ width: 1200, height: 630, locale: 'uk' }))).png().toBuffer()
  await writeFile(join(APP, 'opengraph-image.png'), ogPng)
  console.log('✓ src/app/opengraph-image.png (1200x630)')

  // 5) twitter-image.png (1200x630 — same)
  await writeFile(join(APP, 'twitter-image.png'), ogPng)
  console.log('✓ src/app/twitter-image.png (1200x630)')

  // 6) alt text files
  await writeFile(
    join(APP, 'opengraph-image.alt.txt'),
    "ManPrime — Royal Honey VIP. Натуральні БАДи для чоловічого здоров'я."
  )
  await writeFile(
    join(APP, 'twitter-image.alt.txt'),
    "ManPrime — Royal Honey VIP. Натуральні БАДи для чоловічого здоров'я."
  )
  console.log('✓ alt.txt files')

  console.log('\nAll OG / favicon assets regenerated.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
