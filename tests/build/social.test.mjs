import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import process from 'node:process'
import { Buffer } from 'node:buffer'
import { URL } from 'node:url'
import { inflateSync } from 'node:zlib'
import { JSDOM } from 'jsdom'
import { loadEnv } from 'vite'
import en from '../../src/locales/en.ts'
import ru from '../../src/locales/ru.ts'

const originValue = loadEnv(
  'production',
  process.cwd(),
  'VITE_',
).VITE_SITE_ORIGIN
const origin = originValue?.trim()
  ? new URL(originValue.trim()).origin
  : undefined

for (const [locale, copy, alt] of [
  [
    'en',
    en,
    'Danil Miftakhov — Python Backend & Data Engineer. Portfolio card with his portrait.',
  ],
  [
    'ru',
    ru,
    'Данил Мифтахов — Python Backend-разработчик и инженер по данным. Карточка портфолио с его портретом.',
  ],
]) {
  test(`${locale} social PNG is valid, compact and copied unchanged`, async () => {
    const path = `/social/portfolio-${locale}.png`
    const png = await readFile(`dist${path}`)
    assert.deepEqual(png, await readFile(`public${path}`))
    assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10])
    assert.equal(png.toString('ascii', 12, 16), 'IHDR')
    assert.equal(png.readUInt32BE(16), 1200)
    assert.equal(png.readUInt32BE(20), 630)
    assert.equal(png[24], 8) // 8-bit RGB/RGBA, non-interlaced.
    assert.ok([2, 6].includes(png[25]))
    assert.equal(png[28], 0)
    const chunks = []
    const types = []
    for (let offset = 8; offset < png.length;) {
      const length = png.readUInt32BE(offset)
      const type = png.toString('ascii', offset + 4, offset + 8)
      types.push(type)
      if (type === 'IDAT')
        chunks.push(png.subarray(offset + 8, offset + 8 + length))
      offset += length + 12
    }
    assert.equal(types.at(-1), 'IEND')
    // Chromium renders in sRGB; the optional explicit sRGB chunk is intent 0.
    assert.ok(!types.includes('iCCP'), 'No competing color profile')
    const pixels = inflateSync(Buffer.concat(chunks))
    assert.equal(pixels.length, (1200 * (png[25] === 2 ? 3 : 4) + 1) * 630)
    assert.ok(
      png.length > 10_000 && png.length < 500_000,
      'Preview budget: 500 kB',
    )
    assert.ok(
      png.length < pixels.length,
      'PNG compression must reduce raw size',
    )
  })

  test(`${locale} static HTML has unique localized social metadata`, async () => {
    const document = new JSDOM(
      await readFile(`dist/${locale}/index.html`, 'utf8'),
    ).window.document
    for (const [attribute, key, value] of [
      ['name', 'twitter:card', 'summary_large_image'],
      ['name', 'twitter:title', copy.title],
      ['name', 'twitter:description', copy.description],
      [
        'property',
        'og:image',
        origin ? `${origin}/social/portfolio-${locale}.png` : undefined,
      ],
      ['property', 'og:image:width', origin ? '1200' : undefined],
      ['property', 'og:image:height', origin ? '630' : undefined],
      ['property', 'og:image:type', origin ? 'image/png' : undefined],
      ['property', 'og:image:alt', origin ? alt : undefined],
      [
        'name',
        'twitter:image',
        origin ? `${origin}/social/portfolio-${locale}.png` : undefined,
      ],
      ['name', 'twitter:image:alt', origin ? alt : undefined],
    ]) {
      const tags = document.querySelectorAll(`meta[${attribute}="${key}"]`)
      assert.equal(tags.length, value ? 1 : 0, key)
      if (value) assert.equal(tags[0].content, value, key)
      if (value && ['og:image', 'twitter:image'].includes(key)) {
        const url = new URL(value)
        assert.equal(url.protocol, 'https:')
        await readFile(`dist${url.pathname}`)
        await readFile(`public${url.pathname}`)
      }
    }
    for (const attribute of ['property', 'name']) {
      const keys = [...document.querySelectorAll(`meta[${attribute}]`)]
        .map((tag) => tag.getAttribute(attribute))
        .filter((key) => /^(og:|twitter:)/.test(key))
      assert.equal(new Set(keys).size, keys.length, 'No duplicate social tags')
    }
  })
}
