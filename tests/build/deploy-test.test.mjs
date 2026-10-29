import { readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { JSDOM } from 'jsdom'

for (const locale of ['en', 'ru']) {
  test(`built /${locale}/deploy-test/ is empty and noindex without JavaScript`, async () => {
    const html = await readFile(`dist/${locale}/deploy-test/index.html`, 'utf8')
    const dom = new JSDOM(html)
    const document = dom.window.document
    assert.equal(document.documentElement.lang, locale)
    assert.equal(document.querySelector('#app').textContent.trim(), '')
    assert.equal(document.querySelector('#app').querySelectorAll('*').length, 1)
    assert.equal(
      document.querySelector('#app').firstElementChild.tagName,
      'DIV',
    )
    assert.equal(
      document.querySelector('meta[name="robots"]').content,
      'noindex',
    )
    assert.equal(document.querySelector('link[rel="canonical"]'), null)
    assert.equal(
      document.querySelector('script[type="application/ld+json"]'),
      null,
    )
    dom.window.close()

    const portfolio = await readFile(`dist/${locale}/index.html`, 'utf8')
    assert.ok(!portfolio.includes('href="/' + locale + '/deploy-test/"'))
  })
}

test('deploy test pages are excluded from the sitemap', async () => {
  const sitemap = await readFile('dist/sitemap.xml', 'utf8').catch((error) => {
    if (error.code === 'ENOENT') return ''
    throw error
  })
  assert.ok(!sitemap.includes('deploy-test'))
})
