/* global document */
// Run with node scripts/render-social.mjs. Uses installed Inter (SIL OFL 1.1)
// and Playwright Chromium; no network requests or generated portrait treatments.
// Font files can be supplied via SOCIAL_FONT_REGULAR / SOCIAL_FONT_BOLD.
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import process from 'node:process'
import { Buffer } from 'node:buffer'
import { log } from 'node:console'
import { deflateSync, inflateSync } from 'node:zlib'
import { chromium } from '@playwright/test'

const regular = await readFile(
  process.env.SOCIAL_FONT_REGULAR ??
    '/usr/share/fonts/opentype/inter/Inter-Regular.otf',
)
const bold = await readFile(
  process.env.SOCIAL_FONT_BOLD ??
    '/usr/share/fonts/opentype/inter/Inter-Bold.otf',
)
const portrait = await readFile(
  'src/assets/portrait/danil-miftakhov-portrait.webp',
)
const template = await readFile('design/social/preview.html', 'utf8')

// Losslessly recompress Chromium's PNG data; preserve all other chunks (sRGB).
function optimizePng(png) {
  const chunks = []
  const data = []
  for (let offset = 8; offset < png.length;) {
    const length = png.readUInt32BE(offset)
    const chunk = png.subarray(offset, offset + length + 12)
    if (chunk.toString('ascii', 4, 8) === 'IDAT')
      data.push(chunk.subarray(8, -4))
    else chunks.push(chunk)
    offset += length + 12
  }
  const compressed = deflateSync(inflateSync(Buffer.concat(data)), { level: 9 })
  const chunk = Buffer.alloc(compressed.length + 12)
  chunk.writeUInt32BE(compressed.length)
  chunk.write('IDAT', 4)
  compressed.copy(chunk, 8)
  let crc = 0xffffffff
  for (const byte of chunk.subarray(4, -4)) {
    crc ^= byte
    for (let bit = 0; bit < 8; bit++)
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0)
  }
  chunk.writeUInt32BE((crc ^ 0xffffffff) >>> 0, chunk.length - 4)
  chunks.splice(chunks.length - 1, 0, chunk)
  const result = Buffer.concat([png.subarray(0, 8), ...chunks])
  return result.length < png.length ? result : png
}

await mkdir('public/social', { recursive: true })
const browser = await chromium.launch()
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  })
  await page.route('**/*', (route) => route.abort())
  for (const [locale, name, role] of [
    ['en', 'Danil<br>Miftakhov', 'Python Backend<br>&amp; Data Engineer'],
    [
      'ru',
      'Данил<br>Мифтахов',
      'Python Backend-разработчик<br>и инженер по данным',
    ],
  ]) {
    await page.setContent(
      template
        .replaceAll('{{locale}}', locale)
        .replace('{{name}}', name)
        .replace('{{role}}', role)
        .replace('{{regular}}', regular.toString('base64'))
        .replace('{{bold}}', bold.toString('base64'))
        .replace('{{portrait}}', portrait.toString('base64')),
    )
    await page.evaluate(async () => {
      await document.fonts.ready
      await document.querySelector('img').decode()
    })
    const raw = await page.screenshot({ type: 'png' })
    const optimized = optimizePng(raw)
    await writeFile(`public/social/portfolio-${locale}.png`, optimized)
    log(`${locale}: ${raw.length} → ${optimized.length} bytes (lossless)`)
    // Small previews are review artifacts, intentionally kept outside the repo.
    await page.setContent(
      `<img style="width:400px;height:210px" src="data:image/png;base64,${optimized.toString('base64')}">`,
    )
    await page
      .locator('img')
      .screenshot({ path: `/tmp/project-router-social-${locale}-small.png` })
  }
} finally {
  await browser.close()
}
