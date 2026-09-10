# ListContrast — Expansion V2 decision

**Date:** 2026-09-10  
**Status:** approved implementation contract after repository-level re-review  
**Domain:** `https://listcontrast.com`

This document integrates the 2026-09-10 expansion/SEO handoff into the repository documentation. It is binding for the current implementation wave and supersedes older statements that say no additional ListContrast tool expansion is active.

The detailed research handoff remains the evidence/rationale source. This file records the repository-compatible execution decision after independently checking the current Astro/i18n architecture and existing product semantics.

## 1. Approved scope

### P0 homepage upgrade

Keep `/` as the only canonical page for the overlapping Compare Lists / List Difference intent family. Do not create `/compare-lists`, `/list-comparison`, `/list-diff`, `/list-difference` or other synonym pages.

Approved English direction:

- H1 remains `Compare Lists Online`;
- title becomes `Compare Lists Online — List Difference & Matches | ListContrast`;
- lead/meta copy may naturally include `compare two lists`, `list differences`, matches, unique items, intersection and union;
- the current two-list interaction model stays intact.

Mathematical set terminology must remain truthful. With `Remove duplicates` enabled, explanatory copy may map the results to A−B, B−A, intersection, symmetric difference and union. With duplicates retained, Compare Lists has occurrence/multiset semantics, so the interactive labels must not pretend every mode is a strict mathematical set operation. The implementation should therefore keep the existing neutral result-tab labels and explain the set mapping in editorial copy with an explicit deduplicated-mode caveat.

### Four new independent tools

Build exactly these new tool identities in this wave:

1. `randomTeamGenerator` — Random Team / Group Generator;
2. `randomPairGenerator` — Random Pair Generator;
3. `removeLineBreaks` — Remove Line Breaks / Remove Newlines;
4. `columnToCommaSeparatedList` — Column to Comma Separated List.

Do not add separate synonym routes such as `/random-group-generator`, `/remove-newlines` or `/new-line-remover`.

Reserve/reject for this wave: Random Name Picker, Random Item Picker, Email Extractor, generic List Cleaner, Multi-list Compare, fuzzy matching, invisible-character tools, SQL/JSON/prefix/suffix/chunking pages and other low-evidence utility expansion.

## 2. Independent repository review corrections

The research handoff is directionally sound, with these repository-specific corrections fixed here before coding:

1. **Localized slugs follow the actual route registry convention.** The handoff's `/de/random-team-generator` style examples are conceptual only. Current ListContrast uses localized slugs, so new locale routes also use localized slugs.
2. **All six existing locales ship together if QA stays green.** The current typed static i18n architecture makes the engineering marginal cost low enough to prefer one coherent `en/de/fr/es/pt-br/ru` release. English must still not be blocked by speculative extra features.
3. **The target indexable surface becomes 66 URLs after this release is deployed:** 6 locales × 11 page identities. Until deployment is verified, production remains the current 42-URL surface.
4. **Line-break processing needs its own text-normalization helper.** The current single-list parser is intentionally line/item oriented and does not express paragraph-preservation semantics. Remove Line Breaks must normalize LF/CRLF/CR explicitly and must not be implemented by blindly joining `processListInput()` output.
5. **Random allocation reuses the shipped Fisher–Yates primitive.** Team and Pair generation should share pure allocation helpers and preserve repeated identical input occurrences. No fairness/cryptographic claim is allowed while the random source remains `Math.random`.
6. **No new runtime dependencies.** These are small deterministic browser-side transforms and allocation functions.
7. **No new privacy boundary.** Raw pasted names/text remain browser-only and are never placed in URLs, storage, analytics, logs or tool-processing network requests.

## 3. Final route registry for the new tools

English:

```text
/random-team-generator
/random-pair-generator
/remove-line-breaks
/column-to-comma-separated-list
```

German:

```text
/de/zufaelliger-teamgenerator
/de/zufaellige-paare-bilden
/de/zeilenumbrueche-entfernen
/de/spalte-in-kommagetrennte-liste
```

French:

```text
/fr/generateur-equipes-aleatoires
/fr/generateur-paires-aleatoires
/fr/supprimer-sauts-de-ligne
/fr/colonne-liste-separee-par-virgules
```

Spanish:

```text
/es/generador-equipos-aleatorios
/es/generador-parejas-aleatorias
/es/eliminar-saltos-de-linea
/es/columna-lista-separada-por-comas
```

Brazilian Portuguese:

```text
/pt-br/sorteador-de-times
/pt-br/sorteador-de-duplas
/pt-br/remover-quebras-de-linha
/pt-br/coluna-lista-separada-por-virgulas
```

Russian:

```text
/ru/generator-sluchaynyh-komand
/ru/generator-sluchaynyh-par
/ru/ubrat-perenosy-strok
/ru/stolbec-v-spisok-cherez-zapyatuyu
```

Each locale keeps the existing reciprocal hreflang cluster (`en`, `de`, `fr`, `es`, `pt-BR`, `ru`, `x-default`) and self-canonical behavior.

## 4. Product invariants

### Random Team / Group Generator

- one valid input occurrence is assigned exactly once;
- duplicates are preserved as separate occurrences;
- `Number of teams`: sizes differ by at most one;
- `People per team`: treat the value as target/max size, derive `ceil(N / targetSize)` groups, then distribute evenly;
- team count greater than participant count, zero and negative values are invalid;
- result supports reroll and copy; per-team copy is optional, not release-blocking.

Reference examples:

```text
10 items / 3 teams      → 4 + 3 + 3
10 items / target 3     → 3 + 3 + 2 + 2
```

### Random Pair Generator

- each valid occurrence appears exactly once;
- even N → N/2 pairs;
- odd N → floor(N/2) pairs plus one explicit Unpaired item;
- repeated names remain separate occurrences;
- no anti-repeat history across rerolls.

### Remove Line Breaks

- normalize `\r\n`, `\n` and bare `\r` first;
- default replacement is a space;
- presets: Space, Nothing, Comma, Comma + space, Semicolon, Custom;
- Keep paragraph breaks preserves blank-line-separated paragraph boundaries while joining single hard wraps inside paragraphs;
- optional low-cost Trim each line and Collapse repeated spaces controls are in scope;
- do not concatenate words by default.

### Column to Comma Separated List

- one deliberate list item per line;
- default: Trim surrounding whitespace ON, Ignore empty lines ON;
- delimiter presets: Comma + space, Comma, Semicolon, Pipe, Tab, Custom;
- duplicates remain unless a future explicit option says otherwise;
- output is a single serialized line/string with copy and download.

## 5. Localization contract

Use natural local product vocabulary rather than literal English keyword substitution. Primary H1 direction:

| Locale | Team / Group | Pair | Remove Line Breaks | Column → Comma |
|---|---|---|---|---|
| en | Random Team & Group Generator | Random Pair Generator | Remove Line Breaks | Column to Comma Separated List |
| de | Zufälliger Teamgenerator | Zufällige Paare bilden | Zeilenumbrüche entfernen | Spalte in kommagetrennte Liste |
| fr | Générateur d’équipes aléatoires | Générateur de paires aléatoires | Supprimer les sauts de ligne | Convertir une colonne en liste séparée par des virgules |
| es | Generador de equipos aleatorios | Generador de parejas aleatorias | Eliminar saltos de línea | Columna a lista separada por comas |
| pt-BR | Sorteador de Times e Equipes | Sorteador de Duplas | Remover Quebras de Linha | Coluna para Lista Separada por Vírgulas |
| ru | Генератор случайных команд | Генератор случайных пар | Убрать переносы строк | Столбец в список через запятую |

Exact local monthly search volume is not claimed for DE/FR/ES/RU. PT-BR has stronger quantitative evidence for Team/Pair wording; Russian priority remains a qualitative/Yandex/GSC bet.

## 6. Site integration

After implementation:

- `/tools` contains all 8 tools;
- About copy no longer enumerates only the old four tools;
- related links are contextual, not a dense sitewide keyword grid;
- sitemap/canonical/hreflang generation derives from the typed route registry;
- privacy remains accurate because all new tool processing stays local;
- no new schema type is added merely for SEO decoration.

Preferred related relationships:

```text
Compare Lists ↔ Remove Duplicate Lines / Remove Line Breaks / Column to Comma
List Randomizer ↔ Random Team Generator / Random Pair Generator
Random Team Generator ↔ Random Pair Generator / List Randomizer
Remove Line Breaks ↔ Column to Comma / Remove Duplicate Lines
```

## 7. Delivery workflow

Execute in this order:

```text
Batch 0  repository/docs inspection and contradiction cleanup
Batch 1  homepage SEO/content upgrade, no comparator redesign
Batch 2  shared random allocation domain + Team/Pair tools
Batch 3  shared text transform domain + Line Breaks/Column tools
Batch 4  tools/about/related routes + sitemap/metadata integration
Batch 5  all existing locales
Batch 6  unit + type + build + browser/E2E + privacy/SEO QA
```

Do not broaden scope between batches.

## 8. Definition of done

The wave is done only when:

- `/` remains the canonical Compare Lists page and its stronger copy is semantically truthful;
- all four English routes exist and work;
- all selected localized equivalents are complete and contain no accidental English fallback fragments;
- Team/Pair occurrence and balance invariants are covered by tests;
- line-ending, paragraph and delimiter behavior is covered by tests;
- `/tools` contains 8 tools and About is current;
- all 66 intended post-release URLs build, self-canonicalize, hreflang correctly and appear in sitemap;
- no raw tool input appears in network/storage/telemetry behavior;
- format, lint, typecheck, unit tests, build and Playwright smoke all pass;
- no rejected synonym route is created.

After deployment, stop broad research and use GSC/Yandex Webmaster as the next evidence source at approximately 7/14/28-day windows.