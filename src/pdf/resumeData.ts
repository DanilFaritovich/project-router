import { resumeUrl, resumes } from '../content/resumes'

// Only the six catalog documents may occupy this per-tab cache.
const urls = new Set(
  resumes.flatMap(({ id }) =>
    ['en', 'ru'].map((lang) => resumeUrl(id, lang as 'en' | 'ru')),
  ),
)
type Entry = {
  controller: AbortController
  foreground: boolean
  pending: boolean
  promise: Promise<Uint8Array>
}
const entries = new Map<string, Entry>()

function entryFor(url: string, foreground: boolean) {
  if (!urls.has(url)) throw new Error('Unknown resume URL')
  const existing = entries.get(url)
  if (existing) {
    if (foreground) existing.foreground = true
    return existing
  }
  const controller = new AbortController()
  const entry: Entry = {
    controller,
    foreground,
    pending: true,
    promise: fetch(url, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok)
          throw new Error(`PDF request failed: ${response.status}`)
        const data = new Uint8Array(await response.arrayBuffer())
        entry.pending = false
        return data
      })
      .catch((error: unknown) => {
        if (entries.get(url) === entry) entries.delete(url)
        throw error
      }),
  }
  entries.set(url, entry)
  return entry
}

export async function preloadResume(url: string) {
  await entryFor(url, false).promise
}

export async function resumeData(url: string) {
  // PDF.js transfers its input buffer to a worker. Keep the cached original intact.
  return (await entryFor(url, true).promise).slice()
}

export function discardResume(url: string) {
  entries.delete(url)
}

export function cancelBackgroundResumes() {
  for (const [url, entry] of entries) {
    if (entry.pending && !entry.foreground) {
      entries.delete(url)
      entry.controller.abort()
    }
  }
}
