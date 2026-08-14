# AGENTS.md — Compare Lists

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
4. SEO.md
5. ARCHITECTURE.md
6. ANALYTICS.md
7. STACK_CHANGE.md
8. LAUNCH_PLAN.md
9. IMPLEMENTATION_PLAN.md
10. AGENTS.md
11. the assigned GitHub Issue
```

## 3. Source-of-truth hierarchy

```text
Product semantics → PRODUCT.md
Interaction       → UX.md
Visual design     → DESIGN.md
SEO/indexing      → SEO.md
Technical design  → ARCHITECTURE.md
Analytics/privacy → ANALYTICS.md
Delivery/release  → LAUNCH_PLAN.md
Task sequencing   → IMPLEMENTATION_PLAN.md
Stack revision    → STACK_CHANGE.md
```

Report real contradictions before coding around them.

## 4. Goal

Build the smallest credible production Compare Lists utility:

```text
static indexable page
+
two list inputs
+
deterministic browser-side comparison
+
copy/download
```

This is an SEO/product experiment, not a SaaS platform.

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

Do not introduce SSR, server adapter, API route, backend or database for MVP.

## 8. MVP scope

Implement List A/B, live comparison, trim, ignore empty, ignore case, remove duplicates, Differences/Only A/Only B/Matches/All, summary, swap, clear, example, copy, TXT download, About, Privacy, 404, metadata, canonical, robots, sitemap and privacy-safe analytics boundary.

## 9. Out of scope

No auth, accounts, backend, database, history, saved data, AI, CSV/XLSX parser, Instagram, Spanish, dark mode, ads enabled, third list, sorting, drag-drop or generic tool platform.

## 10. Privacy

Raw user list/result content must never enter network requests, analytics, logs, error reporting, URL, cookies or browser storage. Current-tab memory only.

## 11. Domain core

Pure TypeScript:

```text
parse → normalize → compare → format
```

No Astro/DOM/browser/analytics imports.

## 12. Parsing

One line = one item. Support LF/CRLF/Unicode. No implicit CSV/comma/tab parsing.

## 13. Raw vs normalized

Never rewrite textarea values to apply normalization.

## 14. Duplicate semantics

ON → sets. OFF → multisets.

```text
matches = min(countA, countB)
onlyA   = max(countA - countB, 0)
onlyB   = max(countB - countA, 0)
```

## 15. Ordering

No automatic sort.

```text
Only A      → A order
Only B      → B order
Matches     → A match order
All         → A then unseen B
Differences → Only A then Only B
```

## 16. Client interaction

Astro emits semantic HTML. A small TypeScript script reads controls, calls pure engine and updates the DOM. Do not render the whole app from JS.

## 17. DOM rules

Use semantic native elements, `data-*` behavior hooks and `textContent` for user output. Never use `innerHTML` with user values.

## 18. State

Local tool state only. No Redux/Zustand/MobX/signals/event-bus dependency.

## 19. Result rendering

Do not build a component/node per result row. Prefer one text-oriented viewer from `result.join('\n')`.

## 20. Performance

Profile 1k/10k/100k rows. Separate algorithm and DOM cost. No Worker until measurement proves need.

## 21. UX / Design

Follow `UX.md` and `DESIGN.md`. Tool-first, neutral precision utility, desktop two-column inputs, mobile stacked, Differences default, live update.

No gradients, glass, huge hero, pill tabs, cards everywhere, fake testimonials, badges, random icons, oversized radii or generic SaaS polish.

## 22. Styling

CSS custom properties + Astro scoped styles + small global tokens/base stylesheet. No UI kit, CSS-in-JS or Tailwind unless explicitly approved.

## 23. Dependency policy

Every runtime dependency needs a real reason. Prefer platform APIs (`Map`, `Set`, Clipboard, Blob, DOM).

## 24. SEO

Homepage `/` targets the main intent. No duplicate synonym pages. Static HTML must contain meaningful content before JS runs.

## 25. Analytics

Only events from `ANALYTICS.md`; no raw content. No per-keystroke tracking. Session replay OFF.

## 26. Ads

OFF in MVP.

## 27. Accessibility

Visible labels, semantic controls, keyboard operation, visible focus, accessible tabs, usable touch targets and no color-only meaning.

## 28. Tests

Domain tests first, then DOM/integration behavior, then at least one E2E smoke.

## 29. CI

```text
format:check
lint
typecheck (Astro check)
tests
build
```

## 30. Implementation order

```text
1. migrate the accepted foundation from Next/React to Astro
2. preserve/adapt tokens, content and static layout
3. pure engine and domain tests
4. CompareTool semantic HTML
5. vanilla TypeScript interaction
6. results/copy/download
7. responsive/accessibility
8. SEO/editorial pages
9. robots/sitemap/metadata
10. analytics adapter
11. performance profiling
12. E2E smoke
13. production build
```

## 31. Preferred remaining work sequence

```text
CL-010 — complete pure comparison domain
CL-013 — semantic CompareTool markup
CL-014 — CompareTool interaction and actions
CL-018 — summary and result browsing
CL-021 — copy, download and result-flow tests
CL-024 — editorial content and legal pages
CL-026 — metadata and static SEO routes
CL-028 — privacy-safe analytics boundary
CL-030 — responsive and accessibility quality
CL-032 — Playwright E2E smoke
CL-033 — performance and privacy/security evidence
CL-035 — documentation and protected preview
CL-036 — final release audit
```

Each identifier now represents one consolidated, bounded delivery package.
The assigned GitHub Issue is the operational scope; `IMPLEMENTATION_PLAN.md`
contains the package-level roadmap.

## 32. Scope discipline

Do not silently add sorting, CSV upload, dark mode, persistence, a third list, shareable URLs, drag-and-drop or future roadmap features.

## 33. Avoid over-abstraction

No UniversalProcessor, GenericToolFramework, plugin architecture or speculative shared layer.

## 34. Existing-repo analysis

If the repository already contains Next/React work:

1. inspect how much meaningful code exists;
2. identify reusable domain/style/content work;
3. estimate migration cost and risk;
4. do not delete working code blindly;
5. if it is only scaffold/minimal work, prefer Astro;
6. if substantial tested work exists, report the tradeoff before migration.

If implementation has not started, use Astro directly.

The migration assessment is recorded in `STACK_CHANGE.md`. `CL-001` through
`CL-009` are complete; the repository now uses Astro and has parsing,
normalization and set comparison. Continue only from the assigned package.

## 35. Report format

After work, put the PR URL on the first line. Then report changed files and
behavior, exact checks, dependencies, deviations and unresolved issues. No
claims of guaranteed SEO/rankings/security.

## 36. Definition of done

Approved behavior works, architecture and privacy boundaries hold, no unnecessary framework/dependency exists, relevant tests pass, and UX/design remain compliant.
