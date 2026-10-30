# ProjectRouter

[English](README.md) · [Русский](README.ru.md)

[![CI](https://github.com/DanilFaritovich/project-router/actions/workflows/ci.yml/badge.svg?branch=develop)](https://github.com/DanilFaritovich/project-router/actions/workflows/ci.yml)
[![Vue](https://img.shields.io/badge/Vue-3-42b883?logo=vuedotjs)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Frontend-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ed?logo=docker)](https://www.docker.com/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E-2eAD33?logo=playwright)](https://playwright.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

ProjectRouter is Danil Miftakhov's bilingual engineering portfolio: a single place
to review his experience, explore project source code and download a relevant
resume. Recruiters can review commercial experience and choose a role-specific
resume; engineers can follow source links to inspect the work behind the profile.

The engineering task is to combine indexable EN/RU pages with an interactive PDF
viewer while keeping deployment static. Vue 3 and TypeScript provide the UI;
build-time HTML generation, client-only PDF loading and automated checks keep
content delivery, browser interactions and release validation separate.

**Current version:** application metadata is `1.1.0`. The content refresh has
owner acceptance; first rollout is operator-reported. A version number does not
establish a published GitHub Release or the currently deployed image. See
[release status](#limitations-and-release-status) for evidence and limitations.

[Desktop screenshot](docs/qa/artifacts/page-en-1440.webp) ·
[Mobile screenshot](docs/qa/artifacts/page-en-390.webp) ·
[PDF viewer](docs/qa/artifacts/pdf-en-1440.webp)

These existing browser captures come from the [Stage 07 QA report](docs/qa/STAGE07-REPORT.md);
they predate its documented spacing follow-up and the v1.1.0 content refresh.

## What this project demonstrates

- **A complete portfolio workflow:** experience, project sources, role-specific
  resumes and contact options in one responsive interface.
- **Static application design:** localized HTML is generated before JavaScript
  runs; catalog and copy changes are reviewed in Git without a backend or CMS.
- **Browser lifecycle management:** the PDF viewer loads on demand, handles
  loading failures and disposes document/worker resources when closed.
- **Accessible interactions:** keyboard navigation, focus management and safe PDF
  links accompany the visual interface; known accessibility limits are documented.
- **Verifiable delivery:** unit/component tests, built-HTML checks, Chromium
  journeys and container checks precede trusted image publication.

## Features

- Seven responsive sections: Hero, About, Skills, Projects, Developer Tools,
  Resume and Contacts; commercial, freelance and personal work are distinguished.
- Python Backend positioning supported by three commercial case briefs: batch
  address processing, supplier-to-Ozon inventory synchronization and LLM-assisted
  geospatial-name localization. Commercial work is distinct from public demos.
- Typed, Git-managed catalog: three featured projects, two more projects and
  three developer tools, with source links, four explicit release links and four
  locally optimized project screenshots. Geocoder leads the featured projects;
  host infrastructure and application delivery have separately labeled sources.
  No runtime catalog service is needed.
- Complete EN/RU copy at `/en/` and `/ru/`. Language switching preserves the
  visible section and query/hash; browser Back/Forward and direct links work.
- Pre-rendered localized HTML, metadata, social previews and origin-dependent
  canonical/hreflang, sitemap and Person/WebSite structured data.
- Six new two-page EN/RU resume PDFs for Backend, AI / LLM and Data / ETL,
  with editable sources and role-specific profiles, skills and project selection.
  The six original PDFs remain unchanged. The lazy
  PDF.js viewer supports independent document language, pages, zoom, fit width,
  download, original-file fallback and loading/error/retry states.
- Keyboard navigation, skip link, mobile menu and modal focus containment/return;
  responsive layouts checked from 320 to 1440px in both languages.

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

| Choice                      | Purpose                                                              |
| --------------------------- | -------------------------------------------------------------------- |
| Vue 3 + TypeScript + Vite 8 | Typed component UI and a shared development/build toolchain          |
| Tailwind CSS 4              | Shared theme tokens and responsive layouts                           |
| Vue Router + Vue I18n       | URL-driven locale and translated visible/accessibility copy          |
| Vite SSG + Unhead           | Crawlable HTML and metadata before JavaScript, followed by hydration |
| Git-managed content         | Reviewable copy/catalog updates without a backend, database or CMS   |
| Lazy PDF.js + local worker  | Interactive PDFs loaded only when opened, outside SSG execution      |

## Architecture

`src/content/` owns catalog/resume metadata; `src/locales/` owns EN/RU copy.
`src/components/` and `src/views/` compose the UI, `src/router/` owns locale routing,
and `src/seo/` owns metadata. `src/pdf/` and `src/components/resume/` isolate the
client-only viewer. There is no request-time SSR or API layer.

PDF links allow only HTTP(S)/mailto; HTTP(S) opens with `noopener noreferrer`.
PDF scripts/actions are excluded. Canvas and link annotations stay aligned through
page, zoom and resize changes; document/worker resources are disposed on close.
The viewer serves `public/resumes/candidate-{backend,ai,data}-{en,ru}.pdf`.
The six original PDFs in the same directory remain unchanged.

Resume content lives in `scripts/resumes/content.mjs`; layout and generation live
in `scripts/render-resumes.mjs`. After installing Chromium, `make resume-candidates`
generates PDF and HTML review artifacts under the system temporary directory and
prints the output path. It never overwrites `public/resumes/`; replacing the
site's PDFs is an explicit content update.

See [ARCHITECTURE.md](ARCHITECTURE.md) for module boundaries, data flows and test
coverage. [design/DESIGN.md](design/DESIGN.md) preserves historical design intent;
it is not the final behavior specification.

## Quick Start

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

Optional: copy [.env.example](.env.example) to `.env.local` and set
`VITE_SITE_ORIGIN` to an HTTPS origin without a path, then rebuild. The confirmed
production build origin is `https://danil-miftakhov.dev`; this is configuration,
not evidence of a live site. Without an origin, localized HTML and text metadata
remain available; canonical/hreflang, absolute social URLs, JSON-LD and sitemap
are omitted. The origin is public and baked into SSG; changing it requires a rebuild.

## Quality and testing

```sh
make fix                         # safe ESLint and Prettier fixes
make check                       # lint, format, types, Vitest, production-contract tests
npx playwright install chromium
make verify                      # SSG build, built HTML/assets, Chromium journeys
make ci                          # check + verify, once each; read-only validation
```

On Linux, `npx playwright install --with-deps chromium` also installs required
system libraries. For a focused test, use `npm test -- <test-file>`.
`VITE_SITE_ORIGIN=https://portfolio.test make verify` exercises origin-dependent
SEO locally; the reserved test domain is not a deployment destination.

Tests cover catalog/locale contracts, no-JavaScript HTML, navigation/history,
mobile menu, all six active PDFs, original-file integrity, download bytes, link geometry, focus, retry and
resource races. The [QA report](docs/qa/STAGE07-REPORT.md) records the EN/RU
viewport matrix, axe scans, visual review, historical results and limitations.
Automated accessibility checks are not WCAG certification; readability checks do
not prove credentials, search rankings or AI recommendations.

## Docker and delivery

The [Dockerfile](Dockerfile) uses digest-pinned Node → Nginx Unprivileged stages.
The runtime serves static files as UID/GID **101:101** on HTTP **8080**, without
Node or build dependencies. Compose uses a read-only root, disposable tmpfs,
dropped capabilities and no-new-privileges; no persistent storage is required.

```sh
make docker-build    # requires Docker Engine, Compose v2 and Buildx
make docker-test     # isolated origin/HTTP/security/PDF container checks
make docker-run      # local preview: http://127.0.0.1:8080
make docker-stop
```

Local Compose uses loopback and needs no production network. `PROJECT_ROUTER_PORT`
can change its port. Nginx redirects `/` to `/en/` (302), serves localized SSG
files directly and returns 404 for unknown paths without SPA fallback.

[GitHub Actions](.github/workflows/ci.yml) runs `Quality and static build`, then
`Docker build and container smoke`. PRs never publish. After both pass for the
same trusted push SHA, the [reusable publish workflow](.github/workflows/publish.yml)
publishes `linux/amd64` to `ghcr.io/danilfaritovich/project-router`:

- `develop` → `develop-sha-<full SHA>`;
- `main` → `main-sha-<full SHA>`;
- separately authorized `v*` tags → exact version tag; no `latest` tag.

Publication verifies registry digest/platform and built origin metadata, then
uses GitHub OIDC/Sigstore to sign SLSA provenance and a custom origin/build-input
attestation for that digest. Consumers verify signatures, source SHA/ref, signer
workflow and origin together; tags, OCI labels and unsigned JSON are insufficient.
Main/tag publication requires the exact public Actions variable
`VITE_SITE_ORIGIN=https://danil-miftakhov.dev`; main also requires a protected ref.
An image left by a failed post-push check is not release eligible.

| Repository                                                                                            | Responsibility                                                                         |
| ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| ProjectRouter                                                                                         | Static application, image build/test/publication and HTTP integration contract         |
| [portfolio-deployment](https://github.com/DanilFaritovich/portfolio-deployment)                       | Application registration/rollout, gateway/Caddy, domain routing, networks and recovery |
| [portfolio-server-infrastructure](https://github.com/DanilFaritovich/portfolio-server-infrastructure) | Host provisioning and hardening with Ansible                                           |

Production consumes an immutable image digest. The manager currently accepts
protected-main artifacts, not develop/tag images. It generates service `web` /
alias `project-router-web`; the producer [compose.yaml](compose.yaml) is a separate
example with alias `project-router`. Never run both projects for this application.
See the [deployment contract](docs/deployment/CONTRACT.md) and
[release checklist](docs/deployment/RELEASE-CHECKLIST.md) for verification and handoff.
After successful push CI on `main`, the [production CD workflow](.github/workflows/deploy.yml)
calls a pinned reusable workflow in `portfolio-deployment`, which owns rollout
policy and operations. A merge into `main` therefore enters the production CD
path. Develop and tag publication do not trigger this workflow. No workflow merges
PRs, creates tags or publishes GitHub Releases.

## Limitations and release status

Stages 01–09 are complete and integrated into `develop`. The `1.1.0` content
refresh was integrated through [PR #21](https://github.com/DanilFaritovich/project-router/pull/21).
The owner confirmed visual acceptance of the site and all six new PDFs on
2026-10-28. See the [v1.1.0 release notes](docs/releases/v1.1.0.md) for scope and
recorded validation; these results do not establish checks for a later release SHA.

The first rollout is operator-reported. This repository's local checks do not
establish current public HTTPS/SEO behavior, indexing or field performance.
For each release, the operator verifies the exact protected-main image digest,
signatures, manager admission and runtime acceptance through `portfolio-deployment`.
Docker health status alone does not restart a hung process.

The PDF viewer has no full text layer, search or selection; screen readers cannot
read PDF prose inside its canvas. Original-file links remain available.
Recorded browser QA covers Chromium/Linux; Safari/iOS, Firefox, physical devices
and assistive-technology acceptance remain owner checks. External-link tests do
not guarantee third-party availability. No backend or database is planned as a
requirement for this static portfolio.

## Documentation

- [Architecture](ARCHITECTURE.md): modules, invariants, localization, SEO and PDF lifecycle.
- [QA report and screenshots](docs/qa/STAGE07-REPORT.md): evidence and acceptance limits.
- [Deployment contract](docs/deployment/CONTRACT.md) and [release checklist](docs/deployment/RELEASE-CHECKLIST.md): security, attestations and operator steps.
- [Changelog](CHANGELOG.md) and [v1.1.0 release notes](docs/releases/v1.1.0.md).
- [Historical design specification](design/DESIGN.md) and [canonical references](design/reference/README.md).
- [AGENTS.md](AGENTS.md): contributor/agent rules; task branches from `develop`, PRs into `develop`, manual merge.

### Development roadmap

All nine implementation stages are complete and integrated into `develop`:

| Stage | Scope                                        |
| ----- | -------------------------------------------- |
| 01    | Bootstrap                                    |
| 02    | Vue Foundation                               |
| 03    | Layout & Sections                            |
| 04    | Projects Catalog                             |
| 05    | Localization & SEO                           |
| 06    | Resume & Interactions                        |
| 07    | Testing & Visual QA                          |
| 08    | Docker & CI/CD Foundation                    |
| 09    | Production Integration & Release preparation |

The v1.1.0 content refresh builds on these completed stages. The original
[release PR #14](https://github.com/DanilFaritovich/project-router/pull/14) is merged.
Release integration follows `develop → main`; merge, tag/GitHub Release and
production operations require separate authorization and are not a tenth implementation stage.

## License

Code and technical documentation use the [MIT License](LICENSE), copyright 2026
Danil Miftakhov. Personal photographs, resume documents and branding, including
materials in design references, follow [ASSETS-LICENSE.md](ASSETS-LICENSE.md).
Replace those assets when reusing the code; public availability grants no right
to reuse personal materials or impersonate the owner.
