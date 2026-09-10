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

For current work read:

```text
1. CURRENT_STATE.md
2. EXPANSION_V2_DECISION_2026-09-10.md
3. PRODUCT.md
4. UX.md
5. DESIGN.md
6. SEO.md
7. ARCHITECTURE.md
8. ANALYTICS.md
9. LOCALIZATION_FINAL_DECISION_2026-09-07.md
10. LISTCONTRAST_EXPANSION_SCOPE_V1_1.md (historical semantics for the original tools)
11. deploy/vps/PRODUCTION.md when releasing
12. the assigned GitHub Issue / explicitly approved task
```

Localization planning/research, old launch plans and historical audits are supporting evidence only where they do not conflict with the current-state and active-decision documents.

## 3. Source-of-truth hierarchy

```text
Current routes/release   → CURRENT_STATE.md
Active expansion         → EXPANSION_V2_DECISION_2026-09-10.md
Locale/language model    → LOCALIZATION_FINAL_DECISION_2026-09-07.md
Product semantics        → PRODUCT.md + shipped-tool semantics from LISTCONTRAST_EXPANSION_SCOPE_V1_1.md
Interaction              → UX.md
Visual design            → DESIGN.md
SEO/indexing strategy    → SEO.md + CURRENT_STATE.md
Technical design         → ARCHITECTURE.md
Analytics/privacy        → ANALYTICS.md
Live production ops      → deploy/vps/PRODUCTION.md
Task execution           → assigned Issue / explicitly approved scope
Historical rationale     → localization plans, LAUNCH_PLAN.md, IMPLEMENTATION_PLAN.md, RELEASE_AUDIT.md, SEO_LEGACY_MVP.md
```

`CURRENT_STATE.md` supersedes older current-state statements about route count, placeholder origin, indexing surface or remaining delivery packages. `EXPANSION_V2_DECISION_2026-09-10.md` supersedes older statements that no new expansion package is active. `LOCALIZATION_FINAL_DECISION_2026-09-07.md` still governs the six-locale language/region model.

Report real contradictions before coding around them; do not silently choose a historical document over the active contract.

## 4. Goal

Maintain a small, coherent, static ListContrast toolkit for line/list work. Compare Lists remains the anchor utility.

The active Expansion V2 wave is evidence-backed and bounded: strengthen the existing Compare Lists page and add exactly four independent adjacent tools. This does not authorize arbitrary generic utility growth.

This is an SEO/product experiment, not a SaaS platform.

## 5. Required stack

```text
Astro
TypeScript strict
vanilla DOM/browser APIs
plain/scoped CSS
```

Package manager: `pnpm`.

## 6. Frontend framework rule

Do not add React, Preact, Vue, Svelte, Solid or their Astro integrations. If one appears necessary, report the concrete blocker first.

## 7. Static-first

Do not introduce SSR, server adapters, processing APIs, backend services or a database for these list tools. All approved Expansion V2 behavior is compatible with static output and browser-side processing.

## 8. Current product scope

The verified production surface before Expansion V2 contains these English identities and equivalent DE/FR/ES/PT-BR/RU versions:

```text
/
/alphabetize-list
/randomize-list
/remove-duplicate-lines
/tools
/about
/privacy
```

Expansion V2 approves these additional English tool identities plus localized equivalents using the route registry:

```text
/random-team-generator
/random-pair-generator
/remove-line-breaks
/column-to-comma-separated-list
```

The Compare Lists canonical stays `/`. Do not create synonym routes for list diff/list difference. Team/Group share one canonical page. Remove Line Breaks/Remove Newlines share one canonical page.

After all six locales ship, the intended surface is 66 indexable canonical URLs. Do not claim 66 are live until production deployment is verified.

## 9. Explicit out of scope

Unless a new evidence-backed decision is approved, do not add:

- `/compare-lists`, `/list-comparison`, `/list-diff`, `/list-difference`;
- `/random-group-generator` separate from Team Generator;
- `/remove-newlines` or `/new-line-remover` separate from Remove Line Breaks;
- Random Name Picker or Random Item Picker;
- Email Extractor;
- generic List Cleaner;
- Multi-list Compare route;
- fuzzy/AI matching;
- invisible-character routes;
- SQL/JSON/prefix/suffix/chunking utility families;
- auth/accounts/backend/database/history/saved data;
- share URLs containing user input;
- generic file-processing suite;
- dark mode, ads or payments without an explicit separate decision.

## 10. Privacy

Raw user list/result content must never enter network requests, analytics, logs, error reporting, URL parameters/fragments, cookies or browser storage. Current-tab memory only.

Expansion V2 must preserve this contract. Clipboard and local download happen only after explicit user actions.

Translated Privacy copy must remain factually equivalent to implementation.

## 11. Domain core

Keep each tool's domain logic pure TypeScript. No Astro, DOM, analytics or browser UI imports inside domain functions.

Compare Lists keeps its existing parse/normalize/compare/format semantics. Shared code extraction must not change those semantics.

Expansion V2 should reuse real shared semantics only:

```text
existing list-item parsing where appropriate
existing Fisher–Yates shuffle
balanced group allocation
pair allocation
line-ending normalization
line-break replacement / paragraph preservation
column/list serialization
```

Do not invent a UniversalProcessor or generic plugin framework.

## 12. Parsing and line endings

For list-item tools, one line = one item. An untouched empty input is zero items. Apply trim before empty-line filtering where those options exist.

Accept LF and CRLF everywhere ordinary line-based inputs are expected. Expansion V2 text-normalization helpers must also handle bare CR because Remove Line Breaks explicitly promises LF/CRLF/CR support.

Do not add implicit CSV/comma/tab parsing to ordinary list inputs.

## 13. Raw vs normalized

Never rewrite textarea source values merely to apply normalization.

Compare Lists preserves raw display values while normalizing comparison keys. Transform tools may emit processed values only when their product contract says so.

Remove Line Breaks is prose/text reflow, not list serialization. Its paragraph-preservation behavior must not be implemented by blindly applying the generic list-item parser.

## 14. Duplicate semantics

Compare Lists:

```text
Remove duplicates ON  → sets
Remove duplicates OFF → multisets / occurrence matching
matches = min(countA, countB)
onlyA   = max(countA - countB, 0)
onlyB   = max(countB - countA, 0)
```

Alphabetizer and Randomizer preserve duplicates. Remove Duplicate Lines keeps first occurrences. Random Team and Random Pair must preserve repeated identical names/items as separate occurrences. Column→Comma preserves duplicates by default.

Do not silently deduplicate because values happen to have identical text.

## 15. Ordering and randomness

Compare Lists keeps original-list ordering:

```text
Only A      → A order
Only B      → B order
Matches     → A match order
All         → A then unseen B
Differences → Only A then Only B
```

Alphabetizer sorts by locale-aware `Intl.Collator`. Randomizer changes order only after explicit Randomize action. Dedupe preserves first-occurrence order.

Random Team/Pair should reuse the shipped Fisher–Yates shuffle primitive. While it uses `Math.random`, do not claim cryptographic fairness, auditability or anti-repeat guarantees.

## 16. Random allocation invariants

Random Team/Group:

- every valid input occurrence exactly once;
- no algorithm-created duplicates or omissions;
- Number of teams: sizes differ by at most one;
- People per team: derive `ceil(N / targetSize)` groups, then distribute evenly;
- invalid zero/negative values and team counts greater than participant count are rejected cleanly.

Random Pair:

- every valid occurrence exactly once;
- even count → pairs only;
- odd count → pairs plus one explicit Unpaired item;
- no cross-reroll history or anti-repeat promise.

## 17. Text-transform invariants

Remove Line Breaks:

- normalize CRLF/LF/CR first;
- default separator is a space;
- support Space, Nothing, Comma, Comma + space, Semicolon and Custom;
- Keep paragraph breaks preserves blank-line-separated blocks while joining single hard wraps inside blocks;
- Trim each line and Collapse repeated spaces are allowed low-cost controls;
- default behavior must not concatenate adjacent words.

Column to Comma Separated List:

- one deliberate item per line;
- Trim surrounding whitespace ON by default;
- Ignore empty lines ON by default;
- support Comma + space, Comma, Semicolon, Pipe, Tab and Custom;
- output is one serialized string;
- duplicate values remain.

## 18. Client interaction

Astro emits semantic HTML. Small TypeScript scripts read controls, call pure domain functions and update the DOM. Do not render whole pages from JavaScript.

Localized visible labels should be rendered into HTML/data attributes and consumed by scripts instead of creating a client-side translation runtime.

## 19. DOM and output safety

Use semantic native elements, `data-*` behavior hooks and `textContent` for user output. Never use `innerHTML` with user values.

Generated result text must remain selectable. Long user values must not destroy layout width.

## 20. State

Local tool state only. No Redux/Zustand/MobX/signals/event-bus dependency. No language preference persistence. No persistent roster/history storage.

## 21. Performance

Keep transformations O(n) or O(n log n) where inherent. Avoid repeated reparsing of large inputs without need. No Worker until measurement proves a real main-thread problem.

Do not add client translation bundles or heavyweight parsing dependencies.

## 22. UX / design

Follow `UX.md`, `DESIGN.md` and the active expansion decision. Keep the neutral precision-utility language and compact density.

No gradients, glass, huge heroes, decorative branding, fake testimonials, oversized radii or generic SaaS cards everywhere.

Team results may use compact Team cards because the grouping itself benefits from visible grouping. This is not permission to redesign the whole site as a card dashboard.

Mobile must remain usable; localized German/French labels may wrap rather than force page overflow.

## 23. Styling

CSS custom properties + Astro scoped styles + small shared global tokens. No UI kit, CSS-in-JS or Tailwind without explicit approval.

## 24. Dependency policy

Prefer zero new runtime dependencies for Expansion V2. Platform APIs and small pure functions are sufficient.

Every runtime dependency requires a concrete reason.

## 25. SEO

Each confirmed product/search job maps to one canonical acquisition page. Code reuse is not evidence of separate SEO intent.

The active intent map is in `EXPANSION_V2_DECISION_2026-09-10.md` and `SEO.md`.

Homepage `/` is explicitly approved for a new evidence-backed copy upgrade around Compare Lists / List Difference vocabulary. Its route and existing interaction model remain unchanged.

### Set terminology

With deduplication enabled, explanatory copy may describe A−B, B−A, intersection, symmetric difference and union. With duplicates retained, semantics are occurrence/multiset based. Prefer neutral interactive labels plus a clear editorial caveat rather than static labels that become mathematically false.

### Localization

Use six existing locales only:

```text
en
de
fr
es
pt-br
ru
```

German/French are generic language targets; Spanish is neutral international; Portuguese is explicitly Brazilian (`pt-BR`); Russian is generic `ru`.

Follow the repository's actual localized-slug route registry. Do not copy conceptual English-slug examples from research into localized production URLs.

All localized pages are crawlable static pages, self-canonical, reciprocal hreflang, locale-local internally linked, and have no automatic geo/browser-language redirects.

## 26. Site integration

After Expansion V2:

- `/tools` lists all 8 actual tools;
- About copy does not enumerate only the old four;
- related links are contextual and descriptive;
- sitemap derives from the typed route registry;
- all new page titles/descriptions/H1s are localized;
- no new schema type is added solely to decorate SEO.

## 27. Analytics

Production analytics currently use the no-op boundary. Do not enable a provider solely for this wave. Never send raw input/output or list values.

Post-release SEO measurement comes from GSC/Yandex Webmaster page/query data.

## 28. Accessibility

Every input has a real label. Controls are keyboard-operable with visible focus and usable touch targets. Selected modes are programmatically exposed. Validation is associated with the relevant input/control. Counts must not rely on color alone. Copy feedback may use the existing polite status pattern.

Avoid noisy live-region announcements on every keystroke.

## 29. Tests

Domain tests first, then DOM/integration behavior, then browser/E2E smoke.

Expansion V2 requires focused coverage for:

- Team balance and occurrence preservation;
- Pair even/odd behavior and occurrence preservation;
- CRLF/LF/CR line-break behavior;
- Keep paragraph breaks;
- every separator preset and custom delimiter;
- localized route/content completeness;
- canonical/hreflang/sitemap route count;
- no broken localized related links;
- existing Compare/Alphabetize/Randomize/Dedupe regressions.

## 30. CI

Normal quality gate:

```text
format:check
lint
typecheck (Astro check)
tests
build
e2e/browser smoke
```

A platform quota/infrastructure failure is not evidence that code is correct or incorrect; record it separately.

## 31. Active delivery order

```text
Batch 0 — repository/docs inspection and contradiction cleanup
Batch 1 — homepage SEO/content upgrade
Batch 2 — shared random allocation engine + Team/Pair
Batch 3 — shared text transform engine + Line Breaks/Column
Batch 4 — site integration
Batch 5 — all six locales
Batch 6 — final QA/release
```

Do not reopen broad keyword research during this sequence.

## 32. Historical delivery

The original post-MVP tool expansion (Alphabetizer, Randomizer, Remove Duplicate Lines) and Localization V1 are complete and deployed. Their old delivery-order sections are history, not active roadmap instructions.

`LISTCONTRAST_EXPANSION_SCOPE_V1_1.md` remains useful for those shipped tool semantics. Localization planning docs remain useful for locale architecture rationale.

## 33. Scope discipline

Do not silently add file import, persistent history, share URLs, drag-and-drop, analytics providers, schema types, Workers, reverse converters, quoting/prefix/suffix options, team skill balancing, captains, keep-together/keep-apart constraints or other P1/P2 ideas merely because implementation seems easy.

Implement the approved P0 completely before considering extras.

## 34. Avoid over-abstraction

No UniversalProcessor, GenericToolFramework, plugin architecture or runtime tool registry.

Extract shared code only when at least two real features need the same semantics and the abstraction makes the domain clearer.

The existing typed locale/page route registry remains the correct single mapping for canonical URLs, hreflang, sitemap, navigation, language switching and static route generation.

## 35. Existing-repo analysis

The repository is already on the accepted Astro/TypeScript/vanilla architecture. Do not revisit the old Next/React migration decision.

Implement Expansion V2 inside the current static-first architecture.

## 36. Report format

After work, put the PR URL first. Then report changed behavior, exact checks, dependencies, deviations and unresolved issues. Do not claim guaranteed rankings, traffic or security.

For this wave also report:

- exact intended locale/page route count;
- canonical/hreflang/sitemap validation;
- existing-tool regression result;
- localization copy caveats, if any;
- any deliberate deviation from `EXPANSION_V2_DECISION_2026-09-10.md`.

## 37. Definition of done

The active definition of done is `EXPANSION_V2_DECISION_2026-09-10.md` section 8 plus the privacy, architecture, accessibility and CI requirements above. The work is not complete merely because the four English URLs render.