# ProjectRouter

[English](README.md) · [Русский](README.ru.md)

ProjectRouter is Danil Miftakhov's bilingual engineering portfolio. It brings
commercial experience, project source code, role-specific resumes and contacts
together in a responsive Vue application.

**[Visit the website → danil-miftakhov.dev](https://danil-miftakhov.dev/en/)**

[![CI](https://github.com/DanilFaritovich/project-router/actions/workflows/ci.yml/badge.svg?branch=develop)](https://github.com/DanilFaritovich/project-router/actions/workflows/ci.yml)
[![Vue](https://img.shields.io/badge/Vue-3-42b883?logo=vuedotjs)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Frontend-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ed?logo=docker)](https://www.docker.com/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E-2eAD33?logo=playwright)](https://playwright.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Features

- EN/RU pages with language switching that preserves the current section.
- A Git-managed project catalog with source links and local preview images.
- Pre-rendered HTML, localized metadata, social previews and origin-dependent
  canonical links, hreflang, sitemap and structured data.
- An on-demand PDF viewer with document language selection, paging, zoom,
  fit width, download and loading/error/retry states.
- Keyboard navigation, a skip link and focus management for menus and dialogs.
- Automated checks for components, generated HTML, browser journeys and containers.

## Technology stack

| Area                             | Technologies                                                        |
| -------------------------------- | ------------------------------------------------------------------- |
| Frontend                         | Vue 3, TypeScript, Vite 8, Tailwind CSS 4                           |
| Routing and localization         | Vue Router, Vue I18n                                                |
| Static HTML and metadata         | Vite SSG, Unhead, sitemap, JSON-LD                                  |
| PDF viewing                      | PDF.js, local worker, canvas and link annotations                   |
| Content                          | Typed TypeScript catalog, EN/RU locale files, local PDF/WebP assets |
| Unit and component tests         | Vitest, Vue Test Utils, jsdom                                       |
| Browser and accessibility checks | Playwright, axe-core                                                |
| Code quality                     | ESLint, Prettier, vue-tsc                                           |
| Runtime                          | Docker, Docker Compose, Nginx Unprivileged                          |
| CI and image publication         | GitHub Actions, GHCR, GitHub OIDC/Sigstore attestations             |
| Development                      | Node.js 22.22.2+ within 22.x, npm, Make                             |

## Key engineering decisions

- **Static HTML with Vue hydration.** Vite SSG generates localized pages during
  the build, making their content available before JavaScript runs.
- **Content in Git.** Typed catalog data and EN/RU copy are reviewed alongside
  code; the application needs no backend, database or CMS.
- **Client-only PDF loading.** PDF.js and its worker load when a document opens,
  keeping browser APIs outside static generation and releasing resources on close.
- **Separate application and operations.** This repository builds and tests the
  application image; Deployment Manager owns production rollout and routing.

Module boundaries, SEO and PDF lifecycle details are in
[ARCHITECTURE.md](ARCHITECTURE.md).

## Quick start

Requires Node **22.22.2+ within 22.x** ([.nvmrc](.nvmrc)) and npm.

```sh
git clone https://github.com/DanilFaritovich/project-router.git
cd project-router
npm ci
npm run dev
```

Open the local Vite URL at `/en/` or `/ru/`.

```sh
npm run build      # static output in dist/
npm run preview    # inspect the built site locally
```

For absolute SEO URLs, copy [.env.example](.env.example) to `.env.local` and set
`VITE_SITE_ORIGIN` to the intended HTTPS origin without a path. It is baked into
HTML at build time; changing it requires a rebuild. Without it, origin-dependent
SEO metadata and sitemap are omitted.

## Quality and testing

```sh
make fix                         # safe ESLint and Prettier fixes
make check                       # lint, format, types, Vitest, production-contract tests
npx playwright install chromium
make verify                      # SSG build, built HTML/assets, Chromium journeys
make ci                          # check + verify, once each
```

For a focused test, use `npm test -- <test-file>`. On Linux, Playwright may also
need system libraries: `npx playwright install --with-deps chromium`.

## Docker and delivery

The container serves static files through Nginx Unprivileged on HTTP **8080**.
Local preview requires Docker Engine, Compose v2 and Buildx:

```sh
make docker-build
make docker-test
make docker-run      # http://127.0.0.1:8080
make docker-stop
```

GitHub Actions validates the site and container before trusted pushes publish
an immutable image to GHCR. PRs do not publish. Successful push CI on `main`
triggers the CD handoff to
[portfolio-deployment](https://github.com/DanilFaritovich/portfolio-deployment),
which owns production rollout and routing. Host provisioning belongs to
[portfolio-server-infrastructure](https://github.com/DanilFaritovich/portfolio-server-infrastructure).

Image verification, configuration and operator procedures are documented in the
[deployment contract](docs/deployment/CONTRACT.md) and
[release checklist](docs/deployment/RELEASE-CHECKLIST.md).

## Limitations

- The PDF viewer has no text layer, search or selection; screen readers cannot
  read PDF prose from its canvas. Download and original-file links are available.
- Recorded browser QA covers Chromium/Linux. Safari/iOS, Firefox, physical
  devices and assistive technologies require separate acceptance checks.

## Documentation

- [Architecture](ARCHITECTURE.md): modules, localization, SEO and PDF lifecycle.
- [QA report](docs/qa/STAGE07-REPORT.md): checks and historical screenshots from before the v1.1.0 content refresh.
- [Deployment contract](docs/deployment/CONTRACT.md) and [release checklist](docs/deployment/RELEASE-CHECKLIST.md).
- [Changelog](CHANGELOG.md) and [release notes](docs/releases/v1.1.0.md): development history and recorded acceptance.
- [Historical design specification](design/DESIGN.md) and [canonical references](design/reference/README.md).
- [Contributor and agent rules](AGENTS.md).

## License

Code and technical documentation use the [MIT License](LICENSE), copyright 2026
Danil Miftakhov. Personal photographs, resume documents and branding, including
materials in design references, follow [ASSETS-LICENSE.md](ASSETS-LICENSE.md).
Replace those assets when reusing the code; public availability grants no right
to reuse personal materials or impersonate the owner.
