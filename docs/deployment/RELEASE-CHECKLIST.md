# Production release preparation checklist

Stage 09 prepares publication; it does not authorize release or deployment. No
production image/digest or signed release evidence is asserted by this PR. Local
builds and PR CI cannot prove a future protected-main publication. Use Bash,
Node 22.22.2+ (22.x), npm, current authenticated `gh` with attestation verification,
`jq`, `tar`, Docker Engine and Buildx on an isolated verification workstation.

## Before requesting the separate develop → main PR

- Review/merge the Stage 09 PR into `develop` manually and inspect its CI. Its
  subsequent develop publication is a development candidate, not production evidence.
- Confirm effective rules for both producer and manager `main`/`develop`: required
  reviews/checks, trusted GitHub App identities and bypass restrictions. Require
  `Quality and static build` and `Docker build and container smoke` in this repo.
  `github.ref_protected` alone cannot establish those controls. On 2026-10-22 the
  producer main API reported `protected: true`. Its effective ruleset required
  both named checks from GitHub Actions App ID `15368`, but required approving
  reviews was `0`. Review/strengthen independent review and bypass policy before
  release; Stage 09 did not change branch rules.
- The public repository variable was set and read back during Stage 09. Recheck:

  ```sh
  gh variable get VITE_SITE_ORIGIN -R DanilFaritovich/project-router
  # Must print exactly: https://danil-miftakhov.dev
  gh api repos/DanilFaritovich/project-router/branches/main --jq .protected
  ```

- Review reusable publish workflow and pinned attestation actions. Confirm GHCR
  access/retention and GitHub Artifact Attestations plan/visibility support, OIDC
  and package/attestation permissions. Missing support is a blocker, not permission
  to use labels/plain JSON as trusted evidence.
- Obtain explicit authorization for the separate release PR, then review its diff
  and CI. Merge, tags, `v1.0.0` and GitHub Release remain separate owner actions.
  No release PR, merge, tag or GitHub Release is created by Stage 09.

## After a separately authorized merge to protected main

These commands are **future operator steps**, not evidence already obtained. They
read GitHub/GHCR and pull/copy a local image; they do not deploy it. A workflow
failure after push can leave a registry image: never accept it without complete
successful CI and both verified attestations. Work from a reviewed checkout of
the exact release SHA with `npm ci`; preserve this checkout and verifier version
in the evidence record. The manager must use its independently reviewed collector.

Choose the full main SHA reviewed for release, not a moving branch tip:

```sh
set -euo pipefail
REPO=DanilFaritovich/project-router
read -r -p 'Approved full producer main SHA: ' SHA
[[ "$SHA" =~ ^[a-f0-9]{40}$ ]]
RUN_ID=$(gh run list -R "$REPO" --workflow ci.yml --branch main --event push \
  --commit "$SHA" --status success --json databaseId --jq '.[0].databaseId')
[[ "$RUN_ID" =~ ^[0-9]+$ ]]
EVIDENCE_DIR=$(mktemp -d)
gh api "repos/$REPO/actions/runs/$RUN_ID" > "$EVIDENCE_DIR/run.json"
jq -e --arg sha "$SHA" '.head_sha == $sha and .event == "push" and
  .head_branch == "main" and .path == ".github/workflows/ci.yml" and
  .status == "completed" and .conclusion == "success"' "$EVIDENCE_DIR/run.json"
ATTEMPT=$(jq -r .run_attempt "$EVIDENCE_DIR/run.json")
gh api --paginate --slurp "repos/$REPO/actions/runs/$RUN_ID/attempts/$ATTEMPT/jobs?per_page=100" \
  > "$EVIDENCE_DIR/jobs.json"
jq -e '[.[].jobs[]] as $jobs |
  all(["Quality and static build", "Docker build and container smoke"][];
    . as $name | any($jobs[]; .name == $name and .conclusion == "success")) and
  any($jobs[]; (.name | startswith("Publish validated image")) and .conclusion == "success")' \
  "$EVIDENCE_DIR/jobs.json"
gh run download "$RUN_ID" -R "$REPO" \
  --name "release-evidence-$SHA-$ATTEMPT" --dir "$EVIDENCE_DIR/published"
IMAGE=$(jq -er .image "$EVIDENCE_DIR/published/mapping.json")
[[ "$IMAGE" =~ ^ghcr.io/danilfaritovich/project-router@sha256:[a-f0-9]{64}$ ]]
printf '%s\n' "$IMAGE"
```

The artifact's mapping is only discovery data. Signature verification below must
succeed independently for this exact image. If the 30-day Actions artifact has
expired, retrieve the digest from the retained approved publish record and verify
it independently; never guess a digest from a local image ID. Record run URL,
run ID/attempt, full SHA and effective branch-rule evidence. A successful run for
a PR merge ref, tag or different SHA is insufficient.

Verify GitHub/Sigstore provenance, including the reusable signer workflow and
its immutable source revision:

```sh
gh attestation verify "oci://$IMAGE" --repo "$REPO" --bundle-from-oci \
  --signer-workflow "$REPO/.github/workflows/publish.yml" \
  --signer-digest "$SHA" --source-digest "$SHA" --source-ref refs/heads/main \
  --deny-self-hosted-runners --format json > "$EVIDENCE_DIR/provenance-verified.json"
gh attestation verify "oci://$IMAGE" --repo "$REPO" --bundle-from-oci \
  --signer-workflow "$REPO/.github/workflows/publish.yml" \
  --signer-digest "$SHA" --source-digest "$SHA" --source-ref refs/heads/main \
  --deny-self-hosted-runners \
  --predicate-type https://github.com/DanilFaritovich/project-router/attestations/build-origin/v1 \
  --format json > "$EVIDENCE_DIR/origin-verified.json"
jq -e --arg sha "$SHA" --arg run "$RUN_ID" --arg attempt "$ATTEMPT" \
  'any(.[]; .verificationResult.statement.predicate |
    .sourceRepository == "DanilFaritovich/project-router" and .sourceSha == $sha and
    .sourceRef == "refs/heads/main" and .platform == "linux/amd64" and
    .buildArguments == {"VITE_SITE_ORIGIN":"https://danil-miftakhov.dev"} and
    .originOutputVerified == true and .runId == $run and .runAttempt == $attempt)' \
  "$EVIDENCE_DIR/origin-verified.json"
```

Do not continue on any verification failure. The `gh` verification authenticates
the subject/signature/certificate/source; the jq predicate test adds origin/run
policy after that authentication. Exporting JSON alone does not verify it.
Retain verified bundles/results according to operator retention policy. Recheck
certificate issuer/workflow/source and trust roots; do not relax identity filters
merely to make an old/failing attestation pass.

Inspect richer BuildKit provenance as digest-bound supporting evidence. It is
not a substitute for the signed attestations above:

```sh
docker buildx imagetools inspect "$IMAGE" --format '{{json .Provenance.SLSA}}' \
  > "$EVIDENCE_DIR/buildkit-provenance.json"
jq -e 'type == "object" and length > 0' "$EVIDENCE_DIR/buildkit-provenance.json"
# Inspect invocation parameters/build-arg:VITE_SITE_ORIGIN in the actual schema;
# require https://danil-miftakhov.dev, source SHA and reviewed BuildKit builder.
mkdir "$EVIDENCE_DIR/independent"
node scripts/verify-image.mjs "$IMAGE" https://danil-miftakhov.dev "$EVIDENCE_DIR/independent"
```

`verify-image` verifies registry index → unique linux/amd64 manifest → pulled
runtime config bytes/identity, then reads HTML/canonical/hreflang, social/structured
metadata, sitemap and robots from an unstarted local container. The UUID container
and temporary files are removed even on failure; images remain in the local cache.
There is no public-domain contact or production network creation. Do not confuse
the index digest, amd64 manifest digest, runtime config digest and local image ID
(containerd may use the index digest as local ID). Retain all
three mappings. The manager collector additionally authenticates registry reads,
retains raw config/descriptor bytes and checks its own release policy. This script
does not install that collector or confer deployment authority.

## Handoff to portfolio-deployment and remaining operator work

- Supply the approved protected producer SHA, exact-SHA CI/run/attempt, immutable
  GHCR digest, platform/config mapping, both verified attestations and origin
  evidence. Verify anonymous/private pull access and retention of known-good images.
- Independently review protected manager main SHA, exact-SHA CI, admission/manifest
  revisions and its authenticated release collector. Register via its inactive
  template with component `web`, alias `project-router-web`, `linux/amd64`, HTTP
  `8080/en/`, read-only root, UID/GID 101:101, 16 MiB `/tmp`, cap drop and no runtime
  secrets/host application ports. Never run producer Compose beside the manager.
- Obtain separately authorized isolated exact-digest runtime acceptance with the
  manager's Compose projection: startup, image health, restart, security settings,
  aliases, locales/404/assets/PDF and origin. Recipe smoke in this PR is not proof
  for a future registry digest. Preserve unrelated local resources.
- Host access, infrastructure handoff, production network ownership, trusted
  observations, DNS/ACME/TLS, Caddy storage/validation, backups/restore, first-install
  containment and exact-candidate operator approvals remain manager/infra work.
  Stage 09 does none of them. No previous application release is invented for rollback.
- Only after separate deployment authorization may the manager perform rollout and
  public HTTPS/redirect/metadata checks. Production acceptance and the separately
  authorized tag/release must reflect actual evidence. No automatic CD is introduced.
