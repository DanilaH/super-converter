# ListContrast — current state

State date: 2026-09-07

This document is the concise source of truth for the **current production surface, active release work and indexing expectations**. Historical planning/audit documents remain useful for rationale, but when an older current-state statement conflicts with this file or `LOCALIZATION_FINAL_DECISION_2026-09-07.md`, use the newer documents.

## Product and stack

ListContrast is a small static browser-side toolkit for line-based list work.

```text
Astro
TypeScript strict
vanilla browser APIs
static output
```

Compare Lists remains the anchor utility. Localization does not authorize new tools or broader product semantics.

## Production state before Localization V1 release

The public production site is still the existing English surface until the localization release is merged and deployed:

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

A real 404 remains `noindex,nofollow` and has no canonical URL.

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

## Active release — Localization V1 / L10N-2

The final approved locale set is:

```text
en     existing unprefixed English control
de     generic German
fr     generic French
es     neutral international Spanish
pt-br  Brazilian Portuguese (`pt-BR`)
ru     generic Russian
```

The implementation branch/PR is intended to release all six language surfaces atomically. Each locale has the same seven `PageKey` identities: Compare, Alphabetizer, Randomizer, Dedupe, Tools, About and Privacy.

After the release is actually deployed, expected normal indexable surface:

```text
6 locales × 7 pages = 42 canonical/indexable URLs
7 existing English URLs + 35 localized URLs
```

Do **not** report the 42-URL surface as live before production deployment is verified.

The binding final scope/SEO decision is:

```text
LOCALIZATION_FINAL_DECISION_2026-09-07.md
```

The older four-locale planning documents remain historical implementation rationale. Their statements that Russian is excluded or that the final surface is 35 URLs are superseded by the final decision above.

## Localization behavior

Release invariants:

- English paths and search-facing acquisition semantics remain the control;
- every localized page is statically rendered and self-canonical;
- equivalent pages emit reciprocal `hreflang` for `en`, `de`, `fr`, `es`, `pt-BR`, `ru`, plus `x-default` to English;
- only the explicit crawlable language switcher crosses locale boundaries;
- internal navigation otherwise remains inside the active locale;
- no automatic IP/browser-language redirects;
- no runtime i18n dependency or translation service;
- Alphabetizer uses locale-aware `Intl.Collator` (`en`, `de`, `fr`, `es`, `pt-BR`, `ru`);
- localized visible examples come from locale content rather than English browser-script constants;
- privacy/product behavior stays equivalent to English.

Russian is a qualitative localization bet. Exact Yandex/Wordstat monthly volume is not claimed. The approved RU acquisition wording is recorded in `LOCALIZATION_FINAL_DECISION_2026-09-07.md` and the final localization handoff.

## Research correctness backlog

A real research-runner correctness issue was discovered: `research.market`, `googleHl` and `googleGl` do not guarantee the Keyword Surfer extension's own selected country. The extension market must be verified independently, and stale market-specific values can remain in cache for roughly seven days.

Future locale research therefore requires a market preflight that verifies Keyword Surfer against `research.market` and fails closed on mismatch, plus an isolated cache for market-correction runs. This belongs to the SEO Research Runner backlog; it is not a ListContrast runtime feature.

## Delivery sequence

```text
L10N-1 — locale/content/route foundation + English parity; no new indexable URLs
L10N-2 — DE/FR/ES/PT-BR/RU content + localized routes + locale-aware Alphabetizer + SEO/linking/sitemap + release
```

Do not expose a partial public locale set between these packages unless a real release blocker forces a new explicit decision.

## Documentation precedence

For present repository/release state use this order:

1. `CURRENT_STATE.md` — current production/release snapshot;
2. `LOCALIZATION_FINAL_DECISION_2026-09-07.md` — final Localization V1 locale/count/query decision;
3. `LOCALIZATION_SCOPE_V1.md`, `LOCALIZATION_LANGUAGE_TARGETING_V1.md`, `LOCALIZATION_PLAN_REVIEW_V1.md` — historical/implementation rationale where not superseded;
4. `evidence/seo/localization/2026-09-07/RESEARCH_SUMMARY.md` — original four-run evidence, interpreted with the later Runner/Surfer correction;
5. domain-specific source of truth (`PRODUCT.md`, `UX.md`, `DESIGN.md`, `LISTCONTRAST_EXPANSION_SCOPE_V1_1.md`, `SEO.md`, `ARCHITECTURE.md`, `ANALYTICS.md`);
6. current assigned GitHub Issue / explicitly approved task;
7. older planning/audit documents for rationale and traceability.

Operational production commands and live acceptance checks are in `deploy/vps/PRODUCTION.md`; its localization release gate must expect 42 sitemap URLs after L10N-2 is deployed.
