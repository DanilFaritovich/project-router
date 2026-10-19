import { describe, expect, it } from 'vitest'
import { pageMetadata } from '../../src/seo/metadata'
import { parseSiteOrigin } from '../../src/seo/origin'

const expectedMetadata = {
  en: {
    title: 'Danil Miftakhov | Python Backend & Data Engineer',
    description:
      "Danil Miftakhov's Python backend and data engineering portfolio: API integrations, ETL and data processing with PostgreSQL/PostGIS, plus automation projects.",
  },
  ru: {
    title: 'Данил Мифтахов — Python Backend-разработчик и инженер по данным',
    description:
      'Портфолио Данила Мифтахова: Python backend, инженерия данных и автоматизация. API-интеграции, ETL и обработка данных с PostgreSQL/PostGIS.',
  },
}

describe('localized metadata', () => {
  it.each(['en', 'ru'] as const)(
    'provides distinct %s metadata and reciprocal links',
    (locale) => {
      // Reserved test-only domain; never used as a production default.
      const head = pageMetadata(locale, 'https://portfolio.test')
      expect(head.htmlAttrs.lang).toBe(locale)
      const expected = expectedMetadata[locale]
      expect(head.title).toBe(expected.title)
      expect(head.title.trim()).not.toBe('')
      for (const [attribute, key, content] of [
        ['name', 'description', expected.description],
        ['property', 'og:title', expected.title],
        ['property', 'og:description', expected.description],
        ['property', 'og:type', 'website'],
        ['property', 'og:locale', locale === 'en' ? 'en_US' : 'ru_RU'],
        [
          'property',
          'og:locale:alternate',
          locale === 'en' ? 'ru_RU' : 'en_US',
        ],
      ] as const) {
        const tags = head.meta.filter((meta) =>
          attribute === 'name' ? meta.name === key : meta.property === key,
        )
        expect(tags).toHaveLength(1)
        expect(tags[0]?.content).toBe(content)
        expect(content.trim()).not.toBe('')
      }
      expect(head.link).toContainEqual({
        rel: 'canonical',
        href: `https://portfolio.test/${locale}/`,
      })
      expect(
        head.link
          .filter((link) => link.rel === 'alternate')
          .map((link) => link.hreflang),
      ).toEqual(['en', 'ru', 'x-default'])
    },
  )
  it('omits absolute links until an origin is configured', () => {
    expect(pageMetadata('ru').link).toEqual([])
    expect(
      pageMetadata('ru').meta.some((meta) => meta.property === 'og:url'),
    ).toBe(false)
  })
  it.each([
    'http://portfolio.test',
    'https://portfolio.test/path',
    'https://user:pass@portfolio.test',
    'https://portfolio.test/?q=1',
    'https://portfolio.test/#section',
  ])('rejects invalid origin %s', (origin) => {
    expect(() => parseSiteOrigin(origin)).toThrow()
  })
})
