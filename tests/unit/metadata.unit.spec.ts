import { describe, expect, it } from 'vitest'
import { pageMetadata, socialPreviews } from '../../src/seo/metadata'
import { parseSiteOrigin } from '../../src/seo/origin'

const expectedMetadata = {
  en: {
    title: 'Danil Miftakhov | Python Backend Developer',
    description:
      'Python backend developer working with PostgreSQL/PostGIS, data processing and API integrations. Commercial experience, engineering projects and role-specific resumes.',
  },
  ru: {
    title: 'Данил Мифтахов — Python Backend-разработчик',
    description:
      'Python Backend-разработчик: PostgreSQL/PostGIS, обработка данных и API-интеграции. Коммерческий опыт, инженерные проекты и резюме под разные роли.',
  },
}

describe('localized metadata', () => {
  it.each(['en', 'ru'] as const)(
    'provides distinct %s metadata and reciprocal links',
    (locale) => {
      // Reserved test-only domain; never used as a production default.
      const head = pageMetadata(locale, 'https://portfolio.test')
      expect(head.htmlAttrs.lang).toBe(locale)
      expect(socialPreviews[locale].path).toBe(
        `/social/portfolio-${locale}.png`,
      )
      expect(socialPreviews[locale].alt).toContain(
        locale === 'en' ? 'Danil Miftakhov' : 'Данил Мифтахов',
      )
      const expected = expectedMetadata[locale]
      expect(head.title).toBe(expected.title)
      expect(head.title.trim()).not.toBe('')
      for (const [attribute, key, content] of [
        ['name', 'description', expected.description],
        ['property', 'og:title', expected.title],
        ['property', 'og:description', expected.description],
        ['property', 'og:type', 'website'],
        [
          'property',
          'og:image',
          `https://portfolio.test/social/portfolio-${locale}.png`,
        ],
        ['property', 'og:image:width', '1200'],
        ['property', 'og:image:height', '630'],
        ['property', 'og:image:type', 'image/png'],
        ['property', 'og:image:alt', socialPreviews[locale].alt],
        ['name', 'twitter:card', 'summary_large_image'],
        ['name', 'twitter:title', expected.title],
        ['name', 'twitter:description', expected.description],
        [
          'name',
          'twitter:image',
          `https://portfolio.test/social/portfolio-${locale}.png`,
        ],
        ['name', 'twitter:image:alt', socialPreviews[locale].alt],
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
      expect(head.link).toEqual([
        { rel: 'canonical', href: `https://portfolio.test/${locale}/` },
        {
          rel: 'alternate',
          hreflang: 'en',
          href: 'https://portfolio.test/en/',
        },
        {
          rel: 'alternate',
          hreflang: 'ru',
          href: 'https://portfolio.test/ru/',
        },
        {
          rel: 'alternate',
          hreflang: 'x-default',
          href: 'https://portfolio.test/en/',
        },
      ])
      expect(head.meta.filter((meta) => meta.property === 'og:url')).toEqual([
        { property: 'og:url', content: `https://portfolio.test/${locale}/` },
      ])
      for (const link of head.link) {
        const url = new URL(link.href)
        expect(url.protocol).toBe('https:')
        expect(url.search).toBe('')
        expect(url.hash).toBe('')
      }
    },
  )
  it.each(['en', 'ru'] as const)(
    'omits origin-dependent metadata for %s without losing localized copy',
    (locale) => {
      for (const origin of [undefined, '', '  ']) {
        const head = pageMetadata(locale, origin)
        expect(head.link).toEqual([])
        expect(head.meta.some((meta) => meta.property === 'og:url')).toBe(false)
        expect(
          head.meta.some(
            (meta) =>
              meta.property?.startsWith('og:image') ||
              meta.name?.startsWith('twitter:image'),
          ),
        ).toBe(false)
        expect(head.meta).toContainEqual({
          name: 'twitter:card',
          content: 'summary_large_image',
        })
        expect(head.meta).toContainEqual({
          name: 'twitter:title',
          content: expectedMetadata[locale].title,
        })
        expect(head.meta).toContainEqual({
          name: 'twitter:description',
          content: expectedMetadata[locale].description,
        })
        expect(head.title).toBe(expectedMetadata[locale].title)
        expect(head.meta).toContainEqual({
          name: 'description',
          content: expectedMetadata[locale].description,
        })
      }
    },
  )
  it.each([
    'https://portfolio.test',
    'https://portfolio.test/',
    '  https://PORTFOLIO.test/  ',
  ])('normalizes a valid origin %s', (origin) => {
    expect(parseSiteOrigin(origin)).toBe('https://portfolio.test')
    expect(pageMetadata('ru', origin).link[0]?.href).toBe(
      'https://portfolio.test/ru/',
    )
  })
  it.each([
    'not a URL',
    '/en/',
    'ftp://portfolio.test',
    'http://portfolio.test',
    'https://portfolio.test/path',
    'https://user:pass@portfolio.test',
    'https://user@portfolio.test',
    'https://:pass@portfolio.test',
    'https://portfolio.test/?q=1',
    'https://portfolio.test/#section',
    'https://portfolio.test/?',
    'https://portfolio.test/#',
  ])('rejects invalid origin %s', (origin) => {
    expect(() => parseSiteOrigin(origin)).toThrow()
  })
})
