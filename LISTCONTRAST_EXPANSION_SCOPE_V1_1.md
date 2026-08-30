# ListContrast — List Tools Expansion Scope V1.1

**Status:** Approved implementation scope after clarification pass and independent re-review  
**Date:** 2026-08-30  
**Repository:** `DanilaH/super-converter`  
**Reviewed repository baseline:** `main @ 31d8aa8fc0b5f59f1703e965b70683302b485731`  
**Product:** ListContrast  
**Primary market:** English / global  
**Primary acquisition channel:** organic Google Search

---

## 0. Authority and precedence

This document is the source of truth for the **post-MVP ListContrast list-tools expansion**.

Existing repository documents remain authoritative for everything this scope does not explicitly change:

- `PRODUCT.md` — existing Compare Lists behavior and product principles;
- `UX.md` — interaction principles and existing comparer UX;
- `DESIGN.md` — visual language and anti-AI-slop constraints.

This document explicitly supersedes older planning only where required to allow the evidence-backed expansion described below.

In particular:

- the old rule “do not add tools before evidence” is considered satisfied for the three approved tools in this scope;
- the existing Compare Lists page remains on `/`;
- Spanish localization and the Instagram export tool are **deferred, not cancelled**, and are not part of this expansion;
- the project still must not become an arbitrary generic utility collection.

---

# 1. Why this expansion is approved

The expansion is based on three discovery runs and three enrichment runs, not on visual desire to make the site appear larger.

Approved acquisition clusters:

1. **Compare Lists** — existing anchor.
2. **Alphabetizer / Alphabetize List** — independent search intent.
3. **List Randomizer / Randomize List** — independent search intent.
4. **Remove Duplicate Lines** — smaller but coherent browser-utility intent.

Important research limitations:

- all three discovery runs had **100% Google geo mismatch**: target market `US`, but Google reported `Chelyabinsk Oblast, Russia`;
- Keyword Surfer volumes are directional evidence and **must not be added together as unique demand**;
- first-seen/Wayback evidence was unavailable because the first-seen provider was not configured;
- backlink and organic-traffic snapshot modules were unavailable;
- enrichment used bounded site-structure caps and did not exhaustively inspect every discovered domain.

Therefore this research supports:

> “These are reasonable low-cost product bets on the existing domain.”

It does **not** prove:

- guaranteed rankings;
- guaranteed traffic;
- guaranteed revenue;
- exact US search volume;
- a probability of SEO success.

---

# 2. Scope decision

ListContrast expands from one focused utility into a **small coherent list-processing toolkit**.

Approved structure:

```text
/
├── Compare Lists
├── /alphabetize-list
├── /randomize-list
├── /remove-duplicate-lines
├── /tools
├── /about
└── /privacy
```

The acquisition pages are:

```text
/
 /alphabetize-list
 /randomize-list
 /remove-duplicate-lines
```

`/tools` is primarily a navigation/internal-linking hub, not a new acquisition hypothesis.

---

# 3. Non-negotiable product boundaries

ListContrast remains:

- browser-based;
- static/client-side;
- account-free;
- backend-free for list processing;
- tool-first;
- compact;
- privacy-oriented;
- neutral in visual style.

ListContrast does **not** become:

- SaaS;
- dashboard;
- cloud workspace;
- generic text-tools portal;
- AI product;
- file-processing suite;
- user-account product.

Common flow:

```text
Google
  ↓
specific ListContrast tool
  ↓
paste line-based data
  ↓
immediate transformation or explicit randomization
  ↓
copy / download
  ↓
leave
```

One-time use remains a normal and successful session.

---

# 4. Existing Compare Lists

## Route

```text
/
```

The existing page remains the canonical Compare Lists page.

Do not create:

```text
/compare-lists
/list-compare
/list-comparer
/list-diff
/list-difference
```

as separate SEO pages.

The existing comparer already covers the overlapping Compare / Difference / Matches / Only A / Only B intent family.

## Existing behavior

Do not redesign or rewrite comparer behavior as part of this expansion unless a shared refactor exposes a real defect.

Preserve:

- two-list workspace;
- live comparison;
- current normalization defaults;
- set/multiset behavior;
- result tabs;
- copy;
- download;
- current compact layout;
- current URL.

Any shared-code extraction must pass the existing comparer regression suite unchanged.

---

# 5. Shared semantics for new single-list tools

The three new tools process **one item per line**.

Common default normalization:

```text
Trim whitespace      ON
Ignore empty lines   ON
```

Important semantic difference from the existing comparer:

> For transform tools, normalization affects the emitted result, not only the comparison key.

Example with `Trim whitespace = ON`:

Input:

```text
  Apple
Banana
```

Result item values:

```text
Apple
Banana
```

Do **not** blindly reuse the current comparer `parseList()` behavior if that would preserve raw whitespace in the emitted transformed result. The existing comparer intentionally preserves raw display values while normalizing comparison keys; the new transform tools have different output semantics.

Shared code is allowed only where semantics really match.

## 5.1 Processing pipeline

For the three new single-list tools, use this processing order unless a tool-specific section explicitly says otherwise. Raw input that is exactly the empty string (`""`) produces **zero items** regardless of the `Ignore empty lines` setting; do not treat an untouched empty textarea as one intentional empty item.

For non-empty raw input:

```text
raw input
  ↓
split into lines
  ↓
Trim whitespace, if ON
  ↓
Ignore empty lines, if ON
  ↓
tool-specific operation
  ↓
serialize processed values with "\n"
```

An empty line means a line whose **processed value** is exactly `""` at the empty-line filtering step.

Therefore:

```text
Trim whitespace = ON
Ignore empty lines = ON
"   " → removed

Trim whitespace = OFF
Ignore empty lines = ON
"   " → preserved
```

Line-ending / serialization contract:

- accept ordinary LF and CRLF input;
- serialize the emitted item array exactly as `processedItems.join("\n")`;
- use LF (`"\n"`) as the output separator;
- do not append any newline **in addition to** that serialization.

This means output may legitimately end with `\n` when `Ignore empty lines = OFF` and the final emitted item is an intentional empty string. That trailing separator represents the final empty item; it is not an extra formatting newline.

Examples:

```text
raw input = ""
→ []

raw input = "   "
Trim whitespace = ON
Ignore empty lines = OFF
→ [""]
→ serialized text = ""

raw input = "A\n"
Ignore empty lines = OFF
→ ["A", ""]
→ serialized text = "A\n"
```

Do not add Unicode normalization such as NFC/NFKC unless a tool-specific requirement later justifies it.

## 5.2 Common single-list interaction states

Unless a tool-specific section says otherwise:

- `Clear` is disabled only when the raw textarea is empty;
- `Try example` is available whenever the tool is mounted;
- if `Try example` would replace non-empty user input, use the existing comparer replacement-confirmation pattern before changing data;
- Copy and Download are enabled only when the current serialized result contains exportable text (`serializedText.length > 0`);
- emitted item count and exportability are separate: with `Ignore empty lines = OFF`, a valid single empty-string item can exist internally but serialize to `""`, so Copy/Download remain disabled for that empty-only result;
- if raw input exists but normalization produces zero effective items, Copy and Download remain disabled;
- live-transform tools recompute after source-affecting input/option changes;
- the Randomizer follows its explicit non-live state rules in section 7.

---

# 6. Tool 1 — Alphabetizer

## Route

```text
/alphabetize-list
```

## Target intent

Primary search family:

```text
alphabetizer
alphabetize list
list alphabetizer
alphabetizer online
alphabetical sorter
```

These variants belong to one page.

Do not create separate pages for:

```text
/alphabetizer
/alphabetical-sorter
/alphabetizer-online
```

## Working page copy

H1:

```text
Alphabetize a List Online
```

Working title direction:

```text
Alphabetizer — Alphabetize a List Online | ListContrast
```

The final metadata may be tightened during implementation review, but it must preserve the same intent and must not create another page for wording variants.

---

## 6.1 User flow

```text
paste list
  ↓
alphabetized result updates
  ↓
choose A–Z or Z–A if needed
  ↓
copy / download
```

No mandatory `Sort` submit button is required.

---

## 6.2 Input

One textarea:

```text
LIST
[ one item per line ]
```

Actions:

- paste/type;
- Clear;
- Try example.

Options:

```text
Trim whitespace      ON
Ignore empty lines   ON
Order                 A → Z
```

Order options:

```text
A → Z
Z → A
```

Duplicates remain in the result.

Alphabetizer must not silently become a dedupe tool.

---

## 6.3 Sorting semantics

Use locale-aware browser collation, not naive code-point/ASCII comparison.

Required behavior:

- fixed, testable English-facing collation;
- case-insensitive alphabetical grouping;
- numeric-aware ordering for common mixed strings;
- stable ordering for items considered equivalent by the collator;
- Unicode-safe input;
- original item casing preserved.

Recommended implementation baseline:

```ts
new Intl.Collator("en", {
  numeric: true,
  sensitivity: "accent",
});
```

`sensitivity: "accent"` is the baseline because the required case-insensitive grouping should not silently make accented and unaccented strings equivalent. For example, case variants such as `Apple` / `apple` are collator-equivalent for ordering, while accent differences such as `resume` / `résumé` remain distinguishable.

Items that compare as equivalent must retain their original relative order and original casing. For example:

```text
apple
Apple
APPLE
```

must keep that relative order when those items are otherwise collator-equivalent.

If implementation review finds a concrete browser inconsistency, the exact collator configuration may be adjusted, but the resulting semantics must be documented and tested. Do not switch to accent-insensitive behavior accidentally.

---

## 6.4 Result

Do not add a separate standalone count row if the result toolbar already contains the same count. Keep the result compact.

Result viewer:

```text
Alphabetized list · 24 items

[ result ]

Copy
Download
```

Download filename:

```text
alphabetized-list.txt
```

---

# 7. Tool 2 — List Randomizer

## Route

```text
/randomize-list
```

## Target intent

Primary search family:

```text
list randomizer
randomize list
randomize a list
random list generator
list shuffler
shuffle a list
```

One product page covers the shuffle/random-order job.

Do not create separate pages for:

```text
/list-shuffler
/random-list-generator
/randomize-a-list
/randomize-names
```

`randomize names` is not a primary positioning target because its SERP begins to overlap random-name generators, pickers and wheels.

---

## 7.1 Working page copy

H1:

```text
List Randomizer
```

Working title direction:

```text
List Randomizer — Randomize a List Online | ListContrast
```

---

## 7.2 Interaction model

Randomizer is intentionally **not live-randomized on every keystroke**.

Flow:

```text
paste list
  ↓
Randomize
  ↓
result
  ↓
Randomize again / Copy / Download
```

Reason:

A previously generated order must not unpredictably reshuffle because the textarea received another input event.

---

## 7.3 Input

One textarea.

Actions/options:

```text
Clear
Try example
Trim whitespace      ON
Ignore empty lines   ON
Randomize
```

Duplicates are preserved.

---

## 7.4 Randomization semantics

Use a proper unbiased in-place shuffle structure such as Fisher–Yates.

Do not use:

```ts
array.sort(() => Math.random() - 0.5)
```

The feature is ordinary user-facing random ordering.

Do not claim:

- cryptographic randomness;
- security-grade randomness;
- certified fairness.

The shuffle function must accept an injectable randomness source with `Math.random` as the production default so deterministic unit tests can be written without hardcoding a production sequence. Do not build a general randomness framework.

A valid shuffle is **not required** to differ from the source order or from the previous randomized order. Do not repeatedly reshuffle merely to force a visible difference; for small lists, an unchanged permutation is a legitimate random outcome.

---

## 7.5 Source changes after result

Any change to source-affecting state after randomization invalidates the current randomized result. Source-affecting changes include:

- editing/pasting into the textarea;
- `Clear`;
- `Try example`;
- changing `Trim whitespace`;
- changing `Ignore empty lines`.

The state transition is:

```text
old result becomes stale
  ↓
old randomized content is cleared/hidden
  ↓
Copy / Download disabled
  ↓
primary action returns to Randomize
  ↓
user runs Randomize again
```

Never present a result generated from earlier source-affecting state as if it matches the current textarea/options. The previous randomized content must be removed from the active result viewer rather than remaining available as a selectable/exportable stale result.

`Try example` fills the textarea but **does not automatically randomize** it. Random order is created only after the user explicitly activates `Randomize` or `Randomize again`.

---

## 7.6 Result

Do not add a separate standalone `24 items randomized` summary if the result toolbar already communicates the same count. Prefer one compact result header, for example:

```text
Randomized list · 24 items
```

Actions:

- Randomize again;
- Copy;
- Download.

Download filename:

```text
randomized-list.txt
```

---

# 8. Tool 3 — Remove Duplicate Lines

## Route

```text
/remove-duplicate-lines
```

## Target intent

Primary browser-utility family:

```text
remove duplicate lines
remove duplicate lines online
duplicate line remover
duplicate lines remover
duplicate text remover
deduplicate text
```

Do not position the page primarily around:

```text
remove duplicates from a list
```

because that generic query showed substantial programming/Python intent.

Do not create separate pages for:

```text
/dedupe-list
/duplicate-line-remover
/deduplicate-text
/remove-duplicates-from-list
```

---

## 8.1 Working page copy

H1:

```text
Remove Duplicate Lines
```

Working title direction:

```text
Remove Duplicate Lines Online | ListContrast
```

---

## 8.2 User flow

```text
paste text/list
  ↓
duplicate lines removed automatically
  ↓
copy / download
```

Live transformation is appropriate.

---

## 8.3 Options

```text
Trim whitespace      ON
Ignore empty lines   ON
Ignore case          OFF
```

`Ignore case` affects duplicate identity only.

It must not lowercase or rewrite user text.

Duplicate identity with `Ignore case = ON` uses a deterministic English-facing lowercase key of the already processed value:

```ts
const key = ignoreCase
  ? processedValue.toLocaleLowerCase("en")
  : processedValue;
```

Do not add a broader Unicode case-folding or normalization framework in this scope. Case variants such as `Apple` / `apple` are duplicates; accent variants such as `resume` / `résumé` remain distinct unless they otherwise produce the same key.

---

## 8.4 Deduplication semantics

First occurrence wins.

Input:

```text
B
A
B
C
A
```

Output:

```text
B
A
C
```

Ordering is preserved.

Do not sort automatically.

With:

```text
Trim whitespace = ON
```

the emitted first occurrence is trimmed.

With:

```text
Ignore case = ON
```

example:

```text
Apple
apple
APPLE
```

produces one item, preserving the processed representation of the first occurrence:

```text
Apple
```

---

## 8.5 Summary

Use compact inline summary.

Example:

```text
Input: 100 · Unique: 73 · Removed: 27
```

Definitions:

- `Input` = item count after Trim/Ignore-empty processing and before deduplication;
- `Unique` = emitted item count;
- `Removed` = `Input - Unique`.

Do not use dashboard/metric cards.

---

## 8.6 Result

```text
Unique lines · 73 items

[ result ]

Copy
Download
```

Download filename:

```text
unique-lines.txt
```

---

# 9. `/tools` navigation hub

## Route

```text
/tools
```

Purpose:

- give the product a stable tool index;
- keep the header compact;
- improve internal discoverability;
- provide a crawlable internal-linking hub.

It is **not** justified as a major SEO landing page for the generic query `list tools`.

Content should remain small and useful:

```text
List tools

Compare Lists
Find differences, matches and unique values between two lists.

Alphabetizer
Sort a list alphabetically.

List Randomizer
Shuffle list items into a random order.

Remove Duplicate Lines
Remove repeated lines while keeping the first occurrence.
```

No:

- huge cards;
- icons for decoration;
- feature-grid marketing;
- badges;
- fake popularity labels;
- SEO essay.

The page may be indexable as a genuine navigation resource, but no ranking/traffic expectation should be attached to it.

The `/tools` page must describe and link only tools that exist in the currently merged/releasable codebase. During incremental delivery:

```text
PR-1: Compare Lists + Alphabetizer
PR-2: + List Randomizer
PR-3: + Remove Duplicate Lines
```

Do not publish placeholder tool links that return 404 merely because a later PR is already planned.

---

# 10. Header, footer and internal linking

Current wordmark remains:

```text
ListContrast
```

Header target:

```text
ListContrast                    Tools    About
```

`Tools` links to `/tools`.

Do not put four direct tool links into the primary header if that makes desktop/mobile navigation noisy.

At final expansion completion, the footer should provide direct crawlable links to:

- Compare Lists;
- Alphabetizer;
- List Randomizer;
- Remove Duplicate Lines;
- About;
- Privacy.

During incremental delivery, footer and other navigation links must only reference tool routes already implemented in the merged/releasable codebase.

Each acquisition tool page should include a compact `Related tools` block containing only currently available tool routes.

Do not use a carousel or recommendation-card system.

---

# 11. About and Privacy

## About

Update `/about` from a one-tool description to product-level positioning.

Direction:

> ListContrast is a small collection of browser-based tools for comparing, sorting, randomizing and cleaning line-based lists.

Do not turn About into a marketing landing page.

About must remain factually accurate after every merged implementation PR. Do not mention randomizing or duplicate-line removal before those tool routes actually exist. The final four-tool positioning above becomes appropriate once PR-3 lands.

## Privacy

Update `/privacy` from Compare-specific wording to ListContrast-wide wording.

For every tool:

- raw list content stays in the browser;
- results stay in the browser;
- raw lines are not sent to analytics;
- raw lines are not logged;
- raw lines are not persisted by the site;
- no database is introduced;
- no localStorage/sessionStorage persistence is introduced in this scope.

Copy and Download export data only after the user explicitly performs those actions.

Privacy must be generalized from Compare-only wording in PR-1 and remain factually accurate after every later PR. A separate finalization PR is not allowed to be the first point at which public privacy wording catches up with already shipped tools.

---

# 12. Visual design

The current design direction remains authoritative:

> neutral precision utility

Do not visually redesign the site for the expansion.

Preserve:

- current canvas/surface palette;
- teal accent;
- system typography;
- restrained borders;
- existing radius system;
- compact density;
- tool-first page hierarchy;
- no unnecessary shadows.

Do not add:

- gradients;
- glassmorphism;
- large hero sections;
- decorative illustrations;
- giant cards;
- excessive pills;
- multi-color tool branding;
- SaaS feature grids;
- fake metrics/testimonials;
- AI-style decorative UI.

New tools must feel like the same product as the current comparer.

---

# 13. Single-list page composition

Target composition:

```text
Header

H1
one short functional description
local-processing note

Tool workspace
  ├── Input
  ├── relevant options/actions
  ├── Result
  └── Copy / Download

Short editorial content
Related tools

Footer
```

Desktop default target for transform tools:

```text
Input                         Result
[ textarea ]                  [ viewer ]
```

This side-by-side structure is preferred because it makes transformations immediately inspectable.

It is **not** an immutable layout requirement.

If real screenshot review shows that vertical composition is materially more compact/readable, use the better layout.

Mobile:

```text
Input
↓
Controls
↓
Result
```

No page-level horizontal scrolling.

Single-list control-state baseline:

| State | Clear | Try example | Primary transform action | Copy / Download |
| --- | --- | --- | --- | --- |
| Raw input empty | disabled | enabled | disabled where applicable | disabled |
| Raw input present but zero effective items | enabled | enabled | disabled where applicable | disabled |
| Live transform has non-empty result | enabled | enabled | n/a | enabled |
| Randomizer has valid source but no current randomized result | enabled | enabled | `Randomize` enabled | disabled |
| Randomizer has current valid result | enabled | enabled | `Randomize again` enabled | enabled |
| Randomizer source-affecting state changed | enabled if raw input remains | enabled | `Randomize` follows current effective-item validity | disabled |

Exact button text may use existing product copy conventions, but these availability semantics are part of the interaction contract.

---

# 14. Content strategy

Each acquisition page gets concise unique editorial content.

Allowed structure:

```text
How to use the tool
What the result means
Common uses
How your data is processed
FAQ
```

Rules:

- write for the actual tool;
- avoid copy/paste SEO templates;
- avoid keyword stuffing;
- avoid unnecessary word count;
- do not add filler solely to make pages longer;
- the interactive utility remains the main content.

Do not automatically add structured data/schema unless it is accurate and clearly justified during implementation review.

---

# 15. SEO and route integration

Each acquisition route must have:

- unique `<title>`;
- unique meta description;
- one clear H1;
- self canonical;
- semantic HTML;
- crawlable internal links;
- sitemap inclusion;
- HTTP 200;
- no accidental `noindex`.

Release smoke must additionally verify HTTP 200 for `/`, `/alphabetize-list`, `/randomize-list`, `/remove-duplicate-lines` and `/tools`.

Current repository implementation requires explicit integration work:

- extend `INDEXABLE_PATHS`;
- extend the metadata-key types;
- extend `canonicalPathFor(...)`;
- extend `englishContent.metadata` or its reviewed replacement structure;
- ensure `/tools` metadata is handled consistently;
- keep the existing `robots.txt` production behavior.

The current Nginx static routing already uses generic:

```text
try_files $uri $uri/index.html =404
```

so no route-by-route Nginx special case should be introduced merely for the new pages.

---

# 16. Metadata/content architecture

The current content model is heavily Compare-oriented.

The expansion must remove site-wide assumptions that there is only one tool. This includes reviewing not only About/Privacy/header/footer, but also site-level metadata and 404 copy that currently use `Compare Lists` as if it were the product name. A 404 page may still link users back to the comparer if that is the most useful recovery action, but its site-level naming must remain accurate for ListContrast.

Do not build a CMS.

Acceptable direction:

```text
site-wide content
tool-specific content
route metadata
shared content types where genuinely useful
```

It is acceptable either to:

- extend the current typed English content structure cleanly; or
- split tool-specific content into small typed modules.

Avoid one giant generic “tool config” abstraction if it makes individual tool semantics harder to understand.

---

# 17. Code architecture

Keep domain features explicit.

Target direction:

```text
src/features/
├── analytics/
├── compare-lists/
├── alphabetize-list/
├── randomize-list/
└── remove-duplicate-lines/
```

Shared code may exist for proven common behavior such as:

- splitting line input;
- empty-line filtering;
- text result serialization;
- clipboard/download helpers;
- common workspace presentation primitives.

But apply this rule:

> Do not extract a domain abstraction until at least two real features need the same semantics.

Do not create:

- `UniversalTool`;
- plugin architecture;
- runtime tool registry;
- generic transformation engine;
- backend API;
- persistence framework.

The current comparer normalization/output behavior is not identical to transform-tool output behavior, so dependency extraction must preserve that difference.

---

# 18. Analytics

Production analytics are currently effectively disabled through `NoopAnalytics`.

This expansion does **not** include enabling a production analytics provider.

Therefore analytics generalization is not a release blocker.

If existing analytics types are touched because new tools reuse the abstraction:

- no raw input;
- no raw output;
- no user list values;
- no email/URL/keyword contents.

Safe event concepts may include:

```text
tool_used
copy_result
download_result
example_loaded
option_changed
```

with a coarse tool identifier such as:

```text
compare
alphabetize
randomize
dedupe
```

But do not spend a standalone implementation phase on analytics before a real production provider is intentionally selected.

---

# 19. Performance

Expected algorithmic classes:

```text
Alphabetizer    O(n log n)
Randomizer      O(n)
Dedupe          O(n)
```

Performance smoke datasets:

```text
10 lines
1,000 lines
10,000 lines
100,000 lines
```

The 100k case is a measurement target, not an invented hard “zero jank” SLA.

For each tool:

- verify correctness;
- record whether interaction remains acceptable;
- avoid catastrophic page growth;
- keep result viewer bounded.

Do not add Web Workers pre-emptively.

Add a worker only if real browser measurements show a meaningful UI freeze worth the complexity.

---

# 20. Accessibility

Preserve the current baseline:

- explicit labels;
- keyboard operability;
- visible focus;
- semantic controls;
- sufficient contrast;
- accessible names;
- coarse-pointer target sizing;
- no color-only meaning.

Randomizer-specific:

- `Randomize` and `Randomize again` keyboard accessible;
- stale-result invalidation understandable to assistive technology.

Transformation pages:

- result changes should have appropriate semantics without creating noisy screen-reader announcements on every keystroke.

---

# 21. Tests

Use the existing project quality workflow.

## Shared single-list semantics

Cover at least once at the shared/pure-function level where the implementation structure makes sense:

- raw input `""` produces zero items even when `Ignore empty lines = OFF`;
- whitespace-only input with Trim ON + Ignore-empty OFF can produce one intentional empty-string item;
- a final intentional empty item is preserved by exact `items.join("\n")` serialization;
- a single emitted empty-string item may have item count `1` while serializing to `""`, and Copy/Download remain disabled because there is no exportable text.

Do not duplicate the same low-level parsing test across all three tool suites if one proven shared implementation owns that behavior.

## Alphabetizer

Cover:

- A → Z;
- Z → A;
- case-insensitive collation;
- numeric-looking strings;
- Unicode;
- duplicate preservation;
- whitespace normalization;
- empty-line filtering;
- stable ordering of collator-equivalent items;
- case variants are grouped without making accent variants equivalent by accident;
- LF/CRLF input and exact `items.join("\n")` output serialization contract.

## Randomizer

Test invariants, not one hardcoded random sequence unless using an injected deterministic source.

Cover:

- same multiset before/after;
- same item count;
- duplicates preserved;
- empty-line/trim behavior;
- `Randomize again`;
- input edit invalidates old result;
- no use of sort-with-random-comparator;
- source-affecting option changes invalidate the previous result;
- Try example does not auto-randomize;
- an unchanged permutation is accepted as valid;
- deterministic behavior is testable through the injected randomness source;
- LF/CRLF input and exact `items.join("\n")` output serialization contract.

## Dedupe

Cover:

- first occurrence wins;
- original order retained;
- trim semantics;
- ignore-case semantics;
- empty lines;
- Unicode;
- all-duplicate input;
- already-unique input;
- deterministic English-facing ignore-case identity without lowercasing emitted text;
- accent-distinct values remain distinct unless their processed keys truly match;
- LF/CRLF input and exact `items.join("\n")` output serialization contract.

## Regression

Existing Compare Lists tests remain green after any shared refactor.

## Browser/e2e smoke

At minimum verify:

- all new routes load;
- primary action works;
- Copy works where browser permissions allow the existing test approach;
- Download produces the intended content/filename;
- no page-level horizontal overflow on representative desktop/mobile viewports;
- metadata/canonical/sitemap outputs are correct;
- `/tools`, footer and Related tools contain no links to unimplemented/404 tool routes.

---

# 22. Delivery sequence

Do not create a speculative “foundation architecture” PR before a real second tool exists.

Preferred sequence:

## PR-1 — Alphabetizer + minimum expansion foundation

Implement:

- `/alphabetize-list`;
- only shared primitives already justified by current real consumers; do not extract a speculative single-list domain foundation solely for Randomizer/Dedupe that do not exist yet;
- initial site-wide tool terminology changes, including Compare-as-product assumptions in 404/site-level copy where applicable;
- `/tools` containing only Compare Lists and Alphabetizer;
- compact Related tools links on the Compare Lists and Alphabetizer acquisition pages, containing only implemented routes;
- header/footer changes needed for the now-multi-tool product, linking only implemented routes;
- a Compare-only → multi-tool About update that remains accurate for the two currently shipped tools;
- a Compare-only → site-wide Privacy update that accurately covers the current two-tool release;
- metadata/canonical/sitemap integration;
- source-of-truth documentation updates for behavior/architecture changed by this PR;
- tests.

Then:

```text
independent review
→ fix
→ re-review
→ merge
```

## PR-2 — List Randomizer

Implement:

- `/randomize-list`;
- explicit randomization interaction and source-invalidation state machine;
- shuffle logic with injectable randomness;
- metadata/content;
- `/tools`, footer and Related tools blocks updated across current acquisition pages to expose Randomizer only now that its route exists;
- About/Privacy updates only where necessary to keep public copy accurate;
- source-of-truth documentation updates for behavior/architecture changed by this PR;
- tests.

Then review/fix/re-review/merge.

## PR-3 — Remove Duplicate Lines

Implement:

- `/remove-duplicate-lines`;
- dedupe logic/options/summary;
- metadata/content;
- `/tools`, footer and Related tools blocks updated across current acquisition pages to expose Remove Duplicate Lines only now that its route exists;
- final four-tool About positioning and any required Privacy wording adjustment;
- source-of-truth documentation updates for behavior/architecture changed by this PR;
- tests.

Then review/fix/re-review/merge.

## PR-4 — Cross-tool finalization

Only if needed after the three implementation PRs:

- About/Privacy final consistency audit only;
- internal-link audit;
- visual consistency review;
- responsive screenshots;
- accessibility regression;
- metadata/canonical/sitemap audit;
- source-of-truth docs consistency audit only;
- final production build/e2e.

Do not create PR-4 merely to have a fourth PR if all cross-cutting work was already correctly completed earlier. PR-4 must not be used to postpone correctness-critical public copy, route linking, source-of-truth documentation, metadata or privacy updates that belong to the implementation PR that introduced the relevant behavior.

---

# 23. Out of scope

Do not implement in this expansion:

```text
Merge Lists
Compare Multiple Lists
Reverse List
List Cleaner
Excel Compare
CSV Compare
JSON Diff
Text Diff
File Compare
Random Name Generator
Random Picker
Wheel / Spinner
Team Generator
Number Generator
Remove Duplicate Files
Accounts
Authentication
Cloud storage
History
Saved lists
Collaboration
Backend processing
Database
API
Browser extension
Native/mobile app
Dark mode
AI features
Ads
Payments
```

Also do not create separate SEO pages for result modes or keyword variants already covered by one canonical tool.

Deferred existing roadmap ideas:

```text
Spanish localization
Instagram export comparison
```

They require their own evidence/priority decision and are not silently deleted by this scope.

---

# 24. Definition of Done

The expansion is complete when:

## Functional

- `/` Compare Lists works with no regression;
- `/alphabetize-list` works;
- `/randomize-list` works;
- `/remove-duplicate-lines` works;
- `/tools` links all current tools and has no links to unimplemented/404 tool routes;
- Copy works;
- Download works;
- mobile interaction works;
- keyboard interaction works.

## Privacy

- list values never leave the browser as part of tool processing;
- no new persistence was introduced;
- Privacy accurately describes all four tools.

## SEO

- all acquisition pages have unique metadata;
- `/tools` has its own consistent metadata and self-canonical as an indexable navigation resource;
- canonical paths are correct;
- `INDEXABLE_PATHS` is correct;
- sitemap contains intended indexable routes;
- internal links are crawlable and point only to implemented routes;
- no accidental duplicate-intent pages exist;
- no accidental `noindex`;
- `/`, `/alphabetize-list`, `/randomize-list`, `/remove-duplicate-lines` and `/tools` return HTTP 200 in release smoke checks.

## Quality

- format/lint/typecheck pass;
- unit tests pass;
- existing comparer regression tests pass;
- production build passes;
- e2e/browser smoke passes;
- edge cases are covered;
- source-of-truth docs match the shipped behavior rather than lagging until a later cleanup PR.

## Visual

- desktop review completed;
- mobile review completed;
- no page-level horizontal overflow;
- all tools visibly belong to the same ListContrast system;
- the tool remains the dominant page element;
- no decorative redesign was introduced.

---

# 25. Post-release decision rule

After deployment, do not automatically add another batch of list tools.

Observe:

- indexing;
- Google Search Console impressions;
- query distribution;
- landing-page distribution;
- average positions;
- clicks;
- long-tail queries;
- relative performance of Compare vs Alphabetizer vs Randomizer vs Dedupe.

If a production analytics provider is later enabled, interaction metrics may supplement this evidence, but GSC remains the primary acquisition measurement source.

Next expansion requires new evidence.

Until then:

> Four focused acquisition tools are enough.

---

# Appendix A — Research evidence used for this scope

## Compare Lists

Representative observed signals included:

```text
compare lists           49,500
list compare             40,500
list comparison          49,500
compare two lists        27,100
list diff                18,100
list difference          18,100
```

These numbers are provider observations and are not additive unique demand.

Enrichment showed repeated low-authority/specialist entrants across the shortlist, including strong repeatability by `comparetwolists.com` and `difflists.com`.

Recent registered domains also appeared in the SERP cohort, including domains registered in 2025–2026.

## Alphabetizer

Observed signals included:

```text
alphabetizer             22,200
list alphabetizer         8,100
alphabetical sorter       2,400
```

Enrichment produced a coherent Alphabetizer cluster and showed specialist entrants such as `alphabetizer.org` and `sortmylist.com`.

These specialist domains are old, so the evidence supports intent/weak-authority viability more strongly than rapid-new-domain viability.

## List Randomizer

Observed signals included:

```text
list randomizer          22,200
randomize list           22,200
randomize a list         22,200
random list generator     9,900
random order generator    5,400
```

Enrichment confirmed overlapping Randomizer/Shuffle SERPs.

The SERP also contains stronger established domains, so this is an attractive but more competitive bet than the existing Compare cluster.

A recently registered low-authority entrant (`letsrandomize.org`) appeared in the enriched shortlist, which supports the possibility of entry but is not proof of repeatable rapid ranking.

## Remove Duplicate Lines

Clean browser-tool signals included:

```text
remove duplicate lines online    720
duplicate lines remover           590
duplicate line remover            480
deduplicate text                  170
```

The generic query:

```text
remove duplicates from a list    1,000
```

formed its own mixed/programming-heavy SERP and is therefore not the primary page positioning.

The browser-tool clusters repeatedly included specialist utilities such as `dedupelist.com`, and a recent low-authority entrant (`linecounter.org`) appeared for a clean duplicate-line query.

---

# Appendix B — Independent review corrections vs the earlier draft

The earlier draft had the correct high-level product decision, but this reviewed version changes several details:

1. **Analytics is no longer a release requirement.**  
   Production currently uses `NoopAnalytics`; enabling a provider is outside this expansion.

2. **Transform normalization semantics are explicit.**  
   New tools emit trimmed/filtered values when those options are enabled. This avoids accidentally reusing the comparer’s raw-preservation behavior incorrectly.

3. **Alphabetizer behavior is defined more precisely.**  
   Locale-aware collation is required instead of the vague “sort correctly”.

4. **100k lines is a performance measurement, not an invented zero-freeze SLA.**

5. **No speculative shared-foundation PR.**  
   Shared abstractions are extracted only when real tools prove the common semantics.

6. **Repository integration requirements are explicit.**  
   The implementation must update the current manual route metadata/canonical/sitemap configuration.

7. **Research limitations are part of the source of truth.**  
   Geo mismatch, unavailable first-seen/traffic/backlink evidence and non-additive Surfer volumes must not be forgotten during implementation or later product decisions.

8. **Old Spanish/Instagram plans are deferred, not silently removed.**

9. **`/tools` is defined as navigation/internal linking, not as a fabricated SEO opportunity.**

10. **No separate variant pages.**  
    Each confirmed search family maps to one canonical tool page.

11. **Incremental releases cannot link to future 404 routes.**  
    `/tools`, footer and Related tools expose each new route only when that route exists in the merged/releasable codebase.

12. **Public product/privacy copy and source-of-truth docs update with the introducing PR.**  
    PR-4 is an optional consistency audit, not a place to postpone correctness.

13. **Single-list normalization is now a concrete processing pipeline.**  
    Trim precedes empty-line filtering, raw `""` is explicitly zero items, transform output uses processed values, LF/CRLF input is accepted, and output is exactly `processedItems.join("\n")` without an extra formatting newline.

14. **Alphabetizer collation avoids accidental accent-insensitivity.**  
    The baseline uses `sensitivity: "accent"`; case variants group case-insensitively while accent variants remain distinguishable.

15. **Randomizer state semantics are explicit.**  
    Every source-affecting change invalidates old output, Try example never auto-randomizes, unchanged permutations are valid, and the RNG is injectable for tests.

16. **Dedupe ignore-case identity is deterministic and narrow.**  
    It uses English-facing lowercase keys after common processing without rewriting emitted text or adding a Unicode-normalization framework.

17. **Serialization now preserves intentional empty items without contradiction.**  
    Output is exactly `processedItems.join("\n")`; no extra formatting newline is appended, but a legitimate final empty item may naturally produce a trailing separator.

18. **Item count and exportability are intentionally separate.**  
    A valid empty-string-only result may have a non-zero item count, but Copy/Download stay disabled when exact serialization produces no exportable text.

19. **Related-tool linking is incremental across all acquisition pages.**  
    PR-1 adds the first real Related tools links; later PRs expand those blocks only after their routes exist.

20. **`/tools` release correctness is explicit.**  
    The hub has its own metadata/self-canonical, is covered by HTTP smoke, and must never contain links to future 404 routes.

21. **An untouched empty textarea is not an intentional empty line.**  
    Raw `""` always produces zero items; intentional empty items exist only after non-empty raw input is processed with empty-line filtering disabled.

22. **Site-wide single-tool naming includes 404 and metadata copy.**  
    PR-1 reviews Compare-as-product assumptions beyond About/Privacy so the multi-tool brand does not ship with stale site-level naming.

23. **PR-1 cannot smuggle in a speculative single-list framework.**  
    Shared single-list domain abstractions wait until a second real transform tool proves the common semantics.
