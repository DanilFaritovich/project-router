import { describe, expect, it } from 'vitest'
import { messages } from '../../src/locales'
import {
  serializeJsonLd,
  structuredData,
  structuredDataHead,
} from '../../src/seo/structuredData'

const origin = 'https://portfolio.test'
const profiles = [
  'https://github.com/DanilFaritovich',
  'https://www.linkedin.com/in/danil-miftakhov-55468b399/',
]

describe('portfolio structured data', () => {
  it.each(['en', 'ru'] as const)(
    'describes the %s portfolio truthfully',
    (locale) => {
      const data = structuredData(locale, origin)!
      const copy = messages[locale]
      expect(data['@context']).toBe('https://schema.org')
      expect(data['@graph']).toEqual([
        {
          '@type': 'Person',
          '@id': `${origin}/#person`,
          name: copy.name,
          url: `${origin}/${locale}/`,
          jobTitle: copy.role,
          description: copy.intro,
          sameAs: profiles,
        },
        {
          '@type': 'WebSite',
          '@id': `${origin}/#website`,
          name: 'ProjectRouter',
          url: `${origin}/`,
          description: copy.description,
          inLanguage: ['en', 'ru'],
          author: { '@id': `${origin}/#person` },
        },
      ])
      for (const entity of data['@graph']) {
        for (const address of [entity['@id'], entity.url, ...profiles]) {
          expect(new URL(address).protocol).toBe('https:')
        }
      }
      expect(structuredData(locale, `  ${origin.toUpperCase()}/  `)).toEqual(
        data,
      )
      const head = structuredDataHead(locale, origin)
      expect(head.script).toHaveLength(1)
      expect(head.script[0]?.type).toBe('application/ld+json')
      expect(JSON.parse(head.script[0]!.innerHTML)).toEqual(data)
    },
  )

  it('keeps identities and the author reference stable between locales', () => {
    const en = structuredData('en', origin)!['@graph']
    const ru = structuredData('ru', origin)!['@graph']
    expect(en.map((entity) => entity['@id'])).toEqual(
      ru.map((entity) => entity['@id']),
    )
    expect(en[1]!.author).toEqual({ '@id': en[0]!['@id'] })
    expect(ru[1]!.author).toEqual({ '@id': ru[0]!['@id'] })
  })

  it.each([undefined, '', '  '])(
    'omits the graph without origin (%s)',
    (value) => {
      for (const locale of ['en', 'ru'] as const) {
        expect(structuredData(locale, value)).toBeUndefined()
        expect(structuredDataHead(locale, value)).toEqual({ script: [] })
      }
    },
  )

  it('uses the existing origin validator', () => {
    expect(() => structuredDataHead('en', 'http://portfolio.test')).toThrow()
    expect(() => structuredDataHead('ru', `${origin}/path`)).toThrow()
  })

  it('round trips hostile text without creating HTML or extra scripts', () => {
    const data = {
      description: '</ScRiPt><script>alert("x")</script><!-- & >\u2028\u2029',
    }
    const json = serializeJsonLd(data)
    expect(json).not.toContain('<')
    const container = document.createElement('div')
    container.innerHTML = `<script type="application/ld+json">${json}</script>`
    expect(container.querySelectorAll('script')).toHaveLength(1)
    expect(JSON.parse(container.querySelector('script')!.textContent!)).toEqual(
      data,
    )
  })
})
