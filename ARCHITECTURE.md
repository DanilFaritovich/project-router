# ProjectRouter architecture

## Current implementation

Stage 04 adds the approved nine-project catalog to the responsive Stage 03
seven-section portfolio on the Stage 02
Vue 3, TypeScript, Vite 8, Tailwind CSS 4, Vue Router, Vue I18n, Vite SSG and
Unhead foundation. Desktop and mobile navigation, localized layout copy and
unavailable resume controls are implemented. PDF interactions remain planned.
Node 22.22.2 or a newer Node 22 patch and npm are required. Dependencies are
pinned in `package.json` with a committed `package-lock.json`.

## Static frontend and boundaries

[Vite SSG](https://github.com/antfu-collective/vite-ssg) integrates the existing
Vue Router with build-time Vue rendering and Unhead metadata. `npm run build`
generates `dist/en/index.html` and `dist/ru/index.html`, with nested route output.
The browser hydrates that HTML; no request-time SSR, backend or database is used.
This keeps the foundation close to Vue + Vite without a second routing framework.

| Existing area                       | Responsibility                                                    |
| ----------------------------------- | ----------------------------------------------------------------- |
| `src/main.ts`, `src/App.vue`        | Per-app i18n, locale guard, hydration, reactive document head     |
| `src/views/`                        | Seven-section portfolio composition                               |
| `src/components/`                   | Section/card/action primitives, navigation and section components |
| `src/locales/`                      | Typed EN/RU copy, locale paths, fresh i18n instances              |
| `src/router/`                       | Explicit routes and URL-driven locale guard                       |
| `src/seo/`                          | Origin validation and localized head construction                 |
| `src/styles/`                       | Tailwind theme tokens and responsive portfolio styles             |
| `tests/unit/`, `tests/integration/` | Metadata contracts and component/router/i18n behavior             |
| `tests/build/`, `tests/e2e/`        | Actual HTML/asset inspection and production Chromium smoke        |
| `vite.config.ts`                    | SSG routes, root redirect, 404, robots and optional sitemap       |

`src/content/portfolio.ts` holds section identities, social destinations and skill
group keys. `src/content/projects.ts` is the single typed catalog for three
Featured Projects, three More Projects and three Developer Tools, with ordered
technology labels, explicit repository/release URLs and optional local image
metadata. Project titles, both description paragraphs and image alternatives
come from EN/RU locale files; technology labels are shared metadata. Four
owner-approved source screenshots are optimized WebP assets in
`src/assets/projects/`, imported and fingerprinted by Vite. No runtime or
build-time network request populates the catalog.
`src/composables/useActiveSection.ts` tracks section positions using throttled
scroll/resize updates. Navigation owns mobile dialog state, background inertness,
scroll locking, focus containment, Escape and focus restoration. Locale links
preserve query parameters and the visible section; router scrolling handles
localized direct anchors and history positions. No API layer, store or backend
is introduced. Project screenshots use `src/assets/`; no `public/` directory is needed.
Public configuration and repository data contain no secrets.

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

## Portfolio content and interactions

The layout follows [design/DESIGN.md](design/DESIGN.md): Hero, About, Skills,
Projects, Developer Tools, Resume and Contacts. Featured Projects retain the
MC/AI/ETL typography previews as fallbacks for missing or failed images; real
screenshots occupy their existing preview panels. More Projects and tools keep
compact cards, with an optional MaximML screenshot and Infrastructure emphasized.
All nine cards render both approved paragraphs at every breakpoint. GitHub
actions use the approved repository or development-branch addresses, and only
four cards expose explicit versioned release URLs. External actions open new
tabs with `noopener noreferrer`; no Live Demo actions are supplied.
Three resume roles expose disabled preview and
download controls with a shared unavailable explanation; no PDF modal or viewer
is implemented in Stage 03.

Stage 06 will use PDF.js for configured resume PDF preview, loaded lazily when needed. Keep
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
expand visual and accessibility coverage. Stage 03 adds component/integration
coverage for the seven sections, menu focus/Escape/selection, locale switching,
unavailable controls and fractional anchor positions; production Chromium checks
cover desktop section tracking and mobile navigation. Built HTML checks assert
all seven sections and nine catalog cards in both languages without JavaScript,
including complete descriptions, local images and available actions. Stage 04
adds catalog contracts, localized card/image-failure tests and production browser
checks for loaded images, readable mobile cards and keyboard action navigation.
Manual browser QA compared selected renders with PNG references at 1440, 1024,
768, 390 and 320 pixels in EN/RU, including the narrow mobile menu and overflow.
No PDF viewer tests or live-domain verification are claimed.
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
