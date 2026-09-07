# AGENTS.md — ListContrast

## 1. Role

Operational contract for coding agents.

Current stack is intentionally:

```text
Astro
TypeScript
vanilla browser APIs
```

Do not restore the previous Next.js/React architecture.

## 2. Mandatory reading order

```text
1. PRODUCT.md
2. CURRENT_STATE.md
3. LOCALIZATION_SCOPE_V1.md (while Localization V1 is active)
4. LOCALIZATION_LANGUAGE_TARGETING_V1.md (while Localization V1 is active)
5. LOCALIZATION_PLAN_REVIEW_V1.md (while Localization V1 is active)
6. UX.md
7. DESIGN.md
8. LISTCONTRAST_EXPANSION_SCOPE_V1_1.md
9. SEO.md
10. ARCHITECTURE.md
11. ANALYTICS.md
12. STACK_CHANGE.md
13. LAUNCH_PLAN.md
14. IMPLEMENTATION_PLAN.md
15. AGENTS.md
16. the assigned GitHub Issue / explicitly approved task
```

## 3. Source-of-truth hierarchy

```text
Current routes/release   → CURRENT_STATE.md
Active localization      → LOCALIZATION_SCOPE_V1.md + LOCALIZATION_LANGUAGE_TARGETING_V1.md + LOCALIZATION_PLAN_REVIEW_V1.md
Localization evidence    → evidence/seo/localization/2026-09-07/RESEARCH_SUMMARY.md
Product semantics        → PRODUCT.md
Interaction              → UX.md
Visual design            → DESIGN.md
Post-MVP tool expansion  → LISTCONTRAST_EXPANSION_SCOPE_V1_1.md
SEO/indexing strategy    → SEO.md + CURRENT_STATE.md for the current route/origin snapshot
Technical design         → ARCHITECTURE.md
Analytics/privacy        → ANALYTICS.md
Delivery/release history → LAUNCH_PLAN.md + IMPLEMENTATION_PLAN.md
Live production ops      → deploy/vps/PRODUCTION.md
Task execution           → assigned Issue / explicitly approved scope
Stack revision           → STACK_CHANGE.md
```

`CURRENT_STATE.md` supersedes older current-state statements about route count, placeholder origin, indexing surface, remaining delivery packages, or deferred localization. `LOCALIZATION_LANGUAGE_TARGETING_V1.md` supersedes older localization wording when it conflicts on language-vs-region targeting. Historical planning and audit documents remain evidence/rationale; do not rewrite history by treating them as the latest repository snapshot. Report real contradictions before coding around them.

## 4. Goal

Maintain a small, coherent, static ListContrast toolkit for line-based list work. Compare Lists remains the anchor utility. The shipped post-MVP expansion is defined by `LISTCONTRAST_EXPANSION_SCOPE_V1_1.md`; any additional tools require a new evidence-backed approved scope.

Localization V1 is an approved acquisition experiment over the existing product, not permission to broaden the tool set.

This is an SEO/product experiment, not a SaaS platform or a generic utility portal.

## 5. Required stack

```text
Astro
TypeScript strict
vanilla DOM/browser APIs
plain/scoped CSS
```

Default package manager: `pnpm` if not already fixed.

## 6. Frontend framework rule

Do not add React, Preact, Vue, Svelte, Solid or their Astro integrations. If you believe one is necessary, report the exact blocker first.

## 7. Static-first

Do not introduce SSR, server adapter, processing API, backend or database for list tools. Localization must remain compatible with static output.

## 8. Current product scope

The existing Compare Lists page on `/` remains stable. The shipped post-MVP expansion is defined in `LISTCONTRAST_EXPANSION_SCOPE_V1_1.md` and covers:

```text
/
/alphabetize-list
/randomize-list
/remove-duplicate-lines
/tools
/about
/privacy
```

These routes are the current shipped English product scope. `CURRENT_STATE.md` records their current indexing/release role.

Localization V1 is separately approved to create equivalent German, French, Spanish, and Brazilian Portuguese versions of these existing pages. Planned localized routes are **not shipped** until the corresponding localization release exists. Never expose navigation links to planned routes before those routes exist in the same merged/releasable codebase.

Add unrelated routes only when a newly assigned delivery issue or other explicitly approved scope requires them.

## 9. Out of scope

Follow the explicit out-of-scope list in `LISTCONTRAST_EXPANSION_SCOPE_V1_1.md` for the shipped expansion. In particular: no auth, accounts, backend, database, history, saved data, AI, arbitrary generic text-tool expansion, file-processing suite, dark mode, ads or payments without a new explicit scope decision.

Localization V1 for `de`, `fr`, `es`, and `pt-br` is explicitly approved under `LOCALIZATION_SCOPE_V1.md`. Language targeting is fixed by `LOCALIZATION_LANGUAGE_TARGETING_V1.md`: German and French are generic language versions, Spanish is neutral international Spanish, and Portuguese is explicitly Brazilian (`pt-BR`). Do not introduce `de-DE`, `fr-FR`, `es-ES`, generic `pt`, `pt-PT`, or other regional variants in V1. Russian/Yandex localization is not part of that package and requires separate research/approval. The Instagram export idea remains deferred.

## 10. Privacy

Raw user list/result content must never enter network requests, analytics, logs, error reporting, URL, cookies or browser storage. Current-tab memory only.

Localization must not weaken or alter this boundary. Translated Privacy copy must remain factually equivalent to the actual implementation.

## 11. Domain core

Keep each tool's domain logic pure TypeScript. No Astro/DOM/browser/analytics imports in domain functions.

Compare Lists keeps its existing parse/normalize/compare/format semantics. New transform tools use the separate emitted-value normalization pipeline defined in the expansion scope.

Localization V1 may pass an explicit locale/collation identifier into the pure Alphabetizer domain function because collation is locale-dependent; do not use localization as a reason to merge unrelated domain rules.

## 12. Parsing

One line = one item. Support ordinary LF/CRLF/Unicode. No implicit CSV/comma/tab parsing.

For new transform tools, an untouched empty input is zero items. Apply trim before empty-line filtering and serialize exact emitted items with `items.join("\n")`.

## 13. Raw vs normalized

Never rewrite textarea values merely to apply normalization. Compare Lists preserves raw display values while normalizing comparison keys; transform tools may emit processed values as explicitly defined by the expansion scope.

## 14. Duplicate semantics

Compare Lists:

```text
Remove duplicates ON  → sets
Remove duplicates OFF → multisets
matches = min(countA, countB)
onlyA   = max(countA - countB, 0)
onlyB   = max(countB - countA, 0)
```

Alphabetizer and Randomizer preserve duplicates. Remove Duplicate Lines has its own first-occurrence-wins semantics. Do not merge these domain rules into one generic processor.

## 15. Ordering

Compare Lists does not sort automatically:

```text
Only A      → A order
Only B      → B order
Matches     → A match order
All         → A then unseen B
Differences → Only A then Only B
```

Alphabetizer intentionally sorts with the collation contract defined by the shipped expansion. During Localization V1, preserve English behavior and make the collator locale-aware for localized pages as required by `LOCALIZATION_SCOPE_V1.md` and `LOCALIZATION_LANGUAGE_TARGETING_V1.md`. Randomizer intentionally changes order only after explicit Randomize action. Dedupe preserves first-occurrence order.

## 16. Client interaction

Astro emits semantic HTML. Small TypeScript scripts read controls, call pure domain functions and update the DOM. Do not render the whole application from JavaScript.

Localized visible labels should normally be rendered into HTML/data attributes and consumed by the existing scripts rather than creating a client-side translation runtime.

## 17. DOM rules

Use semantic native elements, `data-*` behavior hooks and `textContent` for user output. Never use `innerHTML` with user values.

## 18. State

Local tool state only. No Redux/Zustand/MobX/signals/event-bus dependency.

Do not add language preference persistence in Localization V1.

## 19. Result rendering

Do not build a component/node per result row. Prefer one bounded text-oriented viewer using newline serialization.

## 20. Performance

Profile representative 10/1k/10k/100k line datasets for new tools. Separate algorithm and DOM cost. No Worker until measurement proves need.

Localization must not introduce client-side translation bundles or runtime dependencies that materially change the current static-first performance model.

## 21. UX / Design

Follow `UX.md`, `DESIGN.md` and the expansion scope. Keep the current neutral precision utility language and compact density.

Compare Lists retains its compact two-input workspace. Single-list transform tools should prefer immediately inspectable input/result composition on desktop and stack on mobile when that remains the clearest layout.

Localized German/French labels may be longer; adapt spacing/wrapping only where actual overflow occurs. Do not redesign the product merely to accommodate localization.

No gradients, glass, huge hero, cards everywhere, fake testimonials, badges, decorative tool branding, oversized radii or generic SaaS polish.

## 22. Styling

CSS custom properties + Astro scoped styles + small global tokens/base stylesheet. No UI kit, CSS-in-JS or Tailwind unless explicitly approved.

## 23. Dependency policy

Every runtime dependency needs a real reason. Prefer platform APIs (`Intl.Collator`, `Map`, `Set`, Clipboard, Blob, DOM).

Localization V1 does not justify a third-party i18n package unless a concrete blocker is demonstrated first.

## 24. SEO

Each confirmed intent family maps to one canonical acquisition page. Do not create synonym pages for wording variants. Static HTML must contain meaningful content before JavaScript runs.

`/tools` is a navigation/internal-linking resource, not a fabricated generic SEO opportunity. Keep route registry/indexable paths, metadata, canonical paths and sitemap synchronized with actually implemented routes. Use `CURRENT_STATE.md` for the current route/origin/indexability snapshot instead of old MVP route counts in historical sections of `SEO.md`.

For Localization V1 follow `LOCALIZATION_SCOPE_V1.md` plus `LOCALIZATION_LANGUAGE_TARGETING_V1.md`: separate crawlable locale URLs, self canonicals, correct page language, reciprocal hreflang, locale-local internal links, and no automatic geo/browser-language redirects. Preserve current English search-facing content during the localization foundation package. DE/FR/ES remain language-only hreflang targets; PT-BR remains region-specific.

## 25. Analytics

Production analytics currently use the existing no-op boundary. Do not enable a provider without a specific approved task. Never send raw input/output or list values.

Localization performance is measured through search-engine data/page paths in V1; do not add an analytics provider solely for this experiment.

## 26. Ads

OFF by default. Adding ads requires explicit approval/evidence and its own scoped task.

## 27. Accessibility

Visible labels, semantic controls, keyboard operation, visible focus, usable touch targets and no color-only meaning. Avoid noisy live-region announcements for every live transform keystroke.

The language switcher must be keyboard-usable and use ordinary crawlable links. Localized aria labels/noscript messages are part of the translation surface.

## 28. Tests

Domain tests first, then DOM/integration behavior, then browser/E2E smoke. Existing Compare Lists regression tests must remain green after shared changes.

Localization V1 additionally requires English output parity, typed locale-content completeness, route/canonical/hreflang tests, locale-aware Alphabetizer tests, and cross-locale navigation/browser smoke as specified in the localization plan.

## 29. CI

Normal quality gate:

```text
format:check
lint
typecheck (Astro check)
tests
build
e2e/browser smoke where relevant
```

A platform quota/infrastructure failure is not evidence that code is correct or incorrect; record it separately from test failures and run the checks locally when required.

## 30. Completed post-MVP expansion delivery order

```text
PR-1 — Alphabetizer + minimum expansion foundation
PR-2 — List Randomizer
PR-3 — Remove Duplicate Lines
PR-4 — cross-tool finalization only if real remaining work exists
```

CL-040 through CL-043 are complete and merged. This sequence is historical; do not reopen it as an active roadmap. Do not create a speculative foundation PR before a real consumer requires the abstraction.

## 31. Current delivery scope

Localization V1 is the currently approved bounded delivery package:

```text
L10N-1 — locale/content/route foundation + English parity; no new indexable URLs
L10N-2 — DE/FR/ES/PT-BR content + localized routes + locale-aware Alphabetizer + SEO/linking/sitemap + release
```

`LOCALIZATION_SCOPE_V1.md` is the implementation contract, `LOCALIZATION_LANGUAGE_TARGETING_V1.md` fixes the language-vs-region targeting model, and `LOCALIZATION_PLAN_REVIEW_V1.md` records the independent corrections. `CURRENT_STATE.md` distinguishes planned localized routes from the currently shipped English surface.

No unrelated expansion package is standing. Maintenance/hardening outside the approved localization work exists only when explicitly assigned.

`LISTCONTRAST_EXPANSION_SCOPE_V1_1.md` remains the source of truth for the shipped tool semantics; it is not automatic authorization to add more tools or broaden the product.

## 32. Scope discipline

Do not silently add more tools, file import, persistence, shareable URLs, drag-and-drop, new analytics providers, structured-data types, Workers or other roadmap features without a specific requirement/evidence decision.

Localization V1 may adapt existing `WebSite` structured-data emission only as needed to avoid incorrect localized-homepage URLs; do not invent new schema types as scope expansion.

## 33. Avoid over-abstraction

No UniversalProcessor, GenericToolFramework, plugin architecture, runtime tool registry or speculative shared transformation engine.

Extract shared code only when at least two real features need the same semantics and the extraction reduces duplication without obscuring domain behavior.

A typed locale/page route registry is allowed in Localization V1 because canonical URLs, hreflang, sitemap, navigation, language switching and static route generation all consume the same real mapping.

## 34. Existing-repo analysis

The repository is already on the accepted Astro/TypeScript/vanilla architecture. Do not revisit the old Next/React migration decision unless a concrete new blocker appears.

Localization must be implemented inside this architecture, static-first.

## 35. Report format

After work, put the PR URL on the first line. Then report changed files and behavior, exact checks, dependencies, deviations and unresolved issues. No claims of guaranteed SEO/rankings/security.

For localization work, also report the exact locale/page route count, canonical/hreflang validation result, English parity result, and any copy-quality caveats.

## 36. Definition of done

Approved behavior works, architecture and privacy boundaries hold, no unnecessary framework/dependency exists, relevant tests pass or have a clearly recorded external-infrastructure blocker, and UX/design remain compliant.

For Localization V1, the more specific definition of done in `LOCALIZATION_SCOPE_V1.md` also applies.
