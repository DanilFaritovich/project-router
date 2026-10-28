import { describe, expect, it } from 'vitest'
import { resumes, resumeUrl } from '../../src/content/resumes'

describe('resume document catalog', () => {
  it('maps each specialization and language to its own public PDF', () => {
    expect(resumes.map((resume) => resume.id)).toEqual([
      'backend',
      'ai',
      'data',
    ])
    for (const resume of resumes) {
      for (const language of ['en', 'ru'] as const) {
        expect(resumeUrl(resume.id, language)).toBe(
          `/resumes/candidate-${resume.id}-${language}.pdf`,
        )
      }
    }
  })
})
