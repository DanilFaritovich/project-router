import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createHead } from '@unhead/vue/client'
import App from '../../src/App.vue'
import { routes, installLocaleRouting } from '../../src/router'
import { createAppI18n, messages } from '../../src/locales'

describe('localized navigation', () => {
  afterEach(() => vi.restoreAllMocks())
  it.each(['en', 'ru'] as const)(
    'renders direct /%s/ entry and switches language',
    async (locale) => {
      vi.spyOn(
        HTMLElement.prototype,
        'getBoundingClientRect',
      ).mockImplementation(function (this: HTMLElement) {
        return { top: this.id === 'resume' ? 80 : 1000 } as DOMRect
      })
      const router = createRouter({ history: createMemoryHistory(), routes })
      const i18n = createAppI18n()
      installLocaleRouting(router, i18n)
      await router.push(`/${locale}/?source=test#resume`)
      await router.isReady()
      const wrapper = mount(App, {
        attachTo: document.body,
        global: { plugins: [router, i18n, createHead()] },
      })
      await flushPromises()
      expect(wrapper.text()).toContain(messages[locale].intro)
      const portraitAlt = {
        en: 'Portrait of Danil Miftakhov',
        ru: 'Портрет Данила Мифтахова',
      }
      expect(wrapper.get('#hero img').attributes('alt')).toBe(
        portraitAlt[locale],
      )
      expect(wrapper.find('#hero [aria-hidden="true"] img').exists()).toBe(
        false,
      )
      expect(
        wrapper.get('a[lang][aria-current="page"]').attributes('lang'),
      ).toBe(locale)
      const target = locale === 'en' ? 'ru' : 'en'
      const link = wrapper.get(`a[lang="${target}"]`)
      expect(link.attributes('href')).toBe(`/${target}/?source=test#resume`)
      await link.trigger('click')
      await flushPromises()
      expect(router.currentRoute.value.path).toBe(`/${target}/`)
      expect(wrapper.text()).toContain(messages[target].contactsCopy)
      expect(wrapper.get('#hero img').attributes('alt')).toBe(
        portraitAlt[target],
      )
      wrapper.unmount()
    },
  )
  it('redirects root to English', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes })
    await router.push('/')
    expect(router.currentRoute.value.path).toBe('/en/')
  })
})
