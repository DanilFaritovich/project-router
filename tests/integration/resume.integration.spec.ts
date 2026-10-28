import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import ResumeModal from '../../src/components/resume/ResumeModal.vue'
import ResumeSection from '../../src/components/sections/ResumeSection.vue'
import { resumes } from '../../src/content/resumes'
import { createAppI18n } from '../../src/locales'
import { loadPdf } from '../../src/pdf/loadPdf'
import { createLinkAnnotations } from '../../src/pdf/linkAnnotations'

vi.mock('../../src/content/resumes', async (original) => ({
  ...(await original<typeof import('../../src/content/resumes')>()),
  resumeAvailable: () => true,
}))

vi.mock('../../src/pdf/loadPdf', () => ({ loadPdf: vi.fn() }))
vi.mock('../../src/pdf/linkAnnotations', () => ({
  createLinkAnnotations: vi.fn(),
}))
const destroyAnnotations = vi.fn()
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
let viewerWidth = 1000
let resize: () => void
function success() {
  vi.mocked(loadPdf).mockResolvedValue({
    promise: Promise.resolve(result),
    destroy,
  } as never)
}
function mountViewer(language: 'en' | 'ru' = 'en') {
  const wrapper = mount(ResumeModal, {
    attachTo: document.body,
    props: { resume: resumes[0], initialLanguage: language },
    global: { plugins: [createAppI18n()] },
  })
  ;(document.querySelector('.pdf-viewport') as HTMLElement).style.padding =
    '16px 24px'
  return wrapper
}
beforeEach(() => {
  vi.clearAllMocks()
  viewerWidth = 1000
  vi.stubGlobal('innerWidth', 1440)
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(
    () => viewerWidth,
  )
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(callback: () => void) {
        resize = callback
      }
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
  vi.mocked(createLinkAnnotations).mockImplementation(async () => {
    const div = document.createElement('div')
    div.innerHTML = '<a href="https://example.com/">Project</a>'
    return { div, destroy: destroyAnnotations } as never
  })
  success()
})
afterEach(() => {
  document.body.innerHTML = ''
  document.body.style.overflow = ''
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
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
      '/resumes/candidate-backend-ru.pdf',
      '/resumes/candidate-ai-ru.pdf',
      '/resumes/candidate-data-ru.pdf',
    ])
    await wrapper.findAll('button')[1]!.trigger('click')
    await vi.waitFor(() =>
      expect(loadPdf).toHaveBeenCalledWith('/resumes/candidate-ai-ru.pdf'),
    )
    await flushPromises()
    i18n.global.locale.value = 'en'
    await flushPromises()
    expect(
      document.querySelector('dialog a[download]')?.getAttribute('href'),
    ).toBe('/resumes/candidate-ai-ru.pdf')
    expect(
      wrapper.findAll('a[download]').map((link) => link.attributes('href')),
    ).toEqual([
      '/resumes/candidate-backend-en.pdf',
      '/resumes/candidate-ai-en.pdf',
      '/resumes/candidate-data-en.pdf',
    ])
    wrapper.unmount()
  })

  it('selects the initial language and keeps preview, download and fallback URLs aligned after switching', async () => {
    const wrapper = mountViewer('ru')
    await flushPromises()
    expect(loadPdf).toHaveBeenLastCalledWith(
      '/resumes/candidate-backend-ru.pdf',
    )
    const links = () => [
      ...document.querySelectorAll('dialog .card-actions a, dialog footer a'),
    ]
    expect(
      links().every(
        (link) =>
          link.getAttribute('href') === '/resumes/candidate-backend-ru.pdf',
      ),
    ).toBe(true)
    expect(links()[0]!.getAttribute('download')).toBe('backend-ru.pdf')
    ;(
      document.querySelector('dialog button[lang="en"]') as HTMLButtonElement
    ).click()
    await flushPromises()
    expect(loadPdf).toHaveBeenLastCalledWith(
      '/resumes/candidate-backend-en.pdf',
    )
    expect(
      links().every(
        (link) =>
          link.getAttribute('href') === '/resumes/candidate-backend-en.pdf',
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
    expect(
      document.querySelector('.pdf-page')?.getAttribute('hidden'),
    ).toBeNull()
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
    expect(document.querySelector('.pdf-zoom')?.textContent).toBe('150%')
    const fit = [...document.querySelectorAll('dialog button')].find(
      (button) => button.textContent === 'Fit width',
    ) as HTMLButtonElement
    fit.click()
    await flushPromises()
    expect(fit.getAttribute('aria-pressed')).toBe('true')
    wrapper.unmount()
  })

  it('caps the initial desktop zoom and recalculates automatic modes without resetting manual zoom', async () => {
    const wrapper = mountViewer()
    await flushPromises()
    const canvas = document.querySelector('canvas')!
    const fit = [...document.querySelectorAll('dialog button')].find(
      (button) => button.textContent === 'Fit width',
    ) as HTMLButtonElement
    expect(canvas.style.width).toBe('750px')
    viewerWidth = 500
    resize()
    await flushPromises()
    expect(parseFloat(canvas.style.width)).toBeCloseTo(452)
    viewerWidth = 1000
    resize()
    await flushPromises()
    expect(canvas.style.width).toBe('750px')
    fit.click()
    await flushPromises()
    expect(parseFloat(canvas.style.width)).toBeCloseTo(952)
    viewerWidth = 800
    resize()
    await flushPromises()
    expect(parseFloat(canvas.style.width)).toBeCloseTo(752)
    ;(
      document.querySelector('[aria-label="Zoom out"]') as HTMLButtonElement
    ).click()
    await flushPromises()
    const manualWidth = canvas.style.width
    viewerWidth = 400
    resize()
    await flushPromises()
    expect(canvas.style.width).toBe(manualWidth)
    wrapper.unmount()
  })

  it('starts mobile in fit width even when a small PDF could fit at 125%', async () => {
    vi.stubGlobal('innerWidth', 390)
    getPage.mockResolvedValueOnce({
      getViewport: ({ scale }: { scale: number }) => ({
        width: 200 * scale,
        height: 300 * scale,
      }),
      render,
    })
    viewerWidth = 350
    const wrapper = mountViewer()
    await flushPromises()
    expect(
      parseFloat(document.querySelector('canvas')!.style.width),
    ).toBeCloseTo(302)
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

  it('removes stale links and keeps focus inside the dialog during rerenders', async () => {
    const wrapper = mountViewer()
    await flushPromises()
    const link = document.querySelector(
      '.pdf-annotations a',
    ) as HTMLAnchorElement
    link.focus()
    resize()
    expect(document.activeElement).toBe(document.querySelector('.pdf-viewport'))
    expect(document.querySelector('.pdf-annotations a')).toBeNull()
    await flushPromises()
    expect(destroyAnnotations).toHaveBeenCalledOnce()
    expect(document.querySelector('.pdf-annotations a')).not.toBeNull()
    wrapper.unmount()
    expect(destroyAnnotations).toHaveBeenCalledTimes(2)
  })

  it('destroys an annotation layer that finishes after document replacement', async () => {
    let resolve!: (value: never) => void
    vi.mocked(createLinkAnnotations).mockReturnValueOnce(
      new Promise((done) => {
        resolve = done
      }),
    )
    const wrapper = mountViewer()
    await flushPromises()
    ;(document.querySelector('button[lang="ru"]') as HTMLButtonElement).click()
    await flushPromises()
    const staleDiv = document.createElement('div')
    staleDiv.innerHTML = '<a href="https://stale.example/">Stale</a>'
    const destroyStale = vi.fn()
    resolve({ div: staleDiv, destroy: destroyStale } as never)
    await flushPromises()
    expect(destroyStale).toHaveBeenCalledOnce()
    expect(document.querySelector('[href="https://stale.example/"]')).toBeNull()
    wrapper.unmount()
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
