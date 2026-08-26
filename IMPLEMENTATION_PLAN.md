# Compare Lists — implementation plan

Plan revision: 2026-08-26  
Repository: DanilaH/super-converter  
Audited main baseline: 2cebb564fe8d3bef19099b4a55250c273b98d359

## 1. Approved direction

The project uses:

```text
Astro
TypeScript strict
vanilla browser APIs
static output
pnpm
```

Do not restore Next.js, React or another UI framework without an approved,
concrete unmet requirement.

## 2. Current state

Implementation and quality packages through CL-033 are accepted. CL-035A and
CL-035B delivered and documented the isolated protected preview, which the
owner manually verified.

CL-036A recorded a conditional production GO in `RELEASE_AUDIT.md`; no
application-level blocker was found. CL-036B configures the repository for
`https://listcontrast.com`, adds an isolated production Compose service and
documents the reversible public cutover.

After CL-036B acceptance, the remaining work is operational: deploy the
accepted commit, configure/verify DNS and external Caddy, run live smoke, then
verify Search Console and submit the sitemap.

## 3. Consolidated delivery model

The original micro-roadmap CL-010 through CL-036 has been consolidated into
13 bounded delivery packages. This reduces manual handoffs without creating
open-ended agent tasks.

Each package still has:

- one GitHub Issue containing the exact scope;
- one dedicated branch;
- one pull request;
- an explicit allowed-file list where practical;
- one complete review before merge.

Related old task IDs are retained in each package description for traceability.

## 4. Mandatory reading order

Every fresh agent context reads:

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

The assigned Issue defines the current implementation scope. Report a real
conflict with an authoritative specification instead of inventing behavior.

## 5. Working agreement

- Start from the exact accepted `main` commit named in the Issue.
- Branch: `task/cl-XXX-short-name`.
- PR title: `[CL-XXX] Short package title`.
- Implement only the assigned package.
- Do not mix dependency upgrades, cleanup or later packages.
- Do not merge your own PR.
- A dependent package starts only after the previous PR is accepted.
- Blocking fixes stay in the same PR.

The coding agent response starts with the PR URL, then reports:

1. changed files and behavior;
2. checks and exact results;
3. dependencies added and why, or `none`;
4. deviations, risks or unresolved questions, or `none`.

## 6. Standard quality gate

```text
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Run additional package-specific checks from the assigned Issue.

## 7. Locked domain contracts

- An entirely empty textarea means zero items.
- One physical line is one item; LF, CRLF and Unicode are supported.
- With Ignore empty lines off, explicit blank lines are data, including the
  final blank line produced by a trailing line break.
- Normalization changes comparison keys, never raw textarea values.
- Result values preserve source representations.
- Matches uses the first matched representation from List A.
- With deduplication on, the first occurrence represents a normalized key.
- With deduplication off, occurrences pair from the start of each list and
  leftovers preserve source order.
- Union is A order followed by previously unseen B values.
- Differences is Only A followed by Only B.
- Differences export uses readable `ONLY IN LIST A` and `ONLY IN LIST B`
  sections. Other exports contain one value per line.

## 8. Remaining delivery packages

### CL-010 — Complete the pure comparison domain

Consolidates former CL-010 through CL-012.

Scope:

- implement `Remove duplicates = OFF` multiset semantics through the existing
  public comparison API;
- preserve the accepted set behavior;
- add deterministic invariant and result-stat tests without a property-testing
  dependency;
- add one moderate stress correctness case without a timing assertion;
- implement pure display/copy/download formatting and stable filenames for
  Differences, Only A, Only B, Matches and All.

No DOM, Astro, Clipboard, Blob, Worker, sorting or dependency changes.

Exit: parsing, normalization, set/multiset comparison, stats and formatting are
fully covered as a pure TypeScript domain.

### CL-013 — Add semantic CompareTool markup

Retains former CL-013.

Scope:

- add generated semantic markup with two labeled native textareas;
- add four native option checkboxes with documented defaults;
- add Swap, per-list Clear and Load example controls;
- add hooks for counters, summary, tabs, result viewer and local feedback;
- add a noscript explanation.

No client behavior, copy/download, analytics or final polish.

### CL-014 — Implement CompareTool interaction and actions

Consolidates former CL-014 through CL-017.

Scope:

- add a small vanilla TypeScript mount function;
- keep raw A/B, options and active result in local tool state;
- bind input/paste and option changes to the pure engine;
- render a basic Differences result through `textContent`;
- implement per-list Clear, exact raw Swap and Load example;
- preserve options and active result during Swap;
- add focused DOM interaction tests for the complete input/action flow and
  multiple-mount safety.

No global store, storage, URL state, analytics, copy/download or framework
islands.

### CL-018 — Complete summary and result browsing

Consolidates former CL-018 through CL-020.

Scope:

- render Only in A, In both and Only in B counts;
- add accessible Differences, Only A, Only B, Matches and All tabs with
  keyboard behavior;
- complete a bounded text-oriented result viewer;
- implement the documented both-empty, no-differences and no-matches states;
- use `textContent`/joined text, not one complex node per row or `innerHTML`.

No copy/download or dashboard-card redesign.

### CL-021 — Add local copy, download and result-flow tests

Consolidates former CL-021 through CL-023.

Scope:

- copy the full active formatted result through Clipboard API;
- provide local accessible success/error feedback with transient reset;
- download the full active result through Blob/object URL;
- use stable filenames and revoke every object URL;
- protect the complete summary/tab/copy/download flow with DOM tests.

No server fallback, network request, global toast or content-bearing analytics.

### CL-024 — Add editorial content and legal pages

Consolidates former CL-024 and CL-025.

Scope:

- add concise generated homepage sections for how-to, result meanings, common
  uses, local processing and FAQ;
- add generated `/about` and `/privacy` pages with truthful copy and links back
  to the tool.

Keep one H1, tool first, no FAQ schema, keyword stuffing, marketing card grid
or claims about providers/cookies/ads that do not exist.

### CL-026 — Complete metadata and static SEO routes

Consolidates former CL-026 and CL-027.

Scope:

- add one validated source for product name and production origin;
- add canonical URLs, descriptions, Open Graph basics and favicon;
- add static robots.txt, sitemap.xml and a custom 404;
- include only `/`, `/about` and `/privacy` in the sitemap;
- prevent preview-host leakage.

Production origin remains an owner decision before final acceptance.

### CL-028 — Add the privacy-safe analytics boundary

Consolidates former CL-028 and CL-029.

Scope:

- add typed event contracts, safe payloads, size buckets and a typed track API;
- add Noop and development adapters;
- wire and test the documented tool events with once/dedup rules.

No production provider, raw list/result content, per-keystroke events or session
replay.

### CL-030 — Complete responsive and accessibility quality

Consolidates former CL-030 and CL-031.

Scope:

- finish two-column desktop and stacked narrow layouts;
- verify long lines, touch targets, focus, keyboard flow and 200% zoom;
- add the smallest justified automated accessibility check;
- fix only confirmed responsive/accessibility issues;
- provide representative evidence.

Do not change the approved visual direction.

### CL-032 — Add a focused Playwright E2E smoke

Retains former CL-032.

Scope:

- test production-like open, paste, Differences, option change, tab and
  copy/download availability;
- cover one desktop and one mobile viewport;
- keep the dependency and CI matrix minimal.

### CL-033 — Establish performance and privacy/security evidence

Consolidates former CL-033 and CL-034.

Scope:

- measure 1k, 10k and 100k rows separately for parse, compare, format, DOM,
  copy preparation and download preparation;
- record environment and results without timing assertions in unit tests;
- verify distinctive raw markers never enter requests, URL, storage, logs,
  analytics or HTML injection paths;
- confirm current-tab memory only and `textContent` rendering.

No Worker, virtualization or performance dependency unless evidence creates a
separate approved follow-up.

### CL-035 — Finalize documentation and protected preview

Delivered as two bounded packages:

- CL-035A added the multi-stage static image, nginx runtime configuration and
  isolated preview Compose service on the external Docker network;
- CL-035B records setup, verification, update, rollback, shared-Caddy ownership
  and the final pre-release state.

Owner-provided manual evidence confirms:

- DNS and HTTPS are operational;
- unauthenticated access returns `401`;
- authenticated access returns `200`;
- `X-Robots-Tag` prevents indexing;
- `/`, `/about` and `/privacy` return `200`;
- an unknown route returns `404`;
- browser comparison, options, copy and download work.

The real password/hash, VPS address and unrelated host configuration are not
repository artifacts. The preview hostname must never become the production
canonical origin.

### CL-036 — Audit and production cutover

Delivered as two bounded packages:

- CL-036A recorded pass/fail evidence for functional, SEO, privacy,
  accessibility, performance, visual, CI, static-build and preview-deployment
  gates. It produced a conditional GO with no application-level blocker;
- CL-036B sets the audited production origin, adds a production service
  isolated from preview and documents DNS/Caddy/deploy/live-verification and
  rollback operations.

CL-036B does not mutate the VPS or external services from the repository PR.
Search Console verification and sitemap submission occur only after live
functional and SEO checks pass.

## 9. Review gates

| Gate | Required state |
|---|---|
| Domain | set/multiset semantics, stats and formatting approved |
| Inputs | semantic markup and raw-preserving interaction approved |
| Core product | summary, tabs, copy and download work locally |
| SEO | generated content, pages, metadata and static routes approved |
| Analytics | typed boundary cannot receive raw content |
| Quality | responsive, accessible, tested, profiled and audited preview |

## 10. Owner decisions

| Decision | Needed by | Current position |
|---|---|---|
| Stack | resolved | Astro + strict TS + vanilla browser APIs |
| Package manager | resolved | pnpm |
| Branch protection | deferred | revisit before release |
| Hosting | resolved | isolated static container behind existing VPS Caddy |
| Production origin | resolved in CL-036B | `https://listcontrast.com`; live after accepted cutover deployment |
| Analytics provider | optional | must not delay launch |
| Ads | after recurring traffic | off for MVP |

## 11. Next action

Review and merge CL-036B. Then execute `deploy/vps/PRODUCTION.md` in order:
deploy and internally verify production, configure external Caddy and DNS, run
public functional/SEO smoke, verify Search Console, submit the sitemap and
record the deployed commit plus rollback target.
