import type { PDFDocumentLoadingTask } from 'pdfjs-dist'

export async function loadPdf(url: string): Promise<PDFDocumentLoadingTask> {
  const [pdfjs, worker] = await Promise.all([
    import('pdfjs-dist'),
    import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
  ])
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default
  return pdfjs.getDocument({ url })
}
