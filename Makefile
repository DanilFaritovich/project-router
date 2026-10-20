.DEFAULT_GOAL := check
.PHONY: fix check verify ci

fix:
	@npm run fix --silent

# Fast checks; never repairs source.
check:
	@npm run lint --silent
	@npm run format:check --silent
	@npm run typecheck --silent
	@npm test --silent

# Additional verification only; deliberately does not repeat check.
verify:
	@npm run build --silent
	@npm run test:build --silent
	@npm run test:smoke --silent

# Each validation level runs once, including under make -j.
ci:
	@$(MAKE) check
	@$(MAKE) verify

.PHONY: docker-build docker-test docker-run docker-stop
PROJECT_ROUTER_IMAGE ?= project-router:local
export PROJECT_ROUTER_IMAGE

docker-build:
	@node scripts/docker.mjs build

# Two isolated images: no origin and reserved test origin; removes owned resources.
docker-test:
	@node scripts/docker.mjs test

docker-run:
	@docker compose -p project-router-local -f compose.local.yaml up -d --wait --wait-timeout 60

docker-stop:
	@docker compose -p project-router-local -f compose.local.yaml down
