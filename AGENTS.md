# AGENTS.md — Compare Lists

## 1. Role of this file

This file is the operational contract for any coding agent working on Compare Lists.

The agent must treat the project specifications as authoritative and must not redesign the product, architecture, SEO strategy, analytics model, or visual direction on its own.

The goal is to implement the approved MVP faithfully, in small reviewable steps.

---

# 2. Mandatory reading order

Before making any code changes, read these files in this order:

```text
1. PRODUCT.md
2. UX.md
3. DESIGN.md
4. SEO.md
5. ARCHITECTURE.md
6. ANALYTICS.md
7. LAUNCH_PLAN.md
8. AGENTS.md
```

Do not start implementation after reading only `AGENTS.md`.

This file summarizes operational rules but does not replace the detailed specifications.

---

# 3. Source-of-truth hierarchy

If requirements appear to conflict, use this priority by topic:

```text
Product scope / semantics
→ PRODUCT.md

Interaction / user flow / states
→ UX.md

Visual appearance
→ DESIGN.md

Search / indexing / metadata
→ SEO.md

Technical boundaries / dependencies
→ ARCHITECTURE.md

Events / metrics / privacy-safe analytics
→ ANALYTICS.md

Implementation / release sequence
→ LAUNCH_PLAN.md
```

If a real contradiction remains after applying this hierarchy, stop and ask for clarification before coding around it.

Do not silently choose your own interpretation.

---

# 4. Product goal

Build a focused browser-based utility that lets a user compare two lists and immediately see:

```text
Differences
Only in A
Only in B
Matches
All
```

The product is primarily an SEO acquisition experiment.

Primary English search intent:

```text
compare lists
compare two lists
list comparison
list diff
```

The MVP is not a SaaS platform.

---

# 5. MVP scope

The first release includes:

```text
List A
List B

live comparison

Trim whitespace
Ignore empty lines
Ignore case
Remove duplicates

Differences
Only A
Only B
Matches
All

Summary
Swap
Clear
Load example
Copy
Download TXT

About
Privacy

SEO metadata
robots
sitemap
404

privacy-safe analytics boundary
```

---

# 6. Explicitly out of scope

Do not add any of the following unless the owner explicitly changes the specification:

```text
authentication
accounts
user profiles
database
backend compare API
history
saved comparisons
cloud storage
payments
subscriptions
AI
chat
CSV parser
XLS/XLSX parser
Instagram import
Spanish localization
French/German/etc.
dark mode
browser extension
mobile app
admin panel
CMS
multi-tool dashboard
feature flags platform
microservices
WebSocket
background jobs
ads enabled by default
```

Do not add future-phase features because they are mentioned in roadmap documents.

Roadmap does not mean MVP scope.

---

# 7. Required stack

Use:

```text
Next.js App Router
React
TypeScript
strict mode
CSS Modules
global CSS design tokens
```

Do not replace the stack without explicit approval.

---

# 8. Package manager

Default recommendation:

```text
pnpm
```

If the repository already has a package manager and lockfile, preserve it.

Never mix lockfiles.

---

# 9. Rendering rules

Keep the page static/server-first.

Expected boundary:

```text
Server/static page
│
├── metadata
├── H1 / intro
├── editorial SEO content
├── About / Privacy links
└── CompareTool ← client boundary
```

Do not add `'use client'` to:

```text
root layout
entire homepage
editorial content
```

unless there is a concrete technical reason.

Only interactive UI should require client-side hydration.

---

# 10. No backend for user data

The comparison must happen entirely in the browser.

Never implement:

```text
POST /compare
server action for list comparison
database persistence
cloud storage
server-side download generation
server-side clipboard fallback
```

Raw list data must never be sent to the server.

---

# 11. Privacy contract

User list contents are sensitive by default.

Never send or store:

```text
List A raw text
List B raw text
comparison result text
email values
URLs
IDs
keywords
names
first/last row
sample row
clipboard contents
download contents
```

Do not put list data into:

```text
analytics
logs
error reporting
URL query params
URL hash
localStorage
sessionStorage
cookies
server actions
network requests
```

List data lives only in browser memory for the current tab.

Reload may clear it.

That is intentional.

---

# 12. Domain engine boundary

Comparison logic must be pure TypeScript.

The engine must not import:

```text
React
Next.js
DOM APIs
analytics
CSS
storage
localization
```

Expected separation:

```text
parse
↓
normalize
↓
compare
↓
format
```

The engine should be testable in isolation.

---

# 13. Raw text must never be mutated

Normalization affects comparison semantics only.

Example:

```text
raw:
"  John@example.com "

comparison key:
"john@example.com"
```

when:

```text
Trim whitespace = ON
Ignore case = ON
```

The textarea must still display the user's original text.

Never rewrite the input just because an option changes.

---

# 14. Parsing semantics

MVP rule:

```text
one line = one item
```

Support:

```text
LF
CRLF
Unicode
```

Do not automatically split by:

```text
comma
semicolon
tab
CSV syntax
```

Those belong to future parser features.

---

# 15. Duplicate semantics

This is fixed.

## Remove duplicates = ON

Treat lists as sets.

## Remove duplicates = OFF

Treat lists as multisets.

Example:

```text
A:
x
x
y

B:
x
z
```

Result:

```text
Matches:
x

Only A:
x
y

Only B:
z
```

For each normalized key:

```text
matches = min(countA, countB)
onlyA   = max(countA - countB, 0)
onlyB   = max(countB - countA, 0)
```

Do not invent alternative duplicate behavior.

---

# 16. Ordering semantics

Do not sort results automatically.

Preserve source order.

Rules:

```text
Only A
→ List A order

Only B
→ List B order

Matches
→ first appearance order from List A

All / Union
→ A order, then previously unseen B values

Differences
→ Only A, then Only B
```

Sorting is not part of MVP.

---

# 17. Live comparison

There is no mandatory `Compare` button.

Expected interaction:

```text
paste A
paste B
↓
result appears automatically
```

Changing an option recalculates automatically.

A short debounce/deferred calculation is allowed only for performance.

Do not add a submit button because it feels conventional.

---

# 18. State ownership

Keep state local to the Compare Lists feature.

Expected mutable state:

```text
rawListA
rawListB
options
activeResultTab
copy feedback
```

Comparison result is derived data.

Do not introduce:

```text
Redux
Zustand
MobX
TanStack Query
SWR
```

for the MVP.

---

# 19. UX rules

Approved direction:

```text
neutral precision utility
moderately compact
tool-first
slightly technical
universal audience
```

Required:

```text
two columns on desktop
single column on mobile
Differences tab default
summary + tabs
live comparison
local copy feedback
client-side download
visible privacy note
```

Do not redesign this flow.

---

# 20. First-screen rule

The user must see the tool immediately.

Do not insert before it:

```text
large hero
CTA
feature grid
testimonials
logos
marketing illustration
pricing section
```

The tool is the page.

---

# 21. Design direction

Approved visual direction:

```text
warm neutral canvas
white functional surfaces
graphite text
single restrained teal accent
system sans
system monospace for data
small radii
1px borders
almost no shadows
left-aligned hierarchy
```

Use the exact visual decisions from `DESIGN.md`.

---

# 22. Anti-AI-slop rules

Do not use:

```text
gradients
glassmorphism
glow
decorative blobs
huge centered hero
oversized marketing headline
cards around every section
rounded-xl / rounded-2xl everywhere
pill tabs
pill badges everywhere
dashboard metric cards
fake testimonials
fake logos
feature card grids
random icons beside every label
purple/blue startup gradient
gradient text
animated backgrounds
parallax
gratuitous scale-on-hover
excessive shadows
illustrations
stock imagery
```

Critical rule:

> Do not wrap something in a card unless the border/background communicates a real functional grouping.

---

# 23. Design tokens

Use project tokens.

Do not introduce arbitrary colors, radii, or spacing when an existing token covers the need.

Design scale from `DESIGN.md` includes:

```text
spacing:
4 / 8 / 12 / 16 / 24 / 32 / 48 / 64

radius:
4 / 6 / 8 max for normal static UI
```

Do not introduce `16px`, `20px`, `24px` radii for ordinary controls.

---

# 24. UI primitives

Prefer semantic native elements:

```text
textarea
button
input[type=checkbox]
```

Use headless primitives only when they solve a real behavior/accessibility problem.

Do not add a visual UI kit.

Do not add:

```text
Material UI
Ant Design
Chakra UI
Mantine
Bootstrap
```

Do not add shadcn as a design source.

If a headless library is used, it must inherit the project visual language.

---

# 25. Dependency policy

Every runtime dependency must have a concrete justification.

Do not add libraries for trivial local behavior.

Avoid:

```text
lodash for basic transforms
icon library for 1 icon
animation library
form library
request library
state manager
date library
CSV library
UI framework
```

If a new dependency is genuinely needed, explain why before adding it.

---

# 26. CSS rules

Use:

```text
tokens.css
globals.css
CSS Modules near feature UI
```

Do not:

```text
hardcode random hex colors in components
create massive global feature selectors
use inline styles for the visual system
create generic Card/Badge abstractions without need
```

---

# 27. SEO rules

Homepage `/` is the primary SEO page.

Do not create synonym pages:

```text
/compare-lists
/compare-two-lists
/list-comparison
/list-diff
```

for the same tool.

One intent → one strong page.

The homepage must contain in initial HTML:

```text
title
H1
intro
labels
editorial explanatory content
About/Privacy links
```

Do not ship a client-only blank shell.

---

# 28. SEO page structure

Expected order:

```text
header
H1
short description
privacy line
Compare Tool
How to compare two lists
What results mean
Common use cases
Privacy explanation
FAQ
footer
```

Do not move editorial SEO content above the tool.

---

# 29. SEO content rules

Do not:

```text
keyword stuff
write 3,000 words because "SEO"
create fake FAQ questions
repeat same keyword unnaturally
create geo doorway pages
auto-generate thin pages
```

Supporting content must be useful to a user who actually compares lists.

---

# 30. Metadata rules

Metadata must be server/static.

Do not derive SEO metadata from client state.

Use one canonical production origin.

No preview hostname in production metadata.

---

# 31. Analytics contract

Product code should call a small typed analytics adapter.

Do not scatter provider SDK calls through UI components.

Events:

```text
tool_used
comparison_completed
option_changed
result_tab_changed
copy_result
download_result
example_loaded
```

---

# 32. Analytics privacy

Never include raw user content.

Prefer coarse size buckets:

```text
0
1-10
11-100
101-1000
1001-10000
10001+
```

Do not send analytics on every keystroke.

`comparison_completed` must be deduplicated.

---

# 33. Session replay

Do not enable session replay in MVP.

Do not enable automatic DOM capture that can expose textarea contents.

If an analytics/error provider adds replay by default, disable it.

---

# 34. Ads

Ads are disabled in first release.

Do not enable YAN or another network during MVP implementation unless explicitly requested.

Architecture may contain:

```tsx
<AdSlot placement="after-tool" />
```

with a no-op provider.

It must create no empty gap when disabled.

---

# 35. Accessibility

Required:

```text
visible labels
semantic buttons
keyboard navigation
visible focus
accessible tabs
touch-friendly controls
no color-only semantics
screen-reader-compatible local status
```

Never replace native textarea behavior with a custom editor unless explicitly required.

---

# 36. Performance rules

Test:

```text
1k rows
10k rows
100k rows
```

Measure separately:

```text
parsing
comparison
React rendering
copy
download
```

Do not add Web Worker or virtualization before profiling.

If performance is bad, identify the bottleneck first.

---

# 37. Result rendering

Do not render huge results as thousands of complicated nested components.

Prefer a simple text-oriented result viewer.

Copy/download must operate on the full result, not only visible rows.

---

# 38. Testing priorities

Highest priority:

```text
domain unit tests
```

Required cases:

```text
empty
A-only
B-only
exact match
partial match
trim
ignore empty
ignore case
dedupe ON
dedupe OFF
ordering
CRLF
Unicode
long strings
```

Then interaction tests:

```text
paste
live compare
toggle option
swap
clear
tabs
copy
download
empty states
```

At least one E2E smoke flow before production.

---

# 39. TypeScript quality

Required:

```text
strict: true
```

Avoid:

```text
any
unsafe casts
non-null assertions used as shortcuts
broad untyped config
```

Prefer explicit typed domain contracts.

Use `satisfies` where it improves correctness.

---

# 40. CI requirements

Before merge:

```text
lint
typecheck
tests
build
```

All must pass.

Do not merge code that leaves the primary branch broken.

---

# 41. Implementation order

Follow this sequence unless there is a concrete reason to change it:

```text
1. project foundation
2. design tokens
3. comparison domain types
4. parser / normalization
5. comparison engine
6. domain tests
7. CompareTool state
8. inputs / options
9. summary / result tabs
10. copy / download
11. responsive UX
12. SEO/editorial shell
13. metadata / robots / sitemap
14. analytics adapter
15. accessibility pass
16. performance profiling
17. E2E smoke
18. production build
```

Do not start by polishing decorative UI before the engine is correct.

---

# 42. Recommended PR sequence

Prefer reviewable stages:

```text
PR 1
Foundation + design tokens

PR 2
Comparison engine + tests

PR 3
Inputs + options + live behavior

PR 4
Results + copy + download

PR 5
SEO shell + About/Privacy

PR 6
Responsive + accessibility + performance

PR 7
Analytics + launch plumbing
```

If work is done directly without PRs, preserve the same logical commit boundaries.

---

# 43. Before each implementation task

Before changing code:

1. identify which spec sections apply;
2. state the implementation scope;
3. inspect existing code before creating abstractions;
4. reuse existing patterns where they match the spec;
5. avoid unrelated refactors.

Do not modify unrelated files unless necessary.

---

# 44. After each implementation task

Run relevant checks.

At minimum:

```text
lint
typecheck
relevant tests
```

Before release:

```text
full test suite
build
```

If the implementation changes user-facing behavior, compare against `UX.md`.

If it changes visual behavior, compare against `DESIGN.md`.

---

# 45. Do not silently expand scope

If implementation reveals a potentially useful idea, do not implement it automatically.

Examples:

```text
"CSV upload would be easy"
"dark mode is easy"
"let's persist settings"
"let's add sorting"
"let's add a third list"
"let's add drag-and-drop"
```

Record the idea separately and keep current scope unchanged.

---

# 46. Do not over-abstract

Avoid generic abstractions before they have multiple real consumers.

Do not create:

```text
UniversalDataProcessor
GenericToolFramework
AbstractComparisonService
GlobalComponentRegistry
PluginArchitecture
```

The project is intentionally small.

Rule:

```text
first use → local
second real use with same semantics → consider extraction
```

---

# 47. Shared folder rule

`shared` is not a dumping ground.

Only place code there when it is genuinely cross-feature.

Do not move compare-specific code to `shared` just because it might be reused someday.

---

# 48. Future Spanish rule

Do not implement Spanish during MVP unless explicitly requested.

When it is implemented later:

```text
/es/comparar-listas
```

must reuse the same domain engine but have localized:

```text
title
description
H1
UI labels
instructions
FAQ
editorial content
```

Do not canonical Spanish to English.

---

# 49. Future Instagram rule

Do not implement Instagram during MVP.

When explicitly requested later:

```text
official Instagram export only
client-side file parsing
no login
no scraping
no password
no unofficial account access
```

Keep Instagram parser in its own feature boundary.

Do not contaminate the generic newline parser with Instagram-specific logic.

---

# 50. Launch constraints

First release launches without ads.

Production must pass:

```text
functional
SEO
privacy
accessibility
performance
visual compliance
CI
```

See `LAUNCH_PLAN.md` for full gates.

---

# 51. Definition of done for a coding task

A task is complete only when:

- behavior matches the approved spec;
- code respects architecture boundaries;
- no unnecessary dependency was added;
- TypeScript is safe;
- relevant tests exist;
- lint/typecheck/tests pass;
- design remains compliant;
- privacy remains intact;
- no unrelated scope was added.

---

# 52. Definition of done for MVP

The MVP is done when the approved first release is production-ready.

It is **not** done when:

```text
every future roadmap feature exists
the site feels like a startup platform
all imaginable edge features are added
```

The correct MVP is the smallest credible tool capable of testing organic acquisition.

---

# 53. Agent communication rules

When reporting work:

Be concise and factual.

Include:

```text
what changed
why
tests/checks run
anything still unresolved
```

Do not claim:

```text
"fully production-ready"
"perfect SEO"
"guaranteed ranking"
"100% secure"
```

unless such a claim is actually verifiable.

---

# 54. When to ask the owner

Ask before:

- changing product semantics;
- adding a runtime dependency with meaningful footprint;
- changing the approved UX flow;
- changing visual direction;
- introducing backend/storage;
- changing SEO URL structure;
- enabling ads;
- enabling analytics that require new privacy/consent tradeoffs;
- changing duplicate semantics;
- creating a new indexable page.

Do not ask for trivial implementation details already covered by the specs.

---

# 55. Final operating principle

The project should remain:

```text
small
fast
private
indexable
easy to understand
easy to review
easy to kill if the hypothesis fails
```

Do not optimize for hypothetical scale before the product earns traffic.

The implementation should make the approved experiment cheap to launch and easy to evaluate.
