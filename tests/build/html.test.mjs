import process from 'node:process'
import { URL } from 'node:url'
import { loadEnv } from 'vite'
import { readFile, access } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { JSDOM } from 'jsdom'
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
const alternatePaths = { en: '/en/', ru: '/ru/', 'x-default': '/en/' }

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
        skills[index].querySelector('.skill-stack').textContent,
        copy[`${key}SkillStack`],
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
        'project-geocoder',
        'project-moon',
        'project-support',
        'project-task',
        'project-maxim',
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
    assert.equal(document.querySelector('#hero img').alt, copy.heroPortraitAlt)
    assert.equal(
      document.querySelector('#pdf-unavailable')?.textContent ?? '',
      document.querySelector('#pdf-unavailable') ? copy.pdfUnavailable : '',
    )
    assert.equal(
      document.querySelector('.contacts-copy').textContent,
      copy.contactsCopy,
    )
    const heroLinks = [...document.querySelectorAll('#hero .social-links a')]
    assert.deepEqual(
      heroLinks.map((link) => link.textContent.replace(/[↗↘]/g, '').trim()),
      ['LinkedIn', 'GitHub', copy.heroContact],
    )
    assert.deepEqual(
      heroLinks.map((link) => link.getAttribute('href')),
      [
        'https://www.linkedin.com/in/danil-miftakhov-55468b399/',
        'https://github.com/DanilFaritovich',
        `/${locale}/#contacts`,
      ],
    )
    assert.equal(heroLinks[2].getAttribute('target'), null)
    for (const button of document.querySelectorAll('#resume button')) {
      assert.ok(
        [copy.viewPdf, copy.downloadPdf].includes(button.textContent.trim()),
      )
      assert.equal(
        button.getAttribute('aria-describedby'),
        button.disabled ? 'pdf-unavailable' : null,
      )
    }
    for (const nav of document.querySelectorAll('.language-switcher')) {
      assert.equal(nav.getAttribute('aria-label'), copy.language)
      assert.equal(
        nav.querySelector('[lang="en"]').getAttribute('aria-label'),
        copy.english,
      )
      assert.equal(
        nav.querySelector('[lang="ru"]').getAttribute('aria-label'),
        copy.russian,
      )
    }
    assert.equal(document.documentElement.lang, locale)
    assert.equal(document.querySelectorAll('title').length, 1)
    assert.equal(document.title, copy.title)
    assert.ok(document.title.trim())
    assert.notEqual(en.description, ru.description)
    for (const [selector, expected] of [
      ['meta[name="description"]', copy.description],
      ['meta[property="og:title"]', copy.title],
      ['meta[property="og:description"]', copy.description],
      ['meta[property="og:type"]', 'website'],
      ['meta[property="og:locale"]', locale === 'en' ? 'en_US' : 'ru_RU'],
      [
        'meta[property="og:locale:alternate"]',
        locale === 'en' ? 'ru_RU' : 'en_US',
      ],
    ]) {
      const tags = document.querySelectorAll(selector)
      assert.equal(tags.length, 1, `Expected exactly one ${selector}`)
      assert.equal(tags[0].content, expected)
      assert.ok(tags[0].content.trim(), `Empty ${selector}`)
    }
    assert.match(
      document.querySelector('main').textContent,
      locale === 'en' ? /Danil Miftakhov/ : /Данил Мифтахов/,
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
    assert.equal(document.querySelectorAll('#projects article').length, 5)
    assert.equal(
      document.querySelectorAll('#resume button:disabled').length +
        2 * document.querySelectorAll('#resume a[download]').length,
      6,
    )
    for (const language of ['en', 'ru'])
      assert.ok(document.querySelector(`a[href="/${language}/"]`))
    const jsonLd = document.querySelectorAll(
      'script[type="application/ld+json"]',
    )
    assert.equal(jsonLd.length, origin ? 1 : 0)
    if (origin) {
      const data = JSON.parse(jsonLd[0].textContent)
      assert.equal(data['@context'], 'https://schema.org')
      assert.equal(data['@graph'].length, 2)
      const [person, website] = data['@graph']
      assert.equal(person['@type'], 'Person')
      assert.equal(website['@type'], 'WebSite')
      assert.equal(
        new Set(data['@graph'].map((entity) => entity['@id'])).size,
        2,
      )
      assert.equal(person['@id'], `${origin}/#person`)
      assert.equal(website['@id'], `${origin}/#website`)
      assert.equal(person.name, copy.name)
      assert.equal(person.jobTitle, copy.role)
      assert.equal(person.description, copy.intro)
      assert.equal(person.url, `${origin}/${locale}/`)
      assert.deepEqual(person.sameAs, [
        'https://github.com/DanilFaritovich',
        'https://www.linkedin.com/in/danil-miftakhov-55468b399/',
      ])
      for (const profile of person.sameAs) {
        assert.ok(document.querySelector(`a[href="${profile}"]`))
        assert.equal(new URL(profile).protocol, 'https:')
      }
      assert.equal(website.name, 'ProjectRouter')
      assert.equal(website.url, `${origin}/`)
      assert.equal(website.description, copy.description)
      assert.deepEqual(website.inLanguage, ['en', 'ru'])
      assert.deepEqual(website.author, { '@id': person['@id'] })
      for (const entity of data['@graph']) {
        assert.equal(new URL(entity['@id']).protocol, 'https:')
        assert.equal(new URL(entity.url).protocol, 'https:')
        await access(`dist${new URL(entity.url).pathname}index.html`)
      }
    }
    const canonicals = document.querySelectorAll('link[rel="canonical"]')
    const alternates = document.querySelectorAll(
      'link[rel="alternate"][hreflang]',
    )
    const ogUrls = document.querySelectorAll('meta[property="og:url"]')
    assert.equal(canonicals.length, origin ? 1 : 0)
    assert.equal(alternates.length, origin ? 3 : 0)
    assert.equal(
      document.querySelectorAll('link[hreflang]').length,
      alternates.length,
    )
    assert.equal(ogUrls.length, origin ? 1 : 0)
    if (origin) {
      const canonical = `${origin}/${locale}/`
      assert.equal(canonicals[0].href, canonical)
      assert.equal(ogUrls[0].content, canonical)
      for (const [language, path] of Object.entries(alternatePaths)) {
        const links = document.querySelectorAll(
          `link[rel="alternate"][hreflang="${language}"]`,
        )
        assert.equal(links.length, 1)
        assert.equal(links[0].href, `${origin}${path}`)
        // Every alternate, including x-default, names a generated document.
        await access(`dist${new URL(links[0].href).pathname}index.html`)
      }
    }
    assert.equal(document.querySelectorAll('meta[name="robots"]').length, 0)
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
  assert.equal(root.querySelectorAll('meta[http-equiv="refresh"]').length, 1)
  assert.equal(root.querySelector('a').getAttribute('href'), '/en/')
  const missing = new JSDOM(await readFile('dist/404.html', 'utf8')).window
    .document
  for (const document of [root, missing]) {
    const robots = document.querySelectorAll('meta[name="robots"]')
    assert.equal(robots.length, 1)
    assert.equal(robots[0].content, 'noindex')
    assert.equal(
      document.querySelectorAll(
        'link[rel="canonical"], link[hreflang], meta[property="og:url"], script[type="application/ld+json"]',
      ).length,
      0,
    )
  }
  assert.equal(missing.querySelector('h1').textContent, 'Page not found')
})

test('crawl files agree with the indexable documents and optional origin', async () => {
  const robots = await readFile('dist/robots.txt', 'utf8')
  // This public site needs no exclusions or private paths.
  assert.deepEqual(robots.trim().split('\n'), [
    'User-agent: *',
    'Allow: /',
    ...(origin ? [`Sitemap: ${origin}/sitemap.xml`] : []),
  ])
  if (!origin) {
    await assert.rejects(access('dist/sitemap.xml'), { code: 'ENOENT' })
    return
  }
  const xml = await readFile('dist/sitemap.xml', 'utf8')
  // XML parsing fails on malformed/unescaped content instead of matching substrings.
  const sitemap = new JSDOM(xml, { contentType: 'application/xml' }).window
    .document
  const namespace = 'http://www.sitemaps.org/schemas/sitemap/0.9'
  assert.equal(sitemap.documentElement.localName, 'urlset')
  assert.equal(sitemap.documentElement.namespaceURI, namespace)
  const entries = [...sitemap.documentElement.children]
  assert.equal(entries.length, 2)
  const urls = entries.map((entry) => {
    assert.equal(entry.localName, 'url')
    assert.equal(entry.namespaceURI, namespace)
    assert.equal(entry.children.length, 1)
    assert.equal(entry.firstElementChild.localName, 'loc')
    assert.equal(entry.firstElementChild.namespaceURI, namespace)
    return entry.firstElementChild.textContent
  })
  assert.deepEqual(urls, [`${origin}/en/`, `${origin}/ru/`])
  assert.equal(new Set(urls).size, 2)
  for (const address of urls) {
    const url = new URL(address)
    assert.equal(url.protocol, 'https:')
    assert.equal(url.search, '')
    assert.equal(url.hash, '')
    const document = new JSDOM(
      await readFile(`dist${url.pathname}index.html`, 'utf8'),
    ).window.document
    assert.equal(document.querySelector('link[rel="canonical"]').href, address)
  }
})
