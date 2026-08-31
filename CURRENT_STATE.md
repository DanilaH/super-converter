# ListContrast — current state

State date: 2026-08-31

This document is the concise source of truth for the **current shipped routes, indexing surface and release state**. Historical planning/audit documents remain useful for rationale and traceability, but when an older current-state statement conflicts with this file, use this file for the present repository state.

## Product and stack

ListContrast is a small static browser-side toolkit for line-based list work.

Current stack:

```text
Astro
TypeScript strict
vanilla browser APIs
static output
```

Compare Lists remains the anchor utility. The approved four-tool expansion is complete; do not infer permission to add more tools from the existence of the toolkit.

## Current routes

The shipped route set is:

```text
/
/alphabetize-list
/randomize-list
/remove-duplicate-lines
/tools
/about
/privacy
```

Roles:

- `/` — Compare Lists primary acquisition/utility page;
- `/alphabetize-list` — Alphabetizer acquisition/utility page;
- `/randomize-list` — List Randomizer acquisition/utility page;
- `/remove-duplicate-lines` — Remove Duplicate Lines acquisition/utility page;
- `/tools` — navigation/internal-linking resource;
- `/about` and `/privacy` — supporting site pages.

All seven routes are currently present in `INDEXABLE_PATHS` and therefore in the production sitemap. A real 404 remains `noindex,nofollow` and has no canonical URL.

## SEO origin and indexing

The repository is configured for the canonical production origin:

```text
https://listcontrast.com
```

Canonical URLs, Open Graph URLs, robots and sitemap output derive from that origin.

The protected preview is a separate deployment concern. Its external Caddy ingress must continue to require Basic Auth and add:

```text
X-Robots-Tag: noindex, nofollow, noarchive
```

Do not treat production canonicals inside the preview build as preview indexability. The ingress-level noindex contract is the preview protection boundary.

## Release state

The codebase is production-origin configured and has separate preview/production deployment definitions. Do **not** infer that public production deployment, DNS, Search Console verification or sitemap submission have happened merely from repository configuration; verify live infrastructure separately when release work requires it.

The four-tool post-MVP implementation is complete. New work must be an explicitly approved maintenance, hardening, measurement or evidence-backed expansion task.

## Documentation precedence

For current repository state, use this order:

1. `CURRENT_STATE.md` — current routes, indexing surface and release snapshot;
2. domain-specific source of truth (`PRODUCT.md`, `UX.md`, `DESIGN.md`, `LISTCONTRAST_EXPANSION_SCOPE_V1_1.md`, `SEO.md`, `ARCHITECTURE.md`, `ANALYTICS.md`);
3. current assigned GitHub Issue / explicitly approved task;
4. historical planning and audit documents for rationale/traceability.

`SEO.md`, `LAUNCH_PLAN.md`, `IMPLEMENTATION_PLAN.md` and `RELEASE_AUDIT.md` contain historical MVP/pre-expansion material. Do not use an older route count, placeholder origin, or old “remaining package” statement from those documents to override the current snapshot above.

Operational production commands and live acceptance checks remain in `deploy/vps/PRODUCTION.md`; keep that runbook synchronized with this route/indexing set.
