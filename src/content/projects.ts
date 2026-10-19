import moonImage from '../assets/projects/moon.webp'
import supportImage from '../assets/projects/support.webp'
import geocoderImage from '../assets/projects/geocoder.webp'
import maximImage from '../assets/projects/maxim.webp'
import type en from '../locales/en'

export type ProjectId =
  | 'moon'
  | 'support'
  | 'geocoder'
  | 'task'
  | 'maxim'
  | 'avito'
  | 'server'
  | 'worker'
  | 'standards'

export interface PortfolioItem {
  id: ProjectId
  stack: readonly string[]
  repositoryUrl: string
  releaseUrl?: string
  preview?: string
  emphasized?: boolean
  image?: {
    src: string
    altKey: Extract<keyof typeof en, `${ProjectId}ImageAlt`>
    width: number
    height: number
  }
}

// Owner-approved screenshots, resized and encoded as WebP; no generated imagery.
// Source: Moon-courier-crisis-game/main/docs/images/mission-overview.png
// Source: support-assistant-llm/develop/docs/images/application-overview.png
// Source: yandex-geocoder-region-parser/main/docs/images/dags-list.png
// Source: maxim-ml/main/docs/images/prediction.png
// All source repositories belong to https://github.com/DanilFaritovich/.
export const featured: readonly PortfolioItem[] = [
  {
    id: 'moon',
    stack: [
      'FastAPI',
      'SQLAlchemy',
      'NetworkX',
      'Vue 3',
      'TypeScript',
      'Docker',
    ],
    repositoryUrl:
      'https://github.com/DanilFaritovich/Moon-courier-crisis-game',
    releaseUrl:
      'https://github.com/DanilFaritovich/Moon-courier-crisis-game/releases/tag/v1.0.0',
    preview: 'MC',
    emphasized: true,
    image: { src: moonImage, altKey: 'moonImageAlt', width: 1200, height: 750 },
  },
  {
    id: 'support',
    stack: [
      'Python',
      'FastAPI',
      'Vue 3',
      'OpenRouter',
      'Redis',
      'SQLAlchemy',
      'Docker',
    ],
    repositoryUrl:
      'https://github.com/DanilFaritovich/support-assistant-llm/tree/develop',
    preview: 'AI',
    image: {
      src: supportImage,
      altKey: 'supportImageAlt',
      width: 1200,
      height: 1000,
    },
  },
  {
    id: 'geocoder',
    stack: [
      'Python',
      'Apache Airflow',
      'PostgreSQL',
      'MinIO/S3',
      'Shapely',
      'PyProj',
      'Docker',
    ],
    repositoryUrl:
      'https://github.com/DanilFaritovich/yandex-geocoder-region-parser',
    releaseUrl:
      'https://github.com/DanilFaritovich/yandex-geocoder-region-parser/releases/tag/v1.2.0',
    preview: 'ETL',
    image: {
      src: geocoderImage,
      altKey: 'geocoderImageAlt',
      width: 1200,
      height: 561,
    },
  },
]

export const more: readonly PortfolioItem[] = [
  {
    id: 'task',
    stack: [
      'Python',
      'FastAPI',
      'SQLAlchemy',
      'PostgreSQL',
      'Alembic',
      'Pydantic',
      'Pytest',
    ],
    repositoryUrl: 'https://github.com/DanilFaritovich/task-service-api',
  },
  {
    id: 'maxim',
    stack: [
      'Python',
      'FastAPI',
      'scikit-learn',
      'Pandas',
      'React',
      'TypeScript',
      'SQLAlchemy',
      'Docker',
    ],
    repositoryUrl: 'https://github.com/DanilFaritovich/maxim-ml',
    releaseUrl:
      'https://github.com/DanilFaritovich/maxim-ml/releases/tag/v1.0.0',
    image: {
      src: maximImage,
      altKey: 'maximImageAlt',
      width: 1200,
      height: 1000,
    },
  },
  {
    id: 'avito',
    stack: ['Python', 'Playwright', 'Camoufox', 'SQLAlchemy', 'SQLite', 'CSV'],
    repositoryUrl: 'https://github.com/DanilFaritovich/avito-parser',
  },
]

export const tools: readonly PortfolioItem[] = [
  {
    id: 'server',
    stack: [
      'Python',
      'Ansible',
      'Ubuntu',
      'OpenSSH',
      'UFW',
      'Docker',
      'GitHub Actions',
      'KVM/QEMU',
    ],
    repositoryUrl:
      'https://github.com/DanilFaritovich/portfolio-server-infrastructure',
    releaseUrl:
      'https://github.com/DanilFaritovich/portfolio-server-infrastructure/releases/tag/v1.0.0',
    emphasized: true,
  },
  {
    id: 'worker',
    stack: [
      'Python',
      'MCP',
      'Pydantic',
      'Codex CLI',
      'OpenCode',
      'Docker',
      'Pytest',
    ],
    repositoryUrl:
      'https://github.com/DanilFaritovich/codex-free-worker-mcp/tree/develop',
  },
  {
    id: 'standards',
    stack: [
      'Codex CLI',
      'Agent Skills',
      'YAML',
      'Git',
      'GitHub Actions',
      'MCP',
    ],
    repositoryUrl:
      'https://github.com/DanilFaritovich/codex-development-standards/tree/develop',
  },
]
