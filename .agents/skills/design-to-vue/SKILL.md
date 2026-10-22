---
name: design-to-vue
description: Convert approved Figma/SVG/PNG design references into accessible responsive Vue 3 interfaces without copying vector exports into component markup. Use for layout implementation, responsive visual QA, previews and localization-ready UI.
---

# Design to Vue

Implement an approved design as maintainable Vue UI, not as a pasted screenshot or enormous imported SVG.

## Source hierarchy

1. Read the target project's `AGENTS.md` and any scoped `design/DESIGN.md`.
2. Inspect only the design screens relevant to the task (usually desktop, mobile and one interaction/state).
3. Use exported PNG previews to understand the whole composition; inspect individual SVG elements only when exact geometry/assets matter.
4. Treat Figma/SVG as visual references, not as an authoritative implementation, routing or content model. Confirm missing behavior from project instructions.

Do not dump full path-heavy SVG XML, all Figma nodes or unrelated design screens into the primary context. Use `rg`, bounded file ranges and image inspection. An unavailable Figma MCP must not block work when exported local references suffice.

## Vue implementation

- Build semantic HTML with focused Vue components. Use CSS/Tailwind for layout; do not recreate entire screens using absolute positions, embedded screenshots, or inline vector text paths.
- Use shared tokens for backgrounds, surface, text, borders, accent, typography and spacing. Respect contrast; avoid small low-contrast text.
- Structure sections and common elements according to actual reuse. Do not make one mega-component or an unnecessary design-system framework.
- Use local state/composables for presentation interactions. Do not add a global store or API/backend dependency unless the project needs one.
- Model content separately from presentation. Keep project metadata/URLs in one typed catalog where practical; do not duplicate source facts across cards.
- Use a real responsive layout with fluid widths, wrapping content and content-driven heights; no fixed-height clipping to imitate a screenshot.
- Preserve the design's visual hierarchy while adapting proportions to the actual browser font metrics and content.

## Localization and assets

- Keep all visible UI copy localization-ready (for example Vue I18n); maintain a stable key scheme and verify that languages with longer strings wrap correctly.
- Include correct document language and accessible names for interactive controls. Do not use flag emoji as language identifiers by default.
- Keep image/preview URLs optional; when no actual image exists, use a finished text-first composition rather than a fake demo screenshot.
- Prefer real, attributable project screenshots or meaningful architecture diagrams to decorative filler. Do not claim a mockup is a deployed application.
- Avoid embedding sensitive or unverified material from portfolio/career sources.
- Different content types (project, developer tool, resume) may reuse components but must not be forced into identical information densities.

## Interaction and accessibility

- Design actions from real destinations and states; only render links such as Live Demo or Release when verified and configured.
- Prefer native link/button behavior, keyboard operability, visible focus, appropriate heading order and reasonable touch targets.
- Account for menu open/close, scroll/active navigation, modal focus/escape/return focus and absent/loading/error resources when relevant.
- A Figma illustration of a state is not proof that the state works: implement and test behavior.

## Visual verification

For each meaningful layout increment:

1. Run safe formatting/auto-fix and focused checks using the project's Makefile rules.
2. Inspect browser screenshots at representative narrow/mobile, tablet and desktop widths. Prefer the few widths affected by the change; expand only when issues appear.
3. Compare actual spacing, hierarchy, line wraps, clipped content, links and interaction states against the relevant reference.
4. Validate keyboard use and accessible names for changed interactions.
5. Report unresolved differences, real missing assets and known unverified claims. Do not report a visual comparison as done unless browser renders/screenshots were actually inspected.

Do not run an expensive all-pages screenshot suite after each small edit. Delegate mechanical noisy diagnostics to an optional execution worker only when it clearly saves the primary-model context; keep visual judgment and final acceptance on the primary model.
