import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import {
  cancelBackgroundResumes,
  discardResume,
  preloadResume,
  resumeData,
} from '../../src/pdf/resumeData'

const url = '/resumes/candidate-backend-en.pdf'
const fetchPdf = vi.fn()
beforeEach(() => {
  vi.stubGlobal('fetch', fetchPdf)
  fetchPdf.mockReset()
  fetchPdf.mockResolvedValue(new Response(new Uint8Array([37, 80, 68, 70])))
})
afterEach(() => {
  cancelBackgroundResumes()
  discardResume(url)
  vi.unstubAllGlobals()
})

it('shares a pending preload with preview and preserves bytes after worker transfer', async () => {
  let complete!: (response: Response) => void
  fetchPdf.mockReturnValue(
    new Promise<Response>((resolve) => {
      complete = resolve
    }),
  )
  const preload = preloadResume(url)
  const preview = resumeData(url)
  cancelBackgroundResumes()
  expect(fetchPdf.mock.calls[0][1].signal.aborted).toBe(false)
  complete(new Response(new Uint8Array([37, 80, 68, 70])))
  await preload
  const first = await preview
  structuredClone(first.buffer, { transfer: [first.buffer] })
  expect(first.byteLength).toBe(0)
  expect(await resumeData(url)).toEqual(new Uint8Array([37, 80, 68, 70]))
  expect(fetchPdf).toHaveBeenCalledTimes(1)
})

it('cancels background requests and allows a fresh foreground request', async () => {
  fetchPdf.mockImplementationOnce(
    (_url, { signal }) =>
      new Promise((_resolve, reject) => {
        signal.addEventListener('abort', () =>
          reject(new DOMException('Aborted', 'AbortError')),
        )
      }),
  )
  const preload = preloadResume(url)
  const rejected = expect(preload).rejects.toThrow('Aborted')
  cancelBackgroundResumes()
  await resumeData(url)
  await rejected
  expect(fetchPdf).toHaveBeenCalledTimes(2)
  await resumeData(url)
  expect(fetchPdf).toHaveBeenCalledTimes(2)
})

it('retries a failed preload instead of caching its rejection', async () => {
  fetchPdf.mockResolvedValueOnce(new Response('', { status: 503 }))
  await expect(preloadResume(url)).rejects.toThrow('503')
  await expect(resumeData(url)).resolves.toHaveLength(4)
  expect(fetchPdf).toHaveBeenCalledTimes(2)
})

it('rejects URLs outside the six catalog documents', async () => {
  await expect(resumeData('/unexpected.pdf')).rejects.toThrow('Unknown resume')
  expect(fetchPdf).not.toHaveBeenCalled()
})
