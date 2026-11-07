import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { createHead } from '@unhead/vue/client'
import App from '../../src/App.vue'
import { routes, installLocaleRouting } from '../../src/router'
import { createAppI18n, messages } from '../../src/locales'
import { socialLinks, kworkProfileUrl } from '../../src/content/portfolio'

describe('client services and portfolio navigation', () => {
  afterEach(() => vi.restoreAllMocks())
  it.each(['en', 'ru'] as const)(
    'keeps the services page when switching from %s and exposes real contacts',
    async (locale) => {
      const router = createRouter({ history: createMemoryHistory(), routes })
      const i18n = createAppI18n()
      const missing = vi.fn()
      i18n.global.setMissingHandler(missing)
      installLocaleRouting(router, i18n)
      await router.push(`/${locale}/freelance/?source=client#pricing`)
      const wrapper = mount(App, {
        global: { plugins: [router, i18n, createHead()] },
      })
      await flushPromises()
      expect(wrapper.get('h1').text()).toContain(
        messages[locale].servicesPage.headline,
      )
      const other = locale === 'en' ? 'ru' : 'en'
      const switcher = wrapper.get(`header a[lang="${other}"]`)
      expect(switcher.attributes('href')).toBe(
        `/${other}/freelance/?source=client#pricing`,
      )
      await switcher.trigger('click')
      await flushPromises()
      expect(router.currentRoute.value.path).toBe(`/${other}/freelance/`)
      expect(wrapper.get('h1').text()).toContain(
        messages[other].servicesPage.headline,
      )
      for (const link of socialLinks)
        expect(wrapper.find(`#contacts a[href="${link.href}"]`).exists()).toBe(
          true,
        )
      expect(wrapper.get('.freelance-kwork').attributes('href')).toBe(
        kworkProfileUrl,
      )
      expect(wrapper.get('.freelance-footer a').attributes('href')).toBe(
        `/${other}/`,
      )
      expect(wrapper.findAll('details')).toHaveLength(3)
      expect(missing).not.toHaveBeenCalled()
      wrapper.unmount()
    },
  )
  it('removes the temporary blank-page routes', () => {
    const router = createRouter({ history: createMemoryHistory(), routes })
    expect(
      router.getRoutes().some((route) => route.path.includes('deploy-test')),
    ).toBe(false)
  })
})
