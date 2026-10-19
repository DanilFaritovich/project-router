import { locales, localePath, messages, type Locale } from '../locales'
import { parseSiteOrigin } from './origin'

export const socialPreviews = {
  en: {
    path: '/social/portfolio-en.png',
    alt: 'Danil Miftakhov — Python Backend & Data Engineer. Portfolio card with his portrait.',
  },
  ru: {
    path: '/social/portfolio-ru.png',
    alt: 'Данил Мифтахов — Python Backend-разработчик и инженер по данным. Карточка портфолио с его портретом.',
  },
} satisfies Record<Locale, { path: string; alt: string }>

export function pageMetadata(locale: Locale, originValue?: string) {
  const origin = parseSiteOrigin(originValue)
  const copy = messages[locale]
  const url = origin ? `${origin}${localePath(locale)}` : undefined
  const preview = socialPreviews[locale]
  const image = origin ? `${origin}${preview.path}` : undefined
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
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: copy.title },
      { name: 'twitter:description', content: copy.description },
      ...(image
        ? [
            { property: 'og:image', content: image },
            { property: 'og:image:width', content: '1200' },
            { property: 'og:image:height', content: '630' },
            { property: 'og:image:type', content: 'image/png' },
            { property: 'og:image:alt', content: preview.alt },
            { name: 'twitter:image', content: image },
            { name: 'twitter:image:alt', content: preview.alt },
          ]
        : []),
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
