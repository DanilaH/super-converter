# ListContrast localization SEO research — 2026-09-07

## Purpose

Evidence summary for the first multilingual SEO experiment on ListContrast. Four discovery runs were supplied and reviewed for German (Germany), Brazilian Portuguese (Brazil), French (France), and Spanish (Spain).

This document records the research signals and intended query-to-page mapping. It is evidence, not a guarantee of rankings or traffic.

## Critical data-quality caveat

All four runs report a Google geo mismatch. The requested markets were DE, BR, FR, and ES, but the detected Google location was Chelyabinsk Oblast, Russia for every trustworthy SERP observation.

Implications:

- Surfer search-volume observations are still market-configured and useful as demand signals.
- SERP composition, Ahrefs DR distribution, and opportunity scores are useful directionally, but must not be treated as clean target-country competition measurements.
- Do not overfit page decisions to small DR differences between candidates.
- The visible SERPs were nevertheless strongly language-appropriate and usually matched the intended utility intent, so the runs are sufficient to choose a V1 localization direction.
- PT-BR and FR source data contain some mojibake keyword rows. Never copy damaged strings into production content; all production text must be clean UTF-8 and reviewed for natural language.

Spanish completed with errors: 55/56 Surfer observations were successful. The single partial row does not block the experiment.

## Run summary

| Locale | Target market | Root keywords | Unique domains | Related rows | Quality state |
| --- | --- | ---: | ---: | ---: | --- |
| `de` | Germany | 47 | 108 | 223 | completed; geo mismatch |
| `pt-BR` | Brazil | 46 | 77 | 214 | completed; geo mismatch |
| `fr` | France | 47 | 95 | 227 | completed; geo mismatch |
| `es` | Spain | 56 | 105 | 228 | completed_with_errors; geo mismatch |

## Recommended acquisition mapping

The product keeps the same four intent families as English. Localized pages should be written around native query language instead of literal translations of English keywords.

### German (`de`, Germany)

#### Compare Lists

Primary query: **`listen vergleichen`**

Research signals:

- volume: 320
- score: 65.16 (B)
- median DR: 16
- top-3 median DR: 7
- exact utility pages occupy several top positions

Recommended framing:

- H1: `Listen vergleichen`
- title should include the online/two-list utility intent naturally
- secondary language: `zwei Listen online vergleichen`, `Listen online vergleichen`, `Listenvergleich`

This is the cleanest German opportunity and one of the strongest signals in the entire four-market set.

#### Alphabetizer

Primary page concept: **`Liste alphabetisch sortieren`**

Useful secondary queries:

- `online alphabetisch sortieren` — volume 110, score 49.33
- `Wörter alphabetisch sortieren` — volume 170, score 48.74
- `Liste alphabetisch sortieren` — volume 170
- `Namen alphabetisch sortieren` — volume 90

The SERP mixes direct tools with Word/Excel/tutorial pages. Keep the page clearly tool-first.

#### Randomizer

Primary page concept: **`Liste zufällig mischen`** / **`Zufallsreihenfolge`**

Signals:

- `Zufallsreihenfolge` — volume 70, score 46.83, top-3 median DR 25
- `Liste zufällig mischen` — clear direct-tool SERP

Use natural German UX language. Do not make awkward `randomisieren` wording the main visible copy only because it exists as a query variant.

#### Remove Duplicate Lines

Primary page concept: **`Duplikate aus Liste entfernen`**

Secondary broad term: `Duplikate entfernen` (volume 170).

The broad term is heavily Excel/high-authority. The list/line-specific wording is a better fit for the actual product and should anchor the page.

### Brazilian Portuguese (`pt-BR`, Brazil)

This market has the largest identified absolute demand in the supplied runs.

#### Compare Lists

Primary query: **`comparar listas`**

Signals:

- volume: 210
- score: 48.02
- top results include very weak direct utility domains despite a high overall median DR

Secondary wording: `comparador de listas` (score 52.16, median DR 7.35, top-3 median DR 3.7).

Recommended H1: `Comparar listas online` or `Comparar listas`, whichever reads best with the final intro.

#### Alphabetizer

Primary query/concept: **`ordem alfabética online`**

Signals:

- volume: 1600
- score: 55.23 (B)
- direct online tools dominate much of the SERP

Secondary wording: `lista em ordem alfabética` (volume 110).

This is the single largest clean demand signal in the supplied localization research.

#### Randomizer

Primary query: **`embaralhar lista`**

Signals:

- volume: 140
- score: 51.55
- SERP is strongly aligned with list shuffling/random order

Use `embaralhar` as the principal UX verb rather than an English-derived randomizer term.

#### Remove Duplicate Lines

Primary query: **`remover linhas duplicadas`**

Signals:

- volume: 720
- score: 54.15
- direct tools appear at multiple top positions

Secondary queries:

- `remover duplicados` — volume 720
- `remover duplicatas` — volume 480

Keep the exact line-based tool intent prominent so the page is not framed as an Excel tutorial.

### French (`fr`, France)

#### Compare Lists

Primary query: **`comparer deux listes`**

Signals:

- volume: 210
- score: 51.36
- top-3 median DR: 6
- the first three results are direct comparison utilities with low DR

Secondary wording: `comparaison de listes`, `comparateur de listes`, `comparer listes en ligne`.

This is a strong exact-intent opportunity even though the overall SERP contains high-authority results lower down.

#### Alphabetizer

Primary query/concept: **`trier une liste par ordre alphabétique`**

Signals:

- volume: 70
- score: 42.39
- mixed utility/tutorial SERP

Keep the tool action explicit and do not reduce the page to a generic article about alphabetical order.

#### Randomizer

Primary page concept: **`mélanger une liste`**

Secondary demand term: `liste aléatoire` (volume 170, score 48.02).

`liste aléatoire` can also imply selection/generation, so the H1 and intro should explicitly describe shuffling the order of an existing list.

#### Remove Duplicate Lines

Primary page concept: **`supprimer les lignes en double`** or `supprimer les doublons d’une liste`.

Broad demand term: `supprimer les doublons` — volume 880, score 44.78.

The broad SERP is mostly Excel/tutorial/high-authority content. Use it as secondary language, while the page itself stays line/list-specific.

### Spanish (`es`, Spain)

Demand is lower in the supplied set than PT-BR/DE/FR, but several intents have clean direct-tool SERPs.

#### Compare Lists

Primary query: **`comparar listas online`**

Signals:

- volume: 140
- score: 54.25
- multiple direct utilities, including very low-DR results

Secondary query: `comparar listas` — volume 40.

#### Alphabetizer

Primary page concept: **`ordenar lista alfabéticamente`**

Useful queries:

- `ordenar alfabéticamente` — volume 70
- `ordenar palabras alfabéticamente` — volume 30
- `ordenar lista alfabéticamente online` — direct utility intent

#### Randomizer

Primary page concept: **`mezclar una lista`** / `aleatorizar una lista` with explicit random-order wording.

The high-scoring `mezclar líneas de texto online` query has semantic ambiguity: parts of its SERP mean concatenate/combine text rather than shuffle. Do not use that phrase as the sole primary framing merely because its score is high.

#### Remove Duplicate Lines

Primary page concept: **`eliminar líneas duplicadas`**

Secondary broad query: `eliminar duplicados` — volume 20.

Prefer Spain-natural `eliminar`/`quitar` language. Do not anchor the Spain version on `remover`, which is more natural in other Spanish-speaking markets.

## Relative opportunity read

At V1 level:

1. **PT-BR** has the strongest aggregate demand, especially alphabetizing and duplicate-line removal.
2. **DE** has the cleanest high-confidence Compare Lists opportunity (`listen vergleichen`) and useful demand across the other tools.
3. **FR** has a very attractive low-DR exact compare SERP plus strong broad dedupe demand; dedupe wording must be narrower than the broad query.
4. **ES** is still a valid experiment, especially compare and alphabetize, but raw measured demand is lower and the randomizer wording needs more semantic care.

This ordering is a prioritization signal, not a reason to omit any of the four locales from the approved simultaneous V1 experiment.

## Experimental interpretation

The localized release will not be a pure single-variable A/B test. Each market intentionally receives native keyword targeting, localized visible copy, localized URLs, and locale-correct alphabetic sorting. Treat the outcome as an **applied market-localization SEO experiment**.

Primary comparison dimensions after launch:

- time to discovery/indexing;
- time to first impression and first click;
- impressions by locale and page identity;
- query-cluster breadth;
- position distribution and first movement into top 50 / top 30;
- clicks and CTR only after enough observations exist;
- relative performance against estimated market demand, not raw impressions alone.

Recommended checkpoints: 7, 14, and 28 complete GSC data-days after release.

## Not included

Russian/Yandex was discussed separately but is **not present in these four supplied research runs**. Do not silently add Russian to Localization V1. The architecture should make another locale cheap to add later, but RU requires its own Russian/Yandex discovery and an explicit follow-up decision.
