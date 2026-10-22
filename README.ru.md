# ProjectRouter

[English](README.md) · [Русский](README.ru.md)

ProjectRouter — двуязычное инженерное портфолио Данила Мифтахова: единая точка
для знакомства с опытом, изучения исходного кода проектов и скачивания подходящего
резюме. Проект также демонстрирует статическое Vue-приложение с локализованным HTML,
доступными интеракциями, автоматизированным QA и проверяемой доставкой контейнеров.

**Статус релиза:** этапы 01–09 завершены и интегрированы в `develop`.
Метаданные проекта подготовлены для первого релиза **v1.0.0**; версия ещё не
выпущена и не развёрнута в production. Существующий [release PR #14](https://github.com/DanilFaritovich/project-router/pull/14)
связывает `develop → main`. Публичный Live Demo не подтверждён.

[Скриншот desktop](docs/qa/artifacts/page-ru-1440.webp) ·
[Скриншот mobile](docs/qa/artifacts/page-ru-390.webp) ·
[PDF viewer](docs/qa/artifacts/pdf-ru-390.webp)

Эти существующие браузерные снимки взяты из [QA-отчёта Stage 07](docs/qa/STAGE07-REPORT.md);
они предшествуют описанной в нём корректировке отступов.

## Возможности

- Семь адаптивных секций: Hero, About, Skills, Projects, Developer Tools,
  Resume и Contacts; коммерческий опыт, фриланс и личные проекты разделены.
- Типизированный каталог в Git: три основных проекта, три дополнительных и
  три инструмента разработчика, ссылки на исходники, четыре ссылки на конкретные
  релизы и четыре локально оптимизированных скриншота. Отдельный сервис каталога не нужен.
- Полные EN/RU тексты по `/en/` и `/ru/`. Смена языка сохраняет видимую секцию
  и query/hash; работают Back/Forward браузера и прямые ссылки.
- Предварительно сгенерированные локализованные HTML, метаданные, social previews
  и зависящие от origin canonical/hreflang, sitemap и Person/WebSite structured data.
- Шесть оригинальных EN/RU PDF для Backend, AI / LLM и Data / ETL. Отложенно
  загружаемый PDF.js viewer поддерживает независимый язык документа, страницы,
  масштаб, fit width, скачивание, ссылку на оригинал и состояния загрузки/ошибки/повтора.
- Клавиатурная навигация, skip link, удержание/возврат фокуса меню и модального окна;
  адаптивная вёрстка проверена от 320 до 1440px на обоих языках.

## Архитектура

| Решение                              | Назначение                                                               |
| ------------------------------------ | ------------------------------------------------------------------------ |
| Vue 3 + TypeScript + Vite 8          | Типизированный компонентный UI и общие инструменты разработки/сборки     |
| Tailwind CSS 4                       | Общие токены темы и адаптивные раскладки                                 |
| Vue Router + Vue I18n                | Язык из URL и перевод видимых текстов и подписей доступности             |
| Vite SSG + Unhead                    | Доступные краулерам HTML и метаданные до JavaScript, затем гидратация    |
| Контент в Git                        | Ревью изменений текстов/каталога без backend, БД или CMS                 |
| Отложенный PDF.js + локальный worker | Интерактивные PDF загружаются только при открытии и не исполняются в SSG |

`src/content/` содержит метаданные каталога/резюме, `src/locales/` — EN/RU тексты.
`src/components/` и `src/views/` формируют UI, `src/router/` управляет языковыми
маршрутами, `src/seo/` — метаданными. `src/pdf/` и `src/components/resume/`
изолируют клиентский viewer. SSR на каждый запрос и API-слоя нет.

PDF-ссылки разрешают только HTTP(S)/mailto; HTTP(S) открывается с `noopener noreferrer`.
PDF scripts/actions исключены. Canvas и аннотации ссылок остаются совмещёнными при
смене страницы, масштаба и размера окна; ресурсы документа/worker освобождаются при
закрытии. Шесть исходных PDF в `public/resumes/` сохранены без изменений.

Границы модулей, потоки данных и покрытие тестами описаны в [ARCHITECTURE.md](ARCHITECTURE.md).
[design/DESIGN.md](design/DESIGN.md) сохраняет исторический замысел дизайна;
это не спецификация финального поведения.

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

При необходимости скопируйте [.env.example](.env.example) в `.env.local` и задайте
`VITE_SITE_ORIGIN` как HTTPS origin без пути, затем пересоберите проект.
Подтверждённый production build origin — `https://danil-miftakhov.dev`; это
конфигурация, а не подтверждение работающего сайта. Без origin доступны
локализованный HTML и текстовые метаданные; canonical/hreflang, абсолютные social
URL, JSON-LD и sitemap не генерируются. Origin публичен и встроен в SSG;
его изменение требует пересборки.

## Качество и тестирование

```sh
make fix                         # безопасные исправления ESLint и Prettier
make check                       # lint, формат, типы, Vitest, production-contract tests
npx playwright install chromium
make verify                      # SSG build, готовые HTML/ассеты, сценарии Chromium
make ci                          # check + verify по одному разу; read-only проверки
```

В Linux команда `npx playwright install --with-deps chromium` также устанавливает
системные библиотеки. Для целевого теста используйте `npm test -- <test-file>`.
`VITE_SITE_ORIGIN=https://portfolio.test make verify` локально проверяет SEO,
зависящее от origin; зарезервированный тестовый домен не является адресом deployment.

Тесты покрывают контракты каталога/локализации, HTML без JavaScript, навигацию/историю,
мобильное меню, все шесть настоящих PDF, байты скачанных файлов, геометрию ссылок,
фокус, повтор загрузки и гонки ресурсов. [QA-отчёт](docs/qa/STAGE07-REPORT.md)
содержит EN/RU матрицу размеров экрана, axe-проверки, визуальное ревью, исторические
результаты и ограничения. Автоматические проверки доступности не являются
сертификацией WCAG; readability-проверки не подтверждают квалификацию, поисковые
позиции или AI-рекомендации.

## Docker и доставка

[Dockerfile](Dockerfile) использует стадии Node → Nginx Unprivileged с закреплёнными
digest. Runtime раздаёт статику под UID/GID **101:101** на HTTP **8080**, без Node
и build-зависимостей. Compose использует read-only root, временный tmpfs,
сброс capabilities и no-new-privileges; постоянное хранилище не требуется.

```sh
make docker-build    # нужны Docker Engine, Compose v2 и Buildx
make docker-test     # изолированные origin/HTTP/security/PDF проверки контейнеров
make docker-run      # локальный просмотр: http://127.0.0.1:8080
make docker-stop
```

Локальный Compose использует loopback и не требует production-сети.
`PROJECT_ROUTER_PORT` меняет порт. Nginx перенаправляет `/` на `/en/` (302),
напрямую отдаёт локализованные SSG-файлы и возвращает 404 для неизвестных путей
без SPA fallback.

[GitHub Actions](.github/workflows/ci.yml) запускает `Quality and static build`,
затем `Docker build and container smoke`. PR ничего не публикует. После успеха
обоих заданий для одного SHA доверенного push [reusable publish workflow](.github/workflows/publish.yml)
публикует `linux/amd64` в `ghcr.io/danilfaritovich/project-router`:

- `develop` → `develop-sha-<полный SHA>`;
- `main` → `main-sha-<полный SHA>`;
- отдельно разрешённые теги `v*` → точный тег версии; тега `latest` нет.

Публикация проверяет registry digest/platform и встроенные метаданные origin,
затем через GitHub OIDC/Sigstore подписывает SLSA provenance и собственную
origin/build-input attestation для этого digest. Потребитель совместно проверяет
подписи, source SHA/ref, signer workflow и origin; тегов, OCI labels и неподписанного
JSON недостаточно. Main/tag publication требует точного значения публичной Actions
variable `VITE_SITE_ORIGIN=https://danil-miftakhov.dev`; main также требует protected
ref. Образ, оставшийся после ошибки post-push проверки, не допускается к релизу.

| Репозиторий                                                                                           | Ответственность                                                                                  |
| ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| ProjectRouter                                                                                         | Статическое приложение, сборка/проверка/публикация образа и HTTP-контракт интеграции             |
| [portfolio-deployment](https://github.com/DanilFaritovich/portfolio-deployment)                       | Регистрация/развёртывание приложений, gateway/Caddy, маршрутизация домена, сети и восстановление |
| [portfolio-server-infrastructure](https://github.com/DanilFaritovich/portfolio-server-infrastructure) | Подготовка и усиление защиты хоста через Ansible                                                 |

Production использует неизменяемый digest образа. Сейчас manager допускает
артефакты protected main, а не develop/tag images. Он генерирует service `web` /
alias `project-router-web`; producer [compose.yaml](compose.yaml) — отдельный
пример с alias `project-router`. Не запускайте оба проекта для этого приложения.
[Deployment contract](docs/deployment/CONTRACT.md) и
[release checklist](docs/deployment/RELEASE-CHECKLIST.md) описывают проверку и передачу.
Эти workflows не выполняют deployment, merge PR, создание тегов или GitHub Releases.

## Ограничения и статус релиза

Production deployment, приёмка публичного HTTPS/SEO, индексация и первая проверка
production-eligible digest/подписей остаются задачами оператора. Правила веток,
допуск manager и runtime acceptance требуют независимого ревью.
Docker health status сам по себе не перезапускает зависший процесс.

В PDF viewer нет полного текстового слоя, поиска и выделения; screen reader
не может читать текст PDF внутри canvas. Ссылки на оригинальные файлы доступны.
Зафиксированный браузерный QA охватывает Chromium/Linux; Safari/iOS, Firefox,
физические устройства и приёмка с assistive technologies остаются проверками
владельца. Тесты внешних ссылок не гарантируют доступность сторонних сайтов.
Backend и БД не планируются как обязательные части этого статического портфолио.

## Документация

- [Архитектура](ARCHITECTURE.md): модули, инварианты, локализация, SEO и жизненный цикл PDF.
- [QA-отчёт и скриншоты](docs/qa/STAGE07-REPORT.md): доказательства и границы приёмки.
- [Deployment contract](docs/deployment/CONTRACT.md) и [release checklist](docs/deployment/RELEASE-CHECKLIST.md): безопасность, attestations и действия оператора.
- [Changelog](CHANGELOG.md) и [черновик release notes v1.0.0](docs/releases/v1.0.0.md).
- [Историческая дизайн-спецификация](design/DESIGN.md) и [канонические референсы](design/reference/README.md).
- [AGENTS.md](AGENTS.md): правила участников/агентов; рабочие ветки от `develop`, PR в `develop`, ручной merge.

### Этапы разработки

Все девять этапов реализации завершены и интегрированы в `develop`:

| Этап | Содержание                                   |
| ---- | -------------------------------------------- |
| 01   | Bootstrap                                    |
| 02   | Vue Foundation                               |
| 03   | Layout & Sections                            |
| 04   | Projects Catalog                             |
| 05   | Localization & SEO                           |
| 06   | Resume & Interactions                        |
| 07   | Testing & Visual QA                          |
| 08   | Docker & CI/CD Foundation                    |
| 09   | Production Integration & Release preparation |

Существующий release PR #14, его отдельно разрешённый merge, тег/GitHub Release
и production-операции относятся к передаче в релиз, а не к десятому этапу реализации.

## Лицензия

Код и техническая документация используют [MIT License](LICENSE), copyright 2026
Danil Miftakhov. Личные фотографии, резюме и брендинг, включая материалы
дизайн-референсов, регулируются [ASSETS-LICENSE.md](ASSETS-LICENSE.md).
При переиспользовании кода замените эти материалы; публичная доступность не даёт
права использовать личные материалы или выдавать себя за владельца.
