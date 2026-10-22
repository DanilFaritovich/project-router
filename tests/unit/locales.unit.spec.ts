import { describe, expect, it } from 'vitest'
import { createAppI18n, locales, messages } from '../../src/locales'
import {
  sections,
  sectionLabel,
  skillGroups,
  socialLinks,
} from '../../src/content/portfolio'
import { featured, more, tools } from '../../src/content/projects'

describe('localization messages', () => {
  it('keeps identical, nonempty EN/RU message keys', () => {
    expect(Object.keys(messages.ru).sort()).toEqual(
      Object.keys(messages.en).sort(),
    )
    for (const copy of Object.values(messages)) {
      for (const [key, value] of Object.entries(copy)) {
        expect(value.trim(), key).not.toBe('')
        expect(value, key).not.toMatch(/\b(?:TODO|FIXME|Lorem ipsum)\b/i)
      }
    }
  })

  it.each(locales)(
    'resolves every content-driven key in %s without fallback',
    (locale) => {
      const i18n = createAppI18n()
      const keys = [
        ...Object.values(sectionLabel),
        ...sections
          .filter((id) => id !== 'hero')
          .flatMap((id) =>
            ['Eyebrow', 'Title', 'Intro'].map((suffix) => `${id}${suffix}`),
          ),
        ...skillGroups.flatMap((group) => [
          `${group.id}Title`,
          group.stack,
          `${group.id}Detail`,
        ]),
        ...socialLinks.map((link) => link.label),
        ...[...featured, ...more, ...tools].flatMap((item) => [
          `${item.id}Title`,
          `${item.id}Summary`,
          `${item.id}Detail`,
          ...(item.image ? [item.image.altKey] : []),
          ...(item.preview ? [`${item.id}Category`, `${item.id}Caption`] : []),
        ]),
      ]
      for (const key of keys)
        expect(i18n.global.te(key, locale), key).toBe(true)
    },
  )

  it('falls back to English for a missing Russian key', () => {
    const i18n = createAppI18n()
    const original = i18n.global.getLocaleMessage('ru')
    const incomplete = { ...original }
    Reflect.deleteProperty(incomplete, 'menu')
    try {
      i18n.global.setLocaleMessage('ru', incomplete)
      i18n.global.locale.value = 'ru'
      expect(
        i18n.global.t('menu', {}, { missingWarn: false, fallbackWarn: false }),
      ).toBe(messages.en.menu)
      expect(createAppI18n().global.locale.value).toBe('en')
    } finally {
      i18n.global.setLocaleMessage('ru', original)
    }
  })
})
