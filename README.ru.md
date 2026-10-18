# ProjectRouter

[English](README.md) · [Русский](README.ru.md)

ProjectRouter — планируемое EN/RU инженерное портфолио Данила Мифтахова:
проекты, инструменты разработчика, резюме и контакты; контент хранится в Git.

## Текущее состояние — Stage 01

Подготовлены Git-структура, MIT, двуязычная документация, архитектурный и дизайн-план,
девять полных локальных skills. Все 20 исходных дизайн-референсов сохранены.
Vue-приложения, npm-зависимостей, Makefile, CI workflow и развёртывания пока нет.

## Планируемый сайт

Vue 3, TypeScript, Vite, Tailwind CSS, Vue Router и Vue I18n, SSG/Prerender по
адресам `/en/` и `/ru/`, SEO, PDF.js, Vitest и Playwright. Собственного backend
и базы данных не планируется. Адаптивное портфолио будет содержать семь секций,
три Featured Projects, More Projects и Developer Tools. Ссылки demo/release и
действия с резюме доступны только при проверенных адресах и настоящих PDF.

## План разработки

Stage 01 подготовлен в текущем PR; этапы 02–09 запланированы.

| Этап | Ветка | Название |
| --- | --- | --- |
| 01 | `chore/project-bootstrap` | Bootstrap |
| 02 | `feature/vue-foundation` | Vue Foundation |
| 03 | `feature/portfolio-layout` | Layout & Sections |
| 04 | `feature/projects-catalog` | Projects Catalog |
| 05 | `feature/i18n-seo` | Localization & SEO |
| 06 | `feature/resume-interactions` | Resume & Interactions |
| 07 | `test/portfolio-quality` | Testing & Visual QA |
| 08 | `feature/production-foundation` | Docker & CI/CD |
| 09 | `feature/caddy-production` | Caddy & Production Release |

После этих девяти этапов реализации отдельно выполняются release PR из `develop`
в `main` и тег/релиз `v1.0.0` по явному разрешению. Этот переход к релизу не является
десятым этапом реализации. Production-деплой также требует отдельного разрешения.

## Разработка и документация

Рабочие ветки создаются строго от `develop`; локальный commit, push и PR в
`develop` разрешены владельцем. Merge выполняется вручную; force push запрещён.
Будущий порядок качества: `make fix` → целевые тесты → `make check`, с независимым
CI без изменения кода. Команды и требования к среде появятся в Stage 02.

- [AGENTS.md](AGENTS.md): процесс Codex и проектные инструкции.
- [ARCHITECTURE.md](ARCHITECTURE.md): план стека, границ, маршрутов и качества.
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
