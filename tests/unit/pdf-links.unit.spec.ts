import { describe, expect, it, vi } from 'vitest'
import {
  createLinkAnnotations,
  safePdfLink,
} from '../../src/pdf/linkAnnotations'
import { readFile } from 'node:fs/promises'

// Exercise the installed AnnotationLayer DOM with PDF.js's Node-compatible build.
vi.mock('pdfjs-dist', () => import('pdfjs-dist/legacy/build/pdf.mjs'))

describe('PDF URL policy', () => {
  it.each([
    'https://example.com/project',
    'http://example.com/',
    'mailto:owner@example.com',
    'https://wa.me/message/example',
    'https://t.me/example',
    'https://linkedin.com/in/example',
    'https://github.com/example/project',
  ])('permits %s', (url) => expect(safePdfLink(url)).toBe(url))

  it.each([
    'javascript:alert(1)',
    'data:text/html,test',
    'file:///tmp/test',
    'vbscript:alert(1)',
    'ftp://example.com/',
    '//example.com',
    '/relative',
    'tel:123',
    undefined,
    '',
    'not a URL',
  ])('rejects %s', (url) => expect(safePdfLink(url)).toBeUndefined())

  it('renders only safe URL annotations as accessible native links', async () => {
    const { getDocument, AnnotationType } =
      await import('pdfjs-dist/legacy/build/pdf.mjs')
    const task = getDocument({
      data: new Uint8Array(await readFile('public/resumes/backend-en.pdf')),
      standardFontDataUrl: `${process.cwd()}/node_modules/pdfjs-dist/standard_fonts/`,
    })
    const pdf = await task.promise
    try {
      const page = await pdf.getPage(1)
      const annotations = await page.getAnnotations()
      const original = annotations[0]!
      vi.spyOn(page, 'getAnnotations').mockResolvedValue([
        ...annotations,
        { ...original, id: 'script', url: 'javascript:alert(1)' },
        { ...original, id: 'data', url: 'data:text/html,test' },
        { ...original, id: 'action', url: undefined, action: 'Print' },
        {
          ...original,
          id: 'js',
          url: undefined,
          actions: new Map([['Action', ['alert(1)']]]),
        },
        { ...original, id: 'widget', annotationType: AnnotationType.WIDGET },
        { ...original, id: 'hidden', hidden: true },
      ])
      const layer = await createLinkAnnotations(
        page,
        page.getViewport({ scale: 1.25 }),
      )
      const links = [
        ...(layer.div as HTMLDivElement).querySelectorAll<HTMLAnchorElement>(
          'a',
        ),
      ]
      expect(links).toHaveLength(annotations.length)
      for (const link of links) {
        expect(link.tabIndex).toBe(0)
        expect(link.getAttribute('aria-label')).toBe(link.href)
        if (link.protocol === 'mailto:') expect(link.target).toBe('')
        else {
          expect(link.target).toBe('_blank')
          expect(link.rel).toBe('noopener noreferrer')
        }
      }
      layer.destroy()
      expect(layer.div.childElementCount).toBe(0)
    } finally {
      await task.destroy()
    }
  })
})
