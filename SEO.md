# SEO.md — current source of truth

This file is the entry point for the current ListContrast SEO strategy.

The original English-only MVP SEO plan has been preserved as [`SEO_LEGACY_MVP.md`](./SEO_LEGACY_MVP.md). It is historical context only and must not override the current route, localization, or release state.

Use the current documents in this order:

1. [`CURRENT_STATE.md`](./CURRENT_STATE.md) — current production/release snapshot and indexable-surface status.
2. [`LOCALIZATION_FINAL_DECISION_2026-09-07.md`](./LOCALIZATION_FINAL_DECISION_2026-09-07.md) — binding Localization V1 locale set, acquisition wording, hreflang/canonical model, and 42-URL target surface.
3. [`LOCALIZATION_SCOPE_V1.md`](./LOCALIZATION_SCOPE_V1.md), [`LOCALIZATION_LANGUAGE_TARGETING_V1.md`](./LOCALIZATION_LANGUAGE_TARGETING_V1.md), and [`LOCALIZATION_PLAN_REVIEW_V1.md`](./LOCALIZATION_PLAN_REVIEW_V1.md) — implementation rationale where not superseded by the final decision.
4. [`evidence/seo/localization/2026-09-07/RESEARCH_SUMMARY.md`](./evidence/seo/localization/2026-09-07/RESEARCH_SUMMARY.md) — localization research evidence and its data-quality caveats.

## Current SEO invariants

- English remains the unprefixed control surface.
- Localization V1 uses `en`, `de`, `fr`, neutral international `es`, `pt-BR`, and `ru`.
- The intended post-deployment indexable surface is 42 canonical URLs: 6 locales × 7 page identities.
- Every localized page is self-canonical and emits reciprocal `hreflang` for `en`, `de`, `fr`, `es`, `pt-BR`, `ru`, plus `x-default` to the English equivalent.
- No automatic geo/IP/browser-language redirects.
- One canonical page per locale and intent cluster; do not create synonym landing pages.
- Compare Lists remains on `/`; do not introduce `/compare-lists` or equivalent English duplicates.
- Localized internal navigation stays inside the active locale except for the explicit language switcher.
- Search-facing copy should not be retuned without post-launch evidence from Search Console or a new explicit research decision.

For historical MVP rationale such as the original English keyword mapping, content philosophy, canonical reasoning, and early Spanish-only future plan, read `SEO_LEGACY_MVP.md` with the understanding that route counts, localization scope, domain placeholders, and future-locale statements there are superseded.
