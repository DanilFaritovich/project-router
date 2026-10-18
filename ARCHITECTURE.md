# ProjectRouter architecture

## Current implementation

Stage 02 implements Vue 3, TypeScript, Vite 8, Tailwind CSS 4, Vue Router,
Vue I18n, Vite SSG and Unhead. A minimal localized page and language navigation
are implemented; portfolio design/content and PDF interactions remain planned.
Node 22.22.2 or a newer Node 22 patch and npm are required. Dependencies are
pinned in `package.json` with a committed `package-lock.json`.

## Static frontend and boundaries

[Vite SSG](https://github.com/antfu-collective/vite-ssg) integrates the existing
Vue Router with build-time Vue rendering and Unhead metadata. `npm run build`
generates `dist/en/index.html` and `dist/ru/index.html`, with nested route output.
The browser hydrates that HTML; no request-time SSR, backend or database is used.
This keeps the foundation close to Vue + Vite without a second routing framework.

| Existing area                       | Responsibility                                                |
| ----------------------------------- | ------------------------------------------------------------- |
| `src/main.ts`, `src/App.vue`        | Per-app i18n, locale guard, hydration, reactive document head |
| `src/views/`                        | Minimal localized foundation page                             |
| `src/components/`                   | Accessible language navigation with real links                |
| `src/locales/`                      | Typed EN/RU copy, locale paths, fresh i18n instances          |
| `src/router/`                       | Explicit routes and URL-driven locale guard                   |
| `src/seo/`                          | Origin validation and localized head construction             |
| `src/styles/`                       | Tailwind import and minimal global styles                     |
| `tests/unit/`, `tests/integration/` | Metadata contracts and component/router/i18n behavior         |
| `tests/build/`, `tests/e2e/`        | Actual HTML/asset inspection and production Chromium smoke    |
| `vite.config.ts`                    | SSG routes, root redirect, 404, robots and optional sitemap   |

`src/content/`, `src/composables/` and `public/` will be introduced when real
content, reusable behavior and licensed assets need them. No empty feature
modules, API layer or store are introduced. Later content will flow from reviewed
Git catalogs and locale files into HTML and components; local state will own
presentation interactions. Public configuration and repository data contain no secrets.

## Routes, localization and SEO

- `/en/` and `/ru/` are independently loadable, indexable portfolio documents.
  `/` redirects to `/en/` as the default entry; persisted preferences must not
  prevent direct access to either language URL.
- Router URL determines locale. Language switching preserves the equivalent
  page and section when possible. Primary navigation uses real anchor links.
- Both HTML files contain localized visible copy, title/description, `html[lang]`
  and Open Graph title/description/type/locale before JavaScript executes.
- Optional `VITE_SITE_ORIGIN` accepts an HTTPS origin without credentials, path,
  query or fragment. It enables self-referencing canonical, reciprocal EN/RU
  hreflang, `x-default` to `/en/`, Open Graph URL, sitemap and robots sitemap link.
  Without it, origin-dependent metadata and sitemap are deliberately omitted.
  No domain or preview image is invented; real social images remain future work.
- `dist/index.html` provides a no-JavaScript meta-refresh and fallback anchor to
  `/en/`; Vue Router redirects `/` during development. An HTTP redirect is a later
  hosting concern. `dist/404.html` is marked noindex; static hosting must serve it
  with status 404 for unknown paths instead of using a blanket SPA fallback.
  Vite preview is a local smoke server, not the production routing contract.
- Inspect built HTML without JavaScript, sitemap and link destinations before
  release. Verify HTTPS, redirects and response status against a real deployment
  only when separately authorized. Optional structured data must reflect facts.

## Portfolio content and interactions (planned)

Follow [design/DESIGN.md](design/DESIGN.md): seven sections, three Featured
Projects, More Projects, Developer Tools, EN/RU, conditional Live Demo and a PDF
modal. GitHub links are required for catalog entries; stable release and demo
links appear only when real destinations have been verified. Optional media
must degrade to an intentional text-first card.

Use PDF.js for configured resume PDF preview, loaded lazily when needed. Keep
PDF asset metadata separate from the viewer. Track unavailable, loading, ready
and error states, with retry, page/zoom/fit controls where appropriate and a
direct download of the same configured document. Do not synthesize resume files
from mockups. The current reference package supplies no actual PDFs.
The modal must support keyboard focus containment, Escape, focus restoration,
accessible names and responsive usable controls. Release viewer resources on
close. A missing PDF keeps preview/download unavailable with explanatory copy.

## Quality and development interface

- `make fix`: safe ESLint fixes and Prettier normalization; design assets and
  installed standards are excluded from generic formatting.
- `make check`: read-only ESLint, formatting, vue-tsc and Vitest checks.
- `make verify`: production SSG build, built HTML/asset checks and Playwright
  Chromium smoke; intentionally does not repeat `check`.
- `make ci`: sequential `check` + `verify`, each once. Only generated ignored
  artifacts change. GitHub Actions installs locked dependencies with `npm ci`
  and Chromium, then runs this interface for PRs to `develop`/`main` and base pushes.

Tests cover both direct localized entries, root redirection, query/hash-preserving
language switching, head metadata, optional origin links, build HTML without JS,
assets, root fallback and browser hydration/refresh/navigation. Stage 07 will
expand coverage to actual portfolio interactions and visual QA. No design
screenshots, PDF viewer tests or live-domain verification are claimed yet.
Repository administrators should require the `Quality and static build` CI check
in branch protection; repository settings are not changed by this task.

## Delivery boundaries (later)

The nine-stage [README roadmap](README.md) defines implementation order. Initial
quality tooling and CI start in Stage 02; Stage 07 expands testing and visual QA.
Stage 08 covers Docker and production CI/CD foundations; Stage 09 covers Caddy
and production release readiness. These are planned stages, not authorization
to deploy. After them, a separate `develop` → `main` release PR and the `v1.0.0`
tag/release require explicit authorization, outside the nine implementation stages.

The future pipeline may package static output in Docker, publish immutable
images to GHCR and serve it through Caddy with HTTPS and direct localized routes.
Public requests go to static assets; there is no application server or database.
Actual deployment topology, secrets and production host are intentionally unset.
Install Docker/CD skills and configure packaging only when that work is requested.
Production deployment requires separate authorization and validated revisions.

Task flow: branch strictly from `develop` → local commit → push → PR to
`develop` → manual review/merge. `main` is the stable branch. Stage 01's initial
commit is the one-time repository initialization; subsequent work uses PRs.
