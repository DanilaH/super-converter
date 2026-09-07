# ListContrast — current state

State date: 2026-09-07

This document is the concise source of truth for the **current shipped routes, indexing surface, release state and currently approved delivery scope**. Historical planning/audit documents remain useful for rationale and traceability, but when an older current-state statement conflicts with this file, use this file for the present repository state.

## Product and stack

ListContrast is a small static browser-side toolkit for line-based list work.

Current stack:

```text
Astro
TypeScript strict
vanilla browser APIs
static output
```

Compare Lists remains the anchor utility. The four-tool expansion is shipped; do not infer permission to add unrelated tools from the existence of the toolkit.

## Current shipped routes

The current production route set is still English-only:

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

All seven routes are currently present in the English indexable surface and production sitemap. A real 404 remains `noindex,nofollow` and has no canonical URL.

## SEO origin and indexing

The canonical production origin is:

```text
https://listcontrast.com
```

The site is live and has begun receiving Google Search Console impressions/click data. Canonical URLs, Open Graph URLs, robots and sitemap output derive from the production origin.

The protected preview is a separate deployment concern. Its external Caddy ingress must continue to require Basic Auth and add:

```text
X-Robots-Tag: noindex, nofollow, noarchive
```

Do not treat production canonicals inside the preview build as preview indexability. The ingress-level noindex contract is the preview protection boundary.

## Active approved scope — Localization V1

A four-language localization SEO experiment is now explicitly approved for implementation, but **none of its localized routes are shipped yet**.

Approved new locales:

```text
de     German / Germany
fr     French / France
es     Spanish / Spain
pt-br  Brazilian Portuguese / Brazil
```

The implementation source of truth is:

```text
LOCALIZATION_SCOPE_V1.md
```

Research evidence and query mapping are recorded in:

```text
evidence/seo/localization/2026-09-07/RESEARCH_SUMMARY.md
```

The localization scope translates/adapts the entire existing seven-page product per locale, including tool UI, editorial content, metadata, navigation, supporting pages and SEO language signals. It does not authorize new tools or product features.

Important boundary: the current production indexable surface remains the seven English URLs until Localization V1 is actually implemented and released. Do not report the planned 28 localized URLs as live before that deployment exists.

Russian/Yandex is **not** part of Localization V1. It requires separate research and an explicit follow-up decision.

## Localization delivery sequence

The approved plan deliberately separates architecture risk from SEO route exposure:

```text
L10N-1 — locale/content/route foundation + English parity, no new indexable URLs
L10N-2 — DE/FR/ES/PT-BR content + localized routes + locale-aware Alphabetizer + hreflang/sitemap + release
```

Do not expose partially translated/indexable locale routes between these packages.

## Documentation precedence

For current repository state, use this order:

1. `CURRENT_STATE.md` — current shipped routes, indexing surface and active delivery snapshot;
2. `LOCALIZATION_SCOPE_V1.md` — approved localization implementation contract while that work is active;
3. `evidence/seo/localization/2026-09-07/RESEARCH_SUMMARY.md` — localization demand/query evidence;
4. domain-specific source of truth (`PRODUCT.md`, `UX.md`, `DESIGN.md`, `LISTCONTRAST_EXPANSION_SCOPE_V1_1.md`, `SEO.md`, `ARCHITECTURE.md`, `ANALYTICS.md`);
5. current assigned GitHub Issue / explicitly approved task;
6. historical planning and audit documents for rationale/traceability.

`SEO.md`, `LAUNCH_PLAN.md`, `IMPLEMENTATION_PLAN.md` and `RELEASE_AUDIT.md` contain historical MVP/pre-expansion material. Do not use an older route count, placeholder origin, old “remaining package” statement, or old “localization deferred” statement to override the current snapshot above.

Operational production commands and live acceptance checks remain in `deploy/vps/PRODUCTION.md`; update that runbook if Localization V1 changes the expected sitemap/indexable route count at release time.
