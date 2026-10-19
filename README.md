# ProjectRouter

[English](README.md) · [Русский](README.ru.md)

ProjectRouter is Danil Miftakhov's EN/RU engineering portfolio, with projects,
developer tools, resume placeholders and contacts. Content is tracked in Git.

## Current state — Stages 01–04

Stages 01–04, Portfolio Content Refinement and Hero Portrait Integration are
implemented and merged into `develop`. The responsive Vue 3/TypeScript/Vite
portfolio includes Tailwind CSS, Vue Router and Vue I18n. Vite SSG generates
localized HTML and basic metadata at `/en/` and `/ru/`; `/` goes to `/en/`.

- Seven sections: Hero, About, Skills, Projects, Developer Tools, Resume and Contacts.
- Hero uses the owner's photograph as local optimized WebP images, with localized
  alt text and responsive `srcset`/sizes. About separates commercial experience,
  freelance work and personal engineering projects; Skills has eight groups.
- The catalog contains three Featured Projects, three More Projects and three
  Developer Tools, with verified GitHub destinations and four explicit versioned
  Release links. Four real project screenshots are optimized locally as WebP.
- Desktop section navigation and a mobile menu support EN/RU switching while
  preserving the visible section; contacts link to the owner's social profiles.
- ESLint, Prettier, TypeScript, Vitest, Playwright, SSG/build checks and GitHub
  Actions provide automated quality checks. Original design references are preserved.

Real resume PDFs are absent: three role placeholders have disabled preview and
download controls, and PDF.js integration remains planned. No public Live Demo
is confirmed or linked. Production deployment has not been performed. Existing
localization and SEO mechanisms are a foundation; their audit and completion
belong to Stage 05, the next stage. No backend or database is used.

## Development roadmap

Stages 01–04 are implemented; stages 05–09 remain planned. Documentation sync
is a maintenance task outside the nine-stage roadmap.

| Stage | Branch                          | Scope                      |
| ----- | ------------------------------- | -------------------------- |
| 01    | `chore/project-bootstrap`       | Bootstrap                  |
| 02    | `feature/vue-foundation`        | Vue Foundation             |
| 03    | `feature/portfolio-layout`      | Layout & Sections          |
| 04    | `feature/projects-catalog`      | Projects Catalog           |
| 05    | `feature/i18n-seo`              | Localization & SEO         |
| 06    | `feature/resume-interactions`   | Resume & Interactions      |
| 07    | `test/portfolio-quality`        | Testing & Visual QA        |
| 08    | `feature/production-foundation` | Docker & CI/CD             |
| 09    | `feature/caddy-production`      | Caddy & Production Release |

After these nine implementation stages, a separate release PR from `develop`
into `main` and the `v1.0.0` tag/release require explicit authorization. This
release handoff is not a tenth implementation stage. Production deployment also
requires separate authorization.

## Development and documentation

Task branches start strictly from `develop`; local commit, push and PR into
`develop` are owner-authorized. Merge remains manual; never force-push.
Requires Node 22.22.2 or a newer Node 22 patch (see `.nvmrc`) and npm.

```sh
npm ci
npm run dev             # local Vite server, /en/ and /ru/
npm run build           # static site in dist/
npm run preview         # inspect the production build locally
make fix                # safe formatting and lint autofix
npm test -- tests/integration/localization.integration.spec.ts
make check              # lint, formatting, types, unit/integration
npx playwright install chromium
make verify             # SSG build, HTML checks and browser smoke
make ci                 # check + verify, no repeated checks or source repairs
```

On Linux, Chromium may need system libraries:
`npx playwright install --with-deps chromium` (CI installs these automatically).
Development flow: `make fix` → targeted tests → `make check`; run `make verify`
when build behavior or user journeys change.

The production domain is undecided. Optionally copy `.env.example` to
`.env.local`, set `VITE_SITE_ORIGIN` to the real HTTPS origin without a path,
and rebuild. Without an origin, canonical, hreflang, `og:url` and sitemap are
omitted; localized HTML and basic metadata still work. Static hosting must serve
`/en/index.html` and `/ru/index.html` directly and return 404 for unknown paths.
Root currently uses an HTML meta-refresh; an HTTP redirect and live SEO checks
belong to the delivery stage. Administrators should require the
`Quality and static build` check in GitHub branch protection; these repository
settings are configured manually.

- [AGENTS.md](AGENTS.md): Codex workflow and project instructions.
- [ARCHITECTURE.md](ARCHITECTURE.md): implemented portfolio, system boundaries, routing and quality.
- [design/DESIGN.md](design/DESIGN.md) and [reference notes](design/reference/README.md): visual specification.
- [.agents/skills/](.agents/skills/) and [standards lock](.codex-standards.lock.yaml): nine complete packages from
  [Codex Development Standards](https://github.com/DanilFaritovich/codex-development-standards),
  `develop`, profile `vue-static-site` v2, using `bootstrap/vue-static-site.md`.
  Docker, CD and backend skills are not installed.

## License

Code and technical documentation use the standard [MIT License](LICENSE),
copyright 2026 Danil Miftakhov, permitting modification and commercial reuse.
Personal photographs, resume documents and branding, including materials in
`design/reference/`, follow
[ASSETS-LICENSE.md](ASSETS-LICENSE.md): public availability grants no reuse or
impersonation rights. No copyright is claimed over unprotected facts or ideas.
