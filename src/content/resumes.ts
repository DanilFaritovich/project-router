export type ResumeLanguage = 'en' | 'ru'
export const resumes = [
  { id: 'backend', title: 'resumeBackend', stack: 'resumeBackendStack' },
  { id: 'ai', title: 'resumeAi', stack: 'resumeAiStack' },
  { id: 'data', title: 'resumeData', stack: 'resumeDataStack' },
] as const
export type Resume = (typeof resumes)[number]
export type ResumeId = Resume['id']

export function resumeUrl(id: ResumeId, language: ResumeLanguage) {
  return `/resumes/candidate-${id}-${language}.pdf`
}

// The owner requested the new documents in the existing viewer for review.
// Original /resumes/{id}-{language}.pdf files remain unchanged.
// Vite resolves availability at build time; missing materials never become links.
const files = import.meta.glob('/public/resumes/candidate-*.pdf', {
  query: '?url',
  import: 'default',
  eager: true,
})
export function resumeAvailable(id: ResumeId, language: ResumeLanguage) {
  return `/public${resumeUrl(id, language)}` in files
}
