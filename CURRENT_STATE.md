# ListContrast — current state

State date: 2026-09-10

This document is the concise source of truth for the **current production surface, completed release state and indexing expectations**. Historical planning/audit documents remain useful for rationale, but when an older current-state statement conflicts with this file or `EXPANSION_V2_DECISION_2026-09-10.md`, use the newer documents.

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

Expansion V2 was deployed and production-smoked on 2026-09-10. The live indexable surface is now:

```text
6 locales × 11 page identities = 66 canonical/indexable URLs
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

Live page identities:

```text
Compare Lists
Alphabetizer
List Randomizer
Remove Duplicate Lines
Random Team Generator
Random Pair Generator
Remove Line Breaks
Column to Comma Separated List
Tools
About
Privacy
```

Production verification for this release included a healthy production container, public smoke for all English page identities, sitemap count 66, an all-sitemap-URL HTTP sweep, real 404 behavior, `www` → apex redirect and crawlable `robots.txt`. Repository CI before and after the hardening merge was green across formatting, lint, typecheck, unit tests, build and Playwright E2E.

The deployed source SHA is:

```text
45bf1811d8a08cf70c163bdcfeabf72f3d1584a5
```

Last known-good rollback SHA from the pre-Expansion-V2 production release:

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

## Completed release — Expansion V2

The binding implementation decision remains:

```text
EXPANSION_V2_DECISION_2026-09-10.md
```

Shipped work:

1. strengthened `/` for the Compare Lists / List Difference cluster without creating synonym routes or redesigning the comparator;
2. added Random Team / Group Generator;
3. added Random Pair Generator;
4. added Remove Line Breaks / Remove Newlines on one canonical tool page;
5. added Column to Comma Separated List;
6. integrated the four tools into all six existing locales, `/tools`, About, related links, sitemap and hreflang/canonical infrastructure;
7. completed post-implementation UI/UX hardening for custom-separator visibility, Team Generator mode-aware labeling, Pair Generator action-row density and result wrapping semantics.

The resulting live surface is:

```text
42 previous URLs + 24 new localized/tool URLs = 66 canonical/indexable URLs
```

No separate pages are approved for `/list-diff`, `/list-difference`, `/compare-lists`, `/random-group-generator`, `/remove-newlines`, `/new-line-remover`, Random Name Picker, Random Item Picker, Email Extractor, generic List Cleaner, Multi-list Compare, fuzzy matching or other adjacency ideas rejected/reserved by the expansion decision.

## Homepage SEO exception

The old localization-era rule to preserve English search-facing copy unchanged is no longer absolute. Expansion V2 explicitly strengthened `/` for `compare lists / list comparison / list diff / list difference` vocabulary.

The canonical route and interaction model stay unchanged. Mathematical set labels must remain truthful: when duplicates are retained, Compare Lists is occurrence/multiset based rather than strict set algebra. The implementation therefore keeps neutral UI labels plus explanatory set terminology with a deduplicated-mode caveat.

## Privacy boundary

Raw user list/result content must never enter:

- tool-processing network requests;
- analytics/logs;
- URLs;
- cookies;
- `localStorage`;
- `sessionStorage`.

All list tools remain fully browser-side. Copy/download occur only after explicit user action.

## Research correctness backlog

The SEO Research Runner has a known market/geo caveat: `research.market`, `googleHl` and `googleGl` do not guarantee the Keyword Surfer extension's own selected country, and automated Google pages can report another physical location. Do not rewrite research evidence as perfectly geo-clean SERP measurement.

For Expansion V2, measured Surfer figures are demand evidence rather than a traffic forecast. Exact DE/FR/ES/RU monthly local volume is not claimed; Russian quantitative truth should come from Yandex/GSC data after launch.

## Post-release observation

Do not immediately retune titles, H1s, slugs, canonical or hreflang after launch. The next evidence source is actual Search Console and Yandex Webmaster behavior over approximately 7/14/28-day windows.

Watch for:

- first impressions and indexed-page growth across DE/FR/ES/PT-BR/RU;
- query → page pair formation for the four new tool families;
- Compare Lists / List Difference query expansion on `/`;
- `Crawled - currently not indexed`, `Discovered - currently not indexed`, duplicate/canonical issues or unexpected locale cannibalization;
- whether PT-BR and RU begin producing useful localized demand signals.

Broad keyword discovery remains closed until live evidence justifies reopening it.

## Documentation precedence

For present work use this order:

1. `CURRENT_STATE.md` — current production/release snapshot;
2. `EXPANSION_V2_DECISION_2026-09-10.md` — binding expansion scope, route decisions and repository-level corrections;
3. `LOCALIZATION_FINAL_DECISION_2026-09-07.md` — locale/language targeting rules that remain active;
4. `PRODUCT.md`, `UX.md`, `DESIGN.md`, `ARCHITECTURE.md`, `ANALYTICS.md` — domain-specific existing contracts where not explicitly changed by Expansion V2;
5. `LISTCONTRAST_EXPANSION_SCOPE_V1_1.md` — historical shipped V1.1 tool semantics for the original four tools;
6. localization planning/evidence docs — historical rationale and evidence;
7. `SEO_LEGACY_MVP.md`, `LAUNCH_PLAN.md`, `IMPLEMENTATION_PLAN.md`, `RELEASE_AUDIT.md` — historical planning/audit context.

Operational production commands and live acceptance checks remain in `deploy/vps/PRODUCTION.md`, whose release gates now target the live 66-URL surface.
