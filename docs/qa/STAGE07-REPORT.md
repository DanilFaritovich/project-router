# Stage 07 — Testing & Visual QA

## Configuration and evidence

Audit date: 2026-10-19. Repository: `DanilFaritovich/project-router`.
Base: [`127bf3e`](https://github.com/DanilFaritovich/project-router/commit/127bf3e)
(current `origin/develop`, Stage 06 merged). Branch: `test/portfolio-quality`.
Validated application/test revision:
[`2bec1d37e8a0c9e5117602e4c9ddcb70d00a7851`](https://github.com/DanilFaritovich/project-router/commit/2bec1d37e8a0c9e5117602e4c9ddcb70d00a7851).
Subsequent changes document the audit, add review images and include the spacing
follow-up below.

Owner-review follow-up (2026-10-20): reduced only Projects bottom padding from
140px to 90px (mobile: 100px to 60px). The gap from Avito Parser to Tools content
is now 139px instead of 189px (mobile: 109px instead of 149px), a 26.5–26.8%
reduction. EN/RU screenshots and geometry were checked at 320, 390, 768, 1024 and
1440px: divider retained, other section dimensions unchanged, no overlaps or
horizontal overflow. `make check` (94 tests) and `make verify` (25 build and 46
Chromium tests) passed. Committed review images below predate this cosmetic fix.

Linux x64, Node 22.22.2, npm 10.9.7, Playwright 1.64.1,
Chromium 156.0.8078.4, Vue 3.5.44, PDF.js 6.4.299,
axe-core Playwright integration 4.14.0. Dependencies installed with `npm ci`.
The shell initially selected Node 22.22.1; all reported validation used 22.22.2.
Production SSG output served with Vite preview, not the development server.
No production origin, deployment, account messaging or release was performed.

Evidence types are distinct: automated assertions, agent inspection of actual
Chromium screenshots, exploratory keyboard actions, and owner acceptance below.
Screenshot generation alone is not counted as visual review. This is not a
WCAG certification or a production performance/SEO sign-off.

## Viewport × locale matrix

Height was 900px, with an additional 320×615 mobile keyboard/menu scenario.
Every cell includes automated layout/content checks, axe page/PDF scans and
actual inspection of browser screenshots. Mobile cells also include menu scans.
The changed 1024px layout was inspected again after the fix.

| Width | EN       | RU       | Navigation / PDF                                    |
| ----- | -------- | -------- | --------------------------------------------------- |
| 320   | Reviewed | Reviewed | Mobile menu, wrapped toolbar, fit width             |
| 390   | Reviewed | Reviewed | Mobile menu, wrapped toolbar, fit width             |
| 768   | Reviewed | Reviewed | Desktop rail, stacked section headings, PDF         |
| 1024  | Reviewed | Reviewed | Desktop rail; heading overlap fixed and re-reviewed |
| 1440  | Reviewed | Reviewed | Desktop composition, 125% initial PDF zoom          |

No unexplained page/dialog overflow or intersecting section headings remains.
Intentional horizontal scrolling after manual PDF zoom is supported.

## Scenarios and coverage

Existing unit/component/build/browser coverage was retained. Additions focus on
heading overlap, automated accessibility, missing PDF cases and actual races.

| Area                 | Checked behavior                                                                           | Evidence / outcome                                                      |
| -------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| Hero                 | Portrait/alt, headings, Projects/Resume/Contact, GitHub/LinkedIn                           | Browser, keyboard and visual: pass                                      |
| About                | Introduction, commercial/freelance/personal blocks and current focus                       | Static HTML, integration, visual: pass                                  |
| Skills               | All eight groups, EN/RU copy and responsive wrapping                                       | Static HTML, browser geometry, visual: pass                             |
| Projects             | Three featured + three more, four real images, complete copy/stack, one/two-action cards   | Unit/build/browser and visual: pass                                     |
| Tools                | Three tools, infrastructure emphasis, source/release actions                               | Unit/build/browser and visual: pass                                     |
| Resume               | Three roles, six original two-page files, controls and selected-file actions               | Real PDF browser tests and visual samples: pass                         |
| Contacts             | Email, WhatsApp, Telegram, LinkedIn, GitHub, Instagram                                     | Exact URL assertions, intercepted HTTP(S) popups, keyboard/visual: pass |
| Localized entry      | `/`, `/en/`, `/ru/`, refresh, no-JS localized HTML                                         | Build and Chromium: pass                                                |
| Navigation           | Seven links, direct anchors, visible-section tracking and contact focus                    | Browser: pass                                                           |
| Language/history     | EN → RU → EN, every section, repeated query values, hash, Back/Forward                     | Existing production browser journeys: pass                              |
| Mobile menu          | Open/close, Escape, Tab/Shift+Tab containment, focus return, selection, language, resize   | Existing journeys + five-cycle/resize regression: pass                  |
| PDF races            | Close with response pending, reopen, delayed RU response superseded by EN, repeated resize | Gated real requests + three repeated runs: pass                         |
| PDF failure          | Failed request, localized error, original fallback, Retry                                  | Intercepted failure then real file: pass                                |
| Keyboard exploration | Skip link → main, Hero actions, PDF Enter/Tab/Escape, restored opener                      | Separate exploratory browser session at 390/1440: pass                  |

HTTP(S) popups are intercepted in tests and preserve the portfolio tab; opener
is null. Email activation is intercepted/prevented where exercised. No message
was sent and no social-account session was opened. GitHub's read-only API
confirmed all nine configured repository/branch destinations and all four exact
release tags: Moon v1.0.0, Geocoder v1.2.0, MaximML v1.0.0 and Infrastructure
v1.0.0. External availability is a point-in-time observation. Social destinations
were checked for configured URL and opening behavior, not account ownership or
successful delivery. No Live Demo action is configured.

## Defects and fixes

| ID    | Priority              | Finding                                                                                                                                                 | Status                                                                                                                                                                                                         |
| ----- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| QA-01 | P1                    | At 1024px the RU Tools heading extends beyond its 164px column and is covered by the first card. Document overflow tests passed despite hidden letters. | Fixed: use the existing stacked heading/content layout throughout 768–1199px. Text-range intersection regression reproduced failure on baseline and passes after rebuilding. Desktop/mobile styling preserved. |
| QA-02 | P1 (test reliability) | Baseline real-PDF external activation timed out waiting for a GitHub popup because the string glob did not reliably intercept the external navigation.  | Fixed: use the existing suite's HTTP(S) regular-expression routing pattern. Six-document scenario passed three subsequent repetitions. No application navigation workaround or longer timeout.                 |
| QA-03 | Review observation    | axe reports undersized PDF annotation links at 320/390px. Rectangles correspond to inline text in unchanged PDFs.                                       | WCAG 2.5.8 inline-link exception applies. Only `target-size` findings on actual PDF link anchors are excluded; all other nodes/rules remain checked. Enlargement would overlap neighboring links.              |

No P0 or unresolved confirmed P1 product defect was found. No source PDF was
changed. Byte-equality build checks and downloaded-byte checks remain passing.

Fix commits:

- [`6ba730e`](https://github.com/DanilFaritovich/project-router/commit/6ba730e): tablet fix, overlap regression and axe matrix.
- [`2bec1d3`](https://github.com/DanilFaritovich/project-router/commit/2bec1d3): PDF network isolation, all-six controls/download/original activation, delayed-response and menu/resize tests.

## Automated validation

| Run                                                     | Result                                                               |
| ------------------------------------------------------- | -------------------------------------------------------------------- |
| Baseline `make fix` → `make check`                      | Passed; 94 Vitest tests                                              |
| Baseline `make verify`                                  | 25 build tests passed; 31/32 Chromium tests passed; QA-02 identified |
| Final `make fix` → `make check`                         | Passed: ESLint, Prettier, vue-tsc, 94 Vitest tests                   |
| Final `make verify`                                     | Passed: SSG build, 25 build tests, 46 Chromium tests                 |
| New race scenarios, `--repeat-each=3`                   | 9/9 passed                                                           |
| All-six PDFs and 1024px PDF scenario, `--repeat-each=3` | 6/6 passed                                                           |
| Test-origin SSG build + build tests                     | 25/25 passed with temporary `https://qa.invalid`                     |
| Test-origin Chromium metadata/no-JS scenarios           | 2/2 passed                                                           |

No arbitrary sleeps, increased timeouts or real external dependencies were added.
Delayed requests use explicit promise gates and UI state assertions. GitHub
Actions independently passed read-only `make ci` and the clean-source guard at
`158cf99` ([run 39320158336](https://github.com/DanilFaritovich/project-router/actions/runs/39320158336)).
[PR #11](https://github.com/DanilFaritovich/project-router/pull/11) targets `develop`.
This evidence update changes documentation only; consult its
[branch checks](https://github.com/DanilFaritovich/project-router/actions?query=branch%3Atest%2Fportfolio-quality)
for the final documentation commit. Merge remains manual.

## Visual review and artifacts

Actual full-page screenshots for all ten combinations were inspected against
`design/reference/Previews/Desktop FINAL.png`, `Mobile FINAL.png` and the menu
references. Long tablet headings received additional inspection at readable
scale. Warm background, amber accents, white cards, navigation hierarchy,
section order and infrastructure emphasis remain intact. Real portrait/images,
expanded approved copy and available PDFs explain differences from older
placeholder/unavailable-document references. No pixel-perfect claim is made.

Reviewed PDF states include initial rendering, toolbar wrapping, disabled page
controls, fit width, zoom, keyboard focus and error. All six documents' two
pages were also captured for direct visual inspection. Geometry tests separately
compare every link rectangle against the original document at rendered scale,
including page/language/zoom/resize changes. Invisible or stale annotation
layers are not retained after rerender/close.

Eight optimized WebP artifacts (about 1.6 MB total), with original capture widths:

| Capture                   | EN                                    | RU                                            |
| ------------------------- | ------------------------------------- | --------------------------------------------- |
| Desktop full page, 1440px | [EN](artifacts/page-en-1440.webp)     | [RU](artifacts/page-ru-1440.webp)             |
| Mobile full page, 390px   | [EN](artifacts/page-en-390.webp)      | [RU](artifacts/page-ru-390.webp)              |
| PDF modal                 | [Desktop](artifacts/pdf-en-1440.webp) | [Mobile](artifacts/pdf-ru-390.webp)           |
| Mobile menu               | —                                     | [320px](artifacts/menu-ru-320.webp)           |
| Fixed tablet Tools        | —                                     | [1024px](artifacts/tablet-tools-ru-1024.webp) |

The full generated matrix stays ignored in `test-results/`. Reproduce with
`make verify`; screenshot files are overwritten by subsequent Playwright runs.
Committed artifacts do not duplicate canonical design assets.

Cosmetic suggestions for future owner review, not changes in this stage:
consider the long RU mobile Hero role line breaks and the generous Projects →
Tools spacing. Both remain readable and consistent with the established design.
Real project previews contain small text; their purpose is an overview, not
reading application content at mobile size.

## Accessibility

axe scans use WCAG 2 A/AA, 2.1 AA and 2.2 AA tags: ten pages, ten ready PDF
modals and four mobile menus. No non-exempt violations remained, including
contrast and accessible-name checks. The inline PDF target-size exception is
explicit and narrow, following the [W3C explanation of SC 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html). Automated results do not prove all WCAG criteria.

Semantic sections, single H1, ordered headings, image alternatives, link/button
names, ARIA selection/expanded states, visible focus, skip navigation, keyboard
order and modal/menu containment were checked using static tests, Chromium
assertions and exploratory keyboard actions. Focus-ring screenshots were
inspected. Active navigation/language states, hovered links/actions and disabled
PDF controls retain clear states; controls wrap within narrow dialogs.

Assistive-technology acceptance remains with the owner: no NVDA/VoiceOver or
physical touch-device session was performed. The PDF viewer provides a named
canvas and native link annotations, but no full text layer/search/selection;
reading PDF prose with a screen reader inside the canvas is not supported.
The original-file link and readable HTML profile remain available. Original PDF
accessibility tagging was not certified or modified.

## SEO, SSG and technical quality

Both localized documents contain real copy and localized title, description,
HTML language and OG/Twitter text before JavaScript. Root fallback and noindex
404 output are present. Direct navigation, hydration, refresh and no-JS copy
passed. Browser matrix detected no application exceptions or local HTTP errors;
existing console warning/error assertions passed. Loaded images decode and
preserve their expected proportions; failed-image fallback remains covered.

Default build intentionally omits canonical, hreflang, absolute OG/Twitter image
URLs, JSON-LD and sitemap when the production origin is unknown. `robots.txt`
allows crawling without inventing a sitemap destination. An additional actual
SSG build with **test-only** `https://qa.invalid` passed built-HTML and browser
checks for self-canonical, reciprocal EN/RU/x-default, social URLs, Person/WebSite
JSON-LD, sitemap and robots sitemap reference. It was discarded/restored to the
unconfigured build; no test domain was written to project configuration.

Main application JS: approximately 225.15 kB raw / 79.91 kB gzip. Lazy modal:
7.58 / 3.19 kB; PDF.js: 430.23 / 129.30 kB; local worker: 1,264.34 kB raw.
A browser request check confirms PDF.js/worker are absent before preview opens.
Actual PDFs load only through the client viewer; SSG does not execute browser
Canvas/worker APIs. Build tests compare original and copied PDF bytes.

Separate local 390/1440px exploratory sessions observed no unexpected layout
shift (sum of layout-shift entries without recent input: 0). This is a short,
unthrottled local observation, not a field CWV measurement. Lighthouse was not
run; no Lighthouse category scores, production performance or CWV pass is claimed.

## Limits and production-only acceptance

Chromium/Linux was exercised; Firefox, Safari/iOS, real touch devices, OS mail
handlers and native browser PDF readers need owner checks. Original-PDF popup
navigation is intercepted to assert destination and safe opening; actual PDF
bytes are tested independently. No screenshots constitute human approval.

After explicitly authorized deployment, verify real HTTPS/certificates, HTTP
redirects, direct locale responses and unknown-path HTTP 404, cache/compression,
security headers/CSP, real-origin metadata and fetched social previews. Vite
preview's fallback behavior is not the Caddy routing contract. Search-console
ownership, crawler access/indexing, real CWV and deployed external destinations
cannot be established by this local audit. Docker/GHCR/Caddy are Stage 08–09.

## Manual QA Checklist

Run with Node 22.22.2+ (22.x):

```sh
npm ci
npm run build
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

Open `http://127.0.0.1:4173/en/` and `/ru/`.

- [ ] Read all seven sections in EN/RU at mobile and desktop sizes; inspect 1024px Tools headings and approved screenshots.
- [ ] Use Hero/section links, direct `?source=review#skills`, language round trips and Back/Forward; confirm section/query preservation.
- [ ] Use only keyboard: skip link, mobile menu, Tab/Shift+Tab, Escape, PDF open/close and returned focus; inspect focus at browser zoom 200%.
- [ ] Open Backend, AI/LLM and Data/ETL in both languages; inspect both pages, zoom/fit, switch document language and verify downloaded filenames/content.
- [ ] Open original PDFs in the native browser reader; try document links without sending messages. Check OS Email behavior separately if desired.
- [ ] Try closing during slow loading, fast language switches and mobile rotation; confirm no stuck backdrop/scroll lock.
- [ ] Review with the intended screen reader and a physical mobile device, noting the documented canvas text limitation.
- [ ] Confirm the latest PR commit's `Quality and static build` check is green, then review/merge manually. Do not deploy or tag from this checklist.
