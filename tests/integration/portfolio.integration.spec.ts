import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createHead } from '@unhead/vue/client'
import App from '../../src/App.vue'
import { createAppI18n, messages } from '../../src/locales'
import { routes, installLocaleRouting } from '../../src/router'
import { sections } from '../../src/content/portfolio'
import { resumes, resumeAvailable } from '../../src/content/resumes'

async function render(path = '/en/') {
  const router = createRouter({ history: createMemoryHistory(), routes })
  const i18n = createAppI18n()
  installLocaleRouting(router, i18n)
  await router.push(path)
  const wrapper = mount(App, {
    attachTo: document.body,
    global: { plugins: [router, i18n, createHead()] },
  })
  return { wrapper, router }
}
afterEach(() => {
  document.body.innerHTML = ''
  document.body.style.overflow = ''
  vi.restoreAllMocks()
})

describe('portfolio', () => {
  it.each(['en', 'ru'] as const)(
    'groups Contacts, highlights only Email and preserves Hero for %s',
    async (locale) => {
      const { wrapper } = await render(`/${locale}/`)
      for (const link of wrapper.findAll('a[href^="https://"]')) {
        expect(link.attributes('target')).toBe('_blank')
        expect(link.attributes('rel')).toBe('noopener noreferrer')
      }
      for (const link of wrapper.findAll('a:not([href^="https://"])')) {
        expect(link.attributes('target')).toBeUndefined()
      }
      expect(
        wrapper
          .get('#contacts a[href="mailto:danilfaritovichwork@gmail.com"]')
          .text(),
      ).toBe('Email')
      expect(
        wrapper
          .get('#contacts a[href="https://wa.me/message/KTYC4R25VAXMF1"]')
          .text(),
      ).toBe('WhatsApp')
      const instagram = wrapper.get(
        '#contacts a[href="https://www.instagram.com/daniel_de_casto"]',
      )
      expect(instagram.text()).toBe('Instagram↗')
      expect(instagram.classes()).not.toContain('action')
      expect(instagram.classes()).not.toContain('action-primary')
      expect(
        wrapper
          .findAll('#contacts .social-links a')
          .map((link) => link.text().replace('↗', '').trim()),
      ).toEqual([
        'Email',
        'WhatsApp',
        'Telegram',
        'LinkedIn',
        'GitHub',
        'Instagram',
      ])
      expect(
        wrapper
          .findAll('#contacts .social-links .action-primary')
          .map((link) => link.text()),
      ).toEqual(['Email'])
      expect(wrapper.get('.contacts-copy').text()).toBe(
        messages[locale].contactsCopy,
      )
      for (const [group, heading, labels] of [
        [
          'direct',
          messages[locale].contactsDirect,
          ['Email', 'WhatsApp', 'Telegram'],
        ],
        [
          'profiles',
          messages[locale].contactsProfiles,
          ['LinkedIn', 'GitHub', 'Instagram'],
        ],
      ] as const) {
        const container = wrapper.get(
          `[aria-labelledby="contacts-${group}-heading"]`,
        )
        expect(container.get('h3').text()).toBe(heading)
        expect(
          container
            .findAll('a')
            .map((link) => link.text().replace('↗', '').trim()),
        ).toEqual(labels)
        expect(container.findAll('.action')).toHaveLength(
          group === 'direct' ? 3 : 0,
        )
      }
      expect(
        wrapper.findAll('.contact-profiles [aria-hidden="true"]'),
      ).toHaveLength(3)
      expect(
        wrapper
          .findAll('#hero .social-links a')
          .map((link) => link.text().replace(/[↗↘]/g, '').trim()),
      ).toEqual(['LinkedIn', 'GitHub', messages[locale].heroContact])
      expect(wrapper.find('#hero a[href*="instagram.com"]').exists()).toBe(
        false,
      )
      wrapper.unmount()
    },
  )

  it.each(['en', 'ru'] as const)(
    'navigates from Hero to localized Contacts with query and focus in %s',
    async (locale) => {
      const { wrapper, router } = await render(`/${locale}/?source=hero#hero`)
      const contact = wrapper.get('#hero .social-links a:last-child')
      expect(contact.attributes('href')).toBe(
        `/${locale}/?source=hero#contacts`,
      )
      expect(contact.attributes('target')).toBeUndefined()
      expect(contact.classes()).not.toContain('action')
      await contact.trigger('click')
      await flushPromises()
      expect(router.currentRoute.value.fullPath).toBe(
        `/${locale}/?source=hero#contacts`,
      )
      expect(document.activeElement).toBe(
        wrapper.get('#contacts-heading').element,
      )
      expect(wrapper.findAll('#hero .social-links a')).toHaveLength(3)
      wrapper.unmount()
    },
  )

  it('renders all seven named sections, reviewed cards and file-backed PDF controls', async () => {
    const { wrapper } = await render()
    for (const id of sections) {
      const section = wrapper.get(`section#${id}`)
      expect(section.attributes('aria-labelledby')).toBe(`${id}-heading`)
      expect(wrapper.find(`#${id}-heading`).exists()).toBe(true)
    }
    expect(wrapper.findAll('h1')).toHaveLength(1)
    expect(wrapper.findAll('#projects article')).toHaveLength(5)
    expect(wrapper.findAll('#tools article')).toHaveLength(3)
    expect(wrapper.findAll('#resume button:disabled')).toHaveLength(
      2 * resumes.filter((item) => !resumeAvailable(item.id, 'en')).length,
    )
    expect(wrapper.findAll('#projects img')).toHaveLength(4)
    expect(wrapper.get('#project-task a').attributes('href')).toBe(
      'https://github.com/DanilFaritovich/task-service-api',
    )
    expect(wrapper.get('#project-standards a').attributes('href')).toBe(
      'https://github.com/DanilFaritovich/codex-development-standards/tree/develop',
    )
    expect(wrapper.findAll('.experience-cases dt')).toHaveLength(3)
    expect(wrapper.find('#project-avito').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Live Demo')
    wrapper.unmount()
  })
  it('opens the menu, contains focus, closes with Escape and restores focus', async () => {
    const { wrapper } = await render()
    const trigger = wrapper.get<HTMLButtonElement>('.menu-trigger')
    trigger.element.focus()
    await trigger.trigger('click')
    expect(trigger.attributes('aria-expanded')).toBe('true')
    const dialog = wrapper.get('[role="dialog"]')
    expect(dialog.attributes('aria-modal')).toBe('true')
    const close = dialog.get<HTMLButtonElement>('button')
    expect(document.activeElement).toBe(close.element)
    expect(document.body.style.overflow).toBe('hidden')
    const links = dialog.findAll<HTMLAnchorElement>('a')
    links.at(-1)!.element.focus()
    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
        cancelable: true,
      }),
    )
    expect(document.activeElement).toBe(close.element)
    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      }),
    )
    expect(document.activeElement).toBe(links.at(-1)!.element)
    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    )
    await flushPromises()
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    expect(document.activeElement).toBe(trigger.element)
    expect(document.body.style.overflow).toBe('')
    wrapper.unmount()
  })
  it('navigates all section anchors and closes the menu after selection', async () => {
    const { wrapper, router } = await render()
    await wrapper.get('.menu-trigger').trigger('click')
    const dialog = wrapper.get('[role="dialog"]')
    expect(
      dialog.findAll('.section-navigation a').map((a) => a.attributes('href')),
    ).toEqual(sections.map((id) => `/en/#${id}`))
    await dialog.get('a[href="/en/#projects"]').trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.hash).toBe('#projects')
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    expect(document.activeElement?.id).toBe('projects-heading')
    wrapper.unmount()
  })
  it('tracks a section when an anchor lands on a fractional CSS pixel', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function (this: HTMLElement) {
        return { top: this.id === 'tools' ? 100.3 : 1000 } as DOMRect
      },
    )
    const { wrapper } = await render('/en/#tools')
    await flushPromises()
    expect(
      wrapper.get('.desktop-rail [aria-current="location"]').attributes('href'),
    ).toBe('/en/#tools')
    wrapper.unmount()
  })
  it('switches locale in the menu, keeps the section and localizes controls', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function (this: HTMLElement) {
        return { top: this.id === 'resume' ? 80 : 1000 } as DOMRect
      },
    )
    const { wrapper, router } = await render('/en/#resume')
    await wrapper.get('.menu-trigger').trigger('click')
    await wrapper.get('[role="dialog"] a[lang="ru"]').trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.fullPath).toBe('/ru/#resume')
    expect(wrapper.get('#resume-heading').text()).toBe('Резюме')
    expect(wrapper.get('.menu-trigger').text()).toBe('Меню')
    if (resumes.some((item) => !resumeAvailable(item.id, 'ru'))) {
      expect(wrapper.get('#pdf-unavailable').text()).toBe(
        'PDF-файлы пока недоступны.',
      )
    }
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    wrapper.unmount()
  })
})
