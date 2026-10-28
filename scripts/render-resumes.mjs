/* global document */
import { chromium } from '@playwright/test'
import process from 'node:process'
import { log } from 'node:console'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { identity, languages, projects, roles } from './resumes/content.mjs'

// Offline candidate generation: no server, external resources or public PDF edits.
const root = fileURLToPath(new URL('../', import.meta.url))
const args = process.argv.slice(2)
if (args.length && (args.length !== 2 || args[0] !== '--output')) {
  throw new Error('Usage: node scripts/render-resumes.mjs [--output DIRECTORY]')
}
const output = path.resolve(
  args[1] ?? path.join(tmpdir(), 'project-router-resume-candidates'),
)
const originalDirectory = path.join(root, 'public', 'resumes')
const relativeOutput = path.relative(originalDirectory, output)
if (
  !relativeOutput ||
  (!relativeOutput.startsWith('..') && !path.isAbsolute(relativeOutput))
) {
  throw new Error('Candidate output must be outside public/resumes')
}

const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[character],
  )
const anchor = (href, label) => {
  if (!/^https:\/\/|^mailto:/.test(href))
    throw new Error(`Unsupported link: ${href}`)
  return `<a href="${escape(href)}">${escape(label)}</a>`
}
const list = (items) =>
  `<ul>${items.map((item) => `<li>${escape(item)}</li>`).join('')}</ul>`
const section = (label, content) =>
  `<section><h2>${escape(label)}</h2>${content}</section>`

function documentHtml(roleId, locale) {
  const copy = languages[locale]
  const role = roles[roleId]
  const variant = role[locale]
  const label = copy.labels
  const skillLabels =
    locale === 'ru'
      ? {
          Quality: 'Качество',
          Delivery: 'Поставка',
          'SQL / Storage': 'SQL / Хранение',
          Processing: 'Обработка',
          'Portfolio ETL': 'Личный ETL-проект',
          'Quality / Tools': 'Качество / Инструменты',
          'LLM integration': 'LLM-интеграции',
          'Agent tooling': 'Инструменты агентов',
          Reliability: 'Надёжность',
        }
      : {}
  const skills = `<dl>${role.skills.map(([name, detail]) => `<div><dt>${escape(skillLabels[name] ?? name)}</dt><dd>${escape(detail)}</dd></div>`).join('')}</dl>`
  const experience = `<h3>${escape(label.role)}</h3><p class="meta">${escape(label.employment)}</p>${list(role.experience.map((key) => copy[key]))}`
  const freelance = `<h3>${escape(label.freelanceRole)}</h3><p class="meta">${escape(label.freelancePeriod)}</p>${list(copy.freelance)}`
  const projectContent = role.projects
    .map((id) => {
      const project = projects[id]
      return `<article><h3>${escape(project.title)} <span class="source">· ${anchor(project.href, label.source)}</span></h3><p class="meta">${escape(project.stack)}</p><p>${escape(project[locale])}</p></article>`
    })
    .join('')
  const footer = (page) =>
    `<footer><span>${escape(copy.name)} · ${escape(variant.title)}</span><span>${page} / 2</span></footer>`
  return `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><title>${escape(copy.name)} | ${escape(variant.title)}</title><style>
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; }
    html, body { margin: 0; color: #181818; font: 10.5pt/1.38 Arial, sans-serif; }
    .sheet { position: relative; width: 210mm; height: 297mm; padding: 15mm 17mm 20mm; break-after: page; }
    .sheet:last-child { break-after: auto; }
    header { border-bottom: 2px solid #b77c18; padding-bottom: 12px; margin-bottom: 18px; }
    h1 { font-size: 28pt; line-height: 1.1; margin: 0 0 7px; }
    .role { font-size: 14pt; font-weight: bold; margin: 0 0 7px; }
    .location, .meta { color: #66625b; font-size: 9.5pt; margin: 4px 0 8px; }
    .contacts { font-size: 9.5pt; margin: 9px 0 0; line-height: 1.6; }
    a { color: #82550f; text-decoration: none; }
    h2 { margin: 16px 0 9px; font-size: 11pt; text-transform: uppercase; letter-spacing: .5px; }
    h3 { margin: 0 0 3px; font-size: 11pt; }
    p { margin: 0 0 9px; }
    ul { margin: 7px 0 0; padding-left: 17px; }
    li { margin: 0 0 5px; }
    dl { margin: 0; }
    dl > div { display: flex; gap: 12px; margin-bottom: 6px; }
    dt { flex: 0 0 116px; font-weight: bold; }
    dd { margin: 0; flex: 1; }
    article { margin: 0 0 23px; break-inside: avoid; }
    .continuation { display: flex; justify-content: space-between; gap: 20px; border-bottom: 1px solid #d8cebc; padding-bottom: 12px; font-size: 10pt; }
    .contribution { color: #66625b; margin-bottom: 23px; font-size: 10pt; }
    .source { font-size: 10pt; font-weight: normal; }
    footer { position: absolute; bottom: 11mm; left: 17mm; right: 17mm; border-top: 1px solid #d8cebc; padding-top: 8px; display: flex; justify-content: space-between; gap: 20px; font-size: 8pt; color: #66625b; }
  </style></head><body>
    <div class="sheet"><div class="sheet-body"><header><h1>${escape(copy.name)}</h1><p class="role">${escape(variant.title)}</p><p class="location">${escape(copy.location)}</p><p class="contacts">${anchor(`mailto:${identity.email}`, identity.email)}<br>${anchor(identity.github, 'GitHub')} · ${anchor(identity.linkedin, 'LinkedIn')} · ${anchor(identity.telegram, 'Telegram')}</p></header>
    ${section(label.profile, `<p>${escape(variant.profile)}</p>`)}
    ${section(label.skills, skills)}${section(label.experience, experience)}${section(label.freelance, freelance)}</div>${footer(1)}</div>
    <div class="sheet"><div class="sheet-body"><div class="continuation"><strong>${escape(copy.name)}</strong><span>${escape(variant.title)}</span></div>
    ${section(label.projects, `<p class="contribution">${escape(copy.contribution)}</p>${projectContent}`)}
    ${section(label.education, `<p>${escape(copy.education)}</p>`)}${section(label.languages, `<p>${escape(copy.languageLevels)}</p>`)}</div>${footer(2)}</div>
  </body></html>`
}

const originals = Object.keys(roles).flatMap((role) =>
  Object.keys(languages).map((locale) => `${role}-${locale}.pdf`),
)
const hashes = async () =>
  Promise.all(
    originals.map(async (name) =>
      createHash('sha256')
        .update(await readFile(path.join(originalDirectory, name)))
        .digest('hex'),
    ),
  )
const before = await hashes()
await mkdir(output, { recursive: true })
const browser = await chromium.launch()
try {
  const page = await browser.newPage()
  await page.route('**/*', (route) => route.abort())
  for (const role of Object.keys(roles)) {
    for (const locale of Object.keys(languages)) {
      const basename = `${role}-${locale}`
      const html = documentHtml(role, locale)
      await page.setContent(html)
      await page.emulateMedia({ media: 'print' })
      await page.evaluate(() => document.fonts.ready)
      const overflow = await page.locator('.sheet').evaluateAll((sheets) =>
        sheets.some((sheet) => {
          const content = sheet
            .querySelector('.sheet-body')
            .getBoundingClientRect()
          const footer = sheet.querySelector('footer').getBoundingClientRect()
          return (
            content.bottom > footer.top - 12 ||
            sheet.scrollWidth > sheet.clientWidth
          )
        }),
      )
      if (overflow)
        throw new Error(`Content exceeds two-page layout: ${basename}`)
      await writeFile(path.join(output, `${basename}.html`), html)
      await page.pdf({
        path: path.join(output, `${basename}.pdf`),
        printBackground: true,
        preferCSSPageSize: true,
        tagged: true,
        outline: true,
      })
      log(`Generated ${basename}.pdf and editable HTML`)
    }
  }
} finally {
  await browser.close()
}
if (JSON.stringify(before) !== JSON.stringify(await hashes()))
  throw new Error('Original resume bytes changed')
log(`Candidate output: ${output}; original PDFs unchanged`)
