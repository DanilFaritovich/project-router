import type { PDFDocumentLoadingTask } from 'pdfjs-dist'
import { discardResume, resumeData } from './resumeData'

let runtime: ReturnType<typeof importRuntime> | undefined
async function importRuntime() {
  const [pdfjs, worker] = await Promise.all([
    import('pdfjs-dist'),
    import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
  ])
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default
  return { pdfjs, workerUrl: worker.default }
}
function pdfRuntime() {
  return (runtime ??= importRuntime().catch((error: unknown) => {
    runtime = undefined
    throw error
  }))
}

let workerPreload: Promise<void> | undefined
export async function preloadPdfRuntime() {
  const { workerUrl } = await pdfRuntime()
  // Importing ?url alone does not download the worker. Warm the HTTP cache
  // without starting a worker or parsing/rendering any document in the background.
  await (workerPreload ??= fetch(workerUrl, { cache: 'force-cache' })
    .then(async (response) => {
      if (!response.ok) throw new Error('PDF worker request failed')
      await response.arrayBuffer()
    })
    .catch((error: unknown) => {
      workerPreload = undefined
      throw error
    }))
}

export async function loadPdf(url: string): Promise<PDFDocumentLoadingTask> {
  const [{ pdfjs }, data] = await Promise.all([pdfRuntime(), resumeData(url)])
  const task = pdfjs.getDocument({ data })
  // A successful HTTP response may still contain an invalid PDF. Retry must
  // be able to fetch fresh bytes instead of reusing that failed document.
  void task.promise.catch(() => discardResume(url))
  return task
}
