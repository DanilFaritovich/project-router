# ProjectRouter

[English](README.md) · [Русский](README.ru.md)

ProjectRouter is Danil Miftakhov's planned bilingual engineering portfolio:
a static website presenting projects, reusable developer tools, resume documents
and contact links. Content and translations will be reviewed and tracked in Git.

## Implemented in Stage 01

- Repository initialization, `main` / `develop` / task-branch workflow.
- Standard MIT code license and separate personal-materials policy.
- Bilingual README, architecture plan, design specification and Codex instructions.
- Nine complete local development skills, pinned to an exact upstream commit.
- All 20 existing SVG/PNG/README reference files preserved without modification.

There is no Vue application, npm dependency installation, Makefile, CI workflow,
Docker configuration or deployed website at this stage.

## Planned stack and features

Vue 3, TypeScript, Vite, Tailwind CSS, Vue Router and Vue I18n; SSG/prerendering
for meaningful initial HTML at `/en/` and `/ru/`. Planned SEO includes localized
metadata, canonical URLs, reciprocal hreflang and a sitemap after the production
origin is known. No dedicated backend or database is planned.

The responsive design has seven sections: Hero, About, Skills, Projects,
Developer Tools, Resume and Contacts. Projects includes three Featured Projects
and a More Projects list. Future interactions include language switching,
mobile navigation and a PDF.js resume modal. Images and PDFs are optional;
no actual resume PDFs are supplied. Latest Release and Live Demo actions will
appear only for verified destinations. No demo or release is promised by a mockup.

Quality tooling is planned around Vitest, Vue Test Utils, Playwright, ESLint,
Prettier, vue-tsc and a Makefile, with independent read-only GitHub Actions checks.
Docker, GHCR, Caddy and delivery belong to later stages; production deployment
requires separate authorization.

## Development roadmap

1. **Stage 01 — Repository Initialization & Bootstrap:** this repository setup,
   standards, licenses and documentation. Application work has not started.
2. **Stage 02 — Vue Foundation:** scaffold Vue/TypeScript/Vite, select and integrate
   prerendering, add routing/i18n foundations, dependency lock, Makefile and CI.
3. **Responsive UI:** implement sections and reusable components from the references.
4. **Content and interactions:** typed catalog, verified links/media, menu and PDF viewer.
5. **Localization and quality:** complete EN/RU, generated HTML SEO, focused tests,
   accessibility and browser visual checks.
6. **Packaging and delivery:** separately scoped Docker/GHCR/Caddy work and authorized
   deployment. No deployment infrastructure is configured now.

These later phases are plans, not available functionality. Stage 02 must define
real install/run commands and supported runtime versions before documenting them.
Future validation flow: `make fix` → targeted tests → `make check`; CI will use
`make ci`. None of these Make targets exists in Stage 01.

## Repository guide

| Path | Purpose |
| --- | --- |
| [AGENTS.md](AGENTS.md) | Compact Codex workflow and repository-specific delivery authorization |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Planned modules, data flow, routes, SEO, quality and delivery boundaries |
| [design/DESIGN.md](design/DESIGN.md) | Design tokens, sections, responsive behavior and interaction requirements |
| [design/reference/README.md](design/reference/README.md) | Reference priority and original package notes |
| [.agents/skills/](.agents/skills/) | Complete installed local skill packages and references |
| [.codex-standards.lock.yaml](.codex-standards.lock.yaml) | Exact standards upstream revision and installed profile |

Standards source: [Codex Development Standards](https://github.com/DanilFaritovich/codex-development-standards),
`develop`, profile `vue-static-site` v2, using `bootstrap/vue-static-site.md`.
Installed: task-development-workflow, standards-sync, code-quality, vue,
vue-testing, design-to-vue, seo, github-actions and documentation.
Docker, CD and backend skills are not installed.

Normal work starts in a task branch strictly from `develop`, then local commit,
push and PR into `develop` through `gh` under the owner's standing authorization.
Merge remains manual; never force-push. `main` is the stable branch.

## License

Source code and technical documentation use the standard [MIT License](LICENSE),
copyright 2026 Danil Miftakhov; copying, modification and commercial use are allowed
under its terms. Personal photos, original resume documents, personal illustrations
and branding are excluded from that grant: see [ASSETS-LICENSE.md](ASSETS-LICENSE.md).
Do not reuse them in your own site without separate permission or impersonate the
owner. This policy does not claim copyright over unprotected facts or ideas.
