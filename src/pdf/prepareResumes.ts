import {
  resumes,
  resumeAvailable,
  resumeUrl,
  type ResumeLanguage,
} from '../content/resumes'
import { cancelBackgroundResumes, preloadResume } from './resumeData'

export function loadResumeModal() {
  return import('../components/resume/ResumeModal.vue')
}

let viewerPreparation: Promise<void> | undefined
export function prepareResumeViewer() {
  return (viewerPreparation ??= Promise.all([
    loadResumeModal(),
    import('./loadPdf').then(({ preloadPdfRuntime }) => preloadPdfRuntime()),
  ])
    .then(() => {})
    .catch((error: unknown) => {
      viewerPreparation = undefined
      throw error
    }))
}

export function prepareResumeOnIntent(url: string) {
  void prepareResumeViewer().catch(() => {})
  void preloadResume(url).catch(() => {})
}

export function scheduleResumePreparation(language: ResumeLanguage) {
  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string }
    }
  ).connection
  if (
    connection?.saveData ||
    ['slow-2g', '2g'].includes(connection?.effectiveType ?? '')
  )
    return cancelBackgroundResumes

  let cancelled = false
  let idle: number | undefined
  let timer: ReturnType<typeof setTimeout> | undefined
  async function prepare() {
    // Best-effort preparation must never surface an error on the portfolio page.
    void prepareResumeViewer().catch(() => {})
    for (const resume of resumes) {
      if (cancelled) return
      if (resumeAvailable(resume.id, language)) {
        await preloadResume(resumeUrl(resume.id, language)).catch(() => {})
      }
    }
  }
  function schedule() {
    if ('requestIdleCallback' in window) {
      idle = window.requestIdleCallback(() => void prepare(), { timeout: 2000 })
    } else {
      timer = setTimeout(() => void prepare(), 1000)
    }
  }
  if (document.readyState === 'complete') schedule()
  else window.addEventListener('load', schedule, { once: true })

  return () => {
    cancelled = true
    window.removeEventListener('load', schedule)
    if (idle !== undefined) window.cancelIdleCallback(idle)
    if (timer !== undefined) clearTimeout(timer)
    cancelBackgroundResumes()
  }
}
