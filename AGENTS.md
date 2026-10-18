# ProjectRouter agent instructions

ProjectRouter is Danil Miftakhov's EN/RU engineering portfolio. Stage 02 provides
a minimal Vue application, localized static HTML, quality tooling and CI.
Portfolio design, catalog, PDF interactions and delivery remain later stages.

- Stack: Vue 3, TypeScript, Vite, Tailwind CSS, Vue Router, Vue I18n,
  Vite SSG/Unhead; PDF.js is planned. Git-tracked content; no backend or database.
- Read relevant local `.agents/skills/<name>/SKILL.md`. Start development with
  `task-development-workflow`; use `standards-sync` for updates and the exact
  `.codex-standards.lock.yaml` revision. Install complete packages; read optional
  references only when needed. Project-specific instructions take precedence:
  the generic Vue skill's backend/API guidance does not require a backend here.
- For this repository, standing owner authorization covers task branches from
  `develop`, local commit, push and PR into `develop` via authenticated `gh`
  without additional confirmation. Continue an existing task branch. Preserve
  user changes; never force-push. Merge is manual, never automatic. Respect
  narrower stop points in a specific task. Do not develop directly on base branches.
- Node 22.22.2+ (22.x), `npm ci`; use `make fix` → targeted tests → `make check`.
  `make verify` adds SSG/HTML/Chromium checks without repeating `check`.
  CI independently runs read-only `make ci` (`check` + `verify` once each).
  Configure `VITE_SITE_ORIGIN` only when a real production origin is known.
- Use `rg`, bounded output, selective file reads and focused diffs. Do not dump
  path-heavy SVGs, load all skill references or repeat successful full checks
  without a relevant change. Prefer existing PNG previews for visual inspection.
- Optional `codex-free-worker-mcp` may handle bounded mechanical tasks or compact
  diagnostics when available and useful; it is not a dependency. Keep design
  judgment, architecture decisions and Git delivery with the primary agent.
- Read [ARCHITECTURE.md](ARCHITECTURE.md) for architecture work and
  [design/DESIGN.md](design/DESIGN.md) for UI work. Canonical visual references
  are under `design/reference/`; preserve them, avoid duplicate exports/ZIPs,
  and implement semantic Vue rather than embedding whole SVG screens.
- Keep code and technical documentation in English; keep the two README language
  versions aligned when requested. Mark planned behavior explicitly.
- No credentials in Git or browser bundles. Personal materials follow
  [ASSETS-LICENSE.md](ASSETS-LICENSE.md). Never invent demo/release URLs, resume
  files, professional claims or a production domain.
- Follow the nine-stage roadmap in [README.md](README.md). The separate release
  PR `develop` → `main` and `v1.0.0` tag/release require explicit authorization;
  release handoff is not a tenth implementation stage.
- Docker, GHCR, Caddy and delivery are later stages. No unauthorized production
  deployments, production host access, tags/releases or automatic merges.
