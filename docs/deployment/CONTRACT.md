# ProjectRouter deployment contract

Stage 08 is in development. This repository builds, validates and publishes its
own static image. Production deployment has not occurred. Stage 09 remains
planned. The future `portfolio-deployment` repository will own the VPS, gateway,
network lifecycle, domain configuration, selected digest and recovery procedures.

## Interface

| Field                        | Contract                                                                       |
| ---------------------------- | ------------------------------------------------------------------------------ |
| Service ID                   | `project-router`                                                               |
| Image repository             | `ghcr.io/danilfaritovich/project-router`                                       |
| Version identity             | `ghcr.io/danilfaritovich/project-router@sha256:<published digest>`             |
| Platform currently published | `linux/amd64`                                                                  |
| Internal protocol/port       | HTTP, `8080`                                                                   |
| External network             | `portfolio-proxy`, created by the central deployment repository                |
| Network alias                | `project-router`                                                               |
| Healthcheck endpoint         | `/en/`                                                                         |
| Storage                      | Stateless; no persistent volumes; disposable `/tmp` tmpfs                      |
| Domain                       | Confirmed and assigned by the central deployment controller                    |
| Secrets                      | None for the basic site; private GHCR pulls may require controller credentials |

[Example service manifest](service-manifest.example.yaml) is proposed integration
data, not a runnable deployment specification or an implemented schema/controller.
The digest, domain and build origin are deliberately unset. The controller must
reject an unset digest and check that the selected image was built for its domain.
Do not substitute a test domain as production configuration.

## Image and HTTP behavior

The multi-stage Dockerfile installs locked dependencies with Node 22.22.2 and
runs Vite SSG. The final digest-pinned Nginx Unprivileged image contains generated
static output, no Node, Vue sources or build dependencies. The Nginx master and
workers run as UID/GID `101:101`. Compose drops all capabilities, enables
`no-new-privileges`, mounts the root filesystem read-only and permits writes only
to a bounded, disposable `/tmp`. No persistent storage or runtime configuration
injection is needed. The only listener is HTTP on 8080; HTTPS belongs to the gateway.

`/` returns a real 302 to `/en/`, preserving the query string. EN/RU directories
serve their own SSG documents. Unknown resources return the noindex error document
with HTTP 404, without SPA fallback. PDFs retain their original bytes. MIME types
include JavaScript for PDF.js `.mjs` workers. Fingerprinted `/assets/` files use
one-year immutable caching; HTML, public PDFs/images and crawl files revalidate
with `Cache-Control: no-cache`. Missing assets do not receive immutable caching.
Responses include nosniff, frame denial and a referrer policy. HSTS/TLS configuration
belongs to the gateway; this container must not redirect internal HTTP to HTTPS.

## Local use

Requires Docker Engine with Compose v2 and Buildx, Node 22.22.2+ (22.x), and `npm ci`.
Commands honor the user's Docker context; if needed, set `DOCKER_CONTEXT` explicitly
without modifying the global context.

```sh
make docker-build
make docker-test
make docker-run
curl -I http://127.0.0.1:8080/
curl -f http://127.0.0.1:8080/en/ -o /dev/null
make docker-stop

# Reserved test origin only; no DNS/HTTPS contact is made.
VITE_SITE_ORIGIN=https://portfolio.test make docker-build
# Rebuild the default local image without an origin afterwards if needed.
VITE_SITE_ORIGIN= make docker-build
```

`docker-run` uses standalone `compose.local.yaml` and the fixed Compose project
`project-router-local`. It binds only loopback (default 8080, configurable through
`PROJECT_ROUTER_PORT`), uses Docker's existing default bridge and does not need
`portfolio-proxy` or Caddy. `docker-stop` removes only that project's container; it leaves the local image. `PROJECT_ROUTER_IMAGE` selects an alternative
local image or published digest. Do not use this local Compose project for production.

`docker-test` builds two UUID-tagged images: unset origin and
`https://portfolio.test`. It starts UUID-named containers on ephemeral loopback
ports, polls Docker health with a deadline, checks actual HTTP responses, all six
PDF byte hashes, emitted JS/CSS/images/PDF worker, locale/SEO/crawl files, runtime
user/processes and absence of build tooling, and restarts each container. It also
renders production Compose and checks digest interpolation, alias, network and
absence of host ports. Cleanup removes only its own containers and image tags,
including on failure or termination; it never prunes shared caches or resources.
No production network is created. Buildx may retain normal build cache.

Healthcheck uses the image's BusyBox `wget` against `http://127.0.0.1:8080/en/`:
15s interval, 3s timeout, three retries and 5s start period. Docker health status
alone does not restart a hung container. `restart: unless-stopped` restarts exited
processes; recovery from unhealthy-but-running status belongs to future operations.

## Build origin

`VITE_SITE_ORIGIN` is a public build argument, never a secret. Existing validation
requires an HTTPS origin without credentials, path, query or fragment. Without it,
local/development HTML works and origin-dependent metadata/sitemap are omitted.
With it, the existing canonical, reciprocal hreflang, sitemap, robots sitemap link,
Person/WebSite JSON-LD and OG/Twitter metadata are baked into the image. Changing
the origin requires a new build and new digest; setting container environment
variables cannot rewrite SSG HTML. Before production release the owner must
confirm the real origin, then set the repository Actions variable
`VITE_SITE_ORIGIN`. No production domain or GitHub Secret is configured by Stage 08.

## CI and publication

`.github/workflows/ci.yml` retains `Quality and static build`: `make ci` runs lint,
format, types, Vitest, production SSG/HTML checks and Chromium in order, once each.
`Docker build and container smoke` follows it, validates workflows with versioned
actionlint and runs the isolated two-origin container matrix. PRs into `develop`
and `main` build/test only. Administrators should require both checks in branch
protection. Repository settings are managed manually. `make ci` remains the site
validation interface; `make docker-test` is the separate container validation level.
If Playwright's default port 4173 is occupied, use `PLAYWRIGHT_PORT=<free port>`.

Only successful trusted push runs call `.github/workflows/publish.yml`. The same
push SHA passes both jobs before publication. The reusable publish workflow is
not a separately racing push workflow and is never called for pull requests.

| Trigger                                  | Published tag                       |
| ---------------------------------------- | ----------------------------------- |
| Push to `develop`                        | `develop-sha-<full commit SHA>`     |
| Push to `main`                           | `main-sha-<full commit SHA>`        |
| Separately authorized push of a `v*` tag | Exact release tag, such as `v1.0.0` |

No `latest` tag is generated. SHA/version tags are convenient discovery names,
not immutable registry policy: deploy by the reported digest. The publish job uses
Buildx, GitHub Actions layer caching, `GITHUB_TOKEN` GHCR login, OCI source/revision/
version labels and minimal standard BuildKit provenance. Only publication jobs
receive `packages: write`; validation has `contents: read`. Main/tag publication
requires a nonempty confirmed origin; the Docker build also validates its syntax.
Digest appears in the job log and Actions summary. A registry digest exists only
after an actual push; a local Docker image ID is not a published registry digest.
The initial publish cannot be proven by the Stage 08 PR; inspect its first
post-merge publish run and package visibility/access before central integration.

## Future central integration

The future controller will obtain the published digest, select the matching built
origin, use `PROJECT_ROUTER_IMAGE` with production `compose.yaml`, attach it to
`portfolio-proxy` and route the confirmed domain to `project-router:8080` through
its own gateway. Production Compose publishes no host HTTP ports. It can be rendered
locally with `docker compose -f compose.yaml config` after supplying an image; do
not run it without an independently provisioned production network.

Caddy configuration, SSH, reconciliation, other applications, VPS rollback and
production deployment are outside this repository and are not implemented here.
Stage 09 — Production Integration & Release covers ProjectRouter integration
with the central deployment and release preparation. Caddy and deployment management
for all applications belong to the separate `portfolio-deployment` repository.
Stage 09 and the separate `develop` → `main` release PR, tag and GitHub Release
remain separately authorized work. A green CI run or GHCR push is not a deployment.
