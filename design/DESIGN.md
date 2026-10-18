# ProjectRouter design specification

## Status and reference priority

This records the inspected local design, not implemented UI. Read the
[reference README](reference/README.md) before translating designs to Vue.

| Reference | Use |
| --- | --- |
| [Desktop FINAL.svg](<reference/ProjectRouter/Desktop FINAL.svg>) | Canonical desktop composition, 1440 × 5639 |
| [Mobile FINAL.svg](<reference/ProjectRouter/Mobile FINAL.svg>) | Canonical mobile composition, 390 × 8786 |
| [Mobile Menu FINAL.svg](<reference/ProjectRouter/Mobile Menu FINAL.svg>) | Mobile navigation and language control |
| [Mobile Menu 320 FINAL.svg](<reference/ProjectRouter/Mobile Menu 320 FINAL.svg>) | Narrow-width menu, 320 × 615 |
| [Interaction Components FINAL.svg](<reference/ProjectRouter/Interaction Components FINAL.svg>) | Optional preview, one/two/three-action card variants, future Live Demo |
| [RU Copy Checks FINAL.svg](<reference/ProjectRouter/RU Copy Checks FINAL.svg>) | Russian wrapping/overflow samples, not a full second design |
| [Resume Modal v2.svg](<reference/ProjectRouter/Resume Modal v2.svg>) | Desktop unavailable PDF state |
| [Resume Modal Mobile v2.svg](<reference/ProjectRouter/Resume Modal Mobile v2.svg>) | Mobile PDF modal reference |
| [PDF States v2.svg](<reference/ProjectRouter/PDF States v2.svg>) | Loading, error/retry and future configured-document actions |

Existing [PNG previews](reference/Previews/) help inspect composition without
reading vector paths. `Components v2.svg` and `Interaction Notes v2.svg` are
supporting source material; `Responsive Checks v2.svg` is historical and may
show the old four-featured layout. Final desktop/mobile and reference README
win conflicts. Preserve originals, including their underlying patched artwork.
Do not add duplicate archives, exports or generated preview copies to Git.

## Palette and typography

Values below were extracted from SVG fill/stroke attributes and editable text;
all-path older lettering cannot be treated as reliable font metadata.

| Role | Reference value |
| --- | --- |
| Warm page background | `#F5F3EE` |
| White card surface | `#FFFFFF` |
| Muted panels / media background | `#EEE9DF` |
| Main text | `#181818` |
| Secondary text | `#66625B`, `#737373` |
| Borders and dividers | `#E2DED6` |
| Amber primary accent / selected navigation | `#C98A1D` |
| Dark accent labels | `#82550F`, `#84530C` |

Editable overlays specify `Inter, Arial, sans-serif`, normal body weight 400,
labels/actions 500–600, headings 700. Desktop overlay samples include 74px
hero, 39px section titles, 27px featured titles, 21–22px secondary headings,
14–16px body and 11–13px metadata. These are reference-scale measurements,
not a requirement to force identical sizes at every viewport. Establish a
responsive type scale, readable line length and verified contrast, especially
for small muted labels and disabled controls. Font delivery/licensing must be
chosen explicitly later; fonts are not supplied or installed in this stage.

## Responsive structure and seven sections

Desktop uses a left navigation rail (DM. mark, section links, EN/RU, location)
and a wide main column. Main sections pair a narrow numbered title/intro column
with wider content; fine horizontal rules and generous vertical space separate
them. Cards are white with subtle borders and restrained amber accents.
Mobile replaces the rail with a compact top bar containing DM., EN/RU and Menu;
sections and cards stack, controls wrap and optional previews move within the
card flow. Hero media is a muted optional area, not an invented portrait.

1. Hero — name, engineering role, short introduction, Projects/Resume actions
   and social links.
2. About — commercial engineering experience, personal projects, current focus.
3. Skills — grouped technologies, two columns on desktop and one on mobile.
4. Projects — three Featured Projects followed by compact More Projects rows.
5. Developer Tools — reusable tooling catalog, with Infrastructure emphasized.
6. Resume — three document roles: Backend Developer, AI / LLM Integration,
   Data / ETL Developer; preview/download availability reflects actual files.
7. Contacts — invitation to connect and configured Telegram/LinkedIn/GitHub links.

Use fluid CSS/Tailwind grid/flex layout and content-driven height. Mockup page
heights are export bounds, not fixed runtime heights. Derive breakpoints from
content; verify at 320px, the 390px reference, tablet and 1440px desktop when UI
exists. No horizontal overflow, clipped Russian copy or inaccessible offscreen
actions. The 320px menu places Close menu below its title and EN/RU below a rule;
keep all seven destinations reachable with keyboard and touch.

## Project and tool catalog

Exactly three Featured Projects in this order:

1. Moon Courier Crisis — lunar logistics simulation.
2. Support Assistant — AI-assisted support request drafting.
3. Yandex Geocoder Region Parser — geospatial data pipeline.

More Projects: Task Service API, MaximML, Avito Parser.
Developer Tools: Portfolio Server Infrastructure (emphasized first tool),
Codex Free Worker MCP, Codex Development Standards.

Featured cards have title, summary, technical context, stack and optional media.
The MC / AI / ETL areas are intentional typography-only interim previews, not
screenshots of deployed applications. Keep `previewImage` optional. Missing
media must not render a broken image or require fabricated imagery.

GitHub is the base action. Latest Release appears only after verifying a stable
GitHub Release, using `/releases/latest`; no invented version/status badges.
Live Demo is a future design variant: render it only with a real verified
configured deployment URL. Support one, two or three actions with responsive
wrapping rather than empty buttons. Do not infer active links from mockup text.

## EN/RU and interaction behavior (planned)

Show EN/RU controls on desktop, mobile top bar and menu; use language labels,
not flags. `/en/` and `/ru/` determine locale. Translate visible and accessible
copy, preserving section identity and using equivalent language routes. RU
samples are wrapping checks; they are not a complete translation source.

Navigation should expose the active section, preserve visible focus and close
the mobile menu after selection. Menu open/close, Escape and focus return require
real Vue behavior and tests; static SVGs do not provide them.

PDF Modal has a document title, Close and Download PDF; the configured viewer
adds previous/next, page count, zoom and fit-width controls. Plan unavailable,
loading, ready and error/retry states. Current references show unavailable PDFs:
preview/download remain disabled or absent with clear explanatory copy until a
real file exists. Use PDF.js later, download the same file that is previewed,
contain keyboard focus, support Escape and restore focus to the opener. On
mobile, fit the viewport with scrollable content and reachable controls.

## Implementation acceptance (future)

Build semantic HTML and maintainable Vue components; do not paste whole exported
SVG screens or vector text paths into runtime markup. Compare real browser
renders at relevant widths, inspect RU line wrapping, optional actions/media,
menu and PDF states, keyboard operation and touch targets. No browser visual
comparison or interaction test has been performed in Stage 01 because there
is no application yet. Asset reuse follows [ASSETS-LICENSE.md](../ASSETS-LICENSE.md).
