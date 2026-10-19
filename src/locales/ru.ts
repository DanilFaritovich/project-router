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
  moonImageAlt:
    'Карта миссии Moon Courier Crisis с лунной базой, маршрутами доставки, зарядом и грузом роверов.',
  moonSummary:
    'Пошаговый симулятор лунной логистики: управление роверами и контрактами с учётом маршрутов, грузоподъёмности и заряда батареи.',
  moonDetail:
    'Backend на FastAPI управляет игровой логикой и состояниями, использует SQLAlchemy, Unit of Work и NetworkX для расчёта маршрутов.',
  moonCategory: '01 / Full-stack',
  moonCaption: 'Лунная логистика',
  supportTitle: 'Support Assistant',
  supportImageAlt:
    'Форма IT-заявки Support Assistant и справочник отделов для выбора ответственного подразделения.',
  supportSummary:
    'AI-ассистент для обработки IT-заявок: определение ответственного отдела, подтверждение человеком и генерация структурированного описания.',
  supportDetail:
    'Архитектура Ports & Adapters, валидация ответов LLM по схеме и общие Redis-квоты для контроля запросов к API.',
  supportCategory: '02 / AI / Backend',
  supportCaption: 'Обработка обращений',
  geocoderTitle: 'Yandex Geocoder Region Parser',
  geocoderImageAlt:
    'Панель Apache Airflow с четырьмя DAG геокодирования и результатами последних запусков задач.',
  geocoderSummary:
    'Геопространственный ETL-пайплайн для получения районов населённых пунктов через генерацию сетки координат внутри полигонов и обработку ответов Yandex Geocoder API.',
  geocoderDetail:
    'Четыре связанных через события DAG в Apache Airflow, PostgreSQL, MinIO/S3, параллельная обработка и управление лимитами API-ключей.',
  geocoderCategory: '03 / Инженерия данных',
  geocoderCaption: 'Геопространственный пайплайн',
  taskTitle: 'Task Service API',
  taskSummary:
    'Асинхронный REST API для управления задачами, пользователями, сервисами и связанными данными в PostgreSQL.',
  taskDetail:
    'Реализован на FastAPI, SQLAlchemy 2.x и Alembic с разделением слоёв приложения, триггерами базы данных, валидацией данных и интеграционными тестами API.',
  maximTitle: 'MaximML',
  maximImageAlt:
    'Форма MaximML с характеристиками жилья, прогнозом стоимости и кнопками обратной связи.',
  maximSummary:
    'Full-stack ML-приложение для прогнозирования стоимости жилья в Калифорнии с помощью линейной регрессии и градиентного бустинга.',
  maximDetail:
    'Реализованы переиспользуемые scikit-learn пайплайны, обучение моделей через API, сбор обратной связи и интерфейс на React с backend на FastAPI.',
  avitoTitle: 'Avito Parser',
  avitoSummary:
    'Прототип Python-парсера для сбора объявлений Avito по артикулам товаров с использованием Playwright и Camoufox.',
  avitoDetail:
    'Реализованы хранение данных в SQLite, исключение дубликатов по URL, сортировка по цене и экспорт до пяти самых дешёвых объявлений по каждому запросу в CSV.',
  toolsEyebrow: '05 / Инструменты',
  toolsTitle: 'Инструменты разработчика',
  toolsIntro: 'Компактный каталог переиспользуемых инженерных инструментов.',
  featuredTool: 'Основной инструмент / Инфраструктура',
  serverTitle: 'Portfolio Server Infrastructure',
  serverSummary:
    'Инструмент Infrastructure as Code для безопасной и воспроизводимой настройки Ubuntu VPS с помощью Ansible и Python CLI.',
  serverDetail:
    'Автоматизирует семь этапов инициализации с независимыми проверками, защищённой настройкой SSH и firewall, установкой Docker и E2E-тестированием в изолированной VM. Проверен на реальном VPS.',
  workerTitle: 'Codex Free Worker MCP',
  workerSummary:
    'Локальный MCP-сервер для делегирования ограниченных задач разработки из Codex вспомогательным агентам OpenCode или изолированному Codex CLI.',
  workerDetail:
    'Поддерживает диагностику тестов и CI, механические исправления, структурированные результаты и контролируемую передачу запросов на разрешения без передачи объёмных логов основному агенту.',
  standardsTitle: 'Codex Development Standards',
  standardsSummary:
    'Модульный набор инженерных стандартов и рабочих процессов для разработки программного обеспечения с помощью Codex.',
  standardsDetail:
    'Включает профили навыков для разных стеков, инкрементальную синхронизацию стандартов, правила Git и CI/CD, тестирования и эффективной работы с контекстом AI-агентов.',
  github: 'GitHub',
  linkedin: 'LinkedIn',
  telegram: 'Telegram',
  instagram: 'Instagram',
  release: 'Релиз',
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
  projectsIntroMobile: 'Три избранных инженерных приложения.',
  moreIntroMobile: 'Backend, ML и прикладная автоматизация.',
  english: 'English',
  russian: 'Русский',
  resumeBackendStack: 'Python · FastAPI · PostgreSQL',
  resumeDataStack: 'SQL · PostgreSQL · Apache Airflow',
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
