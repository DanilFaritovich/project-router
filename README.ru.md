# ProjectRouter

[English](README.md) · [Русский](README.ru.md)

ProjectRouter — планируемое EN/RU инженерное портфолио Данила Мифтахова:
проекты, инструменты разработчика, резюме и контакты; контент хранится в Git.

## Текущее состояние — Stage 02

Реализована техническая основа Vue 3/TypeScript/Vite, Tailwind CSS, Vue Router
и Vue I18n. Vite SSG генерирует отдельный HTML с EN/RU-текстом и метаданными.
Минимальная страница доступна по `/en/` и `/ru/`; `/` ведёт на `/en/`.
Настроены инструменты качества, тесты и GitHub Actions CI.
Дизайн портфолио, каталог, PDF.js и развёртывание остаются будущими этапами.
Исходные дизайн-референсы сохранены.

## Планируемый сайт

Vue 3, TypeScript, Vite, Tailwind CSS, Vue Router и Vue I18n, SSG/Prerender по
адресам `/en/` и `/ru/`, SEO, PDF.js, Vitest и Playwright. Собственного backend
и базы данных не планируется. Адаптивное портфолио будет содержать семь секций,
три Featured Projects, More Projects и Developer Tools. Ссылки demo/release и
действия с резюме доступны только при проверенных адресах и настоящих PDF.

## План разработки

Этапы 01–02 реализованы; этапы 03–09 остаются запланированными.

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
- [ARCHITECTURE.md](ARCHITECTURE.md): текущая основа, план границ, маршрутов и качества.
- [design/DESIGN.md](design/DESIGN.md) и [пояснения к референсам](design/reference/README.md): дизайн-спецификация.
- [.agents/skills/](.agents/skills/) и [lock стандартов](.codex-standards.lock.yaml): девять полных пакетов из
  [Codex Development Standards](https://github.com/DanilFaritovich/codex-development-standards),
  ветка `develop`, профиль `vue-static-site` v2, инструкция `bootstrap/vue-static-site.md`.
  Docker, CD и backend-скиллы не установлены.

## Лицензия

Код и техническая документация доступны по стандартной [MIT License](LICENSE),
copyright 2026 Danil Miftakhov, включая изменение и коммерческое использование.
Персональные материалы и брендинг в `design/reference/` регулируются
[ASSETS-LICENSE.md](ASSETS-LICENSE.md): открытая публикация не разрешает их повторное
использование или присвоение личности владельца. Авторские права на неохраняемые
факты и идеи не заявляются.
