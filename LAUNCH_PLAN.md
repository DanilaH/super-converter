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

Implementation and quality packages through `CL-033` are accepted. `CL-035A`
added the isolated nginx preview container on the shared VPS Docker network.

The owner has manually verified the protected preview: DNS and HTTPS work,
unauthenticated access returns `401`, authenticated access returns `200`,
the noindex header is present, expected routes return `200`, an unknown route
returns `404`, and the client-side comparison, options, copy and download
flows work.

`CL-035B` records the deployment runbook and closes the documentation portion
of the preview gate. The next and final delivery package is `CL-036`.

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
CL-035B — record the protected preview deployment runbook
CL-036  — run the final release audit and production-origin cutover
```

CL-035A already delivered the isolated preview container. Earlier implementation
and quality packages are retained in `IMPLEMENTATION_PLAN.md` for traceability.
Each remaining package keeps one bounded GitHub Issue, branch and PR.

## 19. Existing implementation decision

If Next/React implementation already exists: inspect first, report reusable work and migration cost, do not blindly rewrite. Minimal scaffold → migrate to Astro. Substantial tested implementation → ask before costly migration.

## 20. Protected preview

The protected preview is operational. Existing Caddy terminates HTTPS, requires
Basic Auth and adds `X-Robots-Tag: noindex, nofollow, noarchive`. The isolated
application container serves only the static build on the shared Docker network
and publishes no host port.

Owner verification covers the real build, desktop interaction, routing,
copy/download and indexing protection. See `deploy/vps/README.md` for
operations and rollback.

## 21. Domain

The production domain has been selected. It is configured in application SEO
output only during CL-036 after the final audit passes.

## 22. Hosting

The selected VPS hosts an nginx static preview container behind the existing
Caddy ingress. No Node runtime, backend or database is required.

## 23. Production origin

The configured origin remains the reserved placeholder `https://example.com`
until CL-036. The accepted audit must switch canonical, Open Graph, robots and
sitemap output to one real HTTPS origin without preview-hostname leakage.

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

After CL-035B is reviewed and merged:

```text
1. create the bounded CL-036 final-audit Issue
2. start from the accepted CL-035B main commit
3. collect pass/fail evidence without hiding implementation fixes in the audit
4. create separate blocker Issues where required
5. configure the production origin only if the audit passes
6. open a PR and stop for review
```
