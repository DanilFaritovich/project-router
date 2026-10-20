# ProjectRouter agent instructions

ProjectRouter is Danil Miftakhov's EN/RU engineering portfolio. Stages 01–07 are
complete and merged into `develop`; see [the QA report](docs/qa/STAGE07-REPORT.md).
Stage 08 — Docker & CI/CD Foundation is in development in
`feature/production-foundation`. Stage 09 — Production Integration & Release
remains planned: integrate ProjectRouter with the central deployment and prepare
its release. Caddy and deployment management for all applications belong to the
separate `portfolio-deployment` repository. The site is not deployed.

- Stack: Vue 3, TypeScript, Vite, Tailwind CSS, Vue Router, Vue I18n,
  Vite SSG/Unhead and PDF.js. Git-tracked content; no backend or database.
- Key paths: `src/content/` and `src/locales/` own catalog/copy;
  `src/seo/` owns metadata; `src/components/resume/` and `src/pdf/` own the lazy,
  client-only PDF modal. Six original EN/RU PDFs in `public/resumes/` must remain
  unchanged. The viewer supports independent document language, pages, zoom,
  fit width, download, retry and safe clickable URL annotations. Keep PDF.js and
  browser APIs out of SSG; preserve focus, disposal and responsive alignment.
  Permit only HTTP(S)/mailto PDF links, use safe new-tab attributes for HTTP(S),
  and never execute PDF scripts/actions. Text Layer/search/selection are out of scope.
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
- Docker packaging: digest-pinned multi-stage Node → Nginx Unprivileged, UID/GID
  101:101, HTTP 8080. `make docker-build`, `docker-test`, `docker-run`, `docker-stop`;
  tests own UUID resources, local Compose uses loopback and no production network.
  Production `compose.yaml` accepts `PROJECT_ROUTER_IMAGE` (deploy by digest), no
  host ports, external `portfolio-proxy`, alias `project-router`, stateless.
- `VITE_SITE_ORIGIN` is baked into SSG; changing it requires a new image. Main/tag
  publication requires the confirmed origin in an Actions repository variable.
  CI validates site then containers; only successful trusted pushes publish GHCR.
  PRs never publish. See [deployment contract](docs/deployment/CONTRACT.md).
- ProjectRouter owns only its image build/test/publication and integration contract.
  Future `portfolio-deployment` owns gateway, domain, network and VPS operations.
  Do not add Caddy, SSH/CD, controllers or other applications here. Docker health
  status alone does not restart a hung process. No unauthorized production
  deployments, production host access, tags/releases or automatic merges.
