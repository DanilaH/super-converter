# LAUNCH_PLAN.md — Compare Lists

## 1. Purpose

Plan after architecture simplification.

Current stack:

```text
Astro
TypeScript
vanilla client-side TypeScript
static output
```

Do not use the previous Next.js/React bootstrap.

## 2. Goal

```text
search
↓
static page
↓
paste two lists
↓
local browser comparison
↓
copy/download
```

Launch quickly enough to test organic acquisition.

## 3. Specification set

Read PRODUCT, UX, DESIGN, SEO, ARCHITECTURE, ANALYTICS, STACK_CHANGE,
IMPLEMENTATION_PLAN and AGENTS.

## 3.1 Current delivery baseline

`CL-001` through `CL-006` are merged. They established formatting/tests, CI,
design tokens, a static shell, typed English content and pure comparison types
and defaults on the former Next/React stack.

Reusable work is preserved. The next delivery task is `CL-007`, a bounded
Astro migration. Parsing and comparison work starts only after that migration
is accepted.

## 4. First release

Product: two inputs, live comparison, normalization options, five result modes, summary, swap, clear, example, copy/download and local processing.

Pages: `/`, `/about`, `/privacy`, real 404.

SEO: metadata, canonical, robots, sitemap, semantic supporting content, OG basics.

Quality: strict TS, domain tests, DOM/integration tests, responsive/accessibility/performance checks, static production build.

No ads.

## 5. Excluded

No React/Next, SSR, backend, DB, accounts, Spanish, Instagram, CSV/XLSX, dark mode, ads, payments, CMS or multi-tool platform.

## 6. Bootstrap

Astro + pnpm + strict TypeScript + static output.

Repository root contains all specification files.

Scripts should cover dev, build, preview, lint, typecheck backed by Astro check,
format checks and tests.

## 7. Phase A — Astro migration foundation

Replace the small Next/React foundation with Astro while preserving domain
types/defaults, typed English content, design-token values, formatting/tests
and the CI gate. Recreate only the existing homepage shell and placeholder.

Do not add the real Compare Tool, parser, comparison engine, editorial content,
About, Privacy, 404, analytics or deployment plumbing in this phase.

Exit: build passes, static HTML preserves the accepted shell/content, existing
domain tests pass, and no frontend framework runtime remains.

## 8. Phase B — Domain engine

Implement parse, normalize, compare, format.

Exit: pure TS, semantic tests pass, no DOM/Astro imports.

## 9. Phase C — CompareTool markup + behavior

Astro outputs semantic markup. Vanilla TypeScript binds input, options, swap, clear, example and live recompute.

Exit: paste A/B → result; options update result; raw textarea text never mutates.

## 10. Phase D — Results

Summary, tabs, Differences default, text-oriented result viewer, copy and download.

Exit: large results stay usable, keyboard tabs work, copy/download stay client-side.

## 11. Phase E — SEO shell

Finalize H1, intro, privacy line, tool, how-to, result meanings, use cases, privacy, FAQ, metadata, canonical, robots, sitemap and OG.

Meaningful content must exist in generated HTML.

## 12. Phase F — Quality pass

UX, Design, Accessibility, Privacy, Performance and technical SEO. No feature expansion.

## 13. Performance gate

Test 1k/10k/100k rows and measure parsing, comparison, formatting, DOM update, copy and download separately.

Only add Worker after proving it is needed.

## 14. Privacy gate

DevTools verifies no list content in network, analytics, storage or URL. No session replay.

## 15. Accessibility gate

Visible labels, semantic controls, keyboard flow, focus, accessible tabs, touch targets and no horizontal page overflow.

## 16. Design gate

Reject giant hero, gradients, glass, pill tabs, card grids, excessive shadows, fake marketing sections and extra accent colors.

## 17. CI gate

Every merge:

```text
format:check
lint
typecheck (Astro check)
tests
build
```

## 18. Remaining delivery plan

```text
CL-007 — Astro foundation migration
CL-008…CL-012 — comparison core, tests and formatting
CL-013…CL-017 — inputs, options and live DOM behavior
CL-018…CL-023 — results, copy and download
CL-024…CL-027 — SEO pages, content and static routes
CL-028…CL-029 — analytics boundary
CL-030…CL-036 — responsive/accessibility/performance and release gates
```

The exact one-task-per-PR scopes are defined in `IMPLEMENTATION_PLAN.md`.

## 19. Existing implementation decision

If Next/React implementation already exists: inspect first, report reusable work and migration cost, do not blindly rewrite. Minimal scaffold → migrate to Astro. Substantial tested implementation → ask before costly migration.

## 20. Staging

Use protected preview when possible. Validate real build, mobile, metadata, privacy, large datasets and copy/download. Prevent preview indexing.

## 21. Domain

Needed before final production SEO config, not before implementation.

## 22. Hosting

Static hosting only needs HTTPS, custom domain, CDN/static files, redirects, 404, headers and preferably preview deploys. No Node runtime required.

## 23. Production origin

One canonical origin for canonical, OG, robots and sitemap. No preview hostname leakage.

## 24. Analytics

May activate after safe event schema is verified. Search Console remains the main SEO source. Product analytics absence alone must not block launch.

## 25. Ads

OFF at launch.

## 26. Day 0 checklist

Functional: inputs, live compare, options, swap/clear/example, tabs, copy/download.

Architecture: static Astro build, no UI framework runtime, pure TS domain, small DOM script.

SEO: title, description, H1, canonical, robots, sitemap, About, Privacy, 404, production hostname.

Privacy: no raw network/storage/replay.

Quality: format/lint/typecheck/tests/build,
desktop/mobile/keyboard/large-input profiling.

## 27. After launch

Immediately verify Search Console property, sitemap, homepage indexability and selected canonical.

Week 1: technical correctness/indexing.

Weeks 2–4: impressions, queries, countries, position buckets and tool usage.

Around day 30: determine whether the page is indexed, receiving relevant impressions and used by real users.

Days 30–60: one focused iteration at a time based on Search Console/product data.

Around day 60: review impression/query/position/click/use trends.

## 28. Expansion gates

Spanish only after English core is stable and indexing healthy.

Instagram only after generic engine is stable; official export + local parsing, no login/scraping.

Ads only after recurring traffic exists to measure.

## 29. 90-day decision

GROW when relevant impressions/query footprint/rankings/use are improving.

ITERATE when Google understands the page but ranking/conversion remains weak.

STOP/CHANGE when technical SEO is healthy but enough observation shows no meaningful visibility or positive trend.

## 30. Change discipline

Record meaningful production changes and avoid changing multiple major variables at once when interpreting effects.

## 31. MVP done

```text
small static utility
+
correct comparison
+
good UX
+
indexable page
+
privacy
+
production deployment
```

## 32. Immediate agent action

```text
1. read STACK_CHANGE.md and IMPLEMENTATION_PLAN.md
2. start from the latest accepted main
3. implement only CL-007
4. preserve the listed reusable work
5. open a PR and stop for review
```
