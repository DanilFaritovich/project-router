# ProjectRouter architecture

## Current implementation

Stages 01–04, Portfolio Content Refinement and Hero Portrait Integration are
implemented and merged into `develop`. The responsive seven-section portfolio
and nine-item catalog use Vue 3, TypeScript, Vite 8, Tailwind CSS 4, Vue Router,
Vue I18n, Vite SSG and Unhead. Desktop/mobile navigation, EN/RU content and the
owner portrait are implemented. Resume controls reflect supplied PDF availability. Stage 05 —
Localization & SEO is implemented in `feature/i18n-seo`, awaiting review/merge
into `develop`. Stage 06 viewer code is prepared pending the owner resume assets;
Stages 07–09 and production delivery remain planned.
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
| `src/seo/`                          | Origin validation, localized head and safe Person/WebSite JSON-LD |
| `src/styles/`                       | Tailwind theme tokens and responsive portfolio styles             |
| `tests/unit/`, `tests/integration/` | Metadata contracts and component/router/i18n behavior             |
| `tests/build/`, `tests/e2e/`        | Actual HTML/asset inspection and production Chromium smoke        |
| `vite.config.ts`                    | SSG routes, root redirect, 404, robots and optional sitemap       |

`src/content/portfolio.ts` holds section identities, social destinations and eight
skill group keys. `src/locales/en.ts` and `src/locales/ru.ts` provide section copy,
professional profile, skill stacks/details, resume labels, project descriptions
and image alternatives; `src/locales/index.ts` creates fresh per-app i18n instances.
`src/content/projects.ts` is the single typed catalog for three
Featured Projects, three More Projects and three Developer Tools, with ordered
technology labels, explicit repository/release URLs and optional local image
metadata. Technology labels are shared metadata. Four
owner-approved source screenshots are optimized WebP assets in
`src/assets/projects/`, imported and fingerprinted by Vite. No runtime or
build-time network request populates the catalog.
`src/composables/useActiveSection.ts` tracks section positions using throttled
scroll/resize updates. Navigation owns mobile dialog state, background inertness,
scroll locking, focus containment, Escape and focus restoration. Locale links
preserve query parameters and the visible section; router scrolling handles
localized direct anchors and history positions. No API layer, global store or
backend is introduced. Portrait and project images use `src/assets/`;
`public/social/` holds the two localized social preview PNGs copied by Vite.
Public configuration and repository data contain no secrets.

## Routes, localization and SEO

These mechanisms passed the Stage 05 local audit. Production SEO has not been
verified and no production deployment has been performed.

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
  OG/Twitter image metadata and JSON-LD are also omitted without origin;
  localized title/description, OG/Twitter text and permissive robots remain.
  No production domain is configured or invented.
- `public/social/portfolio-en.png` and `portfolio-ru.png` are localized 1200×630
  previews with the owner portrait. `design/social/preview.html` and the optional
  `node scripts/render-social.mjs` renderer are their source workflow; builds copy
  committed PNGs and do not require font installation or image regeneration.
- `src/seo/structuredData.ts` emits one safely serialized JSON-LD graph directly
  in each localized HTML when origin exists. Person name/jobTitle/description
  match visible copy; sameAs contains the existing GitHub/LinkedIn profiles.
  WebSite references Person through author. Stable root-scoped `/#person` and
  `/#website` identities represent the same entities in both locales. WebSite.url
  uses the site root, a real default-language redirect entry; Person.url points
  to the localized document. A redirect does not make the site identity invalid,
  so these identifiers were retained. `<` is escaped before script insertion.
- `dist/index.html` provides a no-JavaScript meta-refresh and fallback anchor to
  `/en/`; Vue Router redirects `/` during development. An HTTP redirect is a later
  hosting concern. `dist/404.html` is marked noindex; static hosting must serve it
  with status 404 for unknown paths instead of using a blanket SPA fallback.
  Vite preview is a local smoke server, not the production routing contract.
- Inspect built HTML without JavaScript, sitemap and link destinations before
  release. Verify HTTPS, redirects and response status against a real deployment
  only when separately authorized. Structured data reflects visible facts.

## Portfolio content and interactions

The layout follows [design/DESIGN.md](design/DESIGN.md): Hero, About, Skills,
Projects, Developer Tools, Resume and Contacts. About has an introduction, separate
Commercial Experience, Freelance & Client Work and Personal Engineering Projects
blocks, and a current-focus panel. Skills renders eight groups: Backend & APIs,
Databases & Geospatial, Data Engineering & ML, Automation & Integrations,
Infrastructure & Delivery, Testing & Quality, AI & Developer Workflows, and
Architecture & Interfaces. These describe the owner's experience, not services
or infrastructure running inside ProjectRouter.

The catalog renders three Featured Projects, three More Projects and three
Developer Tools. Four real screenshots occupy the three featured cards and
MaximML; cards without an image or with a failed image remain readable without
an empty media panel. Infrastructure is emphasized among the tools. All nine
cards render both approved paragraphs at every breakpoint. GitHub actions use
the verified repository or development-branch addresses, and only four cards
expose explicit versioned release URLs. External actions open new tabs with
`noopener noreferrer`. No public Live Demo is confirmed or linked.
Three resume roles use `src/content/resumes.ts` for typed specialization metadata,
EN/RU asset paths and build-time availability. Owner-supplied documents belong in
`public/resumes/{backend,ai,data}-{en,ru}.pdf` and are copied unchanged by Vite.
Missing files keep the affected card actions disabled with localized explanation.
The requested resume ZIP and six PDFs were absent during Stage 06 implementation;
real-document acceptance and completion of Stage 06 remain blocked on these assets.

`ResumeSection.vue` loads `components/resume/ResumeModal.vue` asynchronously on
preview. Its client mount calls `src/pdf/loadPdf.ts`, which dynamically imports
PDF.js and the Vite-emitted local worker URL; neither PDF.js nor browser/Canvas
APIs execute during SSG. The native modal dialog provides background inertness;
the component contains Tab focus, handles cancel/Escape, locks body scrolling,
restores the opener and destroys loading/rendering resources on unmount.
Document language initializes from the site locale and then stays independent.
Preview, download and new-tab fallback derive from the same selected asset URL.
Loading, ready and error/retry states accompany single-page canvas rendering,
previous/next, zoom and responsive fit-width controls. The viewport scrolls
independently, including horizontally when deliberately zoomed beyond its width.

Unit/component tests cover mapping, language selection, resource URL alignment,
loading/error/retry, pages/zoom, focus containment/restoration and disposal.
A build test requires all six PDFs and compares source/build bytes. Real-PDF
Chromium scenarios at 320, 390, 768 and 1440px run when all owner files are supplied;
they are explicitly skipped while the archive is missing. This is pending
acceptance, not evidence of successful rendering of the actual resumes.

## Responsive Hero and local image optimization

`HeroSection.vue` imports two local WebP variants from `src/assets/portrait/`:
288×384 and 576×768. The owner's photograph is supplied as optimized local assets;
no image service or runtime transformation is used. Vite fingerprints both files.
The image uses `srcset` with 288w/576w candidates and breakpoint-specific `sizes`,
localized `heroPortraitAlt`, explicit 576×768 dimensions and `fetchpriority="high"`.
CSS uses `object-fit: cover` and a fixed focal position; mobile preserves a 3:4
frame at a width clamped between 240 and 280 pixels, while tablet and desktop
use their layout-specific dimensions. Project screenshots are separately stored
as four optimized WebP files in `src/assets/projects/` and load lazily.

## Quality and development interface

- `make fix`: safe ESLint fixes and Prettier normalization; design assets and
  installed standards are excluded from generic formatting.
- `make check`: read-only ESLint, formatting, vue-tsc and Vitest checks.
- `make verify`: production SSG build, built HTML/asset checks and Playwright
  Chromium smoke; intentionally does not repeat `check`.
- `make ci`: sequential `check` + `verify`, each once. Only generated ignored
  artifacts change. GitHub Actions installs locked dependencies with `npm ci`
  and Chromium, then runs this interface for PRs to `develop`/`main` and base pushes.

Unit and integration tests cover catalog order and exact action URLs, localized
card content and image failures, metadata and optional origin links, both direct
localized entries, root redirection and query/hash-preserving language switching.
They also cover About's three experience blocks, seven sections, unavailable PDF
controls and menu focus/Escape/selection. Localization tests assert the portrait's
EN/RU alt text on entry and after switching languages.
Built HTML checks assert localized copy without JavaScript, all seven sections,
three About blocks, eight skill groups, nine complete catalog cards, four local
screenshots and available actions, plus root fallback, 404 and metadata output.
Production-build Chromium tests cover hydration/refresh, JavaScript-disabled
Russian content, desktop section tracking, mobile menu behavior, keyboard actions,
loaded/failed catalog images and layout without overflow at widths from 320 to
1440 pixels in EN/RU. External popup destinations are intercepted in browser tests;
these checks do not establish live availability or deployment of linked projects.
Stage 07 will expand visual and accessibility coverage. Real-resume browser
acceptance and live-domain verification remain pending. Stage 05 adds built-HTML professional
evidence extraction and a limited accessibility/performance smoke; it does not
replace Stage 07 visual QA or real search-engine testing.
Repository administrators should require the `Quality and static build` CI check
in branch protection; repository settings are not changed by this task.

## Stage 05 validation evidence

Local audit on 2026-10-19, Node 22.22.2; all five earlier commits remain ancestors.

| Step                | Result                                                                                                                                                                                                      |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 — Localization    | Direct EN/RU, refresh/hydration, seven sections, nine cards, labels/alt, nonempty matching translation keys; language switching preserves query/hash and history.                                           |
| 2 — Metadata        | Unique localized title/description and HTML language agree with visible specialization.                                                                                                                     |
| 3 — Indexing        | Self-canonical, reciprocal EN/RU hreflang, x-default to EN, two-page sitemap and permissive robots agree; root/404 HTML are noindex.                                                                        |
| 4 — Social          | Unique OG/Twitter metadata and two intact 1200×630 PNGs, each below 160 kB.                                                                                                                                 |
| 5 — Structured data | One Person/WebSite graph per locale, stable IDs, visible facts/profiles, safe serialization; no graph without origin.                                                                                       |
| 6 — Final audit     | Built-HTML agent evidence check, console checks at all smoke widths, no-JS catalog checks and documentation synchronized. No new runtime defect found; no approved content, design or asset changes needed. |

`make fix` and focused metadata/structured-data/localization tests passed (34 tests).
`make check` passed (62 tests). `VITE_SITE_ORIGIN=https://portfolio.test make verify`
passed 24 built-HTML/asset/readability checks and 19 Chromium scenarios. The same
24 build checks passed after `VITE_SITE_ORIGIN= npm run build`, followed by five
foundation/localization browser scenarios with empty origin. The initial sandbox
blocked the local preview socket; browser validation succeeded outside that
restriction. Test origin is never a production default. Both modes retain useful
EN/RU static text; empty origin emits no site canonical/hreflang/OG URL, social
image metadata, sitemap or JSON-LD. Robots remains `User-agent: *` / `Allow: /`.

The existing layout suite covers EN/RU at 1440, 1024, 768, 390, 375 and 320 px,
including loaded images and horizontal overflow; it now rejects console errors
and warnings at every width. Keyboard menu/focus/Escape, real anchors, semantic
heading order, nonempty image alternatives and explicit image dimensions pass.
Both locales retain seven sections and nine project headings without JavaScript.
An additional no-JavaScript browser smoke verified visible section/project
headings and no overflow at 1440, 1024, 768, 390 and 320 px in both locales.
No extra blocking third-party scripts, stylesheets or fonts are needed; the one
local stylesheet is necessary for presentation.

A single local Chromium sample per locale at 1440/390 px, without throttling,
measured DOMContentLoaded/load at 51–75 ms and FCP at 32–68 ms. Resource timing
reported about 182 kB desktop / 91 kB mobile transferred at initial load and no
external resource requests. These are local preview observations, sensitive to
cache/environment, not production Core Web Vitals or performance guarantees.
Client JS is about 215 kB (76 kB gzip), CSS 19 kB (5 kB gzip); project images are
lazy-loaded and the responsive portrait has explicit dimensions and high priority.

### AI Search & Agent Readability Audit

`tests/build/readability.test.mjs`, automatically included in `npm run test:build`
and `make verify`, parses only generated HTML with the existing JSDOM dependency,
without executing JavaScript or importing source translations/catalogs. It checks
visible body evidence, excludes scripts and explicitly hidden nodes, and verifies
public hrefs. Browser smoke complements this with actual layout behavior. It does
not call an LLM, read private career data, or reproduce ChatGPT Search/Gemini.

All six questions are answerable from either localized document. Route references
below mean both `/en/` and `/ru/` followed by the fragment; no live domain is known.

| Agent question                             | Public HTML evidence and supported answer                                                                                                                                                                                                                              | Limits                                                                                                                                                                     |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Who is Danil Miftakhov; specialization?    | `#hero` name, role and introduction: Python backend, data processing, API integrations and automation; `#skills` provides eight technical groups.                                                                                                                      | Self-published professional profile, not independent credential verification.                                                                                              |
| Commercial Python/PostgreSQL experience?   | `#about` Commercial Experience: Maxim since 2022, Python, PostgreSQL/PostGIS, SQL, address/geospatial processing, imports/exports and diagnostics.                                                                                                                     | No commercial FastAPI/LLM claim, exact employment title or private employer evidence inferred.                                                                             |
| FastAPI, ETL and LLM projects?             | `#project-moon`, `#project-task`, `#project-maxim` demonstrate FastAPI; `#project-geocoder` describes Airflow ETL/PostgreSQL/MinIO; `#project-support` describes validated LLM responses; `#project-worker` describes MCP tooling. Each card includes its source link. | Project evidence does not establish that these technologies were used commercially.                                                                                        |
| Where is source code?                      | All nine named cards in `#projects` / `#tools` have the confirmed repository or development-branch links. The [GitHub profile](https://github.com/DanilFaritovich) is linked in Hero/Contacts.                                                                         | Extraction verifies hrefs against approved destinations; external repository uptime and contents are not re-audited.                                                       |
| How to contact him?                        | `#contacts` explicitly suggests [Telegram](https://t.me/Daniel_De_Casto) or [LinkedIn](https://www.linkedin.com/in/danil-miftakhov-55468b399/); GitHub and Instagram are also public links.                                                                            | No email, phone or other contact information invented; live profile accessibility unverified.                                                                              |
| Commercial versus freelance/personal work? | Three separately titled `#about` blocks distinguish Maxim employment; marketplace/API/scraping client work; personal FastAPI/Airflow/LLM/MCP and developer tools.                                                                                                      | No unsupported assignment of every catalog item to a paid engagement. Resume PDFs remain explicitly unavailable in `#resume`, with six disabled controls and no PDF links. |

The static text and anchors are available to an ordinary HTTP client. Public
localized pages contain no noindex; root and 404 are excluded from the two-page
sitemap. Robots does not block localized documents, images or public assets.
Actual HTTPS fetching, host rules and crawler access require deployment.

Crawler roles were checked against official sources on the audit date:

- [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots):
  `OAI-SearchBot` is for search; `GPTBot` is for model training; `ChatGPT-User`
  performs user-triggered visits and is not the automatic search index crawler.
  Search/training controls are independent; robots may not apply to user visits.
- [Google AI features](https://developers.google.com/search/docs/appearance/ai-features)
  and [Googlebot](https://developers.google.com/search/docs/crawling-indexing/googlebot):
  `Googlebot` controls Search crawling, including AI Search features;
  `Google-Extended` controls separate training/grounding uses, not Search indexing.

Existing wildcard Allow already permits search crawlers; no dedicated User-Agent
blocks were added. Training policy is unchanged, not silently tightened or expanded.
No CDN/CAPTCHA/antibot bypass was attempted. Other bot-specific policies are not
needed for this audit.

No concrete `llms.txt` consumer has been identified for this small portfolio; it
would duplicate the already readable profile and links. It is not a required
Google/ChatGPT Search indexing artifact. [Google's official guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
explicitly says Google Search does not use it. OpenAI's search crawler guidance
requires no such file. Keep it absent unless a concrete future integration needs
it; do not create a parallel professional-content store. This audit establishes
technical extractability, not indexing, rankings or AI recommendations.

After authorized deployment, use the real origin and verify public HTTPS, HTTP
root redirect, localized direct responses and unknown-path 404/noindex, canonical/
hreflang/sitemap/robots at the public host, actual social image fetching/previews,
JSON-LD validation and real search/AI crawler access. Then perform Search Console/
webmaster ownership verification and sitemap submission and observe indexing.
None of these public-environment outcomes is established by local preview.

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
