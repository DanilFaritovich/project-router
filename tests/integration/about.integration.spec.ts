import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AboutSection from '../../src/components/sections/AboutSection.vue'
import HeroSection from '../../src/components/sections/HeroSection.vue'
import { createAppI18n } from '../../src/locales'
import en from '../../src/locales/en'
import ru from '../../src/locales/ru'

describe('professional profile', () => {
  it.each(['en', 'ru'] as const)(
    'separates commercial, freelance and personal experience in %s',
    (locale) => {
      const i18n = createAppI18n()
      i18n.global.locale.value = locale
      const copy = locale === 'en' ? en : ru
      const about = mount(AboutSection, { global: { plugins: [i18n] } })
      expect(about.get('.about-introduction').text()).toBe(
        copy.aboutIntroduction,
      )
      expect(about.findAll('h3').map((heading) => heading.text())).toEqual([
        copy.experienceTitle,
        copy.freelanceTitle,
        copy.personalTitle,
        copy.focusTitle,
      ])
      const blocks = about.findAll('.about-block')
      for (const [index, key] of (
        ['experience', 'freelance', 'personal'] as const
      ).entries()) {
        expect(blocks[index]!.findAll('p').map((p) => p.text())).toEqual([
          copy[key],
          copy[`${key}Detail`],
        ])
      }
      expect(blocks[0]!.text()).not.toMatch(/Airflow|Ansible/)
      expect(about.get('aside p').text()).toBe(copy.focus)
      const hero = mount(HeroSection, { global: { plugins: [i18n] } })
      expect(hero.get('.hero-intro').text()).toBe(copy.intro)
      about.unmount()
      hero.unmount()
    },
  )
})
