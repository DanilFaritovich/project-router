# ProjectRouter deployment contract

Stage 08 is merged. Stage 09 implements producer integration and release
preparation; production publication and deployment are not established by this
PR. The confirmed production origin is `https://danil-miftakhov.dev`.
[Release checklist](RELEASE-CHECKLIST.md) separates preparation from operator actions.

## Ownership and manager compatibility

The read-only integration audit used `portfolio-deployment` revision
[`64f9f4024e5b0194b616a495c55886db6983cee8`](https://github.com/DanilFaritovich/portfolio-deployment/tree/64f9f4024e5b0194b616a495c55886db6983cee8),
particularly its [production contract](https://github.com/DanilFaritovich/portfolio-deployment/blob/64f9f4024e5b0194b616a495c55886db6983cee8/docs/production-contracts.md),
[inactive template](https://github.com/DanilFaritovich/portfolio-deployment/blob/64f9f4024e5b0194b616a495c55886db6983cee8/docs/templates/project-router.yaml)
and [release evidence requirements](https://github.com/DanilFaritovich/portfolio-deployment/blob/64f9f4024e5b0194b616a495c55886db6983cee8/docs/production-preparation.md#release-evidence-and-projectrouter-handoff).
Recheck the approved manager revision before release; this repository does not
implement or install its authenticated collector or privileged executor.

| Field                    | Contract                                                            |
| ------------------------ | ------------------------------------------------------------------- |
| Application/source       | `project-router` / `DanilFaritovich/project-router`                 |
| Image                    | `ghcr.io/danilfaritovich/project-router@sha256:<64 lowercase hex>`  |
| Platform                 | `linux/amd64`                                                       |
| HTTP/readiness           | `8080`, `/en/`; image wget healthcheck                              |
| User                     | UID/GID `101:101`                                                   |
| Filesystem               | Read-only root; disposable `/tmp`, bounded to 16 MiB; no volumes    |
| Security                 | Drop ALL capabilities; no-new-privileges; no runtime secrets/config |
| Origin                   | `https://danil-miftakhov.dev`, baked at build time                  |
| Manager service/alias    | `web` / `project-router-web`                                        |
| Manager Compose project  | `portfolio-project-router`; no fixed container name                 |
| Shared network           | External `portfolio-proxy`, lifecycle owned by manager              |
| Public application ports | None; only manager gateway publishes HTTP(S)                        |

The manager generates its own Compose and Caddy configuration. It translates the
producer example's `project-router` service/alias into `web`/`project-router-web`.
Do not override that alias or run producer `compose.yaml` beside manager deployment.
The manager's authoritative `portfolio.deployment/v1` inactive template is the
registration starting point; [our example](service-manifest.example.yaml) is
illustrative data, **not** its schema. Never replace the unset digest with a guessed
hash, local image ID or mutable tag. Manager production eligibility requires
protected `main`; develop images and `v*` tags are ineligible under current policy.

ProjectRouter owns image build/test/publication and HTTP behavior. The manager
owns deployment, aliases, networks, gateway, domain routing and recovery. Host
provisioning/hardening belongs to the infrastructure repository. No gateway,
Caddy configuration, production network creation, SSH/CD or deployment is added here.

## Image and HTTP behavior

The digest-pinned multi-stage Node 22.22.2 → Nginx Unprivileged Dockerfile retains
Stage 08 packaging. Build dependencies and sources are absent from runtime.
Nginx master/workers run as `101:101`, listening on HTTP 8080. Only `/tmp` is
writable under the consumer's runtime policy. No runtime environment injection is
needed or supported to change the origin. The manager's 16 MiB mode-1777 tmpfs is
compatible with this image; producer Compose additionally sets tmpfs UID/GID.

`/` returns 302 to `/en/`, preserving query. EN/RU serve independent SSG documents;
unknown paths return HTTP 404/noindex without SPA fallback. Six PDFs remain
unchanged. JavaScript includes PDF.js `.mjs` MIME handling. Fingerprinted assets
cache immutably; HTML, crawl files and public assets revalidate. Responses have
nosniff, frame denial and referrer policy. TLS/HSTS policy belongs to the gateway.

Image healthcheck: BusyBox wget to `http://127.0.0.1:8080/en/`, interval 15s,
timeout 3s, retries 3, start period 5s. `restart: unless-stopped` handles exited
processes; unhealthy status alone does not restart a hung container.

## Origin and publication gates

`VITE_SITE_ORIGIN` is a **public** build argument and Actions repository variable.
Main/tag publication requires the exact value `https://danil-miftakhov.dev`;
missing, alternate or malformed values fail before the build/push. Main also
requires `github.ref_protected`. That signal is a coarse guard, not proof that
required reviews/checks/admin bypass rules are correctly configured.

Quality CI builds SSG with the repository variable. Docker builds bake that same
variable into HTML. The Dockerfile independently validates generated canonical,
reciprocal hreflang/x-default, OG/Twitter URLs, Person/WebSite JSON-LD and exact
sitemap/robots URLs whenever an origin is supplied. The verifier parses local
bytes without executing scripts or fetching links. Negative regression tests
corrupt individual metadata fields and check rejection. An unset origin remains
supported for local/develop builds only; runtime env cannot repair SSG bytes.

PRs into `develop`/`main` run `Quality and static build`, then
`Docker build and container smoke`. Only a trusted repository push after both
jobs pass for the same exact SHA calls the reusable publication workflow. No
`pull_request_target`, manual deployment trigger or independent racing publish
workflow exists. Only publication receives packages/attestations write and OIDC
permissions. No automatic deployment, release, tag or merge is performed.

| Trusted push                   | Discovery tag            |
| ------------------------------ | ------------------------ |
| `develop`                      | `develop-sha-<full SHA>` |
| `main`                         | `main-sha-<full SHA>`    |
| Separately authorized `v*` tag | Exact tag                |

There is no `latest`. Tags are discovery names; the registry digest is the
immutable deployment identity. Publication uses Buildx caching and `linux/amd64`.
After push, `verify-image.mjs` checks raw registry index/manifest hashes, selects
exactly one amd64 child, checks descriptor sizes and hashes exported local config bytes,
platform, user and healthcheck, then copies and verifies HTML from an **unstarted**
UUID container. It preserves index/manifest/config bytes and mapping as a short-lived
Actions artifact. It starts no application and creates no networks. Pulls may
remain cached locally. Consumers must independently verify these bytes,
layer availability and exact-image runtime acceptance under manager policy.

## Trusted build evidence

[BuildKit `mode=max`](https://docs.docker.com/build/metadata/attestations/slsa-provenance/)
records richer build details, including public argument values. Build arguments
must never contain credentials. The sole application argument is public
`VITE_SITE_ORIGIN`; tokens are used only for registry/OIDC operations. OCI labels,
plain JSON, logs and unsigned BuildKit statements alone are not independent proof.

After digest/platform/output verification, pinned official GitHub actions create:

1. SLSA build provenance using `actions/attest-build-provenance`, subject = exact
   published digest, identity = reusable `.github/workflows/publish.yml`.
2. A signed custom predicate with type
   `https://github.com/DanilFaritovich/project-router/attestations/build-origin/v1`,
   subject = same digest. It binds repository, full SHA, ref, platform, public
   build arguments, successful origin-output verification, run ID and attempt.

Both use GitHub OIDC/Sigstore Artifact Attestations and are stored in GitHub and
GHCR. [GitHub verification](https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations)
must constrain source SHA/ref and immutable signer SHA, workflow and subject.
The custom predicate binds origin explicitly because generic SLSA provenance does
not by itself assert all Docker build arguments. Signed output still depends on
reviewed workflow/source and effective branch protection. No SLSA level claim or
independent third-party build audit is made.

A push can succeed before later verification/attestation fails. Such a digest is
**not release eligible**: require the complete successful exact-SHA CI run, both
verified signatures and matching inputs/outputs. Do not use a tag merely because
it exists. GitHub plan/visibility must support attestations; missing permissions,
registry evidence or signatures block release without JSON/label fallback.

## Local validation

Requires Node 22.22.2+ (22.x), `npm ci`, Docker Engine, Compose v2 and Buildx.
Commands honor `DOCKER_CONTEXT`; do not change global context for tests.

```sh
make fix
make check
VITE_SITE_ORIGIN=https://danil-miftakhov.dev make verify
node scripts/verify-origin.mjs dist https://danil-miftakhov.dev
make docker-test
```

Docker tests build UUID-tagged amd64 images with no origin, reserved
`https://portfolio.test`, and confirmed production origin. All contact stays on
loopback; there is no public-domain probe. Containers use read-only root, bounded
tmpfs, capability drop and no-new-privileges. Tests cover HTTP/SEO/crawl behavior,
all PDF hashes, assets/MIME/cache, non-root processes, runtime contents, health,
restart and rendered Compose/no host ports. Cleanup removes only owned containers
and tags, never prunes caches/resources or creates production networks.

Optional local preview: `make docker-build`, `make docker-run`, `make docker-stop`.
Standalone `compose.local.yaml` uses the existing default bridge and loopback 8080
(`PROJECT_ROUTER_PORT` overrides it). Production `compose.yaml` is render-only in
this task; its external network must already exist under manager ownership.
