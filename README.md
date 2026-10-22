# ProjectRouter

[English](README.md) · [Русский](README.ru.md)

ProjectRouter is Danil Miftakhov's bilingual engineering portfolio: a single place
to review his experience, explore project source code and download a relevant
resume. It also demonstrates a static Vue application with localized HTML,
accessible interactions, automated QA and a verifiable container delivery pipeline.

**Release status:** stages 01–09 are complete and integrated into `develop`.
Project metadata is prepared for the first release, **v1.0.0**; it has not been
released or deployed to production. The existing [release PR #14](https://github.com/DanilFaritovich/project-router/pull/14)
tracks `develop → main`. No public Live Demo is confirmed.

[Desktop screenshot](docs/qa/artifacts/page-en-1440.webp) ·
[Mobile screenshot](docs/qa/artifacts/page-en-390.webp) ·
[PDF viewer](docs/qa/artifacts/pdf-en-1440.webp)

These existing browser captures come from the [Stage 07 QA report](docs/qa/STAGE07-REPORT.md);
they predate its documented spacing follow-up.

## Features

- Seven responsive sections: Hero, About, Skills, Projects, Developer Tools,
  Resume and Contacts; commercial, freelance and personal work are distinguished.
- Typed, Git-managed catalog: three featured projects, three more projects and
  three developer tools, with source links, four explicit release links and four
  locally optimized project screenshots. No runtime catalog service is needed.
- Complete EN/RU copy at `/en/` and `/ru/`. Language switching preserves the
  visible section and query/hash; browser Back/Forward and direct links work.
- Pre-rendered localized HTML, metadata, social previews and origin-dependent
  canonical/hreflang, sitemap and Person/WebSite structured data.
- Six original EN/RU resume PDFs for Backend, AI / LLM and Data / ETL. The lazy
  PDF.js viewer supports independent document language, pages, zoom, fit width,
  download, original-file fallback and loading/error/retry states.
- Keyboard navigation, skip link, mobile menu and modal focus containment/return;
  responsive layouts checked from 320 to 1440px in both languages.

## Architecture

| Choice                      | Purpose                                                              |
| --------------------------- | -------------------------------------------------------------------- |
| Vue 3 + TypeScript + Vite 8 | Typed component UI and a shared development/build toolchain          |
| Tailwind CSS 4              | Shared theme tokens and responsive layouts                           |
| Vue Router + Vue I18n       | URL-driven locale and translated visible/accessibility copy          |
| Vite SSG + Unhead           | Crawlable HTML and metadata before JavaScript, followed by hydration |
| Git-managed content         | Reviewable copy/catalog updates without a backend, database or CMS   |
| Lazy PDF.js + local worker  | Interactive PDFs loaded only when opened, outside SSG execution      |

`src/content/` owns catalog/resume metadata; `src/locales/` owns EN/RU copy.
`src/components/` and `src/views/` compose the UI, `src/router/` owns locale routing,
and `src/seo/` owns metadata. `src/pdf/` and `src/components/resume/` isolate the
client-only viewer. There is no request-time SSR or API layer.

PDF links allow only HTTP(S)/mailto; HTTP(S) opens with `noopener noreferrer`.
PDF scripts/actions are excluded. Canvas and link annotations stay aligned through
page, zoom and resize changes; document/worker resources are disposed on close.
The six source PDFs in `public/resumes/` remain unchanged.

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
mobile menu, all six real PDFs, download bytes, link geometry, focus, retry and
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
These workflows do not deploy, merge PRs, create tags or publish GitHub Releases.

## Limitations and release status

Production deployment, public HTTPS/SEO acceptance, indexing and first
production-eligible digest/signature verification remain pending operator work.
Branch rules and manager admission/runtime acceptance need independent review.
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
- [Changelog](CHANGELOG.md) and [draft v1.0.0 release notes](docs/releases/v1.0.0.md).
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

The existing release PR #14, its separately authorized merge, tag/GitHub Release
and production operations are the release handoff, not a tenth implementation stage.

## License

Code and technical documentation use the [MIT License](LICENSE), copyright 2026
Danil Miftakhov. Personal photographs, resume documents and branding, including
materials in design references, follow [ASSETS-LICENSE.md](ASSETS-LICENSE.md).
Replace those assets when reusing the code; public availability grants no right
to reuse personal materials or impersonate the owner.
