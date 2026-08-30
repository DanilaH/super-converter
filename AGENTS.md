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
2. UX.md
3. DESIGN.md
4. LISTCONTRAST_EXPANSION_SCOPE_V1_1.md
5. SEO.md
6. ARCHITECTURE.md
7. ANALYTICS.md
8. STACK_CHANGE.md
9. LAUNCH_PLAN.md
10. IMPLEMENTATION_PLAN.md
11. AGENTS.md
12. the assigned GitHub Issue
```

## 3. Source-of-truth hierarchy

```text
Product semantics       → PRODUCT.md
Interaction             → UX.md
Visual design           → DESIGN.md
Post-MVP tool expansion → LISTCONTRAST_EXPANSION_SCOPE_V1_1.md
SEO/indexing            → SEO.md
Technical design        → ARCHITECTURE.md
Analytics/privacy       → ANALYTICS.md
Delivery/release        → LAUNCH_PLAN.md
Task sequencing         → IMPLEMENTATION_PLAN.md + assigned Issue / approved scope
Stack revision          → STACK_CHANGE.md
```

The expansion scope explicitly supersedes older planning only where it says so. Report real contradictions before coding around them.

## 4. Goal

Maintain a small, coherent, static ListContrast toolkit for line-based list work. Compare Lists remains the anchor utility. The shipped post-MVP expansion is defined by `LISTCONTRAST_EXPANSION_SCOPE_V1_1.md`; any additional tools require a new evidence-backed approved scope.

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

Do not introduce SSR, server adapter, processing API, backend or database for list tools.

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

These routes are the current shipped product scope. Add or expose new routes only when a newly assigned delivery issue or other explicitly approved scope requires them. Never expose navigation links to planned routes before those routes exist in the merged/releasable codebase.

## 9. Out of scope

Follow the explicit out-of-scope list in `LISTCONTRAST_EXPANSION_SCOPE_V1_1.md` for the shipped expansion. In particular: no auth, accounts, backend, database, history, saved data, AI, arbitrary generic text-tool expansion, file-processing suite, dark mode, ads or payments without a new explicit scope decision.

Spanish localization and the Instagram export idea remain deferred and require their own evidence/priority decision.

## 10. Privacy

Raw user list/result content must never enter network requests, analytics, logs, error reporting, URL, cookies or browser storage. Current-tab memory only.

## 11. Domain core

Keep each tool's domain logic pure TypeScript. No Astro/DOM/browser/analytics imports in domain functions.

Compare Lists keeps its existing parse/normalize/compare/format semantics. New transform tools use the separate emitted-value normalization pipeline defined in the expansion scope.

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

Alphabetizer intentionally sorts with the fixed collation contract in the expansion scope. Randomizer intentionally changes order only after explicit Randomize action. Dedupe preserves first-occurrence order.

## 16. Client interaction

Astro emits semantic HTML. Small TypeScript scripts read controls, call pure domain functions and update the DOM. Do not render the whole application from JavaScript.

## 17. DOM rules

Use semantic native elements, `data-*` behavior hooks and `textContent` for user output. Never use `innerHTML` with user values.

## 18. State

Local tool state only. No Redux/Zustand/MobX/signals/event-bus dependency.

## 19. Result rendering

Do not build a component/node per result row. Prefer one bounded text-oriented viewer using newline serialization.

## 20. Performance

Profile representative 10/1k/10k/100k line datasets for new tools. Separate algorithm and DOM cost. No Worker until measurement proves need.

## 21. UX / Design

Follow `UX.md`, `DESIGN.md` and the expansion scope. Keep the current neutral precision utility language and compact density.

Compare Lists retains its compact two-input workspace. Single-list transform tools should prefer immediately inspectable input/result composition on desktop and stack on mobile when that remains the clearest layout.

No gradients, glass, huge hero, cards everywhere, fake testimonials, badges, decorative tool branding, oversized radii or generic SaaS polish.

## 22. Styling

CSS custom properties + Astro scoped styles + small global tokens/base stylesheet. No UI kit, CSS-in-JS or Tailwind unless explicitly approved.

## 23. Dependency policy

Every runtime dependency needs a real reason. Prefer platform APIs (`Intl.Collator`, `Map`, `Set`, Clipboard, Blob, DOM).

## 24. SEO

Each confirmed intent family maps to one canonical acquisition page. Do not create synonym pages for wording variants. Static HTML must contain meaningful content before JavaScript runs.

`/tools` is a navigation/internal-linking resource, not a fabricated generic SEO opportunity. Keep `INDEXABLE_PATHS`, metadata, canonical paths and sitemap synchronized with actually implemented routes.

## 25. Analytics

Production analytics currently use the existing no-op boundary. Do not enable a provider without a specific approved task. Never send raw input/output or list values.

## 26. Ads

OFF by default. Adding ads requires explicit approval/evidence and its own scoped task.

## 27. Accessibility

Visible labels, semantic controls, keyboard operation, visible focus, usable touch targets and no color-only meaning. Avoid noisy live-region announcements for every live transform keystroke.

## 28. Tests

Domain tests first, then DOM/integration behavior, then browser/E2E smoke. Existing Compare Lists regression tests must remain green after shared changes.

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

There is no active expansion package after CL-043. The four-tool expansion is complete.

For future work, the assigned GitHub Issue or other explicitly approved task is the operational scope. `LISTCONTRAST_EXPANSION_SCOPE_V1_1.md` remains the source of truth for the shipped expansion semantics; it is not automatic authorization to add more tools or broaden the product.

If no implementation scope is assigned, review and report findings only. Do not invent a delivery package, new routes or roadmap work.

## 32. Scope discipline

Do not silently add more tools, file import, persistence, shareable URLs, drag-and-drop, new analytics providers, structured data, Workers or other roadmap features without a specific requirement/evidence decision.

## 33. Avoid over-abstraction

No UniversalProcessor, GenericToolFramework, plugin architecture, runtime tool registry or speculative shared transformation engine.

Extract shared code only when at least two real features need the same semantics and the extraction reduces duplication without obscuring domain behavior.

## 34. Existing-repo analysis

The repository is already on the accepted Astro/TypeScript/vanilla architecture. Do not revisit the old Next/React migration decision unless a concrete new blocker appears.

## 35. Report format

After work, put the PR URL on the first line. Then report changed files and behavior, exact checks, dependencies, deviations and unresolved issues. No claims of guaranteed SEO/rankings/security.

## 36. Definition of done

Approved behavior works, architecture and privacy boundaries hold, no unnecessary framework/dependency exists, relevant tests pass or have a clearly recorded external-infrastructure blocker, and UX/design remain compliant.
