# ARCHITECTURE.md — Compare Lists

## 1. Purpose

Этот документ фиксирует техническую архитектуру production-версии Compare Lists после пересмотра стека.

Главная модель продукта:

```text
static HTML page
    +
small client-side TypeScript utility
    +
no backend for user data
```

Для этого продукта **не используется React/Next.js**.

Выбранный стек:

```text
Astro
TypeScript
vanilla browser APIs
plain/scoped CSS
```

Цель архитектуры — получить максимально простой, быстрый, дешёвый и долговечный сайт, который можно масштабировать как шаблон для будущих boring utilities.

## 2. Why Astro

Compare Lists не является SPA или сложным application shell.

Страница состоит из:

```text
static SEO content
+
two textareas
+
several controls
+
result viewer
+
small deterministic client-side algorithm
```

React state/hydration здесь не дают достаточной пользы, чтобы оправдать дополнительный runtime и abstraction layer.

Astro выбран как тонкий static-site layer:

- file-based pages;
- static HTML by default;
- reusable layouts/components;
- TypeScript support;
- client-side `<script>` without UI framework;
- convenient future localization/routes;
- no React/Vue/Svelte runtime required.

Astro должен использоваться как **static HTML generator**, а не как повод построить ещё один application framework поверх него.

## 3. Architecture principles

### 3.1 Static by default

Production pages генерируются как статические HTML files.

MVP не требует:

```text
SSR
server runtime
server adapter
server actions
API routes
database
```

Expected flow:

```text
build
  ↓
dist/
  ↓
static hosting / CDN
```

### 3.2 JavaScript only for the tool

Без JavaScript пользователь всё равно должен получить title, H1, explanation, privacy information, About/Privacy links и supporting SEO content.

JavaScript нужен только для inputs, options, live comparison, tabs, copy, download, local feedback и analytics side effects.

### 3.3 No frontend UI framework

MVP запрещает framework integrations:

```text
React
Preact
Vue
Svelte
Solid
```

если только владелец проекта отдельно не одобрит изменение архитектуры.

### 3.4 Pure domain core

```text
raw text
   ↓
parse
   ↓
normalize
   ↓
compare
   ↓
result model
```

Core engine imports no Astro, DOM, window/document, analytics, storage or CSS.

### 3.5 Keep the DOM layer thin

DOM layer only reads controls, calls pure functions, renders result state, handles copy/download and interaction events.

## 4. Required stack

```text
Astro
TypeScript strict
CSS custom properties
Astro scoped styles / small global stylesheet
```

Default package manager: `pnpm` if the repository has not already fixed another one.

## 5. Explicitly not required

Do not add:

```text
Next.js
React
global state manager
TanStack Query / SWR
backend framework
ORM
database
API client
form library
visual UI kit
animation framework
large icon library
```

## 6. Proposed repository structure

```text
src/
├── pages/
│   ├── index.astro
│   ├── about.astro
│   ├── privacy.astro
│   ├── 404.astro
│   ├── robots.txt.ts
│   └── sitemap.xml.ts
├── layouts/
│   └── BaseLayout.astro
├── components/
│   ├── SiteHeader.astro
│   ├── SiteFooter.astro
│   ├── CompareTool.astro
│   └── EditorialContent.astro
├── features/
│   └── compare-lists/
│       ├── model/
│       │   ├── types.ts
│       │   └── defaults.ts
│       └── lib/
│           ├── parse-list.ts
│           ├── normalize-item.ts
│           ├── compare-lists.ts
│           ├── format-result.ts
│           └── __tests__/
├── scripts/
│   └── compare-tool.ts
├── analytics/
│   ├── analytics.ts
│   ├── events.ts
│   └── noop-analytics.ts
├── ads/
│   ├── ad-slot.ts
│   └── noop-ad-provider.ts
├── content/
│   ├── types.ts
│   └── en.ts
└── styles/
    ├── tokens.css
    └── global.css
```

Не создавать placeholder files только ради diagram.

The feature path above intentionally preserves the accepted pure TypeScript
work from `CL-006`. Astro does not require domain code to move into a generic
`src/lib` directory. A future extraction needs a second real consumer.

## 6.1 Existing repository migration map

Preserve or adapt:

```text
src/features/compare-lists/model/*  → preserve paths and semantics
src/content/en.ts                   → preserve typed content
src/app/tokens.css                  → move to src/styles/tokens.css
src/app/globals.css                 → adapt to src/styles/global.css
CI quality-gate intent              → keep the same five checks
Vitest domain tests                 → preserve
```

Replace during the dedicated migration task:

```text
Next/React packages and configuration
src/app/layout.tsx and src/app/page.tsx
page-shell CSS Module wiring
React-only infrastructure smoke test
Next-specific ESLint configuration
```

The migration must not also implement parsing, comparison, interactive tool
behavior, About/Privacy pages or launch plumbing.

## 7. Page composition

```text
BaseLayout.astro
│
├── SiteHeader
├── main
│   ├── H1 / intro
│   ├── privacy line
│   ├── CompareTool
│   └── EditorialContent
└── SiteFooter
```

`CompareTool.astro` выводит semantic HTML и подключает небольшой processed `<script>`. Не внедрять component framework island.

## 8. Client script model

Recommended:

```html
<div data-compare-tool>
  ...
</div>

<script>
  import { mountCompareTool } from '../scripts/compare-tool'
  mountCompareTool()
</script>
```

Astro renders markup; small TypeScript script binds behavior. Не генерировать весь tool markup через JavaScript.

## 9. DOM binding

Use explicit behavior hooks such as `data-list-a`, `data-list-b`, `data-option-ignore-case`, `data-result-viewer`, `data-result-tab`.

CSS classes are for styling. `data-*`/IDs are for behavior.

## 10. State model

```ts
type ToolState = {
  listA: string
  listB: string
  options: CompareOptions
  activeResult: ResultType
}
```

Comparison result is derived data. No generic store.

## 11. Comparison domain model

```ts
export type CompareOptions = {
  trimWhitespace: boolean
  ignoreEmptyLines: boolean
  ignoreCase: boolean
  removeDuplicates: boolean
}

export type ResultType =
  | 'differences'
  | 'onlyA'
  | 'onlyB'
  | 'matches'
  | 'all'
```

Result contains `onlyA`, `onlyB`, `matches`, `differences`, `union`, plus stats. Exact internal structures may evolve without changing approved semantics.

## 12. Raw text vs normalized key

Mandatory boundary:

```text
user raw value
     ↓
normalization
     ↓
comparison key
```

Textarea is never rewritten by normalization.

## 13. Parsing semantics

MVP: one physical line = one item. Support LF, CRLF and Unicode. No automatic CSV/comma/semicolon/tab parsing.

An entirely empty textarea represents zero items. When `Ignore empty lines` is
off, explicit blank lines are data, including a final blank line produced by a
trailing line break. Tests lock this behavior before UI work begins.

## 14. Normalization order

```text
split lines
↓
trim if enabled
↓
remove empty if enabled
↓
derive case-normalized key if enabled
↓
duplicate semantics
```

Unit-test the order.

## 15. Duplicate semantics

`Remove duplicates = ON` → set semantics.

`Remove duplicates = OFF` → multiset semantics.

For each normalized key:

```text
matches = min(countA, countB)
onlyA   = max(countA - countB, 0)
onlyB   = max(countB - countA, 0)
```

## 16. Ordering semantics

No auto-sort.

```text
Only A      → A order
Only B      → B order
Matches     → first matching appearance from A
Union       → A order, then unseen B
Differences → Only A followed by Only B
```

Normalization changes comparison keys, not displayed source values. With
deduplication on, the first occurrence represents a key. With deduplication
off, occurrences are paired from the start of each list. `Matches` uses the
first matched representation from List A.

## 17. Comparison algorithm

Target `O(n + m)` with `Map`/`Set`. Avoid nested full-list scans as the core algorithm.

## 18. Result rendering strategy

Do not render a complex DOM node per item.

Preferred:

```text
result arrays
↓
join('\n')
↓
single text-oriented viewer
```

Copy/download use the full in-memory result.

## 19. Live comparison

Input/paste/option change schedules a synchronous update: pure compare → summary/current result. Start simple; add small debounce only if profiling shows benefit.

## 20. Performance verification

Test 1k, 10k and 100k rows. Measure parsing, normalization, comparison, formatting, DOM update, copy and download separately.

## 21. Web Worker rule

No Worker by default. Add only after measurement proves main-thread blocking. Pure engine remains Worker-compatible.

## 22. Copy / Download

Clipboard API for copy. Client-side Blob/object URL for download. No server fallback or network request.

## 23. Privacy boundary

Raw list data must never enter network requests, analytics, error reports, URLs, cookies, localStorage, sessionStorage or server logs.

MVP keeps list data only in current-tab memory.

## 24. Analytics / Ads

Analytics uses a small safe adapter and never receives raw user content. Ads are OFF in MVP and remain outside the comparison core.

## 25. CSS architecture

Use CSS custom properties, Astro scoped styles and small `tokens.css`/`global.css`. No CSS-in-JS, no visual UI framework, no Tailwind requirement.

`DESIGN.md` remains the visual source of truth.

## 26. Localization readiness

English only. No i18n framework yet. Future Spanish route can be:

```text
src/pages/es/comparar-listas.astro
```

using the same comparison engine.

## 27. Future Instagram feature

Keep it separate from generic list parsing. It may reuse comparison primitives, but no Instagram logic belongs in the generic newline parser.

## 28. SEO architecture

Generated HTML contains title, metadata, H1, intro, tool markup, editorial content and footer at build time. No client-rendered SEO shell.

`robots.txt` and `sitemap.xml` may be generated at build time from one production-origin source of truth.

## 29. Security

Render user values with `textContent`, never HTML injection. No eval. No user data in URLs. Minimal third-party scripts/dependencies.

## 30. TypeScript

Strict. Avoid `any`, unsafe casts and routine non-null assertions.

## 31. Testing strategy

Domain tests first:

```text
empty
A-only
B-only
exact match
partial match
trim
empty lines
case sensitivity
dedupe ON/OFF
ordering
LF/CRLF
Unicode
long values
```

Then DOM/integration tests and at least one E2E smoke flow.

Existing tests that cover pure TypeScript contracts remain valid across the
framework migration. React-specific test helpers are removed; DOM behavior is
tested through semantic markup and browser-facing events.

## 32. CI

Required:

```text
format:check
lint
typecheck (runs Astro check)
tests
build
```

## 33. Dependency policy

Every runtime dependency needs a concrete reason. Prefer browser/platform APIs and local code.

## 34. Static hosting

Hosting needs HTTPS, custom domain, static files/CDN, redirects, 404, headers and preferably preview deploys. No always-on Node server required.

## 35. Future boring-utility template

Conceptual reusable pattern:

```text
Astro static shell
+
design tokens
+
SEO basics
+
privacy-safe analytics adapter
+
optional ad slot
+
tool-specific pure TS
+
small DOM script
```

Do not build a generic multi-tool platform before multiple real products justify it.

## 36. Implementation order

```text
1. migrate the accepted foundation to Astro
2. preserve/adapt tokens, content and static homepage shell
3. parse + normalize
4. compare engine and domain tests
5. CompareTool semantic HTML
6. thin DOM script
7. summary/results/tabs
8. copy/download
9. responsive styling
10. editorial SEO content
11. About / Privacy / 404
12. robots / sitemap / metadata
13. analytics adapter
14. accessibility pass
15. 1k/10k/100k profiling
16. E2E smoke
17. production build
```

## 37. Remaining task sequence

```text
CL-007 — Astro foundation migration
CL-008…CL-012 — comparison domain and formatting
CL-013…CL-017 — CompareTool markup and DOM interaction
CL-018…CL-023 — results, copy and download
CL-024…CL-027 — SEO/editorial and static routes
CL-028…CL-029 — privacy-safe analytics boundary
CL-030…CL-036 — responsive, accessibility and release gates
```

See `IMPLEMENTATION_PLAN.md` for the intentionally small PR boundaries. These
CL identifiers continue the accepted project history; they do not reset after
the stack change.

## 38. Acceptance criteria

- Static Astro HTML.
- No React/Vue/Svelte/Preact runtime.
- Tool markup exists before JS.
- Pure core imports no Astro/DOM.
- Multiset semantics and ordering tested.
- Small vanilla TypeScript DOM layer.
- No HTML injection with user data.
- No raw list network/storage/analytics.
- 1k/10k/100k profiled.
- No unnecessary runtime dependencies.
- Build produces deployable static output.

## 39. Final architecture

```text
                  Astro build
                      │
          ┌───────────┴───────────┐
          ↓                       ↓
     static HTML             static assets
          │
   ┌──────┴─────────────────────────────┐
   │                                    │
SEO/editorial HTML                CompareTool HTML
                                        │
                                 small browser TS
                                        │
                            input/options/tabs
                                        ↓
                              pure TypeScript core
                                        │
                         parse → normalize → compare
                                        ↓
                                  result model
                               ↙       ↓       ↘
                            render    copy    download

No React
No hydration framework
No backend
No database
No user-data persistence
```

## 40. Fixed decision

Current approved technical direction:

```text
Astro + TypeScript + static output + vanilla DOM client logic
```

If an agent believes another frontend framework is required, it must first show a concrete unmet requirement and ask for approval.
