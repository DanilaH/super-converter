# ListContrast — final Localization V1 decision

Decision date: 2026-09-07

This file records the final implementation decision after the initial four-locale planning documents and the later Russian/Yandex research pass. For Localization V1, it **supersedes older statements that exclude Russian or describe the final indexable surface as 35 URLs**. Historical research/review documents remain useful for rationale.

## Final locale set

```text
en     existing English control
 de    German, language-targeted
fr     French, language-targeted
es     neutral international Spanish
pt-br  Brazilian Portuguese (`pt-BR`)
ru     Russian, language-targeted
```

Localization V1 therefore contains **6 language surfaces × 7 existing page identities = 42 indexable canonical URLs** after release: 7 existing English URLs plus 35 non-English URLs.

No locale adds a new product tool. The localized product remains the same Compare Lists, Alphabetizer, List Randomizer, Remove Duplicate Lines, Tools, About, and Privacy surface.

## Final acquisition wording

Use one page per locale and intent cluster. Do not create synonym landing pages.

| Locale | Compare H1 | Alphabetizer H1 | Randomizer H1 | Dedupe H1 |
| --- | --- | --- | --- | --- |
| `de` | `Listen online vergleichen` | `Liste online alphabetisch sortieren` | `Liste zufällig mischen` | `Doppelte Zeilen online entfernen` |
| `fr` | `Comparer deux listes en ligne` | `Trier une liste par ordre alphabétique en ligne` | `Mélanger une liste en ligne` | `Supprimer les lignes en double en ligne` |
| `es` | `Comparar dos listas online` | `Ordenar una lista alfabéticamente online` | `Aleatorizar una lista online` | `Eliminar líneas duplicadas online` |
| `pt-br` | `Comparar listas online` | `Colocar lista em ordem alfabética online` | `Embaralhar lista online` | `Remover linhas duplicadas online` |
| `ru` | `Сравнить два списка онлайн` | `Сортировать список по алфавиту онлайн` | `Перемешать список онлайн` | `Удалить дубликаты строк онлайн` |

Russian primary intent mapping:

```text
Compare:    сравнить два списка онлайн
Alphabet:   сортировать список по алфавиту
Randomize:  перемешать список онлайн
Dedupe:     удалить дубликаты строк
```

Russian was a **qualitative YES**. The available workflow did not provide trustworthy Yandex/Wordstat monthly-volume data, so no exact Russian monthly search-volume claim is part of the decision. Native utility intent and SERP fit were clear enough to ship because the incremental implementation cost after the i18n foundation is low.

## Language targeting

Technical locale signals:

```text
en     html/hreflang/collation -> en
de     html/hreflang/collation -> de
fr     html/hreflang/collation -> fr
es     html/hreflang/collation -> es
pt-br  html/hreflang/collation -> pt-BR
ru     html/hreflang/collation -> ru
```

DE, FR, ES, and RU are language-targeted rather than country-exclusive. ES remains neutral international Spanish. PT-BR remains explicitly Brazilian Portuguese; do not broaden it to generic `pt` or add `pt-PT` in V1.

Each equivalent page emits self canonical plus reciprocal alternates for:

```text
en
de
fr
es
pt-BR
ru
x-default -> English equivalent
```

No automatic redirects by IP, geolocation, browser locale, or `Accept-Language`.

## Functional localization

The Alphabetizer must use the current page locale for `Intl.Collator` while preserving numeric ordering and stable ties. The other three tool algorithms keep the existing language-independent semantics.

Page-visible examples should be localized. Download filenames may remain stable ASCII technical filenames.

Russian counters must not display grammatically incorrect cardinal forms. A compact invariant abbreviation is acceptable in V1 if used instead of introducing a runtime pluralization subsystem solely for RU.

## Critical Runner / Keyword Surfer correctness finding

`research.market`, `googleHl`, and `googleGl` do **not** guarantee that the Keyword Surfer browser extension is using the same country. Keyword Surfer keeps its own UI-selected market.

Observed consequence: the first PT-BR / DE / FR measurements were contaminated until the extension market was manually corrected. German keywords were mostly zero before the extension was switched to Germany; meaningful volume appeared immediately after correction.

Required workflow for future market research:

1. open the research Chrome;
2. manually select the intended country in Keyword Surfer;
3. verify it visually;
4. use a fresh/isolated cache when wrong-market values may already be cached;
5. only then run research.

Runner hardening backlog: **add a preflight that verifies the active Keyword Surfer country against `research.market` and fails closed on mismatch.** This is a correctness issue, not optional polish.

Completed keyword results are cached for roughly seven days, so changing the Surfer country and simply rerunning can return stale wrong-market values. Market-correction runs must use an isolated cache DB/namespace, preserve historical runs, and verify that corrected values are not cache hits from the previous market.

## Research stop condition and measurement

Pre-launch localization research is complete. Do not delay implementation for more keyword expansion or try to recover fake precision from contaminated rows.

After release, Search Console becomes the primary source for Google discovery. Track by locale/page:

- indexing;
- impressions and clicks;
- average position;
- actual query clusters;
- country distribution;
- secondary wording that begins receiving impressions.

Do not judge the localization experiment after only one or two weeks. The first question is whether localized pages receive impressions for the intended native intent clusters. Use real post-launch query data before retuning titles/H1/copy.
