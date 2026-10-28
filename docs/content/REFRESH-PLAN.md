# Portfolio content and resume refresh

Status: integrated into `develop` through PR #21; Make checks passed. The owner
confirmed visual acceptance of the site and all six new PDFs on 2026-10-28.
This content iteration is included in v1.1.0 and builds on completed implementation
stages 01–09; release publication and deployment remain separate operations.

## Positioning and source rules

The owner confirmed Python Backend as the primary direction on 2026-10-28.
PostgreSQL, data processing and integrations support that positioning. Data / ETL
and AI / LLM remain separate, secondary resume variants.

Use repository artifacts for implementation facts and explicit owner statements
for employment history. A README documents a claim; reading it is not a code audit,
a new benchmark or proof of production use. Label unfinished work explicitly.
Do not publish private source material, internal systems or customer information.

## Fact review

| Fact                            | Evidence and decision                                                                                   | Remaining question                                                                                                                                                              |
| ------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Primary role                    | Owner-confirmed: Python Backend, with PostgreSQL, data processing and integrations                      | None                                                                                                                                                                            |
| Maxim employment                | Owner-confirmed: currently employed; official title is Software Engineer (Russian: engineer-programmer) | Existing February 2022 start date comes from the supplied resumes; no new start date confirmation                                                                               |
| Freelance start                 | Owner recalls approximately 2020                                                                        | Month and exact year remain uncertain; do not present a precise start date                                                                                                      |
| Education                       | Owner-confirmed: completed Applied Mathematics and Computer Science                                     | Exact degree/qualification wording remains unconfirmed; do not infer B.Sc.                                                                                                      |
| Education institution and dates | Existing resumes: Kazan Federal University, 2021–2026                                                   | Retain as existing document information, not a newly verified diploma record                                                                                                    |
| Address-processing run          | Existing resumes and public profile: up to 46 million records in approximately 6–8 hours                | Owner confirms complete authorship, selection/processing and SQL export/import, and permits public use. Exact timing method and output-validation procedure remain undocumented |
| Commercial FastAPI experience   | Existing documents distinguish data/automation employment from personal and client backend work         | Do not describe all commercial years as FastAPI service development                                                                                                             |
| Commercial Airflow experience   | Portfolio demonstrates Airflow                                                                          | Do not attribute Airflow to Maxim without new evidence                                                                                                                          |
| LLM translation                 | Existing AI resume describes a two-pass geospatial-name workflow                                        | Dates, evaluation procedure, quality results and precise personal contribution need clarification                                                                               |
| Supplier-to-Ozon integration    | Existing resumes describe stock synchronization                                                         | Dates, delivered scope, personal contribution and measurable outcomes need clarification                                                                                        |

The owner reconfirmed the scale/timing claim and permits its public use. Present it
as one reported run, without comparative speedup or independent benchmark claims. Keep
the six original PDFs unchanged; their existing claims are not newly verified by
this review. The same self-reported claim repeated across documents is one source,
not independent corroboration.

## Planned catalog

| Placement                 | Project                                                | Editorial purpose                                                                                          |
| ------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Featured 1                | Yandex Geocoder Region Parser                          | Connect Python, PostgreSQL and geospatial experience with ETL orchestration                                |
| Featured 2                | Moon Courier Crisis                                    | Show backend-owned business rules, state transitions and a usable interface                                |
| Featured 3                | Support Assistant                                      | Show structured LLM integration, validation and explicit human confirmation                                |
| Engineering tool 1        | Portfolio Server Infrastructure + Portfolio Deployment | One related case with separately labeled repository actions and distinct host/application responsibilities |
| Engineering tool 2        | Codex Free Worker MCP                                  | Show bounded execution delegation, result contracts and permission handoff                                 |
| Additional application    | MaximML                                                | Show consistent training/inference transformations and an API-backed ML application                        |
| Additional application    | Task Service API                                       | Keep the PostgreSQL/migrations example in the standard card style                                          |
| Engineering tool 3        | Codex Development Standards                            | Show reusable engineering workflows in the standard tool card style                                        |
| Removed from main catalog | Avito Parser                                           | Reduce overlap with stronger automation cases; keep its repository intact                                  |
| Site implementation link  | ProjectRouter                                          | Explain the portfolio implementation through a small contextual source link                                |

Use functional display names where helpful, while preserving recognizable
repository names. Do not infer release tags, live demos or deployments. Existing
screenshots remain attributable to their source projects.

## Project evidence reviewed on 2026-10-28

- [Geocoder README](https://github.com/DanilFaritovich/yandex-geocoder-region-parser/blob/main/README.MD):
  polygon-based coordinate sampling, four Airflow DAGs, PostgreSQL, MinIO/S3,
  API quotas and deduplicated output. README also labels ongoing development;
  a versioned release does not establish production operation.
- [Moon Courier Crisis README](https://github.com/DanilFaritovich/Moon-courier-crisis-game/blob/main/README.md):
  backend-owned route/cargo/battery rules, service boundaries, SQLAlchemy and
  Unit of Work; SQLite in the current demo. Do not imply PostgreSQL use here.
- [Support Assistant develop README](https://github.com/DanilFaritovich/support-assistant-llm/blob/develop/README.md):
  routing, user confirmation, ticket-description generation, structured output
  validation and shared Redis quotas. Public demonstration under development;
  describe ticket drafting rather than implying customer-reply generation.
- [Infrastructure README](https://github.com/DanilFaritovich/portfolio-server-infrastructure/blob/main/README.md):
  staged host setup and verification; website, gateway and application deployment
  belong elsewhere.
- [Deployment README](https://github.com/DanilFaritovich/portfolio-deployment/blob/main/README.md):
  desired-state registry, planning, readiness, journal, rollback and recovery.
  Its older main README describes pending production work. The newer
  [develop status report](https://github.com/DanilFaritovich/portfolio-deployment/blob/develop/docs/production-status.md),
  reviewed on 2026-10-28, records operator-confirmed first ProjectRouter deployment
  and a successful Manager CD run. It does not establish a successful subsequent
  automatic ProjectRouter update or a production rollback drill. The card links
  develop and attributes rollout status to the operator. No host access occurred.
- [Public profile](https://github.com/DanilFaritovich/DanilFaritovich):
  existing professional self-description; public availability does not independently
  verify employment metrics.

The private career history was consulted without copying its raw contents into
this repository. Older planning notes must not override newer project artifacts:
in particular, Redis quotas are described as implemented by the current Support
Assistant README, although older career notes still call them planned.
LinkedIn content and HH resume content have not been reviewed successfully.

## Commercial case briefs

1. Address processing: describe the data-processing task, database/load constraints,
   batching/concurrency choices and output checks. The owner confirms complete
   authorship and public use of the figures. The exact measured operation and output
   checks remain interview follow-ups; never infer a speedup from a single elapsed time.
2. Supplier-to-Ozon synchronization: describe source/target data, transformation,
   delivered behavior and owner responsibility. Do not invent volume, business
   savings or current operational status.
3. Geospatial-name translation: explain translation rules, second-pass review,
   human evaluation and failure handling. Model self-review is not independent
   proof of translation quality.

## Delivery sequence and acceptance

1. **Facts — reviewed.** Resolve employment/education wording and distinguish
   confirmed facts from pending claims. Primary direction is confirmed.
2. **Catalog — implemented.** Apply the table above; verify
   source destinations and statuses before publishing descriptions.
3. **Commercial cases — drafted.** Prepare short public versions and fuller
   interview notes without private operational details.
4. **RU/EN copy — implemented.** Align Hero, About, Skills, project cards, resume labels
   and SEO with the primary Backend direction. Avoid repeated general claims.
5. **PDF candidates — accepted by the owner.** Prepare editable sources and six separately stored
   candidates. Preserve the original files in public/resumes. The owner authorized adding the candidates to the existing viewer for review,
   using separate candidate-* paths while preserving the originals. Verify text extraction, links, wrapping and page layout.
6. **Site implementation — implemented.** Preserve the visual language and seven-section
   navigation. Keep content typed and localized; support clear actions for the
   related infrastructure/deployment repositories and standard project/tool cards.
7. **Make acceptance — passed.** make fix, make check (94 unit/integration tests)
   and make verify (SSG/HTML checks and 46 browser scenarios) passed. The owner confirmed visual acceptance of RU/EN layouts and all six PDF candidates on 2026-10-28.
   Automated browser assertions within make verify remain part of Make acceptance.
   No additional agent-driven visual review is requested.

Work on a task branch from develop. Deliver through a PR into develop under the
standing owner authorization; do not merge automatically. PR #21 is merged;
v1.1.0 integration into main and publication follow the separate release process.
No release tags, production host contact or deployment are included in this content task.

## Resume candidate reproduction and review

Run `make resume-candidates` with the project Node version and installed Playwright
Chromium. The default output is `project-router-resume-candidates` inside the system
temporary directory: six PDFs and six standalone HTML previews. Editable content
is in `scripts/resumes/content.mjs`; the print template and overflow checks are in
`scripts/render-resumes.mjs`. The owner subsequently requested in-site review; the website now selects the
committed candidate-* PDF copies. The six original files remain unchanged.

Candidate copy uses completed education without inventing a diploma degree,
approximately 2020 for the uncertain freelance start, and distinct project choices
for Backend, Data and AI. Existing February 2022 employment and 2021–2026 education
dates are retained from the supplied documents. The confirmed portfolio URL, https://danil-miftakhov.dev, is included in the
candidate contact block at the owner's request.

## Interview preparation prompts

- **Address processing:** explain the exact operation in the large run, database
  load/memory limits, batch boundaries, retry behavior and output checks. Distinguish
  SQL-file export from database import and identify what the 6–8 hours measured.
- **Ozon synchronization:** reconstruct the period and delivered scope, source/target
  fields, mapping rules, API errors and validation. Quantify only measured results.
- **LLM localization:** explain translator-owned rules, second-pass decisions, human
  checks and failed translations. Do not equate model self-review with an independently
  measured accuracy improvement.

## Owner layout feedback

The owner rejected standalone text references as inconsistent with the site style.
Task Service API and Codex Development Standards therefore remain standard cards.
The final catalog has eight cards: three featured applications, two additional
applications and three tools. Avito Parser remains outside the displayed catalog.

## In-site PDF review

The owner requested all six candidates in the existing Resume section. The catalog
now selects `/resumes/candidate-{id}-{language}.pdf`; opening, downloading, changing
language and opening the source document use the same candidate. Original
`/resumes/{id}-{language}.pdf` files are retained byte-for-byte. This changes the
review content of the task branch; it does not authorize a merge or deployment.

## Role-specific resume refinement

All six candidates include the portfolio link in the header and retain two A4
pages at the existing font size. Page one holds profile, skills, Maxim experience,
education and languages; page two holds client work and four selected projects.

| Resume     | Selected projects, in order                                                                 | Deployment emphasis                                                                     |
| ---------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Backend    | Moon Courier Crisis, Support Assistant, Geospatial ETL Pipeline, Portfolio Deployment       | Python planner/executor, release verification, application runtime and recovery         |
| Data / ETL | Geospatial ETL Pipeline, MaximML, Task Service API, Portfolio Deployment                    | Validated manifests, immutable images, explicit journaled state and reproducibility     |
| AI / LLM   | Support Assistant, Codex Free Worker MCP, Portfolio Deployment, Codex Development Standards | Application delivery, verification and operational checks alongside LLM/MCP integration |

Airflow was checked against main source code, not inferred from the old design:
[prepare_polygon_dag.py](https://github.com/DanilFaritovich/yandex-geocoder-region-parser/blob/main/airflow/dags/prepare_polygon_dag.py),
[prepare_coords_dag.py](https://github.com/DanilFaritovich/yandex-geocoder-region-parser/blob/main/airflow/dags/prepare_coords_dag.py),
[process_coords_dag.py](https://github.com/DanilFaritovich/yandex-geocoder-region-parser/blob/main/airflow/dags/process_coords_dag.py),
and [save_processed_coords_dag.py](https://github.com/DanilFaritovich/yandex-geocoder-region-parser/blob/main/airflow/dags/save_processed_coords_dag.py)
declare four distinct DAG IDs. The downstream schedules use Asset aliases. The
resume therefore describes four DAGs linked by Asset events, not four tasks in one
DAG. Portfolio Deployment descriptions follow its current develop README and
reconciliation code; no successful production rollback drill or zero-downtime
claim is added. The owner accepted the visual balance on 2026-10-28.

The owner agreed this is the resume content baseline after the role-specific
refinement. Profiles now lead with Backend, Data / ETL or LLM/API focus respectively.
Core Skills lead with Python/FastAPI/SQLAlchemy for Backend, PostgreSQL then Airflow
then processing for Data, and LLM integration then MCP tooling for AI. Further
editorial changes should address concrete review feedback or a target vacancy.
This baseline was integrated through PR #21; that merge does not establish a release tag or production deployment.
