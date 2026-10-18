import { locales, localePath, messages, type Locale } from '../locales'
import { parseSiteOrigin } from './origin'

export function pageMetadata(locale: Locale, originValue?: string) {
  const origin = parseSiteOrigin(originValue)
  const copy = messages[locale]
  const url = origin ? `${origin}${localePath(locale)}` : undefined
  return {
    htmlAttrs: { lang: locale },
    title: copy.title,
    meta: [
      { name: 'description', content: copy.description },
      { property: 'og:title', content: copy.title },
      { property: 'og:description', content: copy.description },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: locale === 'en' ? 'en_US' : 'ru_RU' },
      {
        property: 'og:locale:alternate',
        content: locale === 'en' ? 'ru_RU' : 'en_US',
      },
      ...(url ? [{ property: 'og:url', content: url }] : []),
    ],
    link: origin
      ? [
          { rel: 'canonical', href: url! },
          ...locales.map((language) => ({
            rel: 'alternate',
            hreflang: language,
            href: `${origin}${localePath(language)}`,
          })),
          { rel: 'alternate', hreflang: 'x-default', href: `${origin}/en/` },
        ]
      : [],
  }
}
