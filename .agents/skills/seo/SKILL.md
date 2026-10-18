---
name: seo
description: "Reusable technical SEO for public websites and web apps: discoverable HTML, metadata, canonical URLs, multilingual hreflang, sitemap, robots, structured data, performance and release verification. Framework-agnostic."
---

# Technical SEO Standard

Apply technical SEO to public, indexable websites. Adapt to the project's rendering model, language count and page types; do not mandate a specific framework, paid SEO service or marketing tactics.

## Discoverability and rendering

- Identify which routes should be public/indexable and which should be private, preview, duplicate, error or excluded.
- Search engines may run JavaScript but not all crawlers or social-link previewers do. For content-led sites, prefer server-delivered or pre-rendered meaningful HTML where practical.
- Static hosting, SSG/pre-rendering, CSR and SSR are distinct decisions. Choose based on actual discoverability requirements, not SEO fashion. Do not introduce an application backend solely for metadata.
- Ensure real navigation links are crawlable `<a href>` links; avoid buttons or JS-only click handlers for primary site navigation.
- Public routes should return sensible HTTP status codes. A missing page must not silently become an indexable 200 OK duplicate of the homepage.

## Page metadata

For each indexable route provide:
- A descriptive, readable, appropriately localized `<title>` and useful `meta name="description"`; no keyword stuffing or invented claims.
- A single preferred absolute HTTPS canonical URL for the specific document. Avoid fragment identifiers, tracking parameters and accidental trailing-slash duplicates.
- Semantic visible headings/content and useful descriptive link text. Use meaningful image alternative text.
- Social preview metadata (`og:title`, `og:description`, `og:url`, `og:image`; Twitter card where useful) with publicly reachable preview assets and actual canonical route URLs.
- Valid structured data (Schema.org / JSON-LD) only where it truthfully represents visible page facts and fits a supported type; it is optional, not a promise of rich search results.

Maintain metadata in one reusable per-route/content mechanism rather than scattering hardcoded copies across components. Browser-only metadata mutation is not a substitute for meaningful HTML when non-JS consumers need previews.

## Multilingual URLs (when the site has multiple indexable languages)

- Prefer a stable, directly loadable URL for each translated version, for example `/en/` and `/ru/`. This is a conditional pattern, **not** a requirement for monolingual sites.
- The router maps URL -> language and locale content. Language switching updates the real URL, preserving the equivalent route when it exists.
- Each language page has its own localized title, description, content, `html[lang]`, and **self-referencing canonical** (EN canonical -> EN, RU -> RU); do not canonicalize translated pages to the default language.
- Declare reciprocal, consistent `hreflang` alternate links, including each page itself. Only link genuinely existing equivalents. Use `x-default` only where a real language-neutral/default target exists.
- A root URL may redirect to a chosen default-language path, but do not force-canonicalize all traffic to that language. Keep the other language directly accessible.
- Do not rely exclusively on `localStorage`, cookies, geolocation or Accept-Language to determine indexable content; bots may not use those signals. Saved user preference is a UI preference, not the search indexing contract.
- If using SSG/pre-rendering, generate separate HTML outputs per localized route and verify the resulting head/content before shipping.

## Crawl files and delivery

- Generate a `sitemap.xml` with absolute canonical URLs for actual indexable routes; optionally include multilingual alternates correctly if the implementation supports them.
- Configure `robots.txt` carefully. Never assume `Disallow` is equivalent to a `noindex` directive. Do not expose private information or secrets in crawl files.
- Verify domain, canonical host, HTTPS, redirects, status codes, routing and static asset URLs only against a real environment; do not invent production domains or claim the site is publicly indexed.
- Keep production Caddy/Nginx/CDN route behavior consistent with the generated site: direct GET `/en/` and `/ru/` must serve the intended localized document, not a blanket SPA fallback when prerendered HTML is intended.
- Register/verify a live site and sitemap with search-engine webmaster tools only after deployment and when the owner has authorized account access.

## Quality and validation

- For changed routes, inspect the **built HTML** and response (not just the browser after hydration) for actual content, title, canonical, hreflang, OG and robots directives.
- Validate `sitemap.xml` URLs, page status/redirects and localized alternates. Ensure non-indexable pages and broken URLs are not included.
- Test narrow viewport usability, meaningful content visibility, page performance and accessibility, including Core Web Vitals where possible; these support user experience but do not guarantee rankings.
- Keep validation compact. Run focused checks for affected routes and one broader SEO smoke check before release; do not dump complete crawls and unbounded verbose logs into agent context.
- Report what has been verified locally versus what still requires live-domain verification. Never guarantee indexing, rankings or search-result appearance.

## Scope rule

Technical SEO concerns architecture, content markup, routing and distribution. Avoid expanding tasks into keyword campaigns, backlink purchasing, tracking scripts, analytics or third-party paid tools unless explicitly requested.
