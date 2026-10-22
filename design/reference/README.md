# ProjectRouter — Figma import package (final SVG revision)

This package preserves the historical design inputs. Planning language and
placeholder states below describe those assets. For implemented behavior, use
[ARCHITECTURE.md](../../ARCHITECTURE.md); for actual browser captures, use the
[QA report](../../docs/qa/STAGE07-REPORT.md). The final UI includes real images,
six PDFs and explicit versioned release links; the SVG originals are preserved.

## Recommended imports

- `Desktop FINAL.svg` — updated project layout (3 featured), stronger Infrastructure tool, desktop EN/RU control.
- `Mobile FINAL.svg` — updated 3 featured and More Projects, EN/RU control, stronger Infrastructure tool.
- `Mobile Menu FINAL.svg` and `Mobile Menu 320 FINAL.svg` — clean editable menu variants with EN/RU.
- `Interaction Components FINAL.svg` — examples of the optional preview region and of 1/2/3 actions including future Live Demo.
- `RU Copy Checks FINAL.svg` — targeted checks of Russian text length, not a second full design.

## Important

Original Figma-exported SVGs contained **text as vector paths**. We preserved the original visual material and added **editable SVG text** for the revised sections as overlay layers. When imported to Figma, the replaced original artwork is still present *under* some opaque patch backgrounds. For best editing experience, inspect and group the new named overlays in the Layers panel. The original source files are not modified and are not included as additional copies in this package.

`Latest Release` appears only for repositories with a verified stable GitHub Release. The links use `/releases/latest`. No project status badges or version numbers are displayed in updated project cards. `Live Demo` exists only as a **design variant** in Interaction Components, not as an invented active external destination on the page. Images are **not** generated; the three featured cards have named optional-media areas with typography-only interim styling, designed to be replaced with screenshots/diagrams later.

The Resume/PDF, source components, notes, and old responsive montage are retained as *reference source screens*. Their inherited labels and documentation may describe the earlier four-featured layout. Treat `Desktop FINAL.svg`, `Mobile FINAL.svg`, and this README as the final reference-package specification, and the original `Responsive Checks v2.svg` as historical, not a final responsive test.

SVGs are static visual assets. Interactive Vue controls, switching EN/RU, auto layout, PDF loading, responsive behavior, and displaying Demo buttons conditionally must be implemented and tested in Vue. Figma MCP rate limits are not bypassed by importing SVG files. Codex can read these SVG files directly from a repository without Figma MCP.

## Implementation convention

- Source of truth for content: Git (typed project catalog + EN/RU locales).
- Main Figma screens: EN. RU gallery only for text overflow verification.
- 3 featured: Moon Courier Crisis; Support Assistant; Yandex Geocoder Region Parser.
- More: Task Service API; MaximML; Avito Parser.
- Developer Tools: Portfolio Server Infrastructure; Codex Free Worker MCP; Codex Development Standards.
- GitHub always; Latest Release only for stable releases; Live Demo only with a real verified deployment URL.
- Missing media must not create a broken image. `previewImage` is optional in Vue.
