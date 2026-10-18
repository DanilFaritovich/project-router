import { createI18n } from 'vue-i18n'
import en from './en'
import ru from './ru'

export const locales = ['en', 'ru'] as const
export type Locale = (typeof locales)[number]
export const messages = { en, ru }
export const localePath = (locale: Locale) => `/${locale}/`
export function localeFromPath(path: string): Locale {
  return path.split('/')[1] === 'ru' ? 'ru' : 'en'
}
export function createAppI18n() {
  return createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages,
  })
}
