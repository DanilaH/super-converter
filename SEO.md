# SEO.md — current source of truth

This file is the entry point for the current ListContrast SEO strategy.

The original English-only MVP SEO plan is preserved as [`SEO_LEGACY_MVP.md`](./SEO_LEGACY_MVP.md). It is historical context only and must not override the current route, localization or release state.

Use the current documents in this order:

1. [`CURRENT_STATE.md`](./CURRENT_STATE.md) — current production/release snapshot and indexable-surface status.
2. [`EXPANSION_V2_DECISION_2026-09-10.md`](./EXPANSION_V2_DECISION_2026-09-10.md) — binding active expansion scope, keyword-cluster mapping, route decisions and repository-level implementation corrections.
3. [`LOCALIZATION_FINAL_DECISION_2026-09-07.md`](./LOCALIZATION_FINAL_DECISION_2026-09-07.md) — binding locale/language-targeting model that remains active.
4. Localization planning/evidence docs — implementation rationale and research caveats where not superseded.

## Current SEO invariants

- English remains the unprefixed control surface; active locales are `en`, `de`, `fr`, neutral international `es`, `pt-BR`, and `ru`.
- Every localized page is self-canonical and emits reciprocal `hreflang` for `en`, `de`, `fr`, `es`, `pt-BR`, `ru`, plus `x-default` to the English equivalent.
- No automatic geo/IP/browser-language redirects.
- One canonical page per locale and independent search/product intent. Do not create synonym landing-page families.
- Compare Lists remains on `/`; do not introduce `/compare-lists`, `/list-comparison`, `/list-diff`, `/list-difference` or equivalent English duplicates.
- Localized internal navigation stays inside the active locale except for the explicit language switcher.
- Static HTML must contain the meaningful H1, lead and explanatory content before JavaScript runs.
- Search-volume aliases are evidence for one cluster and must not be added together as independent TAM.
- Search demand evidence is not a traffic/ranking forecast.

## Active Expansion V2 intent map

The 2026-09-10 research closes broad discovery for this implementation wave and approves five product/SEO actions:

| Canonical page | Intent cluster | Decision |
|---|---|---|
| `/` | compare lists / list comparison / compare two lists / list difference / list diff | strengthen existing page; no synonym routes |
| `/random-team-generator` | random team generator / random group generator / split list into random groups | build one Team/Group page |
| `/random-pair-generator` | random pair generator / random pairs / pair people randomly | build separate page |
| `/remove-line-breaks` | remove line breaks / line break remover / remove newlines / new line remover | build one cleanup page |
| `/column-to-comma-separated-list` | column to comma / column to comma separated list / lines to comma separated list | build one converter page |

Rejected/reserved routes must not be added merely because they are easy to implement. That includes separate Random Group, Remove Newlines, List Diff, Random Name Picker, Random Item Picker, Email Extractor, generic List Cleaner, Multi-list Compare, fuzzy matching and the low-evidence utility families recorded in the expansion decision.

## Homepage P0

`/` is already the correct canonical page for the largest discovered cluster. Expansion V2 explicitly supersedes the earlier localization-era freeze on English acquisition copy.

Approved English direction:

```text
Title: Compare Lists Online — List Difference & Matches | ListContrast
H1:   Compare Lists Online
```

Lead/meta/explanatory copy should naturally cover `compare two lists`, list differences, matches, unique items and truthful set vocabulary.

Do not redesign the comparator or add a second canonical route. Do not keyword-stuff aliases into headings.

### Set-operation honesty

With `Remove duplicates` enabled, the comparer behaves as set-style comparison and can be explained using:

```text
Only A      → A − B
Only B      → B − A
Matches     → intersection
Differences → symmetric difference
All         → union / all unique values
```

With duplicates retained, matching is occurrence/multiset based. Therefore static mathematical terms must not imply strict set semantics for every state. Keep the interactive labels neutral and explain the mapping in editorial copy with the deduplicated-mode caveat unless the implementation explicitly conditions the labels on mode.

## Localization

Expansion V2 follows the existing localized-slug route-registry convention; conceptual examples that reuse the English slug after `/de/`, `/fr/`, etc. are not binding.

New pages should use natural local vocabulary, not literal keyword translation. Exact DE/FR/ES/RU local monthly volume is not claimed. PT-BR has stronger measured evidence for Team/Pair wording; Russian remains a qualitative bet to validate with Yandex/GSC.

If all four tools ship across all six existing locales, the post-release indexable surface is expected to become 66 canonical URLs. Do not report that surface as live until production deployment is verified.

## Internal linking

`/tools` is a navigation/internal-linking resource, not a generic SEO landing-page factory. After Expansion V2 it should list 8 actual tools. Tool pages should link contextually to genuinely adjacent tools using descriptive labels, without constructing a dense keyword grid.

## Measurement after release

Do not reopen broad discovery immediately after deployment. Use first-party search-engine evidence:

```text
~7 days   crawl/index sanity and very early impressions
~14 days  first useful query-vocabulary signals
~28 days  more meaningful page/query comparison
```

Inspect the five English priority URLs individually and inspect localized routes by locale rather than blending languages together. Impressions/query formation matter before early click volume.

For historical MVP rationale such as the original English keyword mapping, content philosophy and canonical reasoning, read `SEO_LEGACY_MVP.md` with the understanding that route counts, localization scope, domain placeholders and old future-locale statements are superseded.