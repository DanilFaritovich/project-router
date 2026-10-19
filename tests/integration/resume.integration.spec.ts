import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import ResumeModal from '../../src/components/resume/ResumeModal.vue'
import ResumeSection from '../../src/components/sections/ResumeSection.vue'
import { resumes } from '../../src/content/resumes'
import { createAppI18n } from '../../src/locales'
import { loadPdf } from '../../src/pdf/loadPdf'

vi.mock('../../src/content/resumes', async (original) => ({
  ...(await original<typeof import('../../src/content/resumes')>()),
  resumeAvailable: () => true,
}))

vi.mock('../../src/pdf/loadPdf', () => ({ loadPdf: vi.fn() }))
const destroy = vi.fn().mockResolvedValue(undefined)
const cancel = vi.fn()
const render = vi.fn(() => ({ promise: Promise.resolve(), cancel }))
const getPage = vi.fn().mockResolvedValue({
  getViewport: ({ scale }: { scale: number }) => ({
    width: 600 * scale,
    height: 800 * scale,
  }),
  render,
})
const result = { numPages: 3, getPage }
function success() {
  vi.mocked(loadPdf).mockResolvedValue({
    promise: Promise.resolve(result),
    destroy,
  } as never)
}
function mountViewer(language: 'en' | 'ru' = 'en') {
  return mount(ResumeModal, {
    attachTo: document.body,
    props: { resume: resumes[0], initialLanguage: language },
    global: { plugins: [createAppI18n()] },
  })
}
beforeEach(() => {
  vi.clearAllMocks()
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      disconnect() {}
    },
  )
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '')
  }
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute('open')
  }
  success()
})
afterEach(() => {
  document.body.innerHTML = ''
  document.body.style.overflow = ''
  vi.unstubAllGlobals()
})

describe('resume preview', () => {
  it('activates the three cards with matching downloads and initializes the document from the site locale', async () => {
    const i18n = createAppI18n()
    i18n.global.locale.value = 'ru'
    const wrapper = mount(ResumeSection, {
      attachTo: document.body,
      global: { plugins: [i18n] },
    })
    expect(
      wrapper.findAll('a[download]').map((link) => link.attributes('href')),
    ).toEqual([
      '/resumes/backend-ru.pdf',
      '/resumes/ai-ru.pdf',
      '/resumes/data-ru.pdf',
    ])
    await wrapper.findAll('button')[1]!.trigger('click')
    await vi.waitFor(() =>
      expect(loadPdf).toHaveBeenCalledWith('/resumes/ai-ru.pdf'),
    )
    await flushPromises()
    i18n.global.locale.value = 'en'
    await flushPromises()
    expect(
      document.querySelector('dialog a[download]')?.getAttribute('href'),
    ).toBe('/resumes/ai-ru.pdf')
    expect(
      wrapper.findAll('a[download]').map((link) => link.attributes('href')),
    ).toEqual([
      '/resumes/backend-en.pdf',
      '/resumes/ai-en.pdf',
      '/resumes/data-en.pdf',
    ])
    wrapper.unmount()
  })

  it('selects the initial language and keeps preview, download and fallback URLs aligned after switching', async () => {
    const wrapper = mountViewer('ru')
    await flushPromises()
    expect(loadPdf).toHaveBeenLastCalledWith('/resumes/backend-ru.pdf')
    const links = () => [...document.querySelectorAll('dialog a')]
    expect(
      links().every(
        (link) => link.getAttribute('href') === '/resumes/backend-ru.pdf',
      ),
    ).toBe(true)
    expect(links()[0]!.getAttribute('download')).toBe('backend-ru.pdf')
    ;(
      document.querySelector('dialog button[lang="en"]') as HTMLButtonElement
    ).click()
    await flushPromises()
    expect(loadPdf).toHaveBeenLastCalledWith('/resumes/backend-en.pdf')
    expect(
      links().every(
        (link) => link.getAttribute('href') === '/resumes/backend-en.pdf',
      ),
    ).toBe(true)
    expect(destroy).toHaveBeenCalledOnce()
    expect(document.querySelector('canvas')?.getAttribute('lang')).toBe('en')
    wrapper.unmount()
  })

  it('shows loading, then an error and retries the selected document', async () => {
    let reject!: (reason: Error) => void
    vi.mocked(loadPdf).mockReturnValueOnce(
      new Promise((_, fail) => {
        reject = fail
      }),
    )
    const wrapper = mountViewer()
    await flushPromises()
    expect(document.querySelector('[role="status"]')?.textContent).toContain(
      'Loading',
    )
    reject(new Error('offline'))
    await flushPromises()
    expect(document.querySelector('[role="alert"]')?.textContent).toContain(
      'Unable to display PDF',
    )
    const retry = [...document.querySelectorAll('dialog button')].find(
      (button) => button.textContent === 'Retry',
    ) as HTMLButtonElement
    retry.click()
    await flushPromises()
    expect(loadPdf).toHaveBeenCalledTimes(2)
    expect(
      document.querySelector('[aria-busy]')?.getAttribute('aria-busy'),
    ).toBe('false')
    expect(document.querySelector('canvas')?.style.display).not.toBe('none')
    wrapper.unmount()
  })

  it('changes pages, zooms and fits the document', async () => {
    const wrapper = mountViewer()
    await flushPromises()
    ;(
      document.querySelector('[aria-label="Next page"]') as HTMLButtonElement
    ).click()
    await flushPromises()
    expect(document.querySelector('.pdf-page-count')?.textContent).toContain(
      '2 / 3',
    )
    expect(getPage).toHaveBeenLastCalledWith(2)
    ;(
      document.querySelector('[aria-label="Zoom in"]') as HTMLButtonElement
    ).click()
    await flushPromises()
    expect(document.querySelector('.pdf-zoom')?.textContent).toBe('35%')
    const fit = [...document.querySelectorAll('dialog button')].find(
      (button) => button.textContent === 'Fit width',
    ) as HTMLButtonElement
    fit.click()
    await flushPromises()
    expect(fit.getAttribute('aria-pressed')).toBe('true')
    wrapper.unmount()
  })

  it('contains keyboard focus, closes on Escape/close and restores the opener', async () => {
    const opener = document.createElement('button')
    document.body.append(opener)
    opener.focus()
    const wrapper = mountViewer()
    await flushPromises()
    const dialog = document.querySelector('dialog')!
    const close = [...dialog.querySelectorAll('button')].find(
      (button) => button.textContent === 'Close',
    )!
    expect(document.activeElement).toBe(close)
    const last = dialog.querySelector('footer a') as HTMLElement
    last.focus()
    last.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
        cancelable: true,
      }),
    )
    const first = dialog.querySelector('a')!
    expect(document.activeElement).toBe(first)
    first.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      }),
    )
    expect(document.activeElement).toBe(last)
    // Native dialog maps Escape to the cancel event; Chromium E2E covers the key itself.
    dialog.dispatchEvent(new Event('cancel', { cancelable: true }))
    close.click()
    expect(wrapper.emitted('close')).toHaveLength(2)
    wrapper.unmount()
    expect(document.activeElement).toBe(opener)
    expect(document.body.style.overflow).toBe('')
    expect(destroy).toHaveBeenCalledOnce()
  })

  it('disposes a document that finishes loading after the viewer closes', async () => {
    let resolve!: (value: never) => void
    vi.mocked(loadPdf).mockReturnValueOnce(
      new Promise((done) => {
        resolve = done
      }),
    )
    const wrapper = mountViewer()
    await flushPromises()
    wrapper.unmount()
    resolve({ promise: Promise.resolve(result), destroy } as never)
    await flushPromises()
    expect(destroy).toHaveBeenCalledOnce()
  })
})
