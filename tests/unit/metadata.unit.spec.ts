import { describe, expect, it } from 'vitest'
import { pageMetadata } from '../../src/seo/metadata'
import { parseSiteOrigin } from '../../src/seo/origin'
import { messages } from '../../src/locales'

describe('localized metadata', () => {
  it.each(['en', 'ru'] as const)(
    'provides distinct %s metadata and reciprocal links',
    (locale) => {
      // Reserved test-only domain; never used as a production default.
      const head = pageMetadata(locale, 'https://portfolio.test')
      expect(head.htmlAttrs.lang).toBe(locale)
      expect(head.title).toBe(messages[locale].title)
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
