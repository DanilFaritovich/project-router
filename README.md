# ProjectRouter

[English](README.md) · [Русский](README.ru.md)

ProjectRouter is Danil Miftakhov's EN/RU engineering portfolio, with projects,
developer tools, six resume PDFs and contacts. Content is tracked in Git.

## Current state — Stage 08 in development

Stages 01–07 are complete and merged into `develop`. Stage 08 — Docker & CI/CD
Foundation is in development in `feature/production-foundation`; Stage 09 remains
planned. The [QA report](docs/qa/STAGE07-REPORT.md) records Stage 07 evidence and
owner checks. The responsive portfolio uses Vue 3,
TypeScript, Vite, Tailwind CSS, Vue Router and Vue I18n. Vite SSG generates
localized HTML at `/en/` and `/ru/`; `/` goes to `/en/`.

- Seven sections: Hero, About, Skills, Projects, Developer Tools, Resume and Contacts.
- Hero uses the owner's photograph as local optimized WebP images, with localized
  alt text and responsive `srcset`/sizes. About separates commercial experience,
  freelance work and personal engineering projects; Skills has eight groups.
- The catalog contains three Featured Projects, three More Projects and three
  Developer Tools, with verified GitHub destinations and four explicit versioned
  Release links. Four real project screenshots are optimized locally as WebP.
- Desktop section navigation and a mobile menu support EN/RU switching while
  preserving the visible section, query/hash and Back/Forward history; contacts
  link to the owner's social profiles.
- Localized title/description, HTML language, OG/Twitter metadata, self-canonical,
  reciprocal hreflang and x-default, robots/sitemap, and safe Person/WebSite JSON-LD.
  Two local 1200×630 social preview PNGs are included. Absolute site metadata
  requires an explicit HTTPS origin.
- A deterministic AI/agent readability check extracts professional evidence from
  built EN/RU HTML, including all nine source links and honest PDF availability.
  It does not simulate a search engine or guarantee AI recommendations.
- ESLint, Prettier, TypeScript, Vitest, Playwright, SSG/build checks and GitHub
  Actions provide automated quality checks. Original design references are preserved.

Three resume specializations — Backend, AI / LLM and Data / ETL — each include
owner-supplied English and Russian PDFs in `public/resumes/` (six two-page files).
View PDF opens a keyboard-accessible modal with page navigation, zoom, responsive
Fit width, loading/error/retry states, download and an original-file fallback.
Document language starts from the site locale and can then change independently;
preview and download always use the selected document. PDF.js and its local worker
load only when a preview opens.

PDF URL annotations provide clickable personal-site, Email (`mailto:`), WhatsApp,
Telegram, LinkedIn, GitHub and project links. HTTP(S) links open in a new tab with
`noopener noreferrer`; other URL schemes and PDF actions are excluded. Links
follow the rendered page at every scale and support keyboard navigation. Text
selection, search and a full Text Layer are outside this viewer's scope. Original
PDF files and the existing portfolio design are preserved.

No public Live Demo is confirmed or linked. Production deployment has not been
performed; no production origin is configured. Local SEO/readability checks cover
builds with a test origin and without an origin. No backend or database is used.

## Development roadmap

Stages 01–07 are merged. Stage 08 is in development; Stage 09 remains planned. Documentation maintenance is outside this roadmap.

| Stage | Branch                          | Scope                      | Status            |
| ----- | ------------------------------- | -------------------------- | ----------------- |
| 01    | `chore/project-bootstrap`       | Bootstrap                  | Complete / merged |
| 02    | `feature/vue-foundation`        | Vue Foundation             | Complete / merged |
| 03    | `feature/portfolio-layout`      | Layout & Sections          | Complete / merged |
| 04    | `feature/projects-catalog`      | Projects Catalog           | Complete / merged |
| 05    | `feature/i18n-seo`              | Localization & SEO         | Complete / merged |
| 06    | `feature/resume-interactions`   | Resume & Interactions      | Complete / merged |
| 07    | `test/portfolio-quality`        | Testing & Visual QA        | Complete / merged |
| 08    | `feature/production-foundation` | Docker & CI/CD Foundation  | In development    |
| 09    | `feature/caddy-production`      | Caddy & Production Release | Planned           |

After these nine implementation stages, a separate release PR from `develop`
into `main` and the `v1.0.0` tag/release require explicit authorization. This
release handoff is not a tenth implementation stage. Production deployment also
requires separate authorization.

## Development and documentation

Task branches start strictly from `develop`; local commit, push and PR into
`develop` are owner-authorized. Merge remains manual; never force-push.
Requires Node 22.22.2 or a newer Node 22 patch (see `.nvmrc`) and npm.

```sh
npm ci
npm run dev             # local Vite server, /en/ and /ru/
npm run build           # static site in dist/
npm run preview         # inspect the production build locally
make fix                # safe formatting and lint autofix
npm test -- tests/unit/pdf-links.unit.spec.ts tests/integration/resume.integration.spec.ts
make check              # lint, formatting, types, unit/integration
npx playwright install chromium
make verify             # SSG build, HTML checks and browser smoke
make ci                 # check + verify, no repeated checks or source repairs

# Optional SEO validation modes; portfolio.test is reserved for local tests.
VITE_SITE_ORIGIN=https://portfolio.test make verify
VITE_SITE_ORIGIN= npm run build
VITE_SITE_ORIGIN= npm run test:build
VITE_SITE_ORIGIN= npx playwright test tests/e2e/foundation.e2e.spec.ts tests/e2e/localization.e2e.spec.ts
# Focused readability audit of the current dist/ (also part of test:build):
node --test tests/build/readability.test.mjs
```

On Linux, Chromium may need system libraries:
`npx playwright install --with-deps chromium` (CI installs these automatically).
Development flow: `make fix` → targeted tests → `make check`; run `make verify`
when build behavior or user journeys change.

The production domain is undecided. Optionally copy `.env.example` to
`.env.local`, set `VITE_SITE_ORIGIN` to the real HTTPS origin without a path,
and rebuild. Without an origin, canonical, hreflang, `og:url` and sitemap are
omitted, along with OG/Twitter image metadata and JSON-LD; localized HTML,
OG/Twitter text and the permissive robots file still work. Static hosting must serve
`/en/index.html` and `/ru/index.html` directly and return 404 for unknown paths.
The Docker server returns an HTTP redirect at root; plain static preview retains
the HTML meta-refresh. Live SEO checks remain pending. Administrators should require
`Quality and static build` and `Docker build and container smoke` checks in GitHub branch protection; these repository
settings are configured manually.

Implemented locally: static HTML, SEO metadata, crawl artifacts, social images,
JSON-LD and automated checks. See [SEO and readability checks](ARCHITECTURE.md#seo-and-agent-readability-checks)
for the validation boundaries and evidence available to agents.
`llms.txt` is intentionally absent: no concrete consumer or extra information
beyond HTML has been identified. The existing `User-agent: *` / `Allow: /`
permits crawling without new bot-specific rules or a change to training policy.

After deployment, validate public HTTPS and the real `VITE_SITE_ORIGIN`, HTTP
redirects/status codes, direct localized documents, public image previews,
crawler access, actual indexing and Search Console/webmaster ownership/sitemap
submission. None of these production checks has been performed locally.

- [AGENTS.md](AGENTS.md): Codex workflow and project instructions.
- [ARCHITECTURE.md](ARCHITECTURE.md): implemented portfolio, system boundaries, routing and quality.
- [design/DESIGN.md](design/DESIGN.md) and [reference notes](design/reference/README.md): visual specification.
- [.agents/skills/](.agents/skills/) and [standards lock](.codex-standards.lock.yaml): nine complete packages from
  [Codex Development Standards](https://github.com/DanilFaritovich/codex-development-standards),
  `develop`, profile `vue-static-site` v2, using `bootstrap/vue-static-site.md`.
  Docker, CD and backend skills are not installed.

## Docker and GHCR foundation

The multi-stage [Dockerfile](Dockerfile) uses digest-pinned Node 22.22.2 for locked
`npm ci` and Vite SSG, then Nginx Unprivileged on HTTP 8080 as UID/GID 101:101.
Runtime contains static output without Node, Vue sources or build dependencies.
Compose uses a read-only filesystem, disposable tmpfs and dropped capabilities.
There is no persistent storage, HTTPS server or Caddy in this repository.

```sh
make docker-build       # project-router:local, optional VITE_SITE_ORIGIN build arg
make docker-test        # real containers, unset origin + https://portfolio.test
make docker-run         # standalone local Compose, http://127.0.0.1:8080
curl -I http://127.0.0.1:8080/
curl -f http://127.0.0.1:8080/en/ -o /dev/null
make docker-stop
```

Local Compose needs no production network. Override `PROJECT_ROUTER_PORT` for a
busy port or `PROJECT_ROUTER_IMAGE` to test another image/digest. Browser tests
similarly accept `PLAYWRIGHT_PORT` if 4173 is busy. Production [compose.yaml](compose.yaml)
has one service, no published host ports, `restart: unless-stopped`, an image-owned
healthcheck and external `portfolio-proxy` network with alias `project-router`.
The future deployment repository owns that network. Docker health status alone
does not restart a hung container; restart policy handles process exit.

`/` returns HTTP 302 to `/en/`; EN/RU serve their SSG documents. Unknown paths
return HTTP 404 without SPA fallback. PDFs remain unchanged. JS (including PDF.js
`.mjs`), CSS and images have proper MIME types. Fingerprinted assets use immutable
caching; HTML, crawl files and public assets revalidate. Security response headers
include nosniff, frame denial and a referrer policy.

CI keeps existing site checks (`make ci`) then runs workflow validation and
Docker/container tests. PRs publish nothing. Successful trusted pushes call the
reusable GHCR publication workflow: `develop` → `develop-sha-<full SHA>`, `main` →
`main-sha-<full SHA>`, separately authorized `v*` tags → exact version tag. Buildx
uses layer caching, OCI labels and standard provenance; only publish jobs have
`packages: write`, using `GITHUB_TOKEN`. No `latest` tag or production deployment
is created. Deploy by `ghcr.io/danilfaritovich/project-router@sha256:<digest>` from
the publish job's log/summary. PR checks cannot prove the first post-merge GHCR push;
no registry digest is claimed until publication actually succeeds.

`VITE_SITE_ORIGIN` is a build-time HTTPS origin without path, credentials, query
or fragment. An unset value supports local/development builds. Setting it enables
the existing canonical/hreflang, sitemap, JSON-LD and OG/Twitter metadata. Changing
origin requires rebuilding the image. The real domain is undecided; before stable
or release publication the owner must confirm it and set the Actions repository
variable `VITE_SITE_ORIGIN`. No secret or real server setting is added here.

The [deployment contract](docs/deployment/CONTRACT.md) and
[example manifest](docs/deployment/service-manifest.example.yaml) define service
`project-router`, GHCR digest, HTTP 8080, network `portfolio-proxy`, alias
`project-router`, health endpoint `/en/`, stateless storage and no basic site
secrets. The future `portfolio-deployment` controller assigns the domain and
updates containers behind its gateway. SSH/CD, Caddy configuration, reconciliation,
other applications and VPS rollback are outside ProjectRouter. CI validates,
GHCR publishes an artifact, and production deployment remains separate work.

## Repository map

| Path                                | Responsibility                                                 |
| ----------------------------------- | -------------------------------------------------------------- |
| `src/components/`, `src/views/`     | Seven sections, navigation, catalog cards and the resume modal |
| `src/content/`, `src/locales/`      | Typed projects/resumes and EN/RU copy                          |
| `src/pdf/`                          | Lazy PDF.js loading and safe URL annotation rendering          |
| `src/router/`, `src/seo/`           | Localized routing, metadata and structured data                |
| `src/assets/`, `src/styles/`        | Optimized images and shared presentation                       |
| `public/resumes/`, `public/social/` | Original resume PDFs and social previews                       |
| `tests/unit/`, `tests/integration/` | Logic and component behavior                                   |
| `tests/build/`, `tests/e2e/`        | Built HTML/assets and Chromium user journeys                   |
| `.github/workflows/`, `Makefile`    | Read-only CI and local quality commands                        |
| `design/reference/`                 | Preserved canonical designs                                    |

Resume tests inspect the six real PDFs, link destinations and coordinates, EN/RU
and page changes, zoom/Fit width, resize, desktop/mobile layouts, initial overflow,
keyboard behavior, retry and download bytes. External browser destinations are
intercepted; the tests do not establish availability of linked sites. CI installs
locked dependencies and Chromium, then runs `make ci` for PRs to `develop`/`main`
and pushes to those base branches.

## License

Code and technical documentation use the standard [MIT License](LICENSE),
copyright 2026 Danil Miftakhov, permitting modification and commercial reuse.
Personal photographs, resume documents and branding, including materials in
`design/reference/`, follow
[ASSETS-LICENSE.md](ASSETS-LICENSE.md): public availability grants no reuse or
impersonation rights. No copyright is claimed over unprotected facts or ideas.
