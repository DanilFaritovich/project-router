import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createHead } from '@unhead/vue/client'
import App from '../../src/App.vue'
import { routes, installLocaleRouting } from '../../src/router'
import { createAppI18n, messages } from '../../src/locales'

describe('localized navigation', () => {
  it.each(['en', 'ru'] as const)(
    'renders direct /%s/ entry and switches language',
    async (locale) => {
      const router = createRouter({ history: createMemoryHistory(), routes })
      const i18n = createAppI18n()
      installLocaleRouting(router, i18n)
      await router.push(`/${locale}/?source=test#content`)
      await router.isReady()
      const wrapper = mount(App, {
        global: { plugins: [router, i18n, createHead()] },
      })
      expect(wrapper.text()).toContain(messages[locale].intro)
      expect(wrapper.get('[aria-current="page"]').attributes('lang')).toBe(
        locale,
      )
      const target = locale === 'en' ? 'ru' : 'en'
      const link = wrapper.get(`a[lang="${target}"]`)
      expect(link.attributes('href')).toBe(`/${target}/?source=test#content`)
      await link.trigger('click')
      await flushPromises()
      expect(router.currentRoute.value.path).toBe(`/${target}/`)
      expect(wrapper.text()).toContain(messages[target].status)
      wrapper.unmount()
    },
  )
  it('redirects root to English', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes })
    await router.push('/')
    expect(router.currentRoute.value.path).toBe('/en/')
  })
})
