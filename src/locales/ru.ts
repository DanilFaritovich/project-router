import type en from './en'
export default {
  title: 'ProjectRouter — Инженерное портфолио',
  description:
    'ProjectRouter — инженерное портфолио Данила Мифтахова. Python backend, инженерия данных и интеграции.',
  language: 'Выбрать язык',
  languageLabel: 'Язык',
  portfolio: 'Портфолио',
  location: 'Ереван, Армения',
  skip: 'Перейти к содержимому',
  navigation: 'Разделы портфолио',
  menu: 'Меню',
  closeMenu: 'Закрыть меню',
  explore: 'Разделы портфолио',
  navHero: 'Главная',
  navAbout: 'Обо мне',
  navSkills: 'Навыки',
  navProjects: 'Проекты',
  navTools: 'Инструменты разработчика',
  navResume: 'Резюме',
  navContacts: 'Контакты',
  heroEyebrow: '01 / Python-разработка',
  name: 'Данил Мифтахов',
  role: 'Python Backend-разработчик / инженер по данным и автоматизации',
  intro:
    'Разрабатываю API, пайплайны обработки данных и интеграции, которые превращают сложные процессы в воспроизводимые инструменты.',
  aboutEyebrow: '02 / Обо мне',
  aboutTitle: 'Обо мне',
  aboutIntro:
    'Коммерческая работа и личные инженерные проекты с чётким разделением ответственности.',
  experienceTitle: 'Коммерческий инженерный опыт',
  experience:
    'Моя коммерческая работа в Maxim связана с Python, PostgreSQL, PostGIS и SQL: обработкой адресных и географических данных, интеграцией внешних API и автоматизацией внутренних процессов.',
  experienceDetail:
    'Типичные задачи — нормализация и обогащение геоданных, подготовка SQL-импортов с проверкой дубликатов и отсутствия изменений, аналитические выгрузки. Также работаю с геокодерами, переиспользуемыми утилитами для баз данных и скриптами, которые сокращают повторяющиеся операции.',
  personalTitle: 'Личные проекты',
  personal:
    'В личных репозиториях исследую архитектуру приложений, ETL и интеграцию LLM, использую автоматические проверки и воспроизводимые локальные окружения.',
  focusTitle: 'Сейчас в фокусе',
  focus:
    'Границы сервисов, надёжность пайплайнов данных и структурированные процессы с LLM.',
  skillsEyebrow: '03 / Навыки',
  skillsTitle: 'Навыки и технологии',
  skillsIntro: 'Подробный обзор стека по инженерным направлениям.',
  backendTitle: 'Backend и API',
  backendDetail:
    'REST API, валидация контрактов, асинхронный ввод-вывод и сервисы приложений.',
  databaseTitle: 'Базы данных и геоданные',
  databaseDetail:
    'Извлечение и пакетная обработка данных, нормализация адресов и преобразование координат.',
  dataTitle: 'Инженерия данных и ML',
  dataDetail:
    'Связанные этапы ETL, промежуточные артефакты, предобработка, обучение и инференс.',
  automationTitle: 'Автоматизация и интеграции',
  automationDetail:
    'Внешние API, браузерные процессы и воспроизводимая подготовка данных.',
  infraTitle: 'Инфраструктура и доставка',
  infraDetail:
    'Инфраструктура как код, изолированная проверка, локальные окружения и контроль качества в CI.',
  testingTitle: 'Тестирование и качество',
  testingDetail:
    'Модульные, интеграционные и браузерные проверки; типизированные границы и воспроизводимая верификация.',
  aiTitle: 'AI и инструменты разработки',
  aiDetail:
    'Доступ к моделям только через backend, валидация ответов и ограниченные задачи автоматизации.',
  architectureTitle: 'Архитектура и интерфейсы',
  architectureDetail:
    'Слои сервисов, границы хранения данных и типизированные интерфейсы проектов.',
  projectsEyebrow: '04 / Проекты',
  projectsTitle: 'Избранные проекты',
  projectsIntro:
    'Три приложения: инженерные решения, интерфейсы и потоки данных.',
  moreTitle: 'Другие проекты',
  moreIntro: 'Backend, машинное обучение и автоматизация.',
  moonTitle: 'Moon Courier Crisis',
  moonSummary:
    'Симулятор лунной логистики. Управление роверами, доставками, маршрутами и ограничениями заряда.',
  moonDetail:
    'Правила игры и переходы состояний на backend, типизированный интерфейс Vue и браузерные тесты.',
  moonCategory: '01 / Full-stack',
  moonCaption: 'Лунная логистика',
  supportTitle: 'Support Assistant',
  supportSummary:
    'Маршрутизация и подготовка IT-обращений с помощью AI. Перед итоговым ответом человек подтверждает отдел.',
  supportDetail:
    'Валидация ответов LLM по схеме, интеграция провайдера только на backend и общие квоты в Redis.',
  supportCategory: '02 / AI / Backend',
  supportCaption: 'Обработка обращений',
  geocoderTitle: 'Yandex Geocoder Region Parser',
  geocoderSummary:
    'Геопространственный пайплайн обогащает данные районов с помощью выборки точек в полигонах и запросов к геокодеру.',
  geocoderDetail:
    'Четыре связанных DAG в Airflow; промежуточные данные в MinIO/S3 и воспроизводимые этапы ETL.',
  geocoderCategory: '03 / Инженерия данных',
  geocoderCaption: 'Геопространственный пайплайн',
  taskTitle: 'Task Service API',
  taskSummary:
    'Асинхронный REST API для задач, сервисов и пользователей. Слои логики, PostgreSQL и миграции базы данных.',
  maximTitle: 'MaximML',
  maximSummary:
    'Прогнозирование стоимости жилья: обучение моделей, сохранённые пайплайны scikit-learn и интерфейс React.',
  avitoTitle: 'Avito Parser',
  avitoSummary:
    'Поиск товаров по артикулу, фильтрация предложений и экспорт выбранных результатов в CSV.',
  toolsEyebrow: '05 / Инструменты',
  toolsTitle: 'Инструменты разработчика',
  toolsIntro: 'Компактный каталог переиспользуемых инженерных инструментов.',
  featuredTool: 'Основной инструмент / Инфраструктура',
  serverTitle: 'Portfolio Server Infrastructure',
  serverSummary:
    'Набор Ansible для настройки Ubuntu VPS, защиты SSH/UFW, Docker и независимой проверки семи этапов инфраструктуры.',
  workerTitle: 'Codex Free Worker MCP',
  workerSummary:
    'Делегирование ограниченных циклов выполнения Codex в OpenCode с компактными структурированными результатами без сырых логов тестов и сборки.',
  standardsTitle: 'Codex Development Standards',
  standardsSummary:
    'Переиспользуемые навыки и правила для архитектуры, тестирования, проверок качества и CI/CD в программных проектах.',
  github: 'GitHub',
  linkedin: 'LinkedIn',
  telegram: 'Telegram',
  instagram: 'Instagram',
  release: 'Последний релиз',
  resumeEyebrow: '06 / Резюме',
  resumeTitle: 'Резюме',
  resumeIntro:
    'Выберите версию под роль. Просмотр и скачивание PDF используют один документ.',
  resumeBackend: 'Backend-разработчик',
  resumeAi: 'Интеграция AI / LLM',
  resumeData: 'Разработчик Data / ETL',
  resumeAiStack: 'LLM API · Структурированные ответы · Автоматизация',
  viewPdf: 'Открыть PDF',
  downloadPdf: 'Скачать PDF',
  pdfUnavailable: 'PDF-файлы пока недоступны.',
  contactsEyebrow: '07 / Контакты',
  contactsTitle: 'Давайте свяжемся',
  contactsIntro: 'Python backend, инженерия данных и интеграции.',
  contactsCopy:
    'Хотите обсудить инженерную роль или проект? Напишите мне в Telegram или LinkedIn или посмотрите мои работы на GitHub.',
  footer: 'Данил Мифтахов · Ереван, Армения',
  moonSummaryMobile:
    'Симулятор лунной логистики: роверы, маршруты, доставки и ограничения заряда.',
  moonDetailMobile:
    'Логика игры — на сервере; интерфейс Vue и браузерные E2E-тесты.',
  supportSummaryMobile:
    'Маршрутизация IT-обращений с помощью AI и подтверждением описаний человеком.',
  supportDetailMobile:
    'Валидация ответов LLM по схеме; лимиты Redis и интерфейс Vue.',
  geocoderSummaryMobile:
    'Выборка точек в полигонах и геокодирование для обогащения данных районов.',
  geocoderDetailMobile:
    'Четыре связанных DAG в Airflow с промежуточными артефактами в MinIO/S3.',
  taskSummaryMobile:
    'Асинхронный REST API для задач, сервисов и пользователей с PostgreSQL и миграциями.',
  maximSummaryMobile:
    'Full-stack приложение для прогнозирования стоимости жилья и обучения моделей.',
  avitoSummaryMobile:
    'Поиск и фильтрация товаров; экспорт выбранных предложений в CSV.',
  serverSummaryMobile:
    'Настройка Ubuntu VPS, защита и проверка семи этапов инфраструктуры.',
  projectsIntroMobile: 'Три избранных инженерных приложения.',
  moreIntroMobile: 'Backend, ML и прикладная автоматизация.',
  english: 'English',
  russian: 'Русский',
  resumeBackendStack: 'Python · FastAPI · PostgreSQL',
  resumeDataStack: 'SQL · PostgreSQL · Apache Airflow',
  moonStack: 'FastAPI · Vue 3 · TypeScript · SQLAlchemy · Docker',
  supportStack: 'FastAPI · Vue 3 · OpenRouter · Redis · SQLite',
  geocoderStack: 'Python · Airflow · PostgreSQL · MinIO/S3 · Shapely',
  taskStack: 'FastAPI · PostgreSQL · SQLAlchemy · Alembic',
  maximStack: 'FastAPI · scikit-learn · React · Docker',
  avitoStack: 'Python · Playwright · SQLite · CSV',
  serverStack: 'Python · Ansible · Ubuntu · Docker · GitHub Actions',
  workerStack: 'Python · MCP · OpenCode · Codex',
  standardsStack: 'Agent Skills · YAML · GitHub Actions',
  backendSkillStack:
    'Python · FastAPI · Flask · asyncio\nPydantic · SQLAlchemy · Alembic',
  databaseSkillStack:
    'SQL · PostgreSQL · PostGIS · psycopg\nSQLite · Shapely · PyProj',
  dataSkillStack: 'Apache Airflow · MinIO/S3\npandas · NumPy · scikit-learn',
  automationSkillStack:
    'requests · aiohttp · Playwright\nCamoufox · Bash · CSV/JSON',
  infraSkillStack:
    'Ansible · Ubuntu/Linux · SSH/UFW\nDocker · Compose · Nginx · GitHub Actions',
  testingSkillStack: 'pytest · unittest · Ruff · Mypy\nVitest · Playwright E2E',
  aiSkillStack: 'LLM APIs · OpenRouter · MCP\nCodex · OpenCode · JSON Schema',
  architectureSkillStack:
    'Ports & Adapters · Dependency Injection\nGit / PR workflows · Vue 3 · TypeScript · React',
} satisfies Record<keyof typeof en, string>
