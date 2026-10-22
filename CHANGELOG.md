# Changelog

This file records ProjectRouter application changes. Package metadata tracks the
application version; the private package is not published to npm.

## 1.0.0 — prepared, unreleased

First release candidate scope: stages 01–09 are complete and integrated into
`develop`. Version metadata is `1.0.0`; no release date, tag, GitHub Release or
production deployment is asserted here.

### Features

- Seven-section responsive engineering portfolio with distinct commercial,
  freelance and personal experience, project/tool catalog and contact links.
- Complete EN/RU routes and copy; section/query/hash-preserving language switching,
  browser history, mobile menu and keyboard focus handling.
- Three featured projects, three additional projects and three developer tools;
  four real optimized screenshots and explicit source/versioned release links.
- Six original EN/RU PDFs across Backend, AI / LLM and Data / ETL roles; lazy
  client-only PDF.js preview, independent document language, page/zoom/fit-width
  controls, download, original fallback and loading/error/retry states.
- Safe clickable HTTP(S)/mailto PDF annotations, aligned with page rendering;
  PDF scripts/actions are excluded and original document bytes are preserved.

### Architecture and quality

- Vue 3, TypeScript, Vite 8, Tailwind CSS 4, Vue Router, Vue I18n, Vite SSG and
  Unhead; Git-owned content without backend, database or request-time SSR.
- Localized pre-rendered HTML, OG/Twitter previews, optional origin-bound
  canonical/hreflang, sitemap/robots and Person/WebSite JSON-LD.
- ESLint, Prettier, vue-tsc, Vitest, built-output tests, Chromium journeys,
  axe scans and visual QA evidence; separate fast and extended Make checks.
- PDF isolation from SSG, resource cleanup, URL allowlist, safe external opening
  and regression coverage for focus, resizing, downloads and async races.

### Packaging and release preparation

- Digest-pinned multi-stage Node → Nginx Unprivileged container, UID/GID 101:101,
  HTTP 8080, read-only Compose runtime and no persistent storage.
- GitHub Actions validates site and containers before trusted-push GHCR publication;
  PRs do not publish. Full-SHA discovery tags, registry/platform/origin verification,
  signed SLSA provenance and a signed origin/build-input predicate bind the image.
- Producer deployment contract and operator checklist define digest-based handoff
  to `portfolio-deployment`; host provisioning belongs to
  `portfolio-server-infrastructure`. No automatic deployment or release is added.

### Known limits

- Release and production deployment remain pending. Protected-main publication,
  signatures, manager admission and exact-digest runtime acceptance must be
  verified for the actual release candidate.
- Public HTTPS/SEO/indexing and field performance are not established by local QA.
- PDF text layer/search/selection and canvas-prose screen-reader support are absent.
  Recorded browser acceptance is Chromium/Linux; other browsers, physical devices
  and assistive technologies require owner checks.

See [draft release notes](docs/releases/v1.0.0.md), the
[QA report](docs/qa/STAGE07-REPORT.md) and
[release checklist](docs/deployment/RELEASE-CHECKLIST.md) for evidence and remaining work.
