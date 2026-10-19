import type { PDFPageProxy } from 'pdfjs-dist'
import type { PageViewport } from 'pdfjs-dist/types/src/display/page_viewport'

export function safePdfLink(value: unknown): string | undefined {
  if (typeof value !== 'string') return
  try {
    const url = new URL(value)
    if (['https:', 'http:', 'mailto:'].includes(url.protocol)) return url.href
  } catch {
    // PDF actions and relative/invalid URLs are not navigation destinations.
  }
}

export async function createLinkAnnotations(
  page: PDFPageProxy,
  viewport: PageViewport,
) {
  const [{ AnnotationLayer, AnnotationType }, annotations] = await Promise.all([
    import('pdfjs-dist'),
    page.getAnnotations({ intent: 'display' }),
  ])
  // Only URL links reach PDF.js. No forms, destinations, attachments or scripts.
  const links = annotations.flatMap((annotation) => {
    const url = safePdfLink(annotation.url)
    return annotation.annotationType === AnnotationType.LINK &&
      !annotation.hidden &&
      url
      ? [{ ...annotation, url }]
      : []
  })
  const div = document.createElement('div')
  div.className = 'pdf-link-layer'
  div.style.width = `${viewport.width}px`
  div.style.height = `${viewport.height}px`
  div.style.setProperty('--total-scale-factor', String(viewport.scale))
  const layer = new AnnotationLayer({
    div,
    page,
    viewport: viewport.clone({ dontFlip: true }),
    linkService: {
      addLinkAttributes(link: HTMLAnchorElement, url: string) {
        link.href = url
        link.setAttribute('aria-label', url)
        if (new URL(url).protocol !== 'mailto:') {
          link.target = '_blank'
          link.rel = 'noopener noreferrer'
        }
      },
    },
    accessibilityManager: null,
    annotationCanvasMap: null,
    annotationEditorUIManager: null,
    structTreeLayer: null,
    commentManager: null,
    annotationStorage: null,
  })
  try {
    await layer.addLinkAnnotations(links)
    return layer
  } catch (error) {
    layer.destroy()
    throw error
  }
}
