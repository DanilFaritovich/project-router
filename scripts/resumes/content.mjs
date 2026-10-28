// Owner-reviewed facts and role-specific copy. These are candidate documents;
// generating them never replaces public/resumes or changes the website catalog.
export const identity = {
  email: 'danilfaritovichwork@gmail.com',
  github: 'https://github.com/DanilFaritovich',
  linkedin: 'https://www.linkedin.com/in/danil-miftakhov-55468b399/',
  telegram: 'https://t.me/Daniel_De_Casto',
}

const repository = (name, development = false) =>
  `${identity.github}/${name}${development ? '/tree/develop' : ''}`

export const languages = {
  en: {
    name: 'Danil Miftakhov',
    location: 'Yerevan, Armenia · Open to remote work and relocation',
    labels: {
      profile: 'Profile',
      skills: 'Core skills',
      experience: 'Professional experience',
      freelance: 'Client work',
      projects: 'Selected engineering projects',
      education: 'Education',
      languages: 'Languages',
      source: 'Source',
      role: 'Software Engineer · Maxim Technology',
      employment: 'February 2022 – Present · Remote',
      freelanceRole: 'Freelance Python Developer',
      freelancePeriod: 'Project-based engagements · Since approximately 2020',
    },
    education:
      'Kazan Federal University · Applied Mathematics and Computer Science · 2021–2026 · Completed',
    languageLevels: 'Russian — Native · English — B1',
    freelance: [
      'Delivered supplier-to-Ozon stock synchronization: transformed inventory data and integrated the marketplace workflow with Python.',
      'Built CSV/Excel/JSON processing utilities and browser/API automation; packaged selected solutions for Docker/Linux.',
      'Developed Telegram interfaces for controlling server utilities, changing settings and inspecting logs.',
    ],
    batch:
      'Built the complete Python tool for selecting and processing records, exporting SQL files and loading SQL data into a database. One run handled up to 46 million address records in approximately 6–8 hours.',
    database:
      'Develop and maintain Python/SQL workflows for address and geospatial data normalization, enrichment, bulk imports and exports in PostgreSQL/PostGIS.',
    geocoding:
      'Refactored geocoding integrations with concurrent requests, retries, API-quota handling and explicit error processing.',
    diagnostics:
      'Investigate data-quality and SQL performance issues using database queries, execution plans and application logs; document technical findings.',
    llm: 'Implemented a two-pass geospatial-name translation workflow: rules agreed with translators, initial LLM translation, second-pass review and conditional revision.',
  },
  ru: {
    name: 'Данил Мифтахов',
    location: 'Ереван, Армения · Удалённая работа и релокация',
    labels: {
      profile: 'Профиль',
      skills: 'Ключевые навыки',
      experience: 'Коммерческий опыт',
      freelance: 'Заказные проекты',
      projects: 'Избранные инженерные проекты',
      education: 'Образование',
      languages: 'Языки',
      source: 'Исходники',
      role: 'Инженер-программист · Maxim Technology',
      employment: 'Февраль 2022 — настоящее время · Удалённо',
      freelanceRole: 'Python-разработчик на фрилансе',
      freelancePeriod: 'Проектная работа · Примерно с 2020 года',
    },
    education:
      'Казанский федеральный университет · Прикладная математика и информатика · 2021–2026 · Образование завершено',
    languageLevels: 'Русский — родной · Английский — B1',
    freelance: [
      'Реализовал синхронизацию остатков поставщика с Ozon: преобразование товарных данных и интеграцию процесса с маркетплейсом на Python.',
      'Создавал утилиты обработки CSV/Excel/JSON, браузерную и API-автоматизацию; отдельные решения упаковывал для Docker/Linux.',
      'Разрабатывал Telegram-интерфейсы управления серверными утилитами, изменения настроек и просмотра логов.',
    ],
    batch:
      'Полностью разработал Python-инструмент выборки и обработки записей, экспорта в SQL-файлы и загрузки SQL-данных в БД. Один прогон обработал до 46 млн адресных записей примерно за 6–8 часов.',
    database:
      'Разрабатываю и поддерживаю процессы Python/SQL для нормализации и обогащения адресных и геоданных, массовых импортов и выгрузок в PostgreSQL/PostGIS.',
    geocoding:
      'Переработал интеграции с геокодерами: конкурентные запросы, повторные попытки, учёт квот API и явная обработка ошибок.',
    diagnostics:
      'Исследую качество данных и производительность SQL по запросам, планам выполнения и логам приложений; документирую технические выводы.',
    llm: 'Реализовал двухэтапную локализацию географических названий: согласованные с переводчиками правила, первичный LLM-перевод, повторную проверку и условную доработку.',
  },
}

export const projects = {
  moon: {
    title: 'Moon Courier Crisis',
    href: repository('Moon-courier-crisis-game'),
    stack: 'FastAPI · SQLAlchemy · Unit of Work · Vue 3 · Docker',
    en: 'A logistics simulation with backend-owned delivery rules. The API checks routes, cargo and battery constraints; the interface renders server results. Separated domain services and persistence, with automated tests and reproducible Docker Compose startup.',
    ru: 'Симулятор логистики с серверными правилами доставки. API проверяет маршруты, грузоподъёмность и заряд; интерфейс отображает результат сервера. Предметные сервисы отделены от хранения данных; есть автоматические тесты и запуск через Docker Compose.',
  },
  geocoder: {
    title: 'Geospatial ETL Pipeline',
    href: repository('yandex-geocoder-region-parser'),
    stack: 'Python · Apache Airflow · PostgreSQL · MinIO/S3 · Shapely',
    en: 'Four connected DAGs read locality polygons, generate coordinate grids, call Yandex Geocoder under API quotas and export deduplicated district data. Intermediate results are stored outside task memory. A personal orchestration project, separate from commercial PostgreSQL work.',
    ru: 'Четыре связанных DAG читают полигоны населённых пунктов, создают сетку координат, вызывают Yandex Geocoder с учётом квот и выгружают данные районов без дубликатов. Промежуточные результаты хранятся вне памяти задач. Собственный проект оркестрации, отдельный от коммерческой работы с PostgreSQL.',
  },
  support: {
    title: 'Support Assistant',
    href: repository('support-assistant-llm', true),
    stack: 'FastAPI · OpenRouter · JSON Schema · Pydantic · Redis · Vue 3',
    en: 'An IT-ticket demonstration under development. An LLM proposes a department; the user confirms or changes it before description generation. Schema validation, retries, timeouts and shared quotas control the external integration. Ports isolate the model provider from application logic.',
    ru: 'Демоприложение IT-заявок в разработке. LLM предлагает отдел; пользователь подтверждает или меняет выбор перед генерацией описания. Валидация схемы, повторы, таймауты и общие квоты контролируют внешнюю интеграцию. Порты отделяют провайдера модели от логики приложения.',
  },
  task: {
    title: 'Task Service API',
    href: repository('task-service-api'),
    stack: 'FastAPI · PostgreSQL · SQLAlchemy 2 · Alembic · pytest',
    en: 'An asynchronous API for tasks, users and services. Relational models, migrations and database triggers support persistence rules; service boundaries separate HTTP handling from database access. Integration tests exercise the API.',
    ru: 'Асинхронный API задач, пользователей и сервисов. Реляционные модели, миграции и триггеры поддерживают правила хранения; сервисные границы отделяют HTTP от доступа к БД. Интеграционные тесты проверяют API.',
  },
  maxim: {
    title: 'MaximML',
    href: repository('maxim-ml'),
    stack: 'scikit-learn · pandas · FastAPI · SQLAlchemy · React',
    en: 'A California Housing regression application. Saved scikit-learn Pipelines preserve fitted preprocessing for inference; train/test separation precedes fitted transforms. FastAPI exposes training and prediction with persisted training history and a React interface.',
    ru: 'Регрессионное приложение на California Housing. Сохранённые scikit-learn Pipeline сохраняют обученную предобработку для прогнозирования; разделение train/test предшествует обучению преобразований. FastAPI предоставляет обучение и прогноз с сохранением истории и React-интерфейсом.',
  },
  worker: {
    title: 'Codex Free Worker MCP',
    href: repository('codex-free-worker-mcp', true),
    stack: 'Python · MCP stdio · OpenCode · Codex CLI · Structured results',
    en: 'A local bridge for bounded development tasks. OpenCode or a child Codex CLI inspects command output and returns compact structured results. Result contracts and permission handoff support diagnostics and mechanical fixes without moving architecture decisions to the worker.',
    ru: 'Локальный мост для ограниченных задач разработки. OpenCode или дочерний Codex CLI анализирует вывод команд и возвращает краткий структурированный результат. Контракты и передача запросов разрешений поддерживают диагностику и механические исправления; архитектурные решения остаются у основного агента.',
  },
  standards: {
    title: 'Codex Development Standards',
    href: repository('codex-development-standards', true),
    stack: 'Agent Skills · Git · CI · Validation workflows',
    en: 'Reusable instructions and stack profiles for AI-assisted development: scoped context, consistent project workflows, targeted validation and reviewable changes. Complements the executable MCP integration rather than representing a separate production AI service.',
    ru: 'Переиспользуемые инструкции и профили стеков для разработки с AI: ограниченный контекст, единые процессы проектов, адресные проверки и обозримые изменения. Дополняет исполняемую MCP-интеграцию как инструмент организации разработки.',
  },
}

export const roles = {
  backend: {
    en: {
      title: 'Python Backend Developer',
      profile:
        'Python developer with commercial experience since 2022 in PostgreSQL/PostGIS data processing, automation and external API integrations. I build FastAPI and SQLAlchemy applications in personal and client projects, focusing on explicit business rules, typed contracts and reliable data workflows.',
    },
    ru: {
      title: 'Python Backend-разработчик',
      profile:
        'Python-разработчик с коммерческим опытом с 2022 года: PostgreSQL/PostGIS, обработка данных, автоматизация и внешние API. В личных и заказных проектах создаю приложения на FastAPI и SQLAlchemy с явными бизнес-правилами, типизированными контрактами и надёжными процессами работы с данными.',
    },
    skills: [
      ['Backend', 'Python · FastAPI · asyncio · aiohttp · Pydantic'],
      ['SQL / Data', 'PostgreSQL · PostGIS · SQLAlchemy · psycopg · Alembic'],
      ['Quality', 'pytest · Integration tests · Ruff · mypy · GitHub Actions'],
      ['Delivery', 'Docker · Compose · Linux · Git · External APIs'],
    ],
    experience: ['batch', 'database', 'geocoding', 'diagnostics'],
    projects: ['moon', 'geocoder', 'support'],
  },
  data: {
    en: {
      title: 'Python Data / ETL Developer',
      profile:
        'Python developer with commercial experience since 2022 in SQL, PostgreSQL/PostGIS and geospatial data automation. I build extraction, transformation, bulk-import and export workflows. A separate personal project demonstrates Airflow orchestration and MinIO/S3 intermediate storage.',
    },
    ru: {
      title: 'Разработчик Data / ETL (Python)',
      profile:
        'Python-разработчик с коммерческим опытом с 2022 года в SQL, PostgreSQL/PostGIS и автоматизации геоданных. Создаю процессы выборки, преобразования, массового импорта и выгрузки данных. Отдельный личный проект показывает оркестрацию Airflow и промежуточное хранение в MinIO/S3.',
    },
    skills: [
      ['SQL / Storage', 'PostgreSQL · PostGIS · SQL · psycopg · SQLAlchemy'],
      [
        'Processing',
        'Python · Batch processing · CSV / Excel / JSON · API integration',
      ],
      ['Portfolio ETL', 'Apache Airflow · MinIO/S3 · Shapely · PyProj'],
      ['Quality / Tools', 'pytest · Docker · Linux · GitHub Actions · pandas'],
    ],
    experience: ['database', 'batch', 'geocoding', 'diagnostics'],
    projects: ['geocoder', 'task', 'maxim'],
  },
  ai: {
    en: {
      title: 'AI / LLM Integration Developer',
      profile:
        'Python developer with commercial data-automation and API-integration experience since 2022. Implemented a two-pass LLM workflow for geospatial-name translation and review. Personal projects demonstrate validated structured outputs, user confirmation and MCP tooling for bounded agent execution.',
    },
    ru: {
      title: 'Разработчик AI / LLM-интеграций',
      profile:
        'Python-разработчик с коммерческим опытом автоматизации данных и API-интеграций с 2022 года. Реализовал двухэтапный LLM-процесс перевода и проверки географических названий. Личные проекты показывают валидацию структурированных ответов, подтверждение пользователем и MCP-инструменты ограниченного выполнения задач агентами.',
    },
    skills: [
      ['LLM integration', 'LLM APIs · OpenRouter · JSON Schema · Pydantic'],
      [
        'Agent tooling',
        'MCP stdio · Codex CLI · OpenCode · Structured results',
      ],
      ['Python / Data', 'FastAPI · asyncio · PostgreSQL · SQLAlchemy'],
      ['Reliability', 'Retries · Timeouts · pytest · Docker · GitHub Actions'],
    ],
    experience: ['llm', 'database', 'geocoding', 'diagnostics'],
    projects: ['support', 'worker', 'standards'],
  },
}
