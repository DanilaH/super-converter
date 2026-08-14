# Compare Lists — implementation plan

Plan revision: 2026-08-14  
Repository: DanilaH/super-converter  
Baseline main commit: cb40e0079676d869b56c32f82396eb7b7b17be00

## 1. Approved direction

The project now uses:

    Astro
    TypeScript strict
    vanilla browser APIs
    static output
    pnpm

Next.js and React are historical implementation details and must not be
restored unless a concrete unmet requirement is approved by the owner.

The stack change does not alter product semantics, UX, visual direction, SEO,
privacy, analytics or launch goals.

## 2. Current state

CL-001 through CL-006 are merged.

Completed work:

| Task | Result |
|---|---|
| CL-001 | Next-based foundation created |
| CL-002 | formatting and Vitest foundation |
| CL-003 | GitHub Actions quality gate |
| CL-004 | design tokens and global base styles |
| CL-005 | static shell and typed English content |
| CL-006 | pure comparison types and defaults |

The framework-specific implementation is still small. There is no parser,
comparison engine or interactive React tool.

Reusable during migration:

- src/features/compare-lists/model/types.ts
- src/features/compare-lists/model/defaults.ts
- src/features/compare-lists/model/defaults.test.ts
- src/content/en.ts
- design-token values and reusable global CSS rules
- Prettier/Vitest/CI intent

Replace during migration:

- Next/React packages and configuration
- App Router layout/page files
- React-only test setup
- Next-specific lint configuration
- page-shell CSS Module wiring

The next task is CL-007.

## 3. Mandatory reading order

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

If the task and main disagree, inspect main and stop on a real contradiction.
Do not silently choose new product behavior.

## 4. Working agreement

### One task per PR

- Branch: task/cl-XXX-short-name.
- PR title: [CL-XXX] Short task title.
- Start from the latest accepted main.
- Keep one logical change per PR.
- Do not mix dependency upgrades, cleanup or future features.
- The coding agent never merges its own PR.
- A dependent task starts only after the previous PR is accepted.

### Required response from the coding agent

The first line must be the PR URL. Then report:

1. what changed and why;
2. exact files changed;
3. checks run and results;
4. dependencies added and why, or none;
5. unresolved questions or risks, or none.

### Standard quality gate

After CL-007, these commands remain the common interface:

    pnpm format:check
    pnpm lint
    pnpm typecheck
    pnpm test
    pnpm build

The typecheck script must run Astro check after migration.

### Review order

1. product and UX semantics;
2. privacy;
3. architecture/dependencies;
4. tests and edge cases;
5. accessibility;
6. visual compliance;
7. SEO/generated HTML;
8. performance and client JavaScript.

Blocking fixes stay in the same PR. New features become separate tasks.

## 5. Domain contracts

The following behavior must be locked by CL-008 through CL-012:

- An entirely empty textarea means zero items.
- One physical line is one item; LF, CRLF and Unicode are supported.
- With Ignore empty lines off, explicit blank lines are data, including the
  final blank line produced by a trailing line break.
- Normalization changes comparison keys, never the raw textarea value.
- Result values preserve source representations.
- Matches uses the first matched representation from List A.
- With deduplication on, the first occurrence represents a normalized key.
- With deduplication off, occurrences pair from the start of each list and
  leftovers preserve source order.
- Union is A order followed by previously unseen B values.
- Differences is Only A followed by Only B.
- A Differences export has readable ONLY IN LIST A and ONLY IN LIST B labels.
- Other exports contain one value per line.

If a contract conflicts with an authoritative specification, stop at the
domain review gate and resolve it before DOM work.

## 6. Backlog

### Phase A — Astro migration

#### CL-007 — Migrate the accepted foundation to Astro

Scope:

- Replace Next.js/React with a current supported Astro release.
- Use Astro static output, strict TypeScript and no UI-framework integration.
- Preserve pnpm and the standard script names.
- Make pnpm typecheck run Astro check.
- Update ESLint/Prettier only as required to understand Astro files.
- Recreate the accepted header, homepage intro, privacy line, non-interactive
  tool placeholder and footer as generated Astro HTML.
- Preserve exact English copy and metadata title already accepted in CL-005.
- Move/adapt tokens and global styles without changing their values or visual
  direction.
- Preserve the CL-006 domain files, paths, exports and tests.
- Preserve the CI gate and update only commands/configuration that the new
  stack requires.
- Remove Next/React dependencies, configuration and framework-only files after
  their Astro replacements exist.
- Replace the React infrastructure smoke test with a focused framework-neutral
  or Astro-foundation check only if it still adds value.
- Update README development commands and stack summary.

Allowed migration dependencies:

- astro;
- @astrojs/check;
- the minimum Astro lint/format development plugins required by the existing
  quality gate.

Any other dependency requires a concrete explanation before adding it.

Explicitly out of scope:

- parser or normalization;
- comparison engine;
- interactive Compare Tool behavior;
- About, Privacy or 404 pages;
- editorial SEO sections;
- analytics, ads, hosting or deployment;
- redesigning content or tokens;
- moving pure domain files into a speculative generic shared layer.

Acceptance:

- Astro build emits static HTML for /.
- Initial HTML contains the accepted title, H1, description, privacy line,
  placeholder, wordmark and footer.
- No next, react, react-dom or UI-framework integration remains.
- No .tsx application file remains.
- Domain types/defaults and their test are unchanged in behavior.
- Only pnpm-lock.yaml exists.
- All standard checks and CI pass.

Review focus: migration completeness, preservation of reusable work, dependency
removal, generated HTML and absence of feature expansion.

### Review gate A — Astro foundation

Do not begin parser work until CL-007 is merged and main has a green static
Astro build with the accepted shell and reusable domain work intact.

---

### Phase B — Pure comparison domain

#### CL-008 — Implement line parsing and normalization

Scope:

- Implement one-line-per-item parsing with LF/CRLF support.
- Apply split, optional trim, optional empty removal and optional
  locale-independent case normalization in that order.
- Preserve raw source values and source indexes.
- Do not deduplicate or compare.

Required tests:

- empty input;
- LF and CRLF;
- Unicode;
- whitespace-only and internal blank lines;
- trailing newline;
- very long line;
- trim on/off;
- ignore-empty on/off;
- ignore-case on/off;
- no input mutation.

Acceptance: deterministic pure TypeScript, no Astro/DOM/browser imports, all
standard checks pass.

#### CL-009 — Implement set comparison

Scope:

- Implement Remove duplicates = ON.
- Compute Only A, Matches, Only B, Union, Differences and statistics.
- Use an approximately O(n + m) Map/Set approach.
- Preserve documented order and first-source representations.

Required tests: empty, one-sided, exact/partial match, duplicates,
case/whitespace matches, Unicode, ordering and representative values.

Do not implement multiset semantics in this task.

#### CL-010 — Implement multiset comparison

Scope:

- Implement Remove duplicates = OFF.
- Pair occurrences from the start of each list.
- Use min(countA, countB) for matches and ordered leftovers.
- Reuse the public comparison API without changing set behavior.

Required tests include x,x,y versus x,z, unequal repeated counts, normalized
duplicate keys and stable occurrence order.

#### CL-011 — Add invariants and result-stat tests

Scope:

- Add deterministic generated/invariant tests without a new property-testing
  package.
- Cover union completeness, category disjointness, differences composition,
  set symmetry by key, multiset count bounds and stats/result agreement.
- Add one moderate stress correctness case without a timing assertion.

Do not optimize or add a Worker.

#### CL-012 — Implement pure result formatting

Scope:

- Format every result type for display/copy/download.
- Define stable filenames for Differences, Only A, Only B, Matches and All.
- Keep Clipboard, Blob and DOM APIs out of the formatter.

Required tests: empty/single/multiple values, Unicode, spaces, Differences
labels/order and no source-value mutation.

### Review gate B — Domain

Approve empty-line semantics, normalization, duplicates, ordering,
representations, stats and export formatting before DOM interaction.

---

### Phase C — CompareTool markup and interaction

#### CL-013 — Add semantic CompareTool markup

Scope:

- Add CompareTool.astro with static semantic HTML.
- Add two labeled native textareas.
- Add four native normalization checkboxes with documented defaults.
- Add semantic Swap, per-list Clear and Load example buttons.
- Add hooks for counters, summary, tabs, result viewer and local feedback.
- Use data-* for behavior and classes for styling.
- Add a noscript explanation.

Do not add client behavior, copy/download, analytics or final visual polish.

Acceptance: tool markup exists in generated HTML, labels are associated, no UI
framework or client island is added.

#### CL-014 — Add raw input state, options and live comparison

Scope:

- Add a small TypeScript mount function for CompareTool roots.
- Keep raw List A/B, options and active result locally in the mounted tool.
- Bind input and option changes.
- Call the pure engine and render a basic Differences result through
  textContent.
- Update parsed counters without rewriting textarea values.
- Keep Differences as the default result.

Do not add a global store, storage, URL state, debounce, analytics or complex
rendering abstraction.

Required tests: paste/input, every option, live update, raw preservation,
one-sided input and multiple mount safety where practical.

#### CL-015 — Add Clear and Swap actions

Scope:

- Clear each list independently.
- Swap exact raw values.
- Preserve options and active result during Swap.
- Keep focus behavior predictable.

Required tests: each Clear, Swap, result update and focus.

#### CL-016 — Add Load example

Scope:

- Add a short neutral example to typed content/config.
- Populate both inputs and recompute immediately.
- Allow normal editing afterward.

Do not add a modal, tutorial or engine-owned example data.

#### CL-017 — Add cross-flow DOM interaction tests

Protect paste → result, option changes, Swap, Clear, Load example,
one-side-filled behavior and raw-data integrity through public labels/roles and
events. Production fixes must stay within this flow.

### Review gate C — Inputs

Verify no-submit behavior, exact raw values, focus, keyboard operation and no
storage/network side effects.

---

### Phase D — Results, copy and download

#### CL-018 — Add the summary strip

Render Only in A, In both and Only in B counts when input exists. Counts come
from the domain result. Use one restrained strip, not dashboard cards.

#### CL-019 — Add accessible result tabs

Add Differences, Only A, Only B, Matches and All with correct tablist/tab/panel
relationships and keyboard behavior. Differences is active by default. Use
underline/border styling, not pills.

#### CL-020 — Complete the result viewer and empty states

Add a bounded text-oriented viewer, labeled A/B sections for Differences and
documented states for both empty, no differences and no matches. Use
textContent/join, not one complex DOM node per row or innerHTML.

#### CL-021 — Add client-side Copy

Copy the full active formatted result with Clipboard API. Add local accessible
Copied/error feedback and a transient reset. No global toast, server fallback
or content-bearing analytics.

#### CL-022 — Add client-side TXT download

Create a Blob and object URL for the full active result, use stable filenames
and revoke every URL. No request or server endpoint.

#### CL-023 — Add complete result-flow tests

Protect paste → summary → tab → copy/download for equal lists, no matches, one
empty list and duplicates off using public DOM behavior.

### Review gate D — Core product

Paste, live compare, options, summary, tabs, copy and download work locally
without a backend or raw-data persistence.

---

### Phase E — Static SEO pages

#### CL-024 — Complete homepage editorial content

Add concise generated sections after the tool: how to compare, result meanings,
common uses, local processing/privacy and short FAQ. Keep one H1, tool first,
no keyword stuffing, FAQ schema, marketing grid or synonym page.

#### CL-025 — Add About and Privacy pages

Add generated /about and /privacy pages with truthful copy and links back to
the tool. Do not claim providers, cookies or advertising that do not exist.

#### CL-026 — Centralize site URL and metadata

Add one validated source of truth for product name and production origin.
Configure metadata, canonical URLs, Open Graph basics and favicon for existing
pages. Add documented public environment configuration without secrets.

#### CL-027 — Add robots, sitemap and real static 404

Add Astro static endpoints for robots.txt and sitemap.xml and a custom 404
page. Sitemap includes only /, /about and /privacy. Verify the selected preview
host serves the generated 404 file with HTTP 404 before launch.

### Review gate E — SEO

Inspect dist output and rendered metadata. Meaningful content must be
crawlable without executing the Compare Tool script.

---

### Phase F — Privacy-safe analytics boundary

#### CL-028 — Add typed analytics contracts and Noop adapter

Implement the documented event map, safe payload types, size buckets and typed
track API. Add Noop and development adapters. Select no production provider.

#### CL-029 — Wire and test analytics events

Wire tool_used, comparison_completed, option_changed, result_tab_changed,
copy_result, download_result and example_loaded at the DOM interaction layer.
Enforce once/dedup rules and safe enum/bucket payloads. No event per keystroke,
raw content or session replay.

### Review gate F — Analytics

Prove through tests and inspection that analytics can be disabled and never
receives list/result content.

---

### Phase G — Release quality

#### CL-030 — Complete responsive and visual compliance

Finish two-column desktop and stacked narrow layouts, long-line handling,
touch targets and 200% zoom. Provide representative screenshots. Do not change
the approved visual direction.

#### CL-031 — Run the accessibility pass

Add a focused automated accessibility check with the smallest justified
development dependency. Manually verify keyboard flow, focus, labels, tabs,
live status, contrast and touch targets. Fix only confirmed issues.

#### CL-032 — Add Playwright E2E smoke

Test production-like open → paste → Differences → option → tab → copy/download
availability on desktop and one mobile viewport. Keep the CI matrix small.

#### CL-033 — Establish the large-input performance baseline

Measure 1k, 10k and 100k rows separately for parse, normalize, compare,
format, DOM update, copy preparation and download preparation. Record the
environment and evidence. Add no Worker/virtualization/dependency here.

#### CL-034 — Run the privacy and security audit

Verify distinctive raw markers never enter requests, URL, storage, logs,
analytics or HTML injection paths. Confirm current-tab memory only,
textContent rendering and fully local copy/download.

#### CL-035 — Finalize README, environment and protected preview

Document verified setup/scripts/architecture/privacy/deployment configuration.
Configure a protected preview on the chosen static host and prevent preview
indexing or hostname leakage.

Owner decision before CL-035: choose the static hosting provider.

#### CL-036 — Run the final release audit

Record pass/fail evidence for functional, SEO, privacy, accessibility,
performance, visual, CI and static build gates. Do not hide fixes in this
audit; create a small follow-up task for every blocker.

### Review gate G — GO / NO-GO

Only after CL-036 is accepted: configure final domain/redirects, deploy
production, verify Search Console, submit sitemap and save the launch baseline.

## 7. Owner decisions

| Decision | Needed by | Current position |
|---|---|---|
| Stack | resolved | Astro + strict TS + vanilla browser APIs |
| Package manager | resolved | pnpm |
| Branch protection | deferred by owner | revisit before release |
| Hosting | before CL-035 | static host with preview protection |
| Production origin | before CL-026 final acceptance | one HTTPS origin |
| Analytics provider | optional | must not delay launch |
| Ads | after recurring traffic | off for MVP |

## 8. Review gates

| Gate | Required state |
|---|---|
| A | green Astro static foundation; reusable work preserved |
| B | pure comparison semantics and formatting approved |
| C | inputs/options/actions work with raw state intact |
| D | full local product flow including copy/download |
| E | generated pages, metadata, robots, sitemap and 404 |
| F | typed privacy-safe analytics boundary |
| G | responsive, accessible, profiled, audited preview |

## 9. Reusable prompt wrapper

    Work on repository DanilaH/super-converter.

    First read, in order: PRODUCT.md, UX.md, DESIGN.md, SEO.md,
    ARCHITECTURE.md, ANALYTICS.md, STACK_CHANGE.md, LAUNCH_PLAN.md,
    IMPLEMENTATION_PLAN.md, AGENTS.md.

    Then inspect current main. Implement only task CL-XXX below in a new
    task/cl-XXX-* branch. Do not add future features, unrelated refactors or
    speculative abstractions. Preserve all accepted work. Do not merge.

    [PASTE THE CL-XXX TASK HERE]

    Run the task checks and full applicable quality gate. In the response,
    put the PR URL on the first line, then report changed files, exact checks,
    dependencies and unresolved risks.

## 10. Next task

Send CL-007 — Migrate the accepted foundation to Astro. Do not start CL-008
until the migration PR is reviewed and merged.
