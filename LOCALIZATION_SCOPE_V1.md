# ListContrast — Localization V1 implementation scope

Status: **approved implementation plan, not yet shipped**  
Plan date: 2026-09-07

Research evidence: `evidence/seo/localization/2026-09-07/RESEARCH_SUMMARY.md`

## 1. Goal

Add complete German, Brazilian Portuguese, French, and Spanish versions of the existing ListContrast product as a controlled multilingual SEO experiment.

The experiment reuses the same four utility semantics and the same browser-side processing. It does **not** add new tools, backend behavior, analytics providers, persistence, ads, accounts, or generic content expansion.

Locales in V1:

```text
en     existing default/control
 de    German / Germany research
fr     French / France research
es     Spanish / Spain research
pt-br  Brazilian Portuguese / Brazil research
```

English remains unprefixed and must preserve its existing URLs and search-facing content unless an explicitly documented localization-plumbing change is required.

## 2. Definition of the localized product

“Translate the whole project” means every normal user-facing page and all meaningful page-visible UI/editorial copy must have a locale version:

```text
Compare Lists
Alphabetizer
List Randomizer
Remove Duplicate Lines
Tools
About
Privacy
header/navigation
footer/navigation
related-tools blocks
tool labels / states / confirmations / accessibility strings
metadata (title + description)
noscript copy
examples where language/collation matters
```

Localized About/Privacy/Tools are supporting pages, not new keyword opportunities. Do not stuff them with acquisition keywords.

The one global static 404 is a documented V1 exception. Do not add client-side locale detection or server infrastructure solely to localize error rendering. It remains `noindex,nofollow` and must keep correct 404 behavior.

## 3. Non-goals

V1 does not include:

- Russian or Yandex localization;
- Portuguese for Portugal (`pt-PT`);
- Latin-American generic Spanish targeting;
- automatic geo/IP/browser-language redirects;
- a runtime translation service or external i18n dependency;
- user accounts or language preference persistence;
- new utility features;
- synonym landing pages for the same intent;
- translated blog/article content because no such product surface exists;
- a generic plugin-style localization framework.

## 4. SEO experiment constraint: preserve English as the control

The localization release must not accidentally reset or contaminate the existing English observation window.

Before adding localized URLs, refactor English rendering to the new locale-aware plumbing while preserving:

- the seven existing English paths;
- current English title, meta description, H1, editorial content and tool copy;
- current English canonical URLs;
- current tool semantics/defaults;
- current internal English destination pages;
- current static rendering and privacy boundaries.

A build-level English parity test is required before localized routes are exposed.

## 5. URL strategy

Use one `.com` origin with locale subdirectories. Do not create country domains or locale subdomains.

English remains the default unprefixed locale. Non-English pages use locale prefixes and localized acquisition/supporting slugs.

Canonical page identity must be independent from its localized path. Introduce a stable `PageKey` rather than deriving page equivalence from the slug.

Recommended page identity:

```ts
type PageKey =
  | "home"
  | "alphabetizeList"
  | "randomizeList"
  | "removeDuplicateLines"
  | "tools"
  | "about"
  | "privacy";
```

Recommended route matrix:

| PageKey | English | German | French | Spanish | Brazilian Portuguese |
| --- | --- | --- | --- | --- | --- |
| home | `/` | `/de/` | `/fr/` | `/es/` | `/pt-br/` |
| alphabetizeList | `/alphabetize-list` | `/de/liste-alphabetisch-sortieren` | `/fr/trier-liste-ordre-alphabetique` | `/es/ordenar-lista-alfabeticamente` | `/pt-br/ordem-alfabetica` |
| randomizeList | `/randomize-list` | `/de/liste-zufaellig-mischen` | `/fr/melanger-liste` | `/es/mezclar-lista` | `/pt-br/embaralhar-lista` |
| removeDuplicateLines | `/remove-duplicate-lines` | `/de/duplikate-aus-liste-entfernen` | `/fr/supprimer-doublons-liste` | `/es/eliminar-lineas-duplicadas` | `/pt-br/remover-linhas-duplicadas` |
| tools | `/tools` | `/de/werkzeuge` | `/fr/outils` | `/es/herramientas` | `/pt-br/ferramentas` |
| about | `/about` | `/de/ueber` | `/fr/a-propos` | `/es/acerca-de` | `/pt-br/sobre` |
| privacy | `/privacy` | `/de/datenschutz` | `/fr/confidentialite` | `/es/privacidad` | `/pt-br/privacidade` |

ASCII slugs are intentional for operational simplicity; the words themselves remain language-specific. Do not translate the existing English slugs.

The final implementation may adjust an individual localized slug before release if native copy review finds a clearer phrasing, but the `PageKey` mapping must stay one-to-one and permanent after indexable launch.

## 6. Locale and route model

Create a small static locale layer; do not add a third-party i18n package.

Suggested structure:

```text
src/i18n/
  types.ts
  locales.ts
  routes.ts
  content.ts

src/content/locales/
  en.ts
  de.ts
  fr.ts
  es.ts
  pt-br.ts
```

The exact filenames may differ, but the responsibilities must remain explicit:

### Locale config

Each locale needs stable technical metadata:

```ts
type Locale = "en" | "de" | "fr" | "es" | "pt-br";

type LocaleConfig = {
  htmlLang: "en" | "de" | "fr" | "es" | "pt-BR";
  hreflang: "en" | "de" | "fr" | "es" | "pt-BR";
  label: string;
  collatorLocale: string;
};
```

Use `pt-br` in filesystem/path configuration and `pt-BR` in HTML/hreflang/Intl where appropriate.

### Route registry

Maintain one typed `Record<Locale, Record<PageKey, string>>` as the source of truth for:

- canonicals;
- language-switch links;
- localized internal links;
- sitemap paths;
- static-path generation;
- hreflang alternates.

Delete the current duplicated assumption that `metadataKey` alone implies one English canonical path. Do not maintain separate hardcoded path lists for sitemap, header/footer and canonicals.

### Content registry

Move language-neutral content types out of `src/content/en.ts` into neutral types. Each locale exports a complete typed content object using `satisfies LocaleContent` (or an equivalent strict compile-time contract).

A missing locale string must fail typecheck/build instead of silently falling back to English.

Do **not** implement automatic English string fallback for indexable localized pages. A partially English page weakens the experiment and can make page language ambiguous.

## 7. Routing implementation

Keep static output.

Preferred implementation:

- keep the seven existing English page routes in place;
- make those English pages consume the same locale/content abstractions as localized routes;
- generate non-English pages statically from the locale/page route registry;
- use a small `getStaticPaths()`-based localized route shell rather than copying 28 nearly identical page files;
- keep page-specific rendering explicit enough that Compare Lists and single-list tools do not collapse into a generic “universal tool framework.”

Because V1 intentionally uses different slugs between locales, a project-owned route registry is the primary source of truth. Astro’s built-in i18n helpers may be used only if they reduce code without introducing redirect/fallback behavior or a second route mapping. Do not enable automatic locale redirects.

All output must remain prerendered static HTML.

## 8. Component refactor

Current components import English content deep inside the tree. Remove that coupling before adding locales.

Required changes:

- `BaseLayout.astro` receives `locale` + `pageKey` (or equivalent) instead of reading only English metadata.
- `SiteHeader.astro` receives localized labels and locale-aware links.
- `SiteFooter.astro` receives localized labels and locale-aware links.
- `RelatedTools.astro` receives a localized heading and related tool descriptors; remove the hardcoded `Related tools` string.
- `CompareTool.astro`, `AlphabetizeTool.astro`, `RandomizeTool.astro`, and `RemoveDuplicateLinesTool.astro` receive their message/content object as props instead of importing English modules internally.
- page wrappers must not contain hardcoded English related-tool labels/descriptions.

Keep the current DOM/data-hook strategy. Tool scripts should continue reading localized labels from rendered `data-*` attributes rather than importing locale modules into browser code.

## 9. Localized content strategy

Do not literally translate English sentences word-for-word and then sprinkle keywords into them. Each acquisition page gets a native-language rewrite constrained by the existing product semantics.

All locales must preserve factual claims:

- processing is local in the browser;
- raw lists/results are not uploaded for tool processing;
- no account is required;
- Copy/Download behavior stays unchanged;
- the current privacy/analytics statements must stay equivalent to production reality.

### German query mapping

```text
Compare:    Listen vergleichen
Alphabet:   Liste alphabetisch sortieren
Randomize:  Liste zufällig mischen / Zufallsreihenfolge
Dedupe:     Duplikate aus Liste entfernen
```

### Brazilian Portuguese query mapping

```text
Compare:    Comparar listas / Comparar listas online
Alphabet:   Ordem alfabética online
Randomize:  Embaralhar lista
Dedupe:     Remover linhas duplicadas
```

### French query mapping

```text
Compare:    Comparer deux listes
Alphabet:   Trier une liste par ordre alphabétique
Randomize:  Mélanger une liste (secondary: liste aléatoire)
Dedupe:     Supprimer les doublons d’une liste / supprimer les lignes en double
```

### Spanish query mapping

```text
Compare:    Comparar listas online
Alphabet:   Ordenar lista alfabéticamente
Randomize:  Mezclar una lista / aleatorizar una lista
Dedupe:     Eliminar líneas duplicadas
```

For Spanish randomizer, avoid using `mezclar líneas de texto online` as the only primary phrase: the observed SERP mixes shuffle intent with text concatenation/combination.

For French and German dedupe, avoid framing the page solely around the broad “remove duplicates” query because broad SERPs contain substantial Excel/tutorial intent.

## 10. Functional adaptation: Alphabetizer must become locale-aware

This is not a copy-only project.

The current domain function uses a fixed English collator:

```ts
new Intl.Collator("en", {
  numeric: true,
  sensitivity: "accent",
});
```

For localized pages, the sort contract must use the page locale:

```text
en     -> en
 de    -> de
fr     -> fr
es     -> es
pt-br  -> pt-BR
```

Required implementation behavior:

- pass the locale/collation identifier explicitly into the pure alphabetizer domain function or its options;
- preserve `numeric: true` and the intended case-insensitive/accent-aware semantics unless tests prove a language-specific reason to change them;
- preserve stable ordering when the collator reports equality;
- cache/reuse collators if useful, but do not add a dependency;
- keep English output behavior unchanged;
- add locale-specific unit fixtures using accented/local letters and numeric strings;
- rewrite each locale’s explanatory copy so it describes locale-aware sorting, not the current “fixed English-facing browser collation.”

Compare, Randomizer, and Remove Duplicate Lines remain language-independent in their core algorithms for these four locales. Audit their case-normalization behavior but do not add locale-specific semantics without a demonstrated bug.

## 11. Examples and browser-script hardcoding

Audit all visible or user-observable English constants in `src/scripts` and components.

Known examples include:

- Alphabetizer hardcoded English example values;
- Randomizer hardcoded `Alpha/Bravo/...` example values;
- Remove Duplicate Lines hardcoded `Apple/Banana/...` example values;
- Compare’s email example is language-neutral enough to keep if desired;
- tool download filenames are currently hardcoded English filenames.

Move example data that should vary by locale into rendered configuration/data attributes rather than duplicating browser scripts.

V1 requirement: all **page-visible** example content should feel appropriate in the current locale, especially Alphabetizer examples that demonstrate collation.

Download filenames are not an SEO surface. They may remain stable ASCII technical filenames if changing them adds unnecessary branching; record the decision in implementation notes rather than creating a filename localization subsystem.

## 12. Language switcher

Add a compact language selector/link group that is crawlable without JavaScript.

Rules:

- links are ordinary `<a href>` links;
- switching locale keeps the same `PageKey` (German Alphabetizer -> French Alphabetizer, not French homepage);
- labels should make languages understandable to users;
- no automatic redirect based on IP, geolocation, `Accept-Language`, or browser locale;
- do not persist language choice in cookies/localStorage in V1;
- keep header density compatible with the current compact design and mobile touch-target rules.

The selector must not expose a localized destination until that destination is included in the same releasable build.

## 13. Canonical, hreflang, language and Open Graph

For every indexable localized page:

### HTML language

Render the correct `lang` value:

```text
en
 de
fr
es
pt-BR
```

### Canonical

Every localized page is self-canonical.

Never canonicalize German/French/Spanish/PT-BR pages to the English equivalent.

### hreflang cluster

Each page emits absolute `<link rel="alternate" hreflang="...">` links for:

```text
en
de
fr
es
pt-BR
x-default
```

The cluster must include the page itself and all four equivalent locale pages. `x-default` points to the English equivalent.

All alternates are generated from the single route registry so links are automatically reciprocal.

### Open Graph

Use localized title/description and localized canonical URL for `og:url`. Adding `og:locale` / alternates is allowed if implemented from the same locale registry, but is secondary to canonical/hreflang correctness and must not block the release.

## 14. Sitemap and robots

Replace the English-only `INDEXABLE_PATHS` model with a generated indexable route set from the route registry.

After V1 the expected normal indexable surface is:

```text
5 locales × 7 pages = 35 indexable URLs
```

The sitemap must contain all 35 canonical URLs.

Use normal sitemap URL entries. V1 uses HTML `<head>` hreflang as the single alternate-language annotation mechanism; do not duplicate the entire hreflang graph into the sitemap unless a later requirement justifies it.

`robots.txt` keeps the same production allow policy and sitemap pointer.

## 15. Internal linking

All local navigation should remain inside the current locale:

```text
/de/... -> /de/...
/fr/... -> /fr/...
/es/... -> /es/...
/pt-br/... -> /pt-br/...
```

Only the explicit language switcher crosses locale boundaries.

Related Tools must use `PageKey` relationships and resolve href/label/description for the active locale.

This prevents accidental English leakage and ensures crawlers can discover every localized route through normal links as well as the sitemap/hreflang graph.

## 16. Tests and quality gates

### Type/content completeness

- every locale implements the full `LocaleContent` contract;
- every locale has every `PageKey` route;
- no route collisions;
- no empty metadata/title/H1/tool labels;
- no accidental English fallback.

### Route/SEO unit tests

For all 35 indexable URLs verify:

- correct locale;
- self canonical;
- complete reciprocal hreflang set;
- correct `x-default`;
- unique route paths;
- route registry and sitemap are synchronized.

### English parity gate

Before exposing localized routes, compare built English pages against the pre-localization baseline for:

- URL;
- title;
- meta description;
- H1;
- canonical;
- meaningful visible copy;
- tool defaults and behavior.

Plumbing may change; English search-facing semantics must not.

### Alphabetizer unit tests

- English regression fixtures remain green;
- locale-aware collation fixtures for `de`, `fr`, `es`, `pt-BR`;
- numeric ordering remains correct;
- stable tie behavior remains correct.

### Browser/E2E smoke

For every locale, exercise at minimum:

- home compare interaction;
- Alphabetizer interaction;
- Randomizer explicit shuffle lifecycle;
- Dedupe behavior;
- copy/download enabled states where practical;
- header/footer/related links stay in locale;
- language switch keeps equivalent `PageKey`;
- visible page language is consistent;
- no horizontal overflow caused by longer translations at desktop/mobile breakpoints.

The existing English regression suite remains mandatory.

### Content QA

Perform a separate language-quality pass after strings are integrated. Check:

- mojibake/encoding;
- literal or awkward machine-translation phrasing;
- terminology consistency within each locale;
- keyword presence without exact-match stuffing;
- title/description length and readability;
- UI overflow from longer German/French labels;
- privacy claims remain factually identical to English behavior.

## 17. Delivery sequence

### PR / package L10N-1 — localization foundation, zero new indexable URLs

1. Freeze and record the current English build/search-facing baseline.
2. Add neutral locale/content/route types.
3. Refactor layout/header/footer/related-tools/tool components to receive content/locale as data.
4. Convert English to the new typed content registry.
5. Refactor canonical/path helpers around `PageKey` without changing English paths.
6. Add English parity/regression tests.
7. Keep the public route set at seven URLs.
8. Merge/deploy only after generated English output is materially equivalent.

This isolates architecture risk from the SEO experiment.

### PR / package L10N-2 — four-locale experiment release

1. Add `de`, `fr`, `es`, `pt-br` locale configs and route matrix.
2. Author/adapt complete localized content for all seven pages per locale.
3. Make Alphabetizer collation locale-aware and add unit tests.
4. Move locale-dependent examples out of hardcoded browser constants where needed.
5. Add static localized route generation.
6. Add language switcher.
7. Make header/footer/related links locale-local.
8. Add self canonicals + complete hreflang clusters + localized `<html lang>`.
9. Generate sitemap from the route registry (35 URLs).
10. Add cross-locale SEO/content/E2E tests.
11. Run preview visual/content QA for all four locales.
12. Release all four locales in one production deployment.

Do not merge an intermediate state where indexable localized pages exist without their final canonical/hreflang/internal-link setup.

## 18. Release strategy

Release DE, FR, ES, and PT-BR at the same production timestamp after preview validation.

Why simultaneous release:

- same domain age and approximately same external conditions;
- easier comparison of discovery/indexing latency;
- only 28 new URLs, which is a very small crawl surface;
- avoids repeatedly changing the site architecture during the observation window.

Record:

- exact production commit;
- deployment timestamp;
- pre-release English GSC baseline;
- sitemap URL count before/after;
- first date each localized URL is observed/indexed.

Do not request-index dozens of URLs manually as a substitute for normal crawl discovery. Submit/refresh the sitemap and let normal internal/hreflang links expose the cluster.

## 19. Measurement plan

Treat English as the historical/control surface, but do not claim causal A/B conclusions because localized pages intentionally differ in wording, slugs and locale-specific behavior.

At 7, 14, and 28 complete GSC data-days collect by `PageKey × locale`:

- indexed/discovered state;
- impressions;
- clicks;
- visible query count and major query clusters;
- average position (with sample-size caveat);
- best meaningful primary-query position;
- countries;
- page-level exposure.

Compare observed performance against the market-demand context in the research evidence, not just raw totals. PT-BR should not automatically be judged “better” solely because its researched keyword volume is much larger.

Do not optimize a locale from the first few impressions. First useful intervention threshold should require a persistent pattern, not a single-day fluctuation.

## 20. Independent plan review and corrections

The implementation plan was re-reviewed from the perspectives of SEO validity, static architecture, experiment integrity, UX, and maintenance cost. The following corrections are intentional final decisions:

1. **Use localized slugs instead of cloning English slugs.** Google explicitly supports/recommends language-specific words in localized URLs, and this project is testing applied localization rather than isolating “translation only.” The stable `PageKey` prevents route complexity from leaking into component logic.
2. **Do not enable automatic locale redirects.** Separate crawlable URLs + explicit language links are safer for search discovery and preserve user choice.
3. **Do not canonicalize translations to English.** Fully translated pages are their own canonical documents; hreflang connects equivalents.
4. **Do not duplicate hreflang in both HTML and sitemap in V1.** One generated `<head>` implementation plus a normal all-URL sitemap is less failure-prone. The route registry makes reciprocal clusters deterministic.
5. **Do not add a third-party i18n framework.** The content surface is small and static. A typed locale/route registry is enough.
6. **Do not create 28 copied page implementations.** Static `getStaticPaths()` generation avoids drift while keeping page-specific components/domain logic intact.
7. **Do not build a generic UniversalTool/translation runtime.** The four tools retain distinct semantics; only content/routing/layout concerns are shared.
8. **Do not treat localization as copy-only.** The fixed English `Intl.Collator("en")` is a real functional bug for localized Alphabetizer pages and must be adapted.
9. **Do not over-engineer the global 404 or pluralization for hypothetical future languages.** The current four new locales work with the existing count-label model; Russian is explicitly outside V1 and can justify richer plural rules later.
10. **Split foundation from route exposure.** L10N-1 protects the English control and lets architecture changes prove parity before the experiment adds indexable URLs.
11. **Release all four localized markets atomically.** This is cleaner for comparative observation than four rolling production launches, once the common foundation has already been validated.
12. **Treat SERP competition metrics cautiously.** All discovery runs have a geo mismatch; keyword/intent selection is supported, but small DR differences must not drive unnecessary page redesign.

## 21. Definition of done

Localization V1 is done when:

- the existing seven English URLs still render and behave equivalently;
- 28 localized URLs exist, for 35 total indexable URLs;
- every localized page is fully language-consistent in visible content/navigation;
- all localized tool functionality works with the same privacy boundary;
- Alphabetizer uses the correct locale collator;
- localized routes have self canonicals, correct `lang`, reciprocal hreflang + `x-default`;
- sitemap contains exactly the intended 35 indexable canonical URLs;
- language switcher maps equivalent page identities;
- no automatic locale redirects or fallback-English localized pages exist;
- relevant unit/integration/E2E/build checks pass;
- preview visual/content QA is complete;
- production commit/timestamp and measurement baseline are recorded.

After release, no immediate copy/SEO churn is authorized purely from first-day data. Observe the planned checkpoints before changing localized acquisition semantics unless there is a genuine correctness/indexing defect.
