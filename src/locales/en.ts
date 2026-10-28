export default {
  heroPortraitAlt: 'Portrait of Danil Miftakhov',
  title: 'Danil Miftakhov | Python Backend Developer',
  description:
    'Python backend developer working with PostgreSQL/PostGIS, data processing and API integrations. Commercial experience, engineering projects and role-specific resumes.',
  language: 'Choose language',
  languageLabel: 'Language',
  portfolio: 'Portfolio',
  location: 'Yerevan, Armenia',
  skip: 'Skip to content',
  navigation: 'Portfolio sections',
  menu: 'Menu',
  closeMenu: 'Close menu',
  explore: 'Explore portfolio',
  navHero: 'Hero',
  navAbout: 'About',
  navSkills: 'Skills',
  navProjects: 'Projects',
  navTools: 'Developer Tools',
  navResume: 'Resume',
  navContacts: 'Contacts',
  heroEyebrow: '01 / Python engineering',
  name: 'Danil Miftakhov',
  role: 'Python Backend Developer · Data & Automation',
  intro:
    'I develop Python tools for PostgreSQL/PostGIS data processing and external API integrations. In personal and client projects, I build backend services with FastAPI and SQLAlchemy, supported by automated tests and reproducible environments.',
  aboutEyebrow: '02 / About',
  aboutTitle: 'About Me',
  aboutIntro:
    'Commercial Python and SQL work, client integrations and independent backend projects.',
  aboutIntroduction:
    'My core experience is making data workflows practical: extracting and transforming records, integrating external services and checking results. Backend development builds on that experience with explicit business rules and typed APIs.',
  experienceTitle: 'Commercial Experience',
  experience:
    'I work as a Software Engineer at Maxim, where I develop Python tools for address and geospatial data processing with PostgreSQL/PostGIS, SQL and external geocoding APIs.',
  experienceDetail:
    'I investigate data-quality and SQL performance issues using queries, logs and execution plans, and prepare imports, exports and technical findings for colleagues.',
  freelanceTitle: 'Freelance & Client Work',
  freelance:
    'I deliver Python integrations and automation for clients, including supplier-to-Ozon inventory synchronization, data transformation and external API workflows.',
  freelanceDetail:
    'Other work includes browser automation, CSV/Excel/JSON processing and Telegram interfaces for server utilities. I choose between direct HTTP/API access and browser automation according to the task.',
  personalTitle: 'Personal Engineering Projects',
  personal:
    'My portfolio projects explore FastAPI business rules, geospatial ETL with Apache Airflow and LLM integrations: from a logistics simulation to a support-ticket assistant.',
  personalDetail:
    'I use AI-assisted development to build Ansible/Python host provisioning, a container deployment manager and MCP execution tools, with automated checks and separate host/application responsibilities.',
  focusTitle: 'Current focus',
  focus:
    'Python Backend: service logic, PostgreSQL, reliable data processing and external integrations. Data / ETL and applied LLM integrations are complementary directions.',
  skillsEyebrow: '03 / Skills',
  skillsTitle: 'Skills & Technologies',
  skillsIntro:
    'Core Python and database experience, supported by technologies used in personal and client projects.',
  backendTitle: 'Backend & APIs',
  backendDetail:
    'REST API development, data validation, asynchronous operations and application service logic using FastAPI, Flask and Python.',
  databaseTitle: 'Databases & Geospatial',
  databaseDetail:
    'PostgreSQL/PostGIS workflows involving geospatial processing, SQL exports, bulk imports, SQLAlchemy and query execution plan analysis.',
  dataTitle: 'Data pipelines and ML projects',
  dataDetail:
    'In portfolio projects: Airflow orchestration, MinIO/S3 intermediate storage, geospatial transformations and scikit-learn training/inference pipelines.',
  automationTitle: 'Automation & Integrations',
  automationDetail:
    'External API integrations, marketplace automation, web scraping, browser workflows and data transformation between services.',
  infraTitle: 'Infrastructure & Delivery',
  infraDetail:
    'Personal infrastructure projects: staged Ubuntu provisioning with Ansible, Docker/Compose delivery, CI checks and explicit readiness and recovery procedures.',
  testingTitle: 'Testing & Quality',
  testingDetail:
    'Unit, integration and E2E testing, formatting checks, static type analysis and automated code quality workflows.',
  aiTitle: 'AI & Developer Workflows',
  aiDetail:
    'LLM API integrations, structured model outputs, custom MCP tools and development workflow automation with Codex and OpenCode.',
  architectureTitle: 'Architecture & Interfaces',
  architectureDetail:
    'Layered application responsibilities, Ports & Adapters, Dependency Injection, transaction boundaries and Vue/React interfaces in personal projects.',
  projectsEyebrow: '04 / Projects',
  projectsTitle: 'Featured Projects',
  projectsIntro:
    'Three projects showing data pipelines, backend business rules and validated LLM integration.',
  moreTitle: 'More Projects',
  moreIntro:
    'A PostgreSQL API and an ML application with reusable data pipelines.',
  moonTitle: 'Moon Courier Crisis',
  moonImageAlt:
    'Moon Courier Crisis mission map with the lunar base, delivery routes and rover battery and cargo status.',
  moonSummary:
    'A turn-based lunar logistics simulation: assign deliveries while respecting route, cargo and battery constraints.',
  moonDetail:
    'The FastAPI backend checks delivery feasibility and owns game state; the Vue interface renders API results. SQLAlchemy repositories and Unit of Work separate persistence from domain services.',
  moonCategory: '02 / Python Backend',
  moonCaption: 'Lunar logistics',
  supportTitle: 'Support Assistant',
  supportImageAlt:
    'Support Assistant ticket input form and department directory for routing IT requests.',
  supportSummary:
    'An LLM-assisted IT-ticket application: propose a responsible department, let the user confirm or change it, then generate a structured description.',
  supportDetail:
    'JSON Schema and Pydantic validate model responses. Retries, timeouts and shared Redis quotas bound external requests; the user retains control of the final department assignment.',
  supportCategory: '03 / Applied LLM',
  supportCaption: 'Ticket workflows',
  geocoderTitle: 'Geospatial ETL Pipeline',
  geocoderImageAlt:
    'Apache Airflow dashboard listing the four geocoding DAGs and their recent task runs.',
  geocoderSummary:
    'Enrich locality data with administrative districts by sampling coordinates inside polygons and aggregating Yandex Geocoder responses.',
  geocoderDetail:
    'Four connected Airflow DAGs read PostgreSQL polygons, generate points, run quota-aware API requests and export deduplicated results to MinIO/S3. Intermediate storage keeps data between processing stages.',
  geocoderCategory: '01 / Data engineering',
  geocoderCaption: 'Geospatial pipeline',
  taskTitle: 'Task Service API',
  taskSummary:
    'An asynchronous REST API for managing tasks, users, services and related records with PostgreSQL.',
  taskDetail:
    'Built with FastAPI, SQLAlchemy 2.x and Alembic, featuring layered application logic, database triggers, input validation and API integration tests.',
  maximTitle: 'MaximML',
  maximImageAlt:
    'MaximML prediction form with housing features, a price estimate and prediction feedback controls.',
  maximSummary:
    'A portfolio ML application for estimating California housing prices, training regression models and collecting prediction feedback.',
  maximDetail:
    'Saved scikit-learn Pipelines reuse fitted transformations during inference. FastAPI exposes training and prediction, while a React interface presents results and persisted training history.',
  avitoTitle: 'Avito Parser',
  avitoSummary:
    'A Python web scraping prototype for collecting Avito listings by product article numbers using Playwright and Camoufox.',
  avitoDetail:
    'Includes SQLite storage, URL-based deduplication, price ranking and CSV export of up to five lowest-priced listings per search query.',
  toolsEyebrow: '05 / Tools',
  toolsTitle: 'Developer Tools',
  toolsIntro:
    'Personal tools for reproducible infrastructure and AI-assisted engineering.',
  featuredTool: 'Related projects / Infrastructure & delivery',
  serverTitle: 'Portfolio Infrastructure & Deployment',
  serverSummary:
    'Two related projects: an Ansible/Python toolkit prepares an Ubuntu host; a separate Python deployment manager plans and coordinates container application changes.',
  serverDetail:
    'Host provisioning uses staged verification. Application delivery adds a desired-state registry, readiness checks, a state journal and rollback/recovery handling. Separate repositories keep host and application responsibilities explicit.',
  workerTitle: 'Codex Free Worker MCP',
  workerSummary:
    'A local MCP bridge for delegating bounded development tasks from Codex to OpenCode or a child Codex CLI.',
  workerDetail:
    'Execution backends inspect logs and return compact structured results. Result contracts and permission handoff support test diagnostics and mechanical fixes while architectural decisions remain with the primary agent.',
  standardsTitle: 'Codex Development Standards',
  standardsSummary:
    'A modular collection of reusable engineering standards and workflows for Codex-assisted software development.',
  standardsDetail:
    'Includes stack-specific skill profiles, incremental standards synchronization, Git and CI/CD conventions, testing guidelines and context-efficient agent workflows.',
  heroContact: 'Contact',
  github: 'GitHub',
  linkedin: 'LinkedIn',
  telegram: 'Telegram',
  instagram: 'Instagram',
  email: 'Email',
  whatsapp: 'WhatsApp',
  release: 'Release',
  resumeEyebrow: '06 / Resume',
  resumeTitle: 'Resume',
  resumeIntro:
    'Backend is my primary direction. Data / ETL and AI / LLM versions highlight related experience. Each PDF opens and downloads as the same document.',
  resumeBackend: 'Backend Developer',
  resumeAi: 'AI / LLM Integration',
  resumeData: 'Data / ETL Developer',
  resumeAiStack: 'LLM APIs · Structured outputs · Automation',
  viewPdf: 'View PDF',
  downloadPdf: 'Download PDF',
  pdfClose: 'Close',
  pdfControls: 'PDF controls',
  pdfLanguage: 'Document language',
  pdfPrevious: 'Previous page',
  pdfNext: 'Next page',
  pdfPage: 'Page {page} / {pages}',
  pdfZoomOut: 'Zoom out',
  pdfZoomIn: 'Zoom in',
  pdfFitWidth: 'Fit width',
  pdfDocument: 'PDF document',
  pdfLoading: 'Loading PDF…',
  pdfError: 'Unable to display PDF',
  pdfErrorHelp: 'Try again or open the original PDF in a new tab.',
  pdfRetry: 'Retry',
  pdfOpenOriginal: 'Open original PDF in new tab',
  pdfUnavailable: 'PDF files are currently unavailable.',
  contactsEyebrow: '07 / Contact',
  contactsTitle: 'Let’s Get in Touch',
  contactsIntro: 'Python backend, PostgreSQL and external integrations.',
  contactsCopy: 'Have a role or project in mind? Let’s discuss how I can help.',
  contactsDirect: 'Direct contact',
  contactsProfiles: 'Professional profiles',
  footer: 'Danil Miftakhov · Yerevan, Armenia',
  projectsIntroMobile:
    'Data pipelines, backend rules and applied LLM integration.',
  moreIntroMobile: 'ML workflows and a PostgreSQL API example.',
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
  siteSource: 'How this site is built',
  infrastructureSource: 'Host toolkit',
  infrastructureRelease: 'Host toolkit release',
  deploymentSource: 'Deployment manager',
  supportStatus: 'Public demonstration · Under development',
  serverStatus: 'Personal projects · First rollout confirmed by the operator',
  commercialCasesTitle: 'Selected commercial cases',
  batchCaseTitle: 'Maxim · Batch address processing',
  batchCaseDetail:
    'Built the complete Python tool for selecting and processing records, exporting SQL files and loading SQL data into a database. One batch-processing run handled up to 46 million address records in approximately 6–8 hours.',
  stockCaseTitle: 'Client work · Supplier-to-Ozon integration',
  stockCaseDetail:
    'Delivered Python automation for transforming supplier inventory data and synchronizing stock with Ozon. This is a client integration, distinct from the public demonstration applications below.',
  translationCaseTitle: 'Maxim · LLM-assisted geospatial-name localization',
  translationCaseDetail:
    'Implemented translation using rules agreed with translators, followed by a second LLM review and conditional revision. The second pass identifies translations for conditional revision before the workflow completes.',
}
