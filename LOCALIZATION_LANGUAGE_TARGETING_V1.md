# ListContrast — Localization V1 language targeting decision

Status: **binding clarification for Localization V1**  
Decision date: 2026-09-07

This document clarifies the language-vs-region targeting model used by `LOCALIZATION_SCOPE_V1.md` and `LOCALIZATION_PLAN_REVIEW_V1.md`.

If older wording in those documents implies a different regional target, this decision controls for V1.

## Final V1 targeting model

| Locale key | Public path prefix | HTML `lang` | `hreflang` | Content target | Research origin |
| --- | --- | --- | --- | --- | --- |
| `en` | unprefixed | `en` | `en` | generic English | existing production/control |
| `de` | `/de/` | `de` | `de` | generic German | Germany discovery run |
| `fr` | `/fr/` | `fr` | `fr` | generic French | France discovery run |
| `es` | `/es/` | `es` | `es` | neutral international Spanish | Spain discovery run |
| `pt-br` | `/pt-br/` | `pt-BR` | `pt-BR` | Brazilian Portuguese | Brazil discovery run |

## German

German V1 is language-targeted, not Germany-exclusive.

- Write natural standard German suitable for users in Germany, Austria, Switzerland and other German-speaking markets where the terminology remains appropriate.
- Do not inject Germany-only wording merely because the discovery run used Germany as the target market.
- Keep `de` rather than `de-DE` in HTML/hreflang and keep `/de/` as the route prefix.
- The Germany research remains useful evidence for query selection and SERP shape, but it is not a regional restriction on the produced page.

## French

French V1 is language-targeted, not France-exclusive.

- Write standard, broadly understandable French.
- Avoid unnecessary France-only wording when a neutral French formulation is available.
- Keep `fr` rather than `fr-FR` in HTML/hreflang and keep `/fr/` as the route prefix.
- The France discovery run is the starting SEO evidence, not a requirement to regionalize the page to France.

## Spanish

Spanish V1 must be written as **neutral international Spanish**.

- Prefer vocabulary and grammar that read naturally across Spain and Latin America.
- Avoid Spain-only colloquialisms and avoid deliberately LATAM-specific regionalisms when a neutral alternative exists.
- SEO copy should use the discovery evidence as a starting point, but query phrases must be reviewed for neutral-language fit before being promoted into titles, H1s or core UI wording.
- Keep `es` rather than `es-ES`, `es-MX`, or another regional code in HTML/hreflang and keep `/es/` as the route prefix.
- V1 does not create separate Spain/LatAm pages. Regional Spanish variants may become a later experiment only if search data shows a real opportunity or terminology conflict.

This clarifies the older scope wording that the discovery run was Spain-oriented: the **research source is Spain, but the shipped Spanish content is neutral language-targeted Spanish**.

## Portuguese

Portuguese V1 is intentionally **Brazilian Portuguese**, not generic Portuguese.

- Write native `pt-BR` copy and use Brazilian terminology/search phrasing.
- Keep `/pt-br/`, HTML `lang="pt-BR"`, hreflang `pt-BR`, and `Intl` collation `pt-BR`.
- Do not broaden this page to generic `pt` merely to cover Portugal and other Portuguese-speaking markets.
- Do not create `pt-PT` in V1.

Reason: the current discovery evidence and strongest observed opportunity are specifically Brazilian. A generic Portuguese version would claim language-market coverage that was not researched and could force awkward compromises between Brazilian and European Portuguese terminology.

## Technical consequences

The existing route strategy remains unchanged:

```text
en     -> unprefixed English routes
de     -> /de/...
fr     -> /fr/...
es     -> /es/...
pt-br  -> /pt-br/...
```

Locale configuration should therefore remain conceptually:

```text
en     html/hreflang/collation -> en
de     html/hreflang/collation -> de
fr     html/hreflang/collation -> fr
es     html/hreflang/collation -> es
pt-br  html/hreflang/collation -> pt-BR
```

Do not add `de-DE`, `fr-FR`, `es-ES`, generic `pt`, or additional regional alternates in V1.

The hreflang cluster remains:

```text
en
de
fr
es
pt-BR
x-default -> English equivalent
```

## Content/SEO review rule

Before localized copy is approved, review each acquisition page on two independent axes:

1. **Search fit** — the wording must reflect the query/intent evidence from the discovery runs.
2. **Language fit** — DE/FR must remain broadly language-neutral, ES must be intentionally neutral international Spanish, and PT-BR must be explicitly Brazilian.

Do not sacrifice clear native copy just to preserve an exact-match keyword from the research export.

## Measurement implication

After launch, measure country distribution inside each language surface rather than assuming the research origin will be the only market reached.

Examples:

- `/de/` may receive impressions from Germany, Austria or Switzerland;
- `/fr/` may receive impressions from France, Belgium, Canada or Switzerland;
- `/es/` may receive impressions from Spain and multiple Latin-American countries;
- `/pt-br/` is expected to be Brazil-led and should be evaluated primarily as the Brazilian Portuguese experiment.

Cross-country reach is an observation outcome, not a reason to add regional pages before evidence exists.
