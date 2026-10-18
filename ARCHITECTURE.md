# ProjectRouter architecture plan

## Current implementation

Stage 01 provides repository structure, licenses, bilingual documentation,
project instructions, local standards and unmodified design references.
Everything below is a plan for later stages. There is no Vue application,
package manifest, npm installation, Makefile, CI, container or deployment yet.

## Static frontend and boundaries

Use Vue 3 with TypeScript and Vite, Tailwind CSS for design tokens/layout,
Vue Router for explicit localized URLs and Vue I18n for translated UI copy.
The build must generate static HTML/CSS/JavaScript. Choose SSG/prerendering for
public portfolio content and social previews; client hydration adds navigation,
menus and PDF interactions. Select the Vite-compatible prerender integration
in Stage 02 after checking compatibility; no specific package is installed now.
There is no dedicated backend, database or request-time SSR service.

Planned modules (not existing directories):

| Area | Responsibility |
| --- | --- |
| `src/views/` | Portfolio page composition, localized routes |
| `src/components/` | Layout, section headings, project/tool cards, menu, PDF modal |
| `src/composables/` | Small reusable presentation behaviors, modal/viewer lifecycle |
| `src/content/` | Typed Git-tracked catalog of projects, tools and resume metadata |
| `src/locales/` | EN/RU copy with stable keys, including accessible control names |
| `src/router/` | Explicit route-to-locale mapping and equivalent-language navigation |
| `src/seo/` | Shared metadata construction for prerendered localized routes |
| `src/styles/` | Tokens and global styling derived from the design |
| `public/` | Deliberately public, licensed images and configured resume PDFs |
| `tests/` | Unit/component, integration and critical E2E tests |

Content flows from reviewed Git catalog + locale files into prerendered HTML
and Vue components. Browser state owns open menu/modal, active section, zoom
and similar UI state. No global store or API layer is needed initially.
Project links and optional media/PDF sources belong in typed content, not
scattered component literals. Public repository data is not a secrets store.

## Routes, localization and SEO

- `/en/` and `/ru/` are independently loadable, indexable portfolio documents.
  `/` redirects to `/en/` as the default entry; persisted preferences must not
  prevent direct access to either language URL.
- Router URL determines locale. Language switching preserves the equivalent
  page and section when possible. Primary navigation uses real anchor links.
- Prerender separate EN/RU HTML with meaningful section content, localized
  title/description, correct `html[lang]`, self-referencing absolute canonical,
  reciprocal `hreflang` including self, and localized Open Graph metadata.
  Do not canonicalize RU to EN. Use `x-default` only for a real default target.
- Generate sitemap entries for actual indexable canonical routes and suitable
  robots rules. Modal/viewer UI states are not separate indexable pages.
  Unknown paths need a proper 404, not an indexable duplicate with status 200.
- The production domain is undecided. Configure canonical origin when known;
  do not ship placeholder origins or claim live SEO verification now.
- Inspect built HTML without JavaScript, sitemap and link destinations before
  release. Verify HTTPS, redirects and response status against a real deployment
  only when separately authorized. Optional structured data must reflect facts.

## Portfolio content and interactions

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

## Quality and development interface (planned)

Stage 02 adds the package manifest, committed package-manager lock, Makefile
and independent GitHub Actions checks for PRs into `develop` and `main`.
Use ESLint, Prettier, vue-tsc, Vitest/Vue Test Utils and Playwright.

- `make fix`: safe formatting and lint fixes.
- Targeted tests: meaningful changes in catalog behavior, locale mapping,
  conditional actions, menu/modal and viewer states at the smallest useful level.
- `make check`: fast read-only lint/format/type and suitable test validation.
- `make verify`: broader build/SEO/browser checks when warranted.
- `make ci`: independent non-mutating validation of the committed revision,
  including build and selected critical E2E; avoid duplicate aggregate checks.

Critical browser journeys include localized direct entry/switching, mobile
navigation and configured/unavailable PDF behavior. Compare selected browser
screenshots against desktop/mobile references and check keyboard use and RU
wrapping at narrow widths. Do not report tests/build/CI as passed before these
interfaces exist. Stage 01 validates documents, packages, links and Git only.

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
