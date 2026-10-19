# ProjectRouter architecture

## Current implementation

Stages 01–05 are complete and merged into `develop`, including content refinement,
Hero Portrait Integration and Localization & SEO. The responsive seven-section
portfolio and nine-item catalog use Vue 3, TypeScript, Vite 8, Tailwind CSS 4,
Vue Router, Vue I18n, Vite SSG and Unhead. Stage 06 — Resume & Interactions is
implemented in `feature/resume-interactions`, [PR #10](https://github.com/DanilFaritovich/project-router/pull/10),
awaiting review/merge. It adds six owner-supplied PDFs and a client-only PDF.js
viewer with clickable links. Stages 07–09 and production delivery remain planned.
Node 22.22.2 or a newer Node 22 patch and npm are required. Dependencies are
pinned in `package.json` with a committed `package-lock.json`.

## Static frontend and boundaries

[Vite SSG](https://github.com/antfu-collective/vite-ssg) integrates the existing
Vue Router with build-time Vue rendering and Unhead metadata. `npm run build`
generates `dist/en/index.html` and `dist/ru/index.html`, with nested route output.
The browser hydrates that HTML; no request-time SSR, backend or database is used.
This keeps the foundation close to Vue + Vite without a second routing framework.

| Existing area                       | Responsibility                                                         |
| ----------------------------------- | ---------------------------------------------------------------------- |
| `src/main.ts`, `src/App.vue`        | Per-app i18n, locale guard, hydration, reactive document head          |
| `src/views/`                        | Seven-section portfolio composition                                    |
| `src/components/`                   | Section/card/action primitives, navigation and section components      |
| `src/locales/`                      | Typed EN/RU copy, locale paths, fresh i18n instances                   |
| `src/router/`                       | Explicit routes and URL-driven locale guard                            |
| `src/seo/`                          | Origin validation, localized head and safe Person/WebSite JSON-LD      |
| `src/pdf/`                          | Lazy document/worker loading and safe PDF URL annotations              |
| `public/resumes/`                   | Six unchanged two-page EN/RU PDFs for Backend, AI / LLM and Data / ETL |
| `src/styles/`                       | Tailwind theme tokens and responsive portfolio styles                  |
| `tests/unit/`, `tests/integration/` | Metadata contracts and component/router/i18n behavior                  |
| `tests/build/`, `tests/e2e/`        | Actual HTML/asset inspection and production Chromium smoke             |
| `vite.config.ts`                    | SSG routes, root redirect, 404, robots and optional sitemap            |

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
All six original, two-page A4 PDFs are included. Their bytes match the supplied
archive; the archive itself is excluded from Git.

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

`src/pdf/linkAnnotations.ts` dynamically imports the installed PDF.js 6.4
`AnnotationLayer` and reads the current page's display annotations. Only visible
Link annotations with absolute `http:`, `https:` or `mailto:` URLs pass the allowlist.
`AnnotationLayer.addLinkAnnotations` creates native anchors; no scripting manager,
forms, attachments or PDF actions are enabled. The minimal link service sets an
accessible URL label and opens HTTP(S) in a new tab with `noopener noreferrer`.
This supports the personal-site, Email, WhatsApp, Telegram, LinkedIn, GitHub and
project URLs embedded in the documents without inventing destinations. A URL
printed inside an owner-supplied PDF is not a configured production site origin.

Canvas and annotations share one positioned page wrapper. The layer uses the
same CSS-pixel viewport as Canvas, cloned with `dontFlip: true` as required by
PDF.js annotations; bitmap device-pixel scaling affects only Canvas resolution.
PDF.js owns annotation rectangles; the modal supplies scoped positioning and a
visible keyboard focus outline without importing the full PDF viewer UI/styles.
The layer is rebuilt after page/zoom/fit-width/automatic-resize changes and
published only when Canvas and links for the current render are ready.
Manual zoom survives resize; both layers remain aligned in the scrolling wrapper.

Every rerender/document switch removes old anchors and calls the layer's
`destroy()`. If a removed link held focus, focus moves to the document viewport
inside the dialog. Generation guards destroy late asynchronous layers instead of
attaching stale links. Closing disconnects resize observation, cancels rendering,
destroys document loading/worker resources, removes the annotation layer and
restores the opener. Native links participate in the dialog's Tab order, with
hidden page content excluded. There is no full Text Layer, search or text selection.

Unit/component tests cover mapping, language selection, resource URL alignment,
loading/error/retry, pages/zoom, focus containment/restoration and disposal.
A build test requires all six PDFs and compares source/build bytes. Mandatory
Chromium scenarios render all six real documents, verify nonempty canvases,
page navigation, selected-file download bytes, error/retry and keyboard focus.
Real-PDF link checks independently parse each original page, compare all anchor
URLs and rectangles against its PDF viewport, and check geometry after EN/RU,
page, zoom, fit-width and resize changes. Actual pointer/Enter activation is
intercepted on mobile/desktop; no third-party site is contacted. Unit tests use
the installed AnnotationLayer with safe/unsafe annotations and verify URL policy,
accessible anchors and destruction; component tests cover stale asynchronous
layers and focus during removal.
Responsive checks at 320, 390, 768 and 1440px assert no page/dialog overflow and
no document overflow in fit-width mode; 390px and 1440px screenshots are saved
as ignored Playwright artifacts for visual inspection.

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
They also cover About's three experience blocks, seven sections, PDF availability
and viewer states, plus menu focus/Escape/selection. Localization tests assert the portrait's
EN/RU alt text on entry and after switching languages.
Built HTML checks assert localized copy without JavaScript, all seven sections,
three About blocks, eight skill groups, nine complete catalog cards, four local
screenshots and available actions, plus root fallback, 404 and metadata output.
Production-build Chromium tests cover hydration/refresh, JavaScript-disabled
Russian content, desktop section tracking, mobile menu behavior, keyboard actions,
loaded/failed catalog images and layout without overflow at widths from 320 to
1440 pixels in EN/RU. External popup destinations are intercepted in browser tests;
these checks do not establish live availability or deployment of linked projects.
Stage 07 will expand visual and accessibility coverage. Live-domain verification
remains pending. Stage 05 adds built-HTML professional
evidence extraction and a limited accessibility/performance smoke; it does not
replace Stage 07 visual QA or real search-engine testing.
Repository administrators should require the `Quality and static build` CI check
in branch protection; repository settings are not changed by this task.

## SEO and agent readability checks

The completed Stage 05 implementation is validated by metadata/localization unit
and integration tests, built-HTML tests and Chromium smoke. Tests support both an
explicit test HTTPS origin and an empty origin; test values are never production
defaults. The generated `/en/` and `/ru/` documents expose their full localized
content without JavaScript. Root fallback and 404 output are noindex; localized
pages remain indexable. Social previews are two committed 1200×630 PNGs.

`tests/build/readability.test.mjs`, included in `make verify`, parses generated
HTML with JSDOM without executing JavaScript or importing source catalogs. It
checks visible professional evidence, all nine source links and resume actions,
excluding scripts and explicitly hidden nodes. It does not call an LLM or
establish search indexing, rankings or AI recommendations.

| Reader question                                  | Visible evidence in both localized documents                                                      |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| Who is the owner and what is his specialization? | Hero introduction and eight Skills groups                                                         |
| What is his commercial experience?               | About: Maxim since 2022, Python, PostgreSQL/PostGIS, SQL and geospatial/data processing           |
| Where are FastAPI, ETL and LLM examples?         | The project catalog describes the relevant technologies and links to source                       |
| Where is the source code?                        | All nine Projects/Developer Tools cards and the GitHub profile                                    |
| How can he be contacted?                         | Contacts links to the approved social profiles, including Telegram and LinkedIn                   |
| How does paid work differ from personal work?    | Separate About blocks for commercial, freelance/client and personal engineering work              |
| Where are resumes?                               | Three specialization cards with EN/RU-selected preview/download actions and six public PDF assets |

These checks establish extractability of self-published facts, not independent
credential verification or live availability of external links. The viewer reads
only the current PDF page when opened; resume content is not duplicated in a
parallel professional-content store.

`User-agent: *` / `Allow: /` permits crawling. Search/training bot-specific policy
is unchanged. No concrete consumer for `llms.txt` has been identified, so it is
intentionally absent. Stage 07 will expand visual/accessibility QA. Local smoke
results are not production Core Web Vitals or performance guarantees.

After authorized deployment, verify public HTTPS and the real origin, root HTTP
redirect, localized direct responses and unknown-path 404/noindex, canonical/
hreflang/sitemap/robots, fetched social previews, structured data and crawler
access. Search Console/webmaster ownership, sitemap submission and actual
indexing require the public environment; none is established by local preview.

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
