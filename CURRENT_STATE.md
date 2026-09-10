# ListContrast — current state

State date: 2026-09-10

This document is the concise source of truth for the **current production surface, active release work and indexing expectations**. Historical planning/audit documents remain useful for rationale, but when an older current-state statement conflicts with this file or `EXPANSION_V2_DECISION_2026-09-10.md`, use the newer documents.

## Product and stack

ListContrast is a small static browser-side toolkit for line/list operations.

```text
Astro 7
TypeScript strict
vanilla browser APIs
static output
```

Compare Lists on `/` remains the anchor utility. The site must stay focused, browser-only and low-maintenance rather than becoming a generic utility portal or SaaS.

## Verified production state

Localization V1 was deployed and production-verified on 2026-09-08. The live indexable surface is currently:

```text
6 locales × 7 page identities = 42 canonical/indexable URLs
```

Locales:

```text
en     unprefixed English
de     generic German
fr     generic French
es     neutral international Spanish
pt-br  Brazilian Portuguese (`pt-BR`)
ru     generic Russian
```

Current page identities:

```text
Compare Lists
Alphabetizer
List Randomizer
Remove Duplicate Lines
Tools
About
Privacy
```

Production checks completed for that release included: production container health, internal and public 42/42 HTTP 200 sweep, sitemap count 42, reciprocal hreflang/canonical inspection, crawlable `robots.txt`, public HTTPS headers, `www` → apex redirect and real 404 with `noindex,nofollow` and no canonical.

The deployed source SHA before the current expansion work is:

```text
30c7ad234cedc876080b22b50ff26cb9d06d1bdb
```

## Canonical origin and preview boundary

Production origin:

```text
https://listcontrast.com
```

The protected preview is a separate deployment concern. Its external Caddy ingress must continue to require Basic Auth and add:

```text
X-Robots-Tag: noindex, nofollow, noarchive
```

Production canonicals inside a preview build do not make the preview indexable; ingress-level noindex remains the protection boundary.

## Completed release — Localization V1

The binding localization decision remains:

```text
LOCALIZATION_FINAL_DECISION_2026-09-07.md
```

Release invariants that remain active:

- every localized page is statically rendered and self-canonical;
- equivalent pages emit reciprocal `hreflang` for `en`, `de`, `fr`, `es`, `pt-BR`, `ru`, plus `x-default` to English;
- internal navigation stays inside the active locale except for the explicit language switcher;
- no automatic IP/browser-language redirects;
- no runtime i18n dependency or translation service;
- Alphabetizer uses locale-aware `Intl.Collator`;
- privacy/product behavior stays equivalent across locales.

The older Localization V1 planning docs are implementation history where they conflict with the final decision or this current-state snapshot.

## Active release — Expansion V2

Research for the current wave is closed. The binding repository-compatible implementation decision is:

```text
EXPANSION_V2_DECISION_2026-09-10.md
```

Approved work:

1. strengthen the existing `/` for the Compare Lists / List Difference cluster without creating synonym routes or redesigning the comparator;
2. add Random Team / Group Generator;
3. add Random Pair Generator;
4. add Remove Line Breaks / Remove Newlines on one canonical tool page;
5. add Column to Comma Separated List;
6. integrate the four tools into all six existing locales, `/tools`, About, related links, sitemap and hreflang/canonical infrastructure.

If all six locales ship in the release, the intended post-deployment surface becomes:

```text
6 locales × 11 page identities = 66 canonical/indexable URLs
42 current URLs + 24 new localized/tool URLs
```

Do **not** report 66 URLs as live until production deployment and public smoke are verified.

No separate pages are approved for `/list-diff`, `/list-difference`, `/random-group-generator`, `/remove-newlines`, `/new-line-remover`, Random Name Picker, Random Item Picker, Email Extractor, generic List Cleaner, Multi-list Compare, fuzzy matching or other adjacency ideas rejected/reserved by the expansion decision.

## Homepage SEO exception

The old localization-era rule to preserve English search-facing copy unchanged is no longer absolute. Expansion V2 contains a new explicit evidence-backed decision to strengthen `/` for `compare lists / list comparison / list diff / list difference` vocabulary.

The canonical route and interaction model stay unchanged. Mathematical set labels must remain truthful: when duplicates are retained, Compare Lists is occurrence/multiset based rather than strict set algebra. The approved implementation therefore prefers neutral UI labels plus explanatory set terminology with a deduplicated-mode caveat.

## Privacy boundary

Raw user list/result content must never enter:

- tool-processing network requests;
- analytics/logs;
- URLs;
- cookies;
- `localStorage`;
- `sessionStorage`.

The four Expansion V2 tools remain fully browser-side. Copy/download occur only after explicit user action.

## Research correctness backlog

The SEO Research Runner has a known market/geo caveat: `research.market`, `googleHl` and `googleGl` do not guarantee the Keyword Surfer extension's own selected country, and automated Google pages can report another physical location. Do not rewrite research evidence as perfectly geo-clean SERP measurement.

For Expansion V2, measured Surfer figures are demand evidence rather than a traffic forecast. Exact DE/FR/ES/RU monthly local volume is not claimed; Russian quantitative truth should come from Yandex/GSC data after launch.

## Active delivery sequence

```text
Batch 0 — repository/docs inspection and contradiction cleanup
Batch 1 — homepage P0 SEO/content upgrade
Batch 2 — shared random allocation engine + Team/Pair tools
Batch 3 — shared text transform engine + Line Breaks/Column tools
Batch 4 — site integration
Batch 5 — all six locales
Batch 6 — full QA and release
```

Do not reopen broad keyword discovery during this wave.

## Documentation precedence

For present work use this order:

1. `CURRENT_STATE.md` — current production/release snapshot;
2. `EXPANSION_V2_DECISION_2026-09-10.md` — binding active expansion scope, route decisions and repository-level corrections;
3. `LOCALIZATION_FINAL_DECISION_2026-09-07.md` — locale/language targeting rules that remain active;
4. `PRODUCT.md`, `UX.md`, `DESIGN.md`, `ARCHITECTURE.md`, `ANALYTICS.md` — domain-specific existing contracts where not explicitly changed by Expansion V2;
5. `LISTCONTRAST_EXPANSION_SCOPE_V1_1.md` — historical shipped V1.1 tool semantics, still authoritative for the original four tools but not for current expansion scope;
6. localization planning/evidence docs — historical rationale and evidence;
7. `SEO_LEGACY_MVP.md`, `LAUNCH_PLAN.md`, `IMPLEMENTATION_PLAN.md`, `RELEASE_AUDIT.md` — historical planning/audit context.

Operational production commands and live acceptance checks remain in `deploy/vps/PRODUCTION.md`. Its route-count gate must be updated to the current release target before Expansion V2 is deployed.