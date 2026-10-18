# ProjectRouter

[English](README.md) · [Русский](README.ru.md)

ProjectRouter is Danil Miftakhov's planned EN/RU engineering portfolio: projects,
developer tools, resume documents and contacts, with content tracked in Git.

## Current state — Stage 01

Repository setup, MIT licensing, bilingual documentation, architecture/design
plans and nine complete local skills are prepared. All 20 original design
reference files are preserved. No Vue application, npm dependencies, Makefile,
CI workflow or deployment exists yet.

## Planned website

Vue 3, TypeScript, Vite, Tailwind CSS, Vue Router and Vue I18n, with SSG/prerender
at `/en/` and `/ru/`, SEO, PDF.js, Vitest and Playwright. No dedicated backend
or database is planned. The responsive portfolio will have seven sections,
three Featured Projects, More Projects and Developer Tools. Demo/release links
and resume actions depend on verified destinations and real PDF files.

## Development roadmap

Stage 01 is prepared in this PR; stages 02–09 are planned work.

| Stage | Branch | Scope |
| --- | --- | --- |
| 01 | `chore/project-bootstrap` | Bootstrap |
| 02 | `feature/vue-foundation` | Vue Foundation |
| 03 | `feature/portfolio-layout` | Layout & Sections |
| 04 | `feature/projects-catalog` | Projects Catalog |
| 05 | `feature/i18n-seo` | Localization & SEO |
| 06 | `feature/resume-interactions` | Resume & Interactions |
| 07 | `test/portfolio-quality` | Testing & Visual QA |
| 08 | `feature/production-foundation` | Docker & CI/CD |
| 09 | `feature/caddy-production` | Caddy & Production Release |

After these nine implementation stages, a separate release PR from `develop`
into `main` and the `v1.0.0` tag/release require explicit authorization. This
release handoff is not a tenth implementation stage. Production deployment also
requires separate authorization.

## Development and documentation

Task branches start strictly from `develop`; local commit, push and PR into
`develop` are owner-authorized. Merge remains manual; never force-push.
Future quality flow: `make fix` → targeted tests → `make check`, with independent
read-only CI. Commands and runtime requirements will be defined in Stage 02.

- [AGENTS.md](AGENTS.md): Codex workflow and project instructions.
- [ARCHITECTURE.md](ARCHITECTURE.md): planned stack, boundaries, routing and quality.
- [design/DESIGN.md](design/DESIGN.md) and [reference notes](design/reference/README.md): visual specification.
- [.agents/skills/](.agents/skills/) and [standards lock](.codex-standards.lock.yaml): nine complete packages from
  [Codex Development Standards](https://github.com/DanilFaritovich/codex-development-standards),
  `develop`, profile `vue-static-site` v2, using `bootstrap/vue-static-site.md`.
  Docker, CD and backend skills are not installed.

## License

Code and technical documentation use the standard [MIT License](LICENSE),
copyright 2026 Danil Miftakhov, permitting modification and commercial reuse.
Personal assets and branding in `design/reference/` follow
[ASSETS-LICENSE.md](ASSETS-LICENSE.md): public availability grants no reuse or
impersonation rights. No copyright is claimed over unprotected facts or ideas.
