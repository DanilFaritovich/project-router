# ProjectRouter

[English](README.md) · [Русский](README.ru.md)

ProjectRouter — EN/RU инженерное портфолио Данила Мифтахова с проектами,
инструментами разработчика, шестью PDF резюме и контактами. Контент хранится в Git.

## Текущее состояние — Stage 07 готов к review

Этапы 01–06 завершены и слиты в `develop`. Stage 07 — Testing & Visual QA
подготовлен в `test/portfolio-quality` к ручной приёмке; в
[QA-отчёте](docs/qa/STAGE07-REPORT.md) собраны дефекты, браузерные проверки и
чеклист владельца. Адаптивное портфолио использует Vue 3,
TypeScript, Vite, Tailwind CSS, Vue Router и Vue I18n. Vite SSG генерирует
локализованные HTML по `/en/` и `/ru/`; `/` ведёт на `/en/`.

- Семь секций: Hero, About, Skills, Projects, Developer Tools, Resume и Contacts.
- Hero использует фотографию владельца в локальных оптимизированных WebP-файлах,
  локализованный alt и адаптивные `srcset`/sizes. About разделяет коммерческий опыт,
  фриланс и личные инженерные проекты; Skills содержит восемь групп.
- Каталог содержит три Featured Projects, три More Projects и три Developer Tools
  с проверенными GitHub-адресами и четырьмя явными ссылками Release на версии.
  Четыре реальных скриншота проектов локально оптимизированы в WebP.
- Десктопная навигация по секциям и мобильное меню поддерживают переключение EN/RU
  с сохранением видимой секции, query/hash и истории Back/Forward; контакты
  ведут на социальные профили владельца.
- Локализованные title/description, язык HTML, OG/Twitter, self-canonical,
  взаимные hreflang и x-default, robots/sitemap и безопасный Person/WebSite JSON-LD.
  Добавлены два локальных social preview PNG 1200×630. Абсолютные метаданные
  сайта требуют явно заданного HTTPS origin.
- Детерминированная проверка AI/agent readability извлекает профессиональные факты
  из готового EN/RU HTML, включая девять ссылок на исходники и честный статус PDF.
  Она не моделирует поисковую систему и не гарантирует AI-рекомендаций.
- ESLint, Prettier, TypeScript, Vitest, Playwright, SSG/build-проверки и GitHub
  Actions обеспечивают автоматические проверки качества. Исходные дизайн-референсы сохранены.

Три специализации резюме — Backend, AI / LLM и Data / ETL — представлены
оригинальными английскими и русскими PDF владельца в `public/resumes/`
(шесть двухстраничных файлов). «Открыть PDF» показывает доступное с клавиатуры
модальное окно с навигацией по страницам, масштабированием, адаптивным Fit width,
состояниями загрузки/ошибки/повтора, скачиванием и ссылкой на исходный файл.
Язык документа изначально совпадает с языком сайта, затем переключается независимо;
просмотр и скачивание всегда используют выбранный документ. PDF.js и локальный
worker загружаются только при открытии просмотра.

URL-аннотации PDF обеспечивают кликабельные ссылки на личный сайт, Email (`mailto:`),
WhatsApp, Telegram, LinkedIn, GitHub и проекты. HTTP(S)-ссылки открываются в новой
вкладке с `noopener noreferrer`; остальные URL-схемы и PDF-действия исключены.
Ссылки совпадают с отображаемой страницей при любом масштабе и доступны с клавиатуры.
Выделение текста, поиск и полноценный Text Layer не входят в возможности просмотрщика.
Исходные PDF и существующий дизайн портфолио сохранены.

Публичный Live Demo не подтверждён, ссылок на него нет. Production-деплой
не выполнен, production origin не настроен. Локальные SEO/readability-проверки
покрывают сборки с тестовым origin и без origin. Backend и база данных не используются.

## План разработки

Этапы 01–06 слиты. Stage 07 ожидает ручной проверки/merge;
этапы 08–09 запланированы. Сопровождение документации не входит в этот roadmap.

| Этап | Ветка                           | Название                   | Статус           |
| ---- | ------------------------------- | -------------------------- | ---------------- |
| 01   | `chore/project-bootstrap`       | Bootstrap                  | Завершён / слит  |
| 02   | `feature/vue-foundation`        | Vue Foundation             | Завершён / слит  |
| 03   | `feature/portfolio-layout`      | Layout & Sections          | Завершён / слит  |
| 04   | `feature/projects-catalog`      | Projects Catalog           | Завершён / слит  |
| 05   | `feature/i18n-seo`              | Localization & SEO         | Завершён / слит  |
| 06   | `feature/resume-interactions`   | Resume & Interactions      | Завершён / слит  |
| 07   | `test/portfolio-quality`        | Testing & Visual QA        | Ожидает проверки |
| 08   | `feature/production-foundation` | Docker & CI/CD             | Запланирован     |
| 09   | `feature/caddy-production`      | Caddy & Production Release | Запланирован     |

После этих девяти этапов реализации отдельно выполняются release PR из `develop`
в `main` и тег/релиз `v1.0.0` по явному разрешению. Этот переход к релизу не является
десятым этапом реализации. Production-деплой также требует отдельного разрешения.

## Разработка и документация

Рабочие ветки создаются строго от `develop`; локальный commit, push и PR в
`develop` разрешены владельцем. Merge выполняется вручную; force push запрещён.
Требуется Node 22.22.2 или более новый patch Node 22 (см. `.nvmrc`) и npm.

```sh
npm ci
npm run dev             # локальный Vite, /en/ и /ru/
npm run build           # статический сайт в dist/
npm run preview         # локальная проверка production-сборки
make fix                # безопасное форматирование и lint autofix
npm test -- tests/unit/pdf-links.unit.spec.ts tests/integration/resume.integration.spec.ts
make check              # lint, формат, типы, unit/integration
npx playwright install chromium
make verify             # SSG build, HTML и браузерный smoke
make ci                 # check + verify, без повторов и исправления исходников

# Дополнительные режимы SEO-проверок; portfolio.test — только локальный тест.
VITE_SITE_ORIGIN=https://portfolio.test make verify
VITE_SITE_ORIGIN= npm run build
VITE_SITE_ORIGIN= npm run test:build
VITE_SITE_ORIGIN= npx playwright test tests/e2e/foundation.e2e.spec.ts tests/e2e/localization.e2e.spec.ts
# Адресный readability-аудит текущего dist/ (также входит в test:build):
node --test tests/build/readability.test.mjs
```

В Linux для Chromium могут потребоваться системные библиотеки:
`npx playwright install --with-deps chromium` (CI устанавливает их автоматически).
Порядок разработки: `make fix` → целевые тесты → `make check`; `make verify`
выполняется при изменениях сборки и пользовательских сценариев.

Production-домен ещё не выбран. При необходимости скопируйте `.env.example`
в `.env.local` и задайте `VITE_SITE_ORIGIN` как реальный HTTPS origin без пути,
затем пересоберите сайт. Без origin canonical, hreflang, `og:url` и sitemap
не генерируются, как и метаданные изображений OG/Twitter и JSON-LD;
локализованные HTML, текстовые OG/Twitter и разрешающий robots продолжают работать.
Хостинг должен раздавать `/en/index.html` и `/ru/index.html` напрямую и возвращать
404 для неизвестных адресов. Корень пока использует HTML meta-refresh;
настоящий HTTP redirect и live SEO проверяются на этапе доставки.
В GitHub рекомендуется сделать `Quality and static build` обязательной проверкой
веток; настройки защиты веток вручную задаёт администратор.

Реализованы локально: статический HTML, SEO metadata, crawl artifacts, social
images, JSON-LD и автоматические проверки. [Проверки SEO и readability](ARCHITECTURE.md#seo-and-agent-readability-checks)
описывают границы валидации и доступные агентам факты.
`llms.txt` намеренно не добавлен: конкретный потребитель и дополнительные сведения
сверх HTML не найдены. Существующие `User-agent: *` / `Allow: /` разрешают обход
без новых правил для отдельных ботов и изменения политики обучения моделей.

После deployment необходимы проверки публичного HTTPS и настоящего `VITE_SITE_ORIGIN`,
HTTP redirects/status codes, прямой раздачи локализованных документов, публичных
social previews, доступа краулеров, реальной индексации и подтверждение прав/
отправка sitemap в Search Console/webmaster tools. Локальные проверки не подтверждают
ни один из этих production-результатов.

- [AGENTS.md](AGENTS.md): процесс Codex и проектные инструкции.
- [ARCHITECTURE.md](ARCHITECTURE.md): реализованное портфолио, границы системы, маршруты и качество.
- [design/DESIGN.md](design/DESIGN.md) и [пояснения к референсам](design/reference/README.md): дизайн-спецификация.
- [.agents/skills/](.agents/skills/) и [lock стандартов](.codex-standards.lock.yaml): девять полных пакетов из
  [Codex Development Standards](https://github.com/DanilFaritovich/codex-development-standards),
  ветка `develop`, профиль `vue-static-site` v2, инструкция `bootstrap/vue-static-site.md`.
  Docker, CD и backend-скиллы не установлены.

## Структура репозитория

| Путь                                | Назначение                                                        |
| ----------------------------------- | ----------------------------------------------------------------- |
| `src/components/`, `src/views/`     | Семь секций, навигация, карточки каталога и модальное окно резюме |
| `src/content/`, `src/locales/`      | Типизированные проекты/резюме и EN/RU тексты                      |
| `src/pdf/`                          | Отложенная загрузка PDF.js и безопасный слой URL-аннотаций        |
| `src/router/`, `src/seo/`           | Локализованные маршруты, метаданные и структурированные данные    |
| `src/assets/`, `src/styles/`        | Оптимизированные изображения и общие стили                        |
| `public/resumes/`, `public/social/` | Оригинальные PDF резюме и social previews                         |
| `tests/unit/`, `tests/integration/` | Логика и поведение компонентов                                    |
| `tests/build/`, `tests/e2e/`        | Готовые HTML/ассеты и пользовательские сценарии Chromium          |
| `.github/workflows/`, `Makefile`    | Read-only CI и локальные команды качества                         |
| `design/reference/`                 | Сохранённые канонические дизайны                                  |

Тесты резюме проверяют шесть реальных PDF, адреса и координаты ссылок, смену EN/RU
и страниц, масштаб/Fit width, resize, desktop/mobile, начальный overflow,
клавиатуру, повтор загрузки и байты скачанного файла. Внешние переходы в браузере
перехватываются; тесты не подтверждают доступность сторонних сайтов. CI устанавливает
зависимости из lockfile и Chromium, затем выполняет `make ci` для PR в `develop`/`main`
и push в эти базовые ветки.

## Лицензия

Код и техническая документация доступны по стандартной [MIT License](LICENSE),
copyright 2026 Danil Miftakhov, включая изменение и коммерческое использование.
Персональные фотографии, документы резюме и брендинг, включая материалы
в `design/reference/`, регулируются
[ASSETS-LICENSE.md](ASSETS-LICENSE.md): открытая публикация не разрешает их повторное
использование или присвоение личности владельца. Авторские права на неохраняемые
факты и идеи не заявляются.
