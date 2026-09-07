# ListContrast — independent review of Localization V1

Review date: 2026-09-07  
Reviewed plan: `LOCALIZATION_SCOPE_V1.md`

## Verdict

**Proceed with the plan after the corrections/clarifications below.**

The scope is proportionate to the experiment: 28 new localized URLs, no new tools, no backend, no runtime translation dependency, and a two-package delivery that protects the existing English SEO surface before localized routes are exposed.

The plan is compatible with the current Astro + strict TypeScript + vanilla browser architecture and does not require a framework change.

## Repository findings that materially affect implementation

### 1. Localization cannot be implemented only in page copy

The current repository has English imports/hardcoded strings in several layers:

- `BaseLayout.astro` imports `englishContent`, hardcodes `<html lang="en">`, and derives canonical paths from an English-only metadata key.
- `SiteHeader.astro` and `SiteFooter.astro` import English content directly and hardcode English route destinations.
- individual page wrappers contain English Related Tools labels/descriptions.
- `RelatedTools.astro` hardcodes `Related tools`.
- tool Astro components import their English tool-content modules internally.
- browser scripts contain hardcoded example data and download filenames.

Therefore L10N-1 must genuinely remove English coupling from shared rendering, not just add a language selector around the current pages.

### 2. Alphabetizer has a real locale-dependent behavior bug

`src/features/alphabetize-list/lib/alphabetize-list.ts` currently creates:

```ts
new Intl.Collator("en", {
  numeric: true,
  sensitivity: "accent",
});
```

A translated German/French/Spanish/PT-BR Alphabetizer that still sorts with the English collator would be functionally misleading. Locale-aware collation is a release blocker for localized Alphabetizer pages.

Do not change Compare/Randomizer/Dedupe core semantics merely because localization is being added; no equivalent blocker was found for the approved four new locales.

### 3. Current canonical/sitemap configuration must be replaced, not extended ad hoc

`src/config/site.ts` currently owns an English-only `INDEXABLE_PATHS` array and `canonicalPathFor()` switch. `src/pages/sitemap.xml.ts` iterates that list directly.

Adding four separate localized path arrays plus independent header/footer maps would create synchronization risk. The `Locale × PageKey -> path` registry in the approved plan is justified by real consumers (canonical, hreflang, navigation, switcher, sitemap, static path generation) and is not speculative abstraction.

### 4. Existing WebSite structured data needs an explicit locale decision

`BaseLayout.astro` currently emits `WebSite` JSON-LD whenever the metadata key is `home`, with the root `/` URL.

If this condition is copied unchanged to `/de/`, `/fr/`, `/es/`, or `/pt-br/`, localized homepages could emit structured data whose `url` incorrectly points to the English root.

Final V1 rule:

- emit the existing site-level `WebSite` JSON-LD on the English root only; or
- if an implementation intentionally emits localized structured data, generate its URL/language from the same locale route registry and test it.

**Preferred V1: keep the existing `WebSite` object on English `/` only.** There is no need to invent additional structured data for localization.

### 5. Do not make Astro i18n middleware a second routing source of truth

Astro supports unprefixed default locale + prefixed non-default locales. However, V1 also intentionally uses different localized slugs per `PageKey`.

The approved static route registry already solves this deterministically. Using Astro i18n helpers is optional; enabling middleware redirects/fallbacks or maintaining a second implicit path map would add complexity without product value.

Final V1 rule: **static route generation + project-owned route registry is sufficient. No automatic locale redirect/fallback behavior.**

### 6. English parity is a genuine experiment requirement

The current English site already has live GSC observations. If the same release changes English titles/H1/editorial copy while adding four locales, later comparisons become much harder to interpret.

Therefore L10N-1 must preserve English search-facing output. This is not just regression safety; it is part of the experiment design.

### 7. Localized support pages are acceptable, but they are not SEO landing-page expansion

Translating Tools/About/Privacy makes the user journey language-consistent and lets header/footer links stay local. They may remain indexable for parity with the current English site.

Do not create extra localized “SEO content” on these support pages solely to manufacture more keywords.

### 8. Global 404 is not worth architectural complexity

Astro static output produces one real 404 document. Building route-aware server rendering or client-side language detection only to translate the 404 would violate the project’s static/scope discipline.

The single noindex 404 is an accepted V1 exception. This does not prevent the normal seven-page product surface from being fully localized.

### 9. Do not prematurely build a universal pluralization framework

The existing dynamic counters use singular/plural labels. German, French, Spanish and Brazilian Portuguese can be handled within the current V1 counter behavior without adding a broad i18n runtime.

If Russian is approved later, richer plural categories may become a real requirement. Do that work when RU is actually in scope.

### 10. Research quality is good enough to ship the experiment, not good enough for fake precision

All four discovery runs have target-geo mismatch warnings. The localized SERPs are still semantically useful and the demand signals are strong enough to choose page framing, but do not use the reported DR medians as precise market difficulty estimates.

No extra feature should be added because a contaminated SERP happens to show one competitor capability. The product remains the same four tools.

## Final opportunity read after review

- **PT-BR:** strongest aggregate demand. `ordem alfabética online` (1600) and `remover linhas duplicadas` (720) are especially attractive.
- **DE:** strongest clean Compare Lists signal. `listen vergleichen` combines volume 320 with low observed top-result DR.
- **FR:** `comparer deux listes` is an excellent direct-tool SERP; broad dedupe demand is large but must be narrowed to list/line intent in page framing.
- **ES:** valid but smaller measured market in this run; Compare and Alphabetizer are clean, while Randomizer requires careful wording because `mezclar líneas de texto` can mean concatenation as well as shuffling.

All four remain justified for one simultaneous V1 release.

## Final delivery decision

Use two implementation packages:

```text
L10N-1
  localization foundation
  English-only output remains live
  no new indexable URLs
  English parity gate

L10N-2
  DE + FR + ES + PT-BR content
  28 new localized URLs
  locale-aware Alphabetizer
  locale-local navigation + language switcher
  self canonicals + reciprocal hreflang + x-default
  35-URL sitemap
  all-locale QA
  one simultaneous production release
```

Do not split L10N-2 into four rolling public locale launches unless a real implementation blocker forces it; simultaneous exposure is cleaner for the intended comparative observation.

## Additional implementation checklist added by this review

Before production release verify all of the following explicitly:

- localized homepages do not emit English-root structured-data URLs by accident;
- every localized page has exactly one self canonical;
- every equivalent-page hreflang cluster is reciprocal and contains self + `en` + `de` + `fr` + `es` + `pt-BR` + `x-default`;
- all language-switch destinations resolve to 200 in the same build;
- sitemap has the intended 35 canonical URLs and no duplicate paths;
- no localized indexable page contains accidental English fallback copy;
- no page-visible mojibake from the research exports enters production;
- German/French long labels do not break compact tool controls or header navigation;
- English build output remains materially equivalent to the pre-L10N baseline;
- current privacy guarantees remain true after localization;
- existing English unit/E2E suite stays green.

With these corrections, the plan is implementation-ready.
