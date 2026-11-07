import assert from 'node:assert/strict'
import { readFile, access } from 'node:fs/promises'
import test from 'node:test'
import process from 'node:process'
import { JSDOM } from 'jsdom'
const origin = process.env.VITE_SITE_ORIGIN || ''
for (const locale of ['en', 'ru']) {
  test(`/${locale}/freelance/ contains localized services and route metadata before JavaScript`, async () => {
    const html = await readFile(`dist/${locale}/freelance/index.html`, 'utf8')
    const dom = new JSDOM(html)
    const doc = dom.window.document
    assert.equal(doc.documentElement.lang, locale)
    assert.equal(doc.querySelectorAll('h1').length, 1)
    assert.match(
      doc.querySelector('h1').textContent,
      locale === 'ru' ? /Меньше ручной работы/ : /Less manual work/,
    )
    for (const section of ['services', 'cases', 'pricing', 'faq', 'contacts'])
      assert.ok(doc.getElementById(section))
    assert.equal(doc.querySelectorAll('details').length, 3)
    assert.ok(doc.querySelector('#contacts a[href^="mailto:"]'))
    assert.ok(
      doc.querySelector('a[href="https://kwork.ru/user/danil_miftakhov"]'),
    )
    assert.ok(!doc.querySelector('meta[name="robots"][content="noindex"]'))
    assert.ok(!html.includes('localhost:9001'))
    const portfolio = new JSDOM(
      await readFile(`dist/${locale}/index.html`, 'utf8'),
    ).window.document
    assert.notEqual(doc.title, portfolio.title)
    assert.notEqual(
      doc.querySelector('meta[name="description"]').content,
      portfolio.querySelector('meta[name="description"]').content,
    )
    assert.ok(portfolio.querySelector(`a[href="/${locale}/freelance/"]`))
    if (origin) {
      assert.equal(
        doc.querySelector('link[rel="canonical"]').href,
        `${origin}/${locale}/freelance/`,
      )
      for (const language of ['en', 'ru'])
        assert.equal(
          doc.querySelector(`link[hreflang="${language}"]`).href,
          `${origin}/${language}/freelance/`,
        )
      assert.equal(
        doc.querySelector('link[hreflang="x-default"]').href,
        `${origin}/en/freelance/`,
      )
      assert.equal(
        doc.querySelector('meta[property="og:url"]').content,
        `${origin}/${locale}/freelance/`,
      )
    } else
      assert.equal(
        doc.querySelectorAll('link[rel="canonical"], link[hreflang]').length,
        0,
      )
    await assert.rejects(access(`dist/${locale}/deploy-test/index.html`), {
      code: 'ENOENT',
    })
    dom.window.close()
  })
}
