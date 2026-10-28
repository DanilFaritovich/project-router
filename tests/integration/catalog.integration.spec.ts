import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PortfolioCard from '../../src/components/PortfolioCard.vue'
import { featured, more, tools } from '../../src/content/projects'
import { createAppI18n, messages } from '../../src/locales'

describe.each(['en', 'ru'] as const)('catalog cards in %s', (locale) => {
  it('renders both approved paragraphs, the stack, image alt and exact available actions', () => {
    const i18n = createAppI18n()
    i18n.global.locale.value = locale
    for (const item of [...featured, ...more, ...tools]) {
      const wrapper = mount(PortfolioCard, {
        props: { item, tool: tools.includes(item) },
        global: { plugins: [i18n] },
      })
      expect(wrapper.get('h3').text()).toBe(messages[locale][`${item.id}Title`])
      expect(wrapper.get('.card-summary').text()).toBe(
        messages[locale][`${item.id}Summary`],
      )
      expect(wrapper.get('.card-detail').text()).toBe(
        messages[locale][`${item.id}Detail`],
      )
      expect(wrapper.get('.stack').text()).toBe(item.stack.join(' · '))
      expect(
        wrapper.findAll('a').map((link) => link.attributes('href')),
      ).toEqual([
        item.repositoryUrl,
        ...(item.relatedSources?.map(({ href }) => href) ?? []),
        ...(item.releaseUrl ? [item.releaseUrl] : []),
      ])
      if (item.statusKey) {
        expect(wrapper.get('.card-status').text()).toBe(
          messages[locale][item.statusKey],
        )
      }
      if (item.repositoryLabel) {
        expect(wrapper.findAll('a')[0]!.text()).toBe(
          messages[locale][item.repositoryLabel],
        )
      }
      for (const source of item.relatedSources ?? []) {
        expect(wrapper.get(`a[href="${source.href}"]`).text()).toBe(
          messages[locale][source.label],
        )
      }
      for (const link of wrapper.findAll('a')) {
        expect(link.attributes('target')).toBe('_blank')
        expect(link.attributes('rel')).toBe('noopener noreferrer')
      }
      if (item.image) {
        expect(wrapper.get('img').attributes('alt')).toBe(
          messages[locale][item.image.altKey],
        )
        expect(wrapper.get('img').attributes('src')).toBe(item.image.src)
      } else expect(wrapper.find('img').exists()).toBe(false)
      wrapper.unmount()
    }
  })

  it('keeps readable text-only cards when an image is missing or fails to load', async () => {
    const i18n = createAppI18n()
    i18n.global.locale.value = locale
    for (const item of featured) {
      const wrapper = mount(PortfolioCard, {
        props: { item },
        global: { plugins: [i18n] },
      })
      await wrapper.get('img').trigger('error')
      expect(wrapper.find('img').exists()).toBe(false)
      expect(wrapper.find('.project-preview').exists()).toBe(false)
      expect(wrapper.classes()).not.toContain('media-card')
      expect(wrapper.get('.card-summary').isVisible()).toBe(true)
      expect(wrapper.findAll('a').length).toBe(item.releaseUrl ? 2 : 1)
      await wrapper.setProps({ item: { ...item, image: undefined } })
      expect(wrapper.find('.project-preview').exists()).toBe(false)
      expect(wrapper.classes()).not.toContain('media-card')
      wrapper.unmount()
    }
  })

  it('keeps a compact card complete when its optional image fails', async () => {
    const item = more.find(({ id }) => id === 'maxim')!
    const i18n = createAppI18n()
    i18n.global.locale.value = locale
    const wrapper = mount(PortfolioCard, {
      props: { item },
      global: { plugins: [i18n] },
    })
    await wrapper.get('img').trigger('error')
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.findAll('.card-summary, .card-detail')).toHaveLength(2)
    expect(wrapper.findAll('a')).toHaveLength(2)
    wrapper.unmount()
  })
})
