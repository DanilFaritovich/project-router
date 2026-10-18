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
