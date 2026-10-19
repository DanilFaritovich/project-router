# ProjectRouter

[English](README.md) · [Русский](README.ru.md)

ProjectRouter — EN/RU инженерное портфолио Данила Мифтахова с проектами,
инструментами разработчика, заглушками резюме и контактами. Контент хранится в Git.

## Текущее состояние — Stage 01–04

Stage 01–04, Portfolio Content Refinement и Hero Portrait Integration реализованы
и слиты в `develop`. Адаптивное портфолио на Vue 3/TypeScript/Vite использует
Tailwind CSS, Vue Router и Vue I18n. Vite SSG генерирует локализованные HTML
и базовые метаданные по `/en/` и `/ru/`; `/` ведёт на `/en/`.

- Семь секций: Hero, About, Skills, Projects, Developer Tools, Resume и Contacts.
- Hero использует фотографию владельца в локальных оптимизированных WebP-файлах,
  локализованный alt и адаптивные `srcset`/sizes. About разделяет коммерческий опыт,
  фриланс и личные инженерные проекты; Skills содержит восемь групп.
- Каталог содержит три Featured Projects, три More Projects и три Developer Tools
  с проверенными GitHub-адресами и четырьмя явными ссылками Release на версии.
  Четыре реальных скриншота проектов локально оптимизированы в WebP.
- Десктопная навигация по секциям и мобильное меню поддерживают переключение EN/RU
  с сохранением видимой секции; контакты ведут на социальные профили владельца.
- ESLint, Prettier, TypeScript, Vitest, Playwright, SSG/build-проверки и GitHub
  Actions обеспечивают автоматические проверки качества. Исходные дизайн-референсы сохранены.

Настоящих PDF резюме пока нет: у трёх ролевых заглушек отключены просмотр
и скачивание, интеграция PDF.js запланирована. Публичный Live Demo не подтверждён,
ссылок на него нет. Production-деплой не выполнен. Существующие механизмы
локализации и SEO являются основой; их аудит и завершение относятся к следующему
Stage 05. Backend и база данных не используются.

## План разработки

Этапы 01–04 реализованы; этапы 05–09 остаются запланированными. Синхронизация
документации — задача сопровождения вне девятиэтапного roadmap.

| Этап | Ветка                           | Название                   |
| ---- | ------------------------------- | -------------------------- |
| 01   | `chore/project-bootstrap`       | Bootstrap                  |
| 02   | `feature/vue-foundation`        | Vue Foundation             |
| 03   | `feature/portfolio-layout`      | Layout & Sections          |
| 04   | `feature/projects-catalog`      | Projects Catalog           |
| 05   | `feature/i18n-seo`              | Localization & SEO         |
| 06   | `feature/resume-interactions`   | Resume & Interactions      |
| 07   | `test/portfolio-quality`        | Testing & Visual QA        |
| 08   | `feature/production-foundation` | Docker & CI/CD             |
| 09   | `feature/caddy-production`      | Caddy & Production Release |

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
npm test -- tests/integration/localization.integration.spec.ts
make check              # lint, формат, типы, unit/integration
npx playwright install chromium
make verify             # SSG build, HTML и браузерный smoke
make ci                 # check + verify, без повторов и исправления исходников
```

В Linux для Chromium могут потребоваться системные библиотеки:
`npx playwright install --with-deps chromium` (CI устанавливает их автоматически).
Порядок разработки: `make fix` → целевые тесты → `make check`; `make verify`
выполняется при изменениях сборки и пользовательских сценариев.

Production-домен ещё не выбран. При необходимости скопируйте `.env.example`
в `.env.local` и задайте `VITE_SITE_ORIGIN` как реальный HTTPS origin без пути,
затем пересоберите сайт. Без origin canonical, hreflang, `og:url` и sitemap
не генерируются; локализованные HTML и базовые метаданные работают.
Хостинг должен раздавать `/en/index.html` и `/ru/index.html` напрямую и возвращать
404 для неизвестных адресов. Корень пока использует HTML meta-refresh;
настоящий HTTP redirect и live SEO проверяются на этапе доставки.
В GitHub рекомендуется сделать `Quality and static build` обязательной проверкой
веток; настройки защиты веток вручную задаёт администратор.

- [AGENTS.md](AGENTS.md): процесс Codex и проектные инструкции.
- [ARCHITECTURE.md](ARCHITECTURE.md): реализованное портфолио, границы системы, маршруты и качество.
- [design/DESIGN.md](design/DESIGN.md) и [пояснения к референсам](design/reference/README.md): дизайн-спецификация.
- [.agents/skills/](.agents/skills/) и [lock стандартов](.codex-standards.lock.yaml): девять полных пакетов из
  [Codex Development Standards](https://github.com/DanilFaritovich/codex-development-standards),
  ветка `develop`, профиль `vue-static-site` v2, инструкция `bootstrap/vue-static-site.md`.
  Docker, CD и backend-скиллы не установлены.

## Лицензия

Код и техническая документация доступны по стандартной [MIT License](LICENSE),
copyright 2026 Danil Miftakhov, включая изменение и коммерческое использование.
Персональные фотографии, документы резюме и брендинг, включая материалы
в `design/reference/`, регулируются
[ASSETS-LICENSE.md](ASSETS-LICENSE.md): открытая публикация не разрешает их повторное
использование или присвоение личности владельца. Авторские права на неохраняемые
факты и идеи не заявляются.
