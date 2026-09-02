# ListContrast

**Live site:** https://listcontrast.com

Browser-based, account-free tools for working with line-based lists. The current product includes Compare Lists, an Alphabetizer, a List Randomizer and Remove Duplicate Lines; list processing runs client-side and raw list content never leaves the browser for tool processing.

## Current tools

- `/` — Compare Lists: differences, matches and unique values between two lists.
- `/alphabetize-list` — Alphabetizer: A–Z / Z–A sorting for one item per line.
- `/randomize-list` — List Randomizer: explicit-action shuffling for one item per line.
- `/remove-duplicate-lines` — Remove Duplicate Lines: stable first-occurrence deduplication with optional case-insensitive identity.
- `/tools` — crawlable navigation index for currently available tools.

## Docs

- [PRODUCT.md](PRODUCT.md) — existing Compare Lists product semantics
- [UX.md](UX.md) — existing interaction model
- [DESIGN.md](DESIGN.md) — visual direction
- [LISTCONTRAST_EXPANSION_SCOPE_V1_1.md](LISTCONTRAST_EXPANSION_SCOPE_V1_1.md) — reviewed post-MVP list-tools expansion source of truth
- [SEO.md](SEO.md) — search / indexing strategy outside expansion-specific overrides
- [ARCHITECTURE.md](ARCHITECTURE.md) — technical boundaries outside expansion-specific overrides
- [ANALYTICS.md](ANALYTICS.md) — privacy-safe analytics boundary
- [LAUNCH_PLAN.md](LAUNCH_PLAN.md) — release sequence
- [STACK_CHANGE.md](STACK_CHANGE.md) — approved Astro migration decision
- [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) — legacy/consolidated task roadmap where not superseded
- [AGENTS.md](AGENTS.md) — operational contract for coding agents
- [evidence/seo/list-tools-expansion/2026-08-30/README.md](evidence/seo/list-tools-expansion/2026-08-30/README.md) — curated runner evidence for the approved expansion
- [deploy/vps/README.md](deploy/vps/README.md) — protected preview deployment runbook
- [deploy/vps/PRODUCTION.md](deploy/vps/PRODUCTION.md) — production cutover and rollback runbook

## Stack

Astro, TypeScript (strict), vanilla browser APIs, static output, pnpm.

## Development

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```
