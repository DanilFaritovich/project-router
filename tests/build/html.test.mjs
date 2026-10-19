import process from 'node:process'
import { URL } from 'node:url'
import { readFile, access } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { JSDOM } from 'jsdom'
import en from '../../src/locales/en.ts'
import ru from '../../src/locales/ru.ts'

for (const locale of ['en', 'ru']) {
  test(`built /${locale}/ contains localized HTML without JavaScript`, async () => {
    const html = await readFile(`dist/${locale}/index.html`, 'utf8')
    const document = new JSDOM(html).window.document
    const copy = locale === 'en' ? en : ru
    assert.equal(document.querySelector('.hero-intro').textContent, copy.intro)
    assert.equal(
      document.querySelector('.about-introduction').textContent,
      copy.aboutIntroduction,
    )
    const experienceBlocks = [
      ...document.querySelectorAll('#about .about-block'),
    ]
    assert.equal(experienceBlocks.length, 3)
    for (const [index, key] of [
      'experience',
      'freelance',
      'personal',
    ].entries()) {
      const block = experienceBlocks[index]
      assert.equal(block.querySelector('h3').textContent, copy[`${key}Title`])
      assert.deepEqual(
        [...block.querySelectorAll('p')].map((p) => p.textContent),
        [copy[key], copy[`${key}Detail`]],
      )
    }
    assert.equal(
      document.querySelector('#focus-heading').textContent,
      copy.focusTitle,
    )
    assert.equal(
      document.querySelector('#about aside p').textContent,
      copy.focus,
    )
    const skills = [...document.querySelectorAll('#skills .skills-grid > div')]
    assert.equal(skills.length, 8)
    for (const [index, key] of [
      'backend',
      'database',
      'data',
      'automation',
      'infra',
      'testing',
      'ai',
      'architecture',
    ].entries()) {
      assert.equal(
        skills[index].querySelector('h3').textContent,
        copy[`${key}Title`],
      )
      assert.equal(
        skills[index].querySelector('.skill-detail').textContent,
        copy[`${key}Detail`],
      )
    }
    const cards = [...document.querySelectorAll('.portfolio-card')]
    assert.deepEqual(
      cards.map((card) => card.id),
      [
        'project-moon',
        'project-support',
        'project-geocoder',
        'project-task',
        'project-maxim',
        'project-avito',
        'project-server',
        'project-worker',
        'project-standards',
      ],
    )
    for (const card of cards) {
      const id = card.id.replace('project-', '')
      assert.equal(card.querySelector('h3').textContent, copy[`${id}Title`])
      assert.equal(
        card.querySelector('.card-summary').textContent,
        copy[`${id}Summary`],
      )
      assert.equal(
        card.querySelector('.card-detail').textContent,
        copy[`${id}Detail`],
      )
      assert.ok(card.querySelector('.stack').textContent.length > 40)
      for (const link of card.querySelectorAll('a')) {
        assert.equal(link.target, '_blank')
        assert.equal(link.rel, 'noopener noreferrer')
      }
    }
    assert.equal(
      document.querySelectorAll('.portfolio-card a[href*="/releases/tag/"]')
        .length,
      4,
    )
    assert.equal(
      document.querySelectorAll('.portfolio-card a[href*="/releases/latest"]')
        .length,
      0,
    )
    assert.equal(document.querySelectorAll('.portfolio-card a').length, 13)
    assert.ok(!cards.some((card) => card.textContent.includes('Live Demo')))
    const images = [...document.querySelectorAll('.portfolio-card img')]
    assert.equal(images.length, 4)
    for (const image of images) {
      const id = image.closest('article').id.replace('project-', '')
      assert.equal(image.alt, copy[`${id}ImageAlt`])
      assert.ok(image.getAttribute('src').startsWith('/assets/'))
      assert.ok(Number(image.width) > 0 && Number(image.height) > 0)
      await access(`dist${image.getAttribute('src')}`)
    }
    assert.equal(document.documentElement.lang, locale)
    assert.match(
      document.title,
      locale === 'en' ? /Engineering portfolio/ : /Инженерное портфолио/,
    )
    assert.match(
      document.querySelector('main').textContent,
      locale === 'en' ? /Danil Miftakhov/ : /Данил Мифтахов/,
    )
    assert.match(
      document.querySelector('meta[name="description"]').content,
      locale === 'en'
        ? /engineering portfolio of Danil/
        : /инженерное портфолио Данила/,
    )
    assert.equal(
      document.querySelector('meta[property="og:title"]').content,
      document.title,
    )
    assert.equal(
      document.querySelector('meta[property="og:description"]').content,
      document.querySelector('meta[name="description"]').content,
    )
    assert.equal(document.querySelectorAll('h1').length, 1)
    for (const id of [
      'hero',
      'about',
      'skills',
      'projects',
      'tools',
      'resume',
      'contacts',
    ]) {
      assert.ok(
        document.querySelector(`section#${id}`)?.textContent.trim(),
        `Missing ${id} content`,
      )
    }
    assert.equal(document.querySelectorAll('#projects article').length, 6)
    assert.equal(document.querySelectorAll('#resume button:disabled').length, 6)
    for (const language of ['en', 'ru'])
      assert.ok(document.querySelector(`a[href="/${language}/"]`))
    const canonical = document.querySelector('link[rel="canonical"]')
    if (process.env.VITE_SITE_ORIGIN)
      assert.ok(canonical, 'Configured origin must produce canonical links')
    if (canonical) {
      const origin = new URL(canonical.href).origin
      assert.equal(canonical.href, `${origin}/${locale}/`)
      assert.equal(
        document.querySelector('meta[property="og:url"]').content,
        canonical.href,
      )
      for (const language of ['en', 'ru'])
        assert.equal(
          document.querySelector(`link[hreflang="${language}"]`).href,
          `${origin}/${language}/`,
        )
      const sitemap = await readFile('dist/sitemap.xml', 'utf8')
      assert.ok(
        sitemap.includes(`${origin}/en/`) && sitemap.includes(`${origin}/ru/`),
      )
    } else {
      assert.equal(document.querySelectorAll('link[hreflang]').length, 0)
      await assert.rejects(access('dist/sitemap.xml'))
    }
    for (const asset of document.querySelectorAll(
      'script[src], link[rel="stylesheet"]',
    )) {
      const path = asset.getAttribute('src') ?? asset.getAttribute('href')
      assert.ok(path.startsWith('/assets/'))
      await access(`dist${path}`)
    }
  })
}
test('static root redirects and missing page is excluded from indexing', async () => {
  const root = new JSDOM(await readFile('dist/index.html', 'utf8')).window
    .document
  assert.equal(
    root.querySelector('meta[http-equiv="refresh"]').content,
    '0;url=/en/',
  )
  const missing = new JSDOM(await readFile('dist/404.html', 'utf8')).window
    .document
  assert.equal(missing.querySelector('meta[name="robots"]').content, 'noindex')
})
