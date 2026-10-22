import { socialLinks } from '../content/portfolio'
import { locales, localePath, messages, type Locale } from '../locales'
import { parseSiteOrigin } from './origin'

export function structuredData(locale: Locale, originValue?: string) {
  const origin = parseSiteOrigin(originValue)
  if (!origin) return undefined

  const copy = messages[locale]
  // Identity belongs to the site, not to a translated document.
  const personId = `${origin}/#person`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': personId,
        name: copy.name,
        url: `${origin}${localePath(locale)}`,
        jobTitle: copy.role,
        description: copy.intro,
        sameAs: socialLinks
          .filter(({ label }) => label === 'github' || label === 'linkedin')
          .map(({ href }) => href),
      },
      {
        '@type': 'WebSite',
        '@id': `${origin}/#website`,
        name: 'ProjectRouter',
        url: `${origin}/`,
        description: copy.description,
        inLanguage: [...locales],
        author: { '@id': personId },
      },
    ],
  }
}

export function serializeJsonLd(data: object): string {
  // A script is an HTML raw-text element: JSON escaping alone cannot stop
  // a closing script tag. Unicode escapes preserve the original JSON values.
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

export function structuredDataHead(locale: Locale, originValue?: string) {
  const data = structuredData(locale, originValue)
  return {
    script: data
      ? [
          {
            key: 'portfolio-structured-data',
            type: 'application/ld+json',
            innerHTML: serializeJsonLd(data),
          },
        ]
      : [],
  }
}
