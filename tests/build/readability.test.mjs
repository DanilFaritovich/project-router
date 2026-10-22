import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { JSDOM } from 'jsdom'

// Audit delivered documents only: no Vue, translation or catalog imports.
// These are evidence requirements, not another source of professional content.
const repositories = {
  moon: 'Moon-courier-crisis-game',
  support: 'support-assistant-llm/tree/develop',
  geocoder: 'yandex-geocoder-region-parser',
  task: 'task-service-api',
  maxim: 'maxim-ml',
  avito: 'avito-parser',
  server: 'portfolio-server-infrastructure',
  worker: 'codex-free-worker-mcp/tree/develop',
  standards: 'codex-development-standards/tree/develop',
}
const contacts = [
  ['Email', 'mailto:danilfaritovichwork@gmail.com'],
  ['WhatsApp', 'https://wa.me/message/KTYC4R25VAXMF1'],
  ['Telegram', 'https://t.me/Daniel_De_Casto'],
  ['LinkedIn', 'https://www.linkedin.com/in/danil-miftakhov-55468b399/'],
  ['GitHub', 'https://github.com/DanilFaritovich'],
  ['Instagram', 'https://www.instagram.com/daniel_de_casto'],
]

for (const locale of ['en', 'ru']) {
  test(`${locale} static HTML answers professional-profile questions with public evidence`, async (t) => {
    const dom = new JSDOM(await readFile(`dist/${locale}/index.html`, 'utf8'))
    const document = dom.window.document
    // Never accept metadata, JSON-LD or explicitly hidden text as visible evidence.
    document
      .querySelectorAll(
        'script, style, template, [hidden], [aria-hidden="true"]',
      )
      .forEach((el) => el.remove())
    const text = (selector) => {
      const element = document.querySelector(selector)
      assert.ok(element, `Missing evidence: ${selector}`)
      const value = element.textContent.replace(/\s+/g, ' ').trim()
      assert.ok(value, `Empty evidence: ${selector}`)
      return value
    }
    try {
      await t.test(
        'Q1: name and backend/data/automation specialization — #hero',
        () => {
          assert.equal(
            text('h1'),
            locale === 'en' ? 'Danil Miftakhov' : 'Данил Мифтахов',
          )
          assert.match(text('.hero-role'), /Python Backend/)
          assert.match(
            text('.hero-role'),
            locale === 'en' ? /Data & Automation/ : /данным и автоматизации/,
          )
          assert.match(text('.hero-intro'), /PostgreSQL/)
        },
      )
      await t.test(
        'Q2/Q6: commercial, freelance and personal evidence remain separate — #about',
        () => {
          const blocks = [...document.querySelectorAll('#about .about-block')]
          assert.equal(blocks.length, 3)
          const [commercial, freelance, personal] = blocks.map(
            (el) => el.textContent,
          )
          assert.match(
            commercial,
            locale === 'en' ? /Commercial Experience/ : /Коммерческий опыт/,
          )
          for (const fact of [
            /2022/,
            /Maxim/,
            /Python/,
            /PostgreSQL\/PostGIS/,
            /SQL/,
          ])
            assert.match(commercial, fact)
          assert.match(
            freelance,
            locale === 'en'
              ? /Freelance & Client Work/
              : /Фриланс и заказные проекты/,
          )
          assert.match(
            freelance,
            locale === 'en'
              ? /marketplace integrations/
              : /интеграции маркетплейсов/,
          )
          assert.match(freelance, /Telegram/)
          assert.match(
            personal,
            locale === 'en'
              ? /Personal Engineering Projects/
              : /Собственные инженерные проекты/,
          )
          for (const fact of [/FastAPI/, /Apache Airflow/, /LLM\/MCP/])
            assert.match(personal, fact)
        },
      )
      await t.test(
        'Q3: FastAPI, ETL and LLM examples — project cards and #skills',
        () => {
          for (const id of ['moon', 'support', 'task', 'maxim'])
            assert.match(text(`#project-${id}`), /FastAPI/)
          for (const fact of [
            /ETL/,
            /Apache Airflow/,
            /PostgreSQL/,
            /MinIO\/S3/,
          ])
            assert.match(text('#project-geocoder'), fact)
          assert.match(text('#project-support .card-detail'), /LLM/)
          assert.match(text('#project-worker'), /MCP/)
          for (const skill of [
            'Python',
            'FastAPI',
            'PostgreSQL',
            'PostGIS',
            'Apache Airflow',
            'Docker',
            'LLM',
            'MCP',
          ])
            assert.ok(text('#skills').includes(skill), skill)
        },
      )
      await t.test(
        'Q4: all nine named projects expose confirmed source links — #projects / #tools',
        () => {
          assert.equal(document.querySelectorAll('.portfolio-card').length, 9)
          for (const [id, repository] of Object.entries(repositories)) {
            text(`#project-${id} h3`)
            text(`#project-${id} .card-summary`)
            text(`#project-${id} .card-detail`)
            const address = `https://github.com/DanilFaritovich/${repository}`
            const link = document.querySelector(
              `#project-${id} a[href="${address}"]`,
            )
            assert.ok(
              link?.textContent.trim(),
              `Missing source link: ${address}`,
            )
          }
        },
      )
      await t.test(
        'Q5: public profiles and contact destinations — #contacts',
        () => {
          const links = [
            ...document.querySelectorAll('#contacts .social-links a'),
          ]
          assert.deepEqual(
            links.map((link) => [
              link.textContent.trim(),
              link.getAttribute('href'),
            ]),
            contacts,
          )
          for (const link of links) {
            const external = link.getAttribute('href').startsWith('https://')
            assert.equal(
              link.getAttribute('target'),
              external ? '_blank' : null,
            )
            assert.equal(
              link.getAttribute('rel'),
              external ? 'noopener noreferrer' : null,
            )
          }
          assert.equal(
            text('#contacts-direct-heading'),
            locale === 'en' ? 'Direct contact' : 'Прямая связь',
          )
          assert.equal(
            text('#contacts-profiles-heading'),
            locale === 'en'
              ? 'Professional profiles'
              : 'Профессиональные профили',
          )
          assert.equal(document.querySelectorAll('#contacts .action').length, 3)
          assert.equal(text('#contacts .action-primary'), 'Email')
          assert.equal(
            document.querySelectorAll('.contact-profiles .action').length,
            0,
          )
        },
      )
      await t.test(
        'resume actions reflect supplied documents — #resume',
        () => {
          if (document.querySelector('#pdf-unavailable')) {
            assert.match(
              text('#pdf-unavailable'),
              locale === 'en'
                ? /PDF files are currently unavailable/
                : /PDF-файлы пока недоступны/,
            )
            assert.equal(
              document.querySelectorAll('#resume button:disabled').length,
              6,
            )
            assert.equal(document.querySelectorAll('#resume a[href]').length, 0)
            assert.equal(document.querySelectorAll('a[href$=".pdf"]').length, 0)
          } else {
            assert.equal(
              document.querySelectorAll('#resume a[download]').length,
              3,
            )
            assert.equal(
              document.querySelectorAll('#resume button:disabled').length,
              0,
            )
            for (const id of ['backend', 'ai', 'data']) {
              assert.ok(
                document.querySelector(
                  `#resume a[href="/resumes/${id}-${locale}.pdf"][download]`,
                ),
              )
            }
          }
        },
      )
      await t.test(
        'semantic headings, crawlable anchors and dimensioned images are present',
        () => {
          const headings = [
            ...document.querySelectorAll('main h1, main h2, main h3'),
          ]
          let level = 0
          for (const heading of headings) {
            const next = Number(heading.tagName.slice(1))
            assert.ok(
              next <= level + 1,
              `Skipped heading level: ${heading.textContent}`,
            )
            assert.ok(heading.textContent.trim())
            level = next
          }
          for (const section of document.querySelectorAll('main > section')) {
            assert.ok(
              document.getElementById(section.getAttribute('aria-labelledby')),
            )
            assert.ok(document.querySelector(`a[href$="#${section.id}"]`))
          }
          for (const image of document.querySelectorAll('main img')) {
            assert.ok(image.alt.trim())
            assert.ok(Number(image.width) > 0 && Number(image.height) > 0)
          }
          for (const link of document.querySelectorAll('a[href]')) {
            const href = link.getAttribute('href')
            assert.ok(!/^(javascript:|#?$)/i.test(href), href)
            const hash = href.includes('#')
              ? href.slice(href.indexOf('#') + 1)
              : ''
            if (href.startsWith('/') || href.startsWith('#')) {
              if (hash)
                assert.ok(
                  document.getElementById(hash),
                  `Broken anchor: ${href}`,
                )
            }
          }
          // One local stylesheet is needed to present this page; no third-party
          // blocking scripts, fonts or CSS are required to read its content.
          assert.equal(
            document.querySelectorAll('link[rel="stylesheet"]').length,
            1,
          )
          assert.ok(
            document
              .querySelector('link[rel="stylesheet"]')
              .getAttribute('href')
              .startsWith('/assets/'),
          )
        },
      )
    } finally {
      dom.window.close()
    }
  })
}
