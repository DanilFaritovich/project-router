import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { URL, pathToFileURL } from 'node:url'
import process from 'node:process'
import console from 'node:console'
import { JSDOM } from 'jsdom'

export const productionOrigin = 'https://danil-miftakhov.dev'

export function requireProductionOrigin(value) {
  assert.equal(
    value,
    productionOrigin,
    `VITE_SITE_ORIGIN must equal ${productionOrigin}`,
  )
  return value
}

// Parse local bytes only. JSDOM does not execute scripts or load remote resources.
export async function verifyOrigin(directory, origin) {
  assert.equal(new URL(origin).origin, origin, 'Expected an exact HTTPS origin')
  assert.equal(new URL(origin).protocol, 'https:')
  for (const locale of ['en', 'ru']) {
    const dom = new JSDOM(
      await readFile(resolve(directory, locale, 'index.html'), 'utf8'),
    )
    try {
      const document = dom.window.document
      assert.equal(document.documentElement.lang, locale)
      const attr = (selector, name, expected) => {
        const nodes = document.querySelectorAll(selector)
        assert.equal(nodes.length, 1, selector)
        assert.equal(nodes[0].getAttribute(name), expected, selector)
      }
      attr('link[rel="canonical"]', 'href', `${origin}/${locale}/`)
      assert.equal(document.querySelectorAll('link[hreflang]').length, 3)
      for (const [language, path] of Object.entries({
        en: '/en/',
        ru: '/ru/',
        'x-default': '/en/',
      })) {
        attr(
          `link[rel="alternate"][hreflang="${language}"]`,
          'href',
          `${origin}${path}`,
        )
      }
      attr('meta[property="og:url"]', 'content', `${origin}/${locale}/`)
      attr(
        'meta[property="og:image"]',
        'content',
        `${origin}/social/portfolio-${locale}.png`,
      )
      attr(
        'meta[name="twitter:image"]',
        'content',
        `${origin}/social/portfolio-${locale}.png`,
      )
      const scripts = document.querySelectorAll(
        'script[type="application/ld+json"]',
      )
      assert.equal(scripts.length, 1)
      const data = JSON.parse(scripts[0].textContent)
      assert.equal(data['@context'], 'https://schema.org')
      assert.equal(data['@graph'].length, 2)
      const [person, website] = data['@graph']
      assert.equal(person['@type'], 'Person')
      assert.equal(person['@id'], `${origin}/#person`)
      assert.equal(person.url, `${origin}/${locale}/`)
      assert.equal(website['@type'], 'WebSite')
      assert.equal(website['@id'], `${origin}/#website`)
      assert.equal(website.url, `${origin}/`)
      assert.deepEqual(website.author, { '@id': person['@id'] })
    } finally {
      dom.window.close()
    }
  }
  const sitemap = new JSDOM(
    await readFile(resolve(directory, 'sitemap.xml'), 'utf8'),
    { contentType: 'application/xml' },
  )
  try {
    assert.deepEqual(
      [...sitemap.window.document.querySelectorAll('loc')].map(
        (node) => node.textContent,
      ),
      [`${origin}/en/`, `${origin}/ru/`],
    )
  } finally {
    sitemap.window.close()
  }
  assert.equal(
    await readFile(resolve(directory, 'robots.txt'), 'utf8'),
    `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`,
  )
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  if (process.argv[2] === '--require-production')
    requireProductionOrigin(process.env.VITE_SITE_ORIGIN)
  else {
    assert.equal(
      process.argv.length,
      4,
      'Usage: node scripts/verify-origin.mjs <directory> <expected-origin>',
    )
    await verifyOrigin(process.argv[2], process.argv[3])
    console.log(
      'Built HTML, canonical, hreflang, social, structured metadata and crawl origin verified.',
    )
  }
}
