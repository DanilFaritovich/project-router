// Owner-reviewed facts and role-specific copy. These are candidate documents;
// generating them never replaces public/resumes or changes the website catalog.
export const identity = {
  website: 'https://danil-miftakhov.dev',
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
    en: 'Four Airflow DAGs linked by Asset events read locality polygons, generate coordinate grids, call Yandex Geocoder under API quotas and export deduplicated district data. MinIO/S3 stores intermediate results between stages; dynamic task mapping parallelizes geocoding requests.',
    ru: 'Четыре DAG Airflow, связанные событиями Assets, читают полигоны населённых пунктов, создают сетку координат, вызывают Yandex Geocoder с учётом квот и выгружают данные районов без дубликатов. MinIO/S3 хранит промежуточные результаты; dynamic task mapping распараллеливает геокодирование.',
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
    en: 'Reusable instructions and stack profiles for AI-assisted development: scoped context, consistent Git workflows, targeted validation and reviewable changes. Applied across portfolio repositories to keep project conventions and checks consistent.',
    ru: 'Переиспользуемые инструкции и профили стеков для разработки с AI: ограниченный контекст, единые Git-процессы, адресные проверки и обозримые изменения. Используются в репозиториях портфолио для согласованных правил разработки и проверок.',
  },
  deployment: {
    title: 'Portfolio Deployment',
    href: repository('portfolio-deployment', true),
    stack: 'Python · GitHub Actions · Docker Compose · Caddy · SQLite',
    details: {
      backend: {
        en: 'A container deployment platform with a Python planner and executor. GitHub Actions integrates signed-release and image-digest verification; Docker Compose and Caddy provide application runtime and routing. Readiness checks, a SQLite journal and scoped rollback/recovery support controlled changes.',
        ru: 'Платформа доставки контейнерных приложений с планировщиком и исполнителем на Python. GitHub Actions интегрирует проверку подписанных релизов и digest образов; Docker Compose и Caddy отвечают за запуск и маршрутизацию. Проверки готовности, SQLite-журнал и ограниченные сценарии отката и восстановления контролируют изменения.',
      },
      data: {
        en: 'A Python platform for reproducible container application delivery. Validated manifests and immutable image digests define the target state; GitHub Actions verifies release evidence. A SQLite journal, readiness checks and scoped rollback/recovery preserve explicit deployment state across failures.',
        ru: 'Python-платформа воспроизводимой доставки контейнерных приложений. Проверяемые манифесты и неизменяемые digest образов задают целевое состояние; GitHub Actions проверяет свидетельства релиза. SQLite-журнал, проверки готовности и ограниченные сценарии отката и восстановления сохраняют явное состояние изменений при сбоях.',
      },
      ai: {
        en: 'A Python deployment platform with application manifests, signed-release verification and a GitHub Actions delivery workflow. Docker Compose and Caddy handle runtime and routing; readiness checks, journaling and scoped recovery make application changes explicit and verifiable.',
        ru: 'Python-платформа развёртывания с манифестами приложений, проверкой подписанных релизов и процессом доставки в GitHub Actions. Docker Compose и Caddy отвечают за запуск и маршрутизацию; проверки готовности, журналирование и ограниченное восстановление делают изменения приложений явными и проверяемыми.',
      },
    },
  },
}

export const roles = {
  backend: {
    en: {
      title: 'Python Backend Developer',
      profile:
        'Python Backend developer focused on FastAPI, SQLAlchemy and PostgreSQL. Commercial experience since 2022 covers geospatial data processing, Python automation and external API integrations. In personal and client backend projects, I use explicit business rules, typed contracts and automated tests.',
    },
    ru: {
      title: 'Python Backend-разработчик',
      profile:
        'Python Backend-разработчик с фокусом на FastAPI, SQLAlchemy и PostgreSQL. Коммерческий опыт с 2022 года включает обработку геоданных, Python-автоматизацию и внешние API. В личных и заказных backend-проектах использую явные бизнес-правила, типизированные контракты и автоматические тесты.',
    },
    skills: [
      ['Backend', 'Python · FastAPI · SQLAlchemy · asyncio · Pydantic'],
      ['SQL / Data', 'PostgreSQL · PostGIS · SQL · psycopg · Alembic'],
      ['Quality', 'pytest · Integration tests · Ruff · mypy · GitHub Actions'],
      ['Delivery', 'Docker · Compose · Linux · Git · External APIs'],
    ],
    experience: ['batch', 'database', 'geocoding', 'diagnostics'],
    projects: ['moon', 'support', 'geocoder', 'deployment'],
  },
  data: {
    en: {
      title: 'Python Data / ETL Developer',
      profile:
        'Data / ETL developer working with PostgreSQL/PostGIS, SQL and Python. Commercial experience since 2022 includes extraction, transformation, bulk imports and exports of geospatial data. Personal projects demonstrate Airflow orchestration and MinIO/S3 intermediate storage.',
    },
    ru: {
      title: 'Разработчик Data / ETL (Python)',
      profile:
        'Разработчик Data / ETL: PostgreSQL/PostGIS, SQL и Python. Коммерческий опыт с 2022 года включает выборку, преобразование, массовый импорт и выгрузку геоданных. Личные проекты показывают оркестрацию Airflow и промежуточное хранение в MinIO/S3.',
    },
    skills: [
      ['SQL / Storage', 'PostgreSQL · PostGIS · SQL · psycopg · SQLAlchemy'],
      ['Portfolio ETL', 'Apache Airflow · MinIO/S3 · Shapely · PyProj'],
      [
        'Processing',
        'Python · Batch processing · CSV / Excel / JSON · API integration',
      ],
      ['Quality / Tools', 'pytest · Docker · Linux · GitHub Actions · pandas'],
    ],
    experience: ['database', 'batch', 'geocoding', 'diagnostics'],
    projects: ['geocoder', 'maxim', 'task', 'deployment'],
  },
  ai: {
    en: {
      title: 'AI / LLM Integration Developer',
      profile:
        'Python developer focused on LLM API integrations, validated structured outputs and MCP tooling. Commercial Python, data-automation and API experience since 2022; implemented a two-pass geospatial-name translation workflow. Personal projects demonstrate user-confirmed ticket routing and bounded agent execution.',
    },
    ru: {
      title: 'Разработчик AI / LLM-интеграций',
      profile:
        'Python-разработчик с фокусом на LLM API, валидацию структурированных ответов и MCP-инструменты. Коммерческий опыт Python, автоматизации данных и API с 2022 года; реализовал двухэтапный процесс перевода географических названий. Личные проекты показывают маршрутизацию IT-заявок с подтверждением пользователем и ограниченное выполнение задач агентами.',
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
    projects: ['support', 'worker', 'deployment', 'standards'],
  },
}
