# ProjectRouter

[English](README.md) · [Русский](README.ru.md)

ProjectRouter — двуязычное инженерное портфолио Данила Мифтахова. Адаптивное
Vue-приложение объединяет коммерческий опыт, исходники проектов, резюме
по направлениям и контакты.

**[Открыть сайт → danil-miftakhov.dev](https://danil-miftakhov.dev/ru/)**

[![CI](https://github.com/DanilFaritovich/project-router/actions/workflows/ci.yml/badge.svg?branch=develop)](https://github.com/DanilFaritovich/project-router/actions/workflows/ci.yml)
[![Vue](https://img.shields.io/badge/Vue-3-42b883?logo=vuedotjs)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Frontend-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ed?logo=docker)](https://www.docker.com/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E-2eAD33?logo=playwright)](https://playwright.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Возможности

- EN/RU страницы со сменой языка, сохраняющей текущий раздел.
- Каталог проектов в Git со ссылками на исходники и локальными изображениями.
- Предварительно сгенерированный HTML, локализованные метаданные, social previews
  и зависящие от origin canonical, hreflang, sitemap и структурированные данные.
- PDF viewer с загрузкой по запросу, выбором языка документа, страницами,
  масштабом, подгонкой по ширине, скачиванием и обработкой ошибок с повтором загрузки.
- Клавиатурная навигация, ссылка пропуска к содержимому и управление фокусом меню и диалогов.
- Автоматические проверки компонентов, готового HTML, браузерных сценариев и контейнеров.

## Используемые технологии

| Область                           | Технологии                                                                     |
| --------------------------------- | ------------------------------------------------------------------------------ |
| Frontend                          | Vue 3, TypeScript, Vite 8, Tailwind CSS 4                                      |
| Маршрутизация и локализация       | Vue Router, Vue I18n                                                           |
| Статический HTML и метаданные     | Vite SSG, Unhead, sitemap, JSON-LD                                             |
| Просмотр PDF                      | PDF.js, локальный worker, canvas и аннотации ссылок                            |
| Контент                           | Типизированный TypeScript-каталог, EN/RU файлы локализации, локальные PDF/WebP |
| Unit- и component-тесты           | Vitest, Vue Test Utils, jsdom                                                  |
| Браузерные проверки и доступность | Playwright, axe-core                                                           |
| Качество кода                     | ESLint, Prettier, vue-tsc                                                      |
| Runtime                           | Docker, Docker Compose, Nginx Unprivileged                                     |
| CI и публикация образов           | GitHub Actions, GHCR, GitHub OIDC/Sigstore attestations                        |
| Разработка                        | Node.js 22.22.2+ в пределах 22.x, npm, Make                                    |

## Ключевые инженерные решения

- **Статический HTML с гидратацией Vue.** Vite SSG генерирует локализованные
  страницы при сборке, поэтому их содержимое доступно до выполнения JavaScript.
- **Контент в Git.** Типизированный каталог и EN/RU тексты проходят ревью вместе
  с кодом; приложению не нужны backend, база данных или CMS.
- **Загрузка PDF только в браузере.** PDF.js и worker загружаются при открытии
  документа; браузерные API изолированы от статической генерации, ресурсы освобождаются при закрытии.
- **Разделение приложения и эксплуатации.** Этот репозиторий собирает и проверяет
  образ приложения; Deployment Manager отвечает за production-развёртывание и маршрутизацию.

Границы модулей, SEO и жизненный цикл PDF описаны в
[ARCHITECTURE.md](ARCHITECTURE.md).

## Быстрый старт

Требуются Node **22.22.2+ в пределах 22.x** ([.nvmrc](.nvmrc)) и npm.

```sh
git clone https://github.com/DanilFaritovich/project-router.git
cd project-router
npm ci
npm run dev
```

Откройте локальный URL Vite по `/en/` или `/ru/`.

```sh
npm run build      # статические файлы в dist/
npm run preview    # локальный просмотр готовой сборки
```

Для абсолютных SEO-ссылок скопируйте [.env.example](.env.example) в `.env.local`
и задайте `VITE_SITE_ORIGIN` как целевой HTTPS origin без пути. Значение встроено
в HTML при сборке; его изменение требует пересборки. Без него зависящие от origin
SEO-метаданные и sitemap не генерируются.

## Качество и тестирование

```sh
make fix                         # безопасные исправления ESLint и Prettier
make check                       # lint, формат, типы, Vitest, production-contract tests
npx playwright install chromium
make verify                      # SSG build, готовые HTML/ассеты, сценарии Chromium
make ci                          # check + verify по одному разу
```

Для целевого теста используйте `npm test -- <test-file>`. В Linux для Playwright
могут потребоваться системные библиотеки: `npx playwright install --with-deps chromium`.

## Docker и доставка

Контейнер раздаёт статические файлы через Nginx Unprivileged на HTTP **8080**.
Для локального просмотра нужны Docker Engine, Compose v2 и Buildx:

```sh
make docker-build
make docker-test
make docker-run      # http://127.0.0.1:8080
make docker-stop
```

GitHub Actions проверяет сайт и контейнер перед публикацией неизменяемого образа
в GHCR из доверенного push. PR ничего не публикуют. Успешный push CI в `main`
запускает передачу управления CD в
[portfolio-deployment](https://github.com/DanilFaritovich/portfolio-deployment),
который отвечает за production-развёртывание и маршрутизацию. Подготовкой хоста занимается
[portfolio-server-infrastructure](https://github.com/DanilFaritovich/portfolio-server-infrastructure).

Проверка образов, конфигурация и действия оператора описаны в
[deployment contract](docs/deployment/CONTRACT.md) и
[release checklist](docs/deployment/RELEASE-CHECKLIST.md).

## Ограничения

- В PDF viewer нет текстового слоя, поиска и выделения; screen reader не может
  читать текст из canvas. Доступны скачивание и ссылки на исходный файл.
- Зафиксированный браузерный QA охватывает Chromium/Linux. Safari/iOS, Firefox,
  физические устройства и assistive technologies требуют отдельной приёмки.

## Документация

- [Архитектура](ARCHITECTURE.md): модули, локализация, SEO и жизненный цикл PDF.
- [QA-отчёт](docs/qa/STAGE07-REPORT.md): проверки и исторические скриншоты до обновления контента v1.1.0.
- [Deployment contract](docs/deployment/CONTRACT.md) и [release checklist](docs/deployment/RELEASE-CHECKLIST.md).
- [Changelog](CHANGELOG.md) и [release notes](docs/releases/v1.1.0.md): история разработки и зафиксированная приёмка.
- [Историческая дизайн-спецификация](design/DESIGN.md) и [канонические референсы](design/reference/README.md).
- [Правила участников и агентов](AGENTS.md).

## Лицензия

Код и техническая документация используют [MIT License](LICENSE), copyright 2026
Danil Miftakhov. Личные фотографии, резюме и брендинг, включая материалы
дизайн-референсов, регулируются [ASSETS-LICENSE.md](ASSETS-LICENSE.md).
При переиспользовании кода замените эти материалы; публичная доступность не даёт
права использовать личные материалы или выдавать себя за владельца.
