// Stage 03 layout fixtures. Reviewed catalog enrichment belongs to Stage 04.
export const sections = [
  'hero',
  'about',
  'skills',
  'projects',
  'tools',
  'resume',
  'contacts',
] as const
export type SectionId = (typeof sections)[number]
export const sectionLabel = {
  hero: 'navHero',
  about: 'navAbout',
  skills: 'navSkills',
  projects: 'navProjects',
  tools: 'navTools',
  resume: 'navResume',
  contacts: 'navContacts',
} as const
const github = 'https://github.com/DanilFaritovich/'
export const contactSocialOrder = [
  'telegram',
  'linkedin',
  'github',
  'instagram',
]
export const socialLinks = [
  { label: 'github', href: github.slice(0, -1) },
  {
    label: 'linkedin',
    href: 'https://www.linkedin.com/in/danil-miftakhov-55468b399/',
  },
  { label: 'telegram', href: 'https://t.me/Daniel_De_Casto' },
  {
    label: 'instagram',
    href: 'https://www.instagram.com/daniel_de_casto',
    contactsOnly: true,
  },
]
export interface PortfolioItem {
  id: string
  stack: string
  repository: string
  release?: boolean
  preview?: string
  emphasized?: boolean
}
export const featured: PortfolioItem[] = [
  {
    id: 'moon',
    stack: 'moonStack',
    repository: github + 'Moon-courier-crisis-game',
    release: true,
    preview: 'MC',
    emphasized: true,
  },
  {
    id: 'support',
    stack: 'supportStack',
    repository: github + 'support-assistant-llm',
    preview: 'AI',
  },
  {
    id: 'geocoder',
    stack: 'geocoderStack',
    repository: github + 'yandex-geocoder-region-parser',
    release: true,
    preview: 'ETL',
  },
]
export const more: PortfolioItem[] = [
  {
    id: 'task',
    stack: 'taskStack',
    repository: github + 'task-service-api',
  },
  {
    id: 'maxim',
    stack: 'maximStack',
    repository: github + 'maxim-ml',
    release: true,
  },
  {
    id: 'avito',
    stack: 'avitoStack',
    repository: github + 'avito-parser',
  },
]
export const tools: PortfolioItem[] = [
  {
    id: 'server',
    stack: 'serverStack',
    repository: github + 'portfolio-server-infrastructure',
    release: true,
    emphasized: true,
  },
  {
    id: 'worker',
    stack: 'workerStack',
    repository: github + 'codex-free-worker-mcp',
  },
  {
    id: 'standards',
    stack: 'standardsStack',
    repository: github + 'codex-development-standards',
  },
]
export const skillGroups = [
  {
    id: 'backend',
    stack: 'backendSkillStack',
  },
  {
    id: 'database',
    stack: 'databaseSkillStack',
  },
  {
    id: 'data',
    stack: 'dataSkillStack',
  },
  {
    id: 'automation',
    stack: 'automationSkillStack',
  },
  {
    id: 'infra',
    stack: 'infraSkillStack',
  },
  {
    id: 'testing',
    stack: 'testingSkillStack',
  },
  {
    id: 'ai',
    stack: 'aiSkillStack',
  },
  {
    id: 'architecture',
    stack: 'architectureSkillStack',
  },
]
