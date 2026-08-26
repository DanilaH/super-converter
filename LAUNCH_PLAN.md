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

Implementation, quality and protected-preview packages through `CL-035B` are
accepted. The owner has manually verified protected DNS/HTTPS, authentication,
noindex protection, route statuses and the browser comparison actions.

`CL-036A` recorded a conditional GO in `RELEASE_AUDIT.md`: no
application-level release blocker was found. `CL-036B` prepares the real
production origin, an isolated production Compose service and the reversible
cutover runbook. Public DNS/Caddy deployment and live verification remain
manual release operations after the cutover PR is accepted.

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
CL-036B — prepare and execute the reversible production cutover
```

CL-035B and the CL-036A pre-production audit are accepted. Earlier packages are
retained in `IMPLEMENTATION_PLAN.md` for traceability.

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

The canonical production origin is `https://listcontrast.com`. The `www`
hostname redirects permanently to the apex origin. The protected preview keeps
its own hostname and must never appear in canonical or sitemap output.

## 22. Hosting

The selected VPS uses two isolated static nginx Compose services behind the
existing Caddy ingress: protected preview and public production. Neither
publishes a host port. No Node runtime, backend or database is required.

## 23. Production origin

The repository is configured for `https://listcontrast.com`. Canonical, Open
Graph, robots and sitemap output derive from that single origin. Live acceptance
still requires the DNS/Caddy/deployment checks in
`deploy/vps/PRODUCTION.md`.

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

## 32. Immediate release action

After CL-036B is reviewed and merged:

```text
1. update the VPS checkout to the accepted main commit
2. start and internally verify the separate production Compose service
3. append, validate and gracefully reload the public Caddy blocks
4. configure/confirm apex and www DNS without changing preview
5. run public functional, redirect, 404 and SEO smoke checks
6. verify Search Console and submit the production sitemap
7. record the deployed commit and rollback target
```

Follow `deploy/vps/PRODUCTION.md`; stop and roll back on any listed release
stop condition.
