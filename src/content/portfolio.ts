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
