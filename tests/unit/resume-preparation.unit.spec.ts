import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { scheduleResumePreparation } from '../../src/pdf/prepareResumes'
import {
  cancelBackgroundResumes,
  preloadResume,
} from '../../src/pdf/resumeData'

vi.mock('../../src/pdf/resumeData', () => ({
  cancelBackgroundResumes: vi.fn(),
  preloadResume: vi.fn().mockResolvedValue(undefined),
}))
vi.mock('../../src/pdf/loadPdf', () => ({
  preloadPdfRuntime: vi.fn().mockResolvedValue(undefined),
}))
vi.mock('../../src/components/resume/ResumeModal.vue', () => ({ default: {} }))

beforeEach(() => {
  vi.clearAllMocks()
  vi.useFakeTimers()
  vi.stubGlobal(
    'requestIdleCallback',
    vi.fn((callback: () => void) => setTimeout(callback, 10)),
  )
  vi.stubGlobal('cancelIdleCallback', vi.fn(clearTimeout))
  vi.spyOn(document, 'readyState', 'get').mockReturnValue('complete')
  Object.defineProperty(navigator, 'connection', {
    configurable: true,
    value: undefined,
  })
})
afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  Reflect.deleteProperty(navigator, 'connection')
})

it('prepares only the current language and cancels scheduled work on cleanup', async () => {
  const cancelEnglish = scheduleResumePreparation('en')
  cancelEnglish()
  const cancelRussian = scheduleResumePreparation('ru')
  await vi.runAllTimersAsync()
  expect(preloadResume).toHaveBeenCalledTimes(3)
  expect(vi.mocked(preloadResume).mock.calls.map(([url]) => url)).toEqual([
    '/resumes/candidate-backend-ru.pdf',
    '/resumes/candidate-ai-ru.pdf',
    '/resumes/candidate-data-ru.pdf',
  ])
  cancelRussian()
  expect(cancelBackgroundResumes).toHaveBeenCalledTimes(2)
})

it.each([
  { saveData: true },
  { effectiveType: '2g' },
  { effectiveType: 'slow-2g' },
])(
  'avoids automatic preparation on a constrained connection: %s',
  async (connection) => {
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: connection,
    })
    scheduleResumePreparation('en')()
    await vi.runAllTimersAsync()
    expect(preloadResume).not.toHaveBeenCalled()
  },
)

it('waits for the page load event and supports browsers without idle callbacks', async () => {
  vi.spyOn(document, 'readyState', 'get').mockReturnValue('loading')
  vi.stubGlobal('requestIdleCallback', undefined)
  // Remove the property entirely to exercise feature detection.
  Reflect.deleteProperty(window, 'requestIdleCallback')
  const cancel = scheduleResumePreparation('en')
  await vi.runAllTimersAsync()
  expect(preloadResume).not.toHaveBeenCalled()
  window.dispatchEvent(new Event('load'))
  await vi.runAllTimersAsync()
  expect(preloadResume).toHaveBeenCalledTimes(3)
  cancel()
})

it('stops the queue while a background document is being fetched', async () => {
  let finish!: () => void
  vi.mocked(preloadResume).mockImplementationOnce(
    () =>
      new Promise<void>((resolve) => {
        finish = resolve
      }),
  )
  const cancel = scheduleResumePreparation('en')
  await vi.advanceTimersByTimeAsync(10)
  expect(preloadResume).toHaveBeenCalledTimes(1)
  cancel()
  finish()
  await vi.runAllTimersAsync()
  expect(preloadResume).toHaveBeenCalledTimes(1)
})
