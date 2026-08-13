# ARCHITECTURE.md — Compare Lists

## 1. Purpose

Этот документ фиксирует техническую архитектуру первой production-версии Compare Lists.

Архитектура должна поддерживать текущую продуктовую гипотезу:

```text
SEO-readable page
      +
small interactive browser utility
      +
no backend for user data
```

Основные цели:

- минимальная инфраструктура;
- indexable HTML;
- строгая TypeScript-модель;
- полностью client-side comparison;
- отсутствие хранения пользовательских списков;
- хорошая производительность на больших входах;
- возможность добавить Spanish, Instagram workflow, analytics и ads без переписывания core;
- отсутствие преждевременной платформенной архитектуры.

---

# 2. Architecture principles

## 2.1 Static-first, interactive where necessary

Большая часть страницы:

- layout;
- heading;
- metadata;
- explanatory content;
- About;
- Privacy

не требует client-side JavaScript.

Интерактивным должен быть только сам Compare Tool.

Модель:

```text
Server/static HTML
│
├── Header
├── H1 / intro
├── SEO/editorial content
├── Footer
│
└── CompareTool          ← client boundary
      │
      ├── inputs
      ├── options
      ├── comparison
      └── results
```

---

## 2.2 No backend for comparison

MVP не имеет API для:

- list input;
- comparison;
- result generation;
- download;
- history.

Raw user data существует только в памяти browser tab.

```text
textarea
   ↓
browser memory
   ↓
pure comparison engine
   ↓
browser UI / Blob download
```

Нет:

```text
POST /compare
database
server logs with list content
cloud storage
```

---

## 2.3 Pure domain core

Comparison logic не должна зависеть от:

- React;
- Next.js;
- DOM;
- analytics;
- UI components;
- localization;
- storage.

Core engine — набор чистых TypeScript-функций.

Это позволяет:

- тестировать без browser;
- переиспользовать engine в Spanish page;
- переиспользовать его в Instagram flow;
- вынести вычисления в Web Worker позднее без переписывания business logic.

---

## 2.4 Feature-first, not framework-first

Не строить FSD/DDD-иерархию ради маленькой utility.

Организация кода следует продуктовым границам.

Recommended:

```text
src/
├── app/
├── features/
│   └── compare-lists/
├── shared/
│   ├── analytics/
│   ├── ads/
│   └── ui/
├── content/
└── styles/
```

`shared` не является свалкой.

В `shared` попадает код только после появления реального cross-feature use case.

---

# 3. Technology stack

## Required

```text
Next.js App Router
React
TypeScript — strict mode
CSS Modules + global CSS design tokens
```

## No backend/database

MVP не требует:

```text
PostgreSQL
Redis
Prisma
ORM
API layer
server state library
```

## No global client state library

Не подключать:

```text
Redux
Zustand
MobX
```

Состояние Compare Tool локально и принадлежит самой feature.

## No server-state library

Не нужен TanStack Query / SWR, потому что MVP не получает domain data с сервера.

---

# 4. Why Next.js

Next.js нужен здесь не ради backend.

Он даёт удобную границу:

```text
static/server-rendered SEO shell
        +
client-side interactive island
```

`page.tsx` остаётся Server Component.

Интерактивный tool выносится в отдельный Client Component.

Metadata остаётся на server/static стороне.

---

# 5. Rendering strategy

## Homepage

```text
/
```

Должна быть prerenderable.

Она не зависит от:

- cookies;
- session;
- request headers;
- auth;
- database.

Core content доступен в initial HTML.

## Client hydration

Hydration требуется только для interactive feature:

```tsx
<CompareTool />
```

Не ставить `'use client'` на:

```text
root layout
whole page
editorial sections
metadata-bearing page
```

без необходимости.

---

# 6. Static export decision

Архитектура **совместима со static export**, но MVP не обязан включать `output: 'export'`.

Почему не фиксируем static export как обязательный режим:

- обычный Next deployment и так может prerenderить страницу;
- static export ограничивает часть runtime-функций;
- в будущем могут понадобиться host/server capabilities;
- архитектурная цель — static-first page, а не конкретный deployment mode.

Если выбранный production host выигрывает от pure static hosting, `output: 'export'` можно включить после build validation.

Это deployment decision, не domain decision.

---

# 7. Proposed repository structure

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── not-found.tsx
│   ├── about/
│   │   └── page.tsx
│   ├── privacy/
│   │   └── page.tsx
│   ├── robots.ts
│   └── sitemap.ts
│
├── features/
│   └── compare-lists/
│       ├── model/
│       │   ├── types.ts
│       │   ├── defaults.ts
│       │   └── result.ts
│       │
│       ├── lib/
│       │   ├── parse-list.ts
│       │   ├── normalize-item.ts
│       │   ├── compare-lists.ts
│       │   ├── format-result.ts
│       │   ├── download-result.ts
│       │   └── __tests__/
│       │
│       └── ui/
│           ├── compare-tool.tsx
│           ├── list-input.tsx
│           ├── comparison-options.tsx
│           ├── summary-strip.tsx
│           ├── result-tabs.tsx
│           ├── result-viewer.tsx
│           └── compare-tool.module.css
│
├── shared/
│   ├── analytics/
│   │   ├── analytics.ts
│   │   ├── events.ts
│   │   └── noop-analytics.ts
│   │
│   ├── ads/
│   │   ├── ad-slot.tsx
│   │   ├── ad-provider.ts
│   │   └── noop-ad-provider.ts
│   │
│   └── ui/
│       └── [only genuinely reused primitives]
│
├── content/
│   ├── types.ts
│   └── en.ts
│
└── styles/
    ├── tokens.css
    └── globals.css
```

Не создавать пустые директории заранее, если они ещё не нужны.

Структура выше — target architecture, а не требование создать placeholder files.

---

# 8. Dependency direction

Основное правило:

```text
app
 ↓
feature UI
 ↓
feature model/lib

shared utilities can be imported by app/features
but shared never imports product feature
```

То есть:

```text
app → features → shared
```

Разрешено:

```text
feature/ui → feature/lib
feature/ui → feature/model
feature/lib → feature/model
feature → shared
app → content
```

Запрещено:

```text
shared → compare-lists
compare-lists/lib → React
compare-lists/lib → Next.js
content → feature UI
```

---

# 9. Comparison domain model

Recommended types:

```ts
export type CompareOptions = {
  trimWhitespace: boolean
  ignoreEmptyLines: boolean
  ignoreCase: boolean
  removeDuplicates: boolean
}

export type ListItem = {
  raw: string
  key: string
  index: number
}

export type CompareResult = {
  onlyA: string[]
  onlyB: string[]
  matches: string[]
  union: string[]
  differences: string[]
  stats: {
    rowsA: number
    rowsB: number
    uniqueA: number
    uniqueB: number
    onlyA: number
    onlyB: number
    matches: number
  }
}
```

Финальные типы могут уточняться реализацией, но separation `raw` vs comparison `key` обязательно.

---

# 10. Raw value vs normalized key

Одна из ключевых архитектурных границ:

```text
raw user value
     ↓
normalization
     ↓
comparison key
```

Например:

```text
raw:  "  John@example.com "
key:  "john@example.com"
```

при:

```text
Trim whitespace = ON
Ignore case = ON
```

Textarea никогда не переписывается normalized value.

Raw text остаётся собственностью input state.

---

# 11. Normalization pipeline

Recommended order:

```text
split lines
    ↓
trim?               
    ↓
drop empty?         
    ↓
case normalization?
    ↓
duplicate handling
```

Важно:

- normalization создаёт comparison representation;
- normalization не мутирует input;
- порядок преобразований фиксируется тестами.

---

# 12. Line parsing

MVP semantic unit:

```text
one line = one item
```

Поддерживать line endings:

```text
LF
CRLF
```

Не добавлять автоматически:

- comma splitting;
- semicolon splitting;
- CSV parsing;
- TSV parsing

в core MVP.

Это изменяет семантику данных и относится к будущим import/parser features.

---

# 13. Case comparison

При `ignoreCase = true` comparison key использует locale-independent lowercase conversion.

Raw value сохраняется.

Не делать:

```text
textareaValue = textareaValue.toLowerCase()
```

Не добавлять accent folding / transliteration в MVP.

---

# 14. Duplicate semantics

Эту семантику необходимо определить заранее, иначе `Remove duplicates = OFF` становится неоднозначным.

## Remove duplicates = ON

Lists трактуются как sets.

```text
A:
x
x
y

→
{x, y}
```

## Remove duplicates = OFF

Lists трактуются как **multisets**.

Количество повторов имеет значение.

Пример:

```text
A:
x
x
y

B:
x
z
```

Результат:

```text
Matches:
x

Only A:
x
y

Only B:
z
```

То есть для каждого normalized key:

```text
matches count = min(countA, countB)
onlyA count   = max(countA - countB, 0)
onlyB count   = max(countB - countA, 0)
```

Это делает toggle `Remove duplicates` математически определённым и предсказуемым.

---

# 15. Ordering rules

Результаты по умолчанию **не сортируются**.

Сохраняется порядок исходных данных насколько это возможно.

Правила:

## Only A

Порядок List A.

## Only B

Порядок List B.

## Matches

Порядок первого появления в List A.

## Union

Сначала значения из A в их порядке, затем новые значения из B.

## Differences

Сначала Only A, затем Only B в соответствующих исходных порядках.

Причина:

> compare tool не должен неожиданно перестраивать данные пользователя.

Sorting может стать отдельной future option.

---

# 16. Display representation under ignore-case

Если два значения совпадают по normalized key:

```text
A: John@example.com
B: john@example.com
```

и `Ignore case = ON`, output по умолчанию сохраняет representation из source, которому принадлежит конкретный result view.

Для `Matches` предпочтительно первое matched representation из List A.

Это правило должно быть покрыто тестами.

---

# 17. Comparison algorithm

Базовая стратегия:

```text
parse + normalize
      ↓
Map<normalizedKey, item bucket/count>
      ↓
derive result sets/multisets
```

Target complexity:

```text
O(n + m)
```

для сравнения после parsing.

Не использовать nested scan:

```text
A.every(item => B.includes(item))
```

как основной алгоритм на больших lists.

---

# 18. State ownership

Все mutable user state Compare Tool принадлежит:

```text
CompareTool
```

или небольшому feature-local hook.

State:

```text
rawListA
rawListB
options
activeResultTab
transientCopyState
```

Derived state:

```text
parsed lists
comparison result
stats
```

не хранится отдельно без причины.

Принцип:

> Если значение полностью вычисляется из существующего state, сначала считать его derived data, а не отдельным state.

---

# 19. No global store

Compare Tool — одна локальная feature.

Global store не нужен.

Не использовать state manager «на будущее».

Если Instagram tool позднее будет отдельной feature, shared comparison engine переиспользуется через pure modules, а не через глобальный store.

---

# 20. Live computation strategy

Для обычных inputs:

```text
raw input state updates immediately
        ↓
comparison derived from current/deferred values
        ↓
result renders
```

UI typing/paste не должен зависеть от asynchronous server call.

Начальная реализация может использовать:

- memoized pure calculation;
- small debounce/deferred computation, если measurement показывает пользу.

Не вводить loading state искусственно.

---

# 21. Performance thresholds

До release измерить минимум:

```text
1k rows
10k rows
100k rows
```

Проверять отдельно:

1. parsing;
2. comparison;
3. React render;
4. result viewer render;
5. copy;
6. download.

Важно отличать:

```text
algorithm slow
```

от:

```text
DOM rendering slow
```

---

# 22. Web Worker strategy

Web Worker **не входит автоматически в MVP**.

Добавлять только если profiling показывает main-thread blocking на realistic large datasets.

Поскольку core engine не зависит от React/DOM, его можно перенести:

```text
feature/lib
   ↓
worker adapter
```

без изменения domain API.

Potential future boundary:

```text
UI
 ↓
comparison service interface
 ├── main-thread implementation
 └── worker implementation
```

Не создавать этот abstraction до появления реальной необходимости.

---

# 23. Result rendering

Главная performance опасность может быть не comparison, а DOM.

Не рендерить 100k строк как сложные React row-components с wrappers.

Preferred progression:

### Phase 1

Простой text-oriented result viewer.

### If needed

- chunking;
- virtualization;
- deferred rendering.

Copy/Download всегда используют full in-memory result, независимо от того, сколько строк физически находится в DOM.

---

# 24. Download architecture

Download выполняется client-side:

```text
result strings
    ↓
formatResult()
    ↓
Blob
    ↓
Object URL
    ↓
browser download
```

После trigger:

```text
URL.revokeObjectURL(...)
```

Данные не отправляются на сервер.

---

# 25. Clipboard architecture

Copy использует browser Clipboard API там, где доступно.

Fallback policy должна быть простой:

- показать локальную ошибку;
- пользователь может выделить result вручную.

Не добавлять hidden server copy endpoint.

---

# 26. User data privacy boundary

Raw list data запрещено передавать в:

- analytics;
- logs;
- error trackers;
- URL;
- query parameters;
- hash;
- localStorage;
- sessionStorage;
- cookies;
- server actions;
- network requests.

В MVP list state живёт только в memory текущей вкладки.

Reload = data disappears.

Это сознательное privacy решение.

---

# 27. URL privacy

Нельзя делать shareable state вроде:

```text
/?listA=...
#listB=...
```

Пользовательские значения могут попасть в:

- browser history;
- copied URLs;
- analytics;
- referrer;
- screenshots;
- support logs.

Options также не обязаны синхронизироваться с URL в MVP.

---

# 28. Browser storage

В MVP не сохранять list content.

Допустимо позднее сохранять только несекретные UI preferences, например:

```text
ignoreCase
trimWhitespace
```

но это не нужно для первой версии.

No storage is the default.

---

# 29. Analytics boundary

Product code не должен напрямую вызывать конкретный SDK по всему приложению.

Используется маленький adapter:

```ts
track('comparison_completed', {
  rowsABucket: '101-1000',
  rowsBBucket: '1-100',
})
```

Не:

```ts
gtag(...)
```

в десятках компонентов.

Recommended API:

```ts
export interface Analytics {
  track(
    event: AnalyticsEvent,
    payload?: SafeAnalyticsPayload
  ): void
}
```

---

# 30. Analytics privacy

Даже aggregate metrics должны быть консервативными.

Предпочтительнее buckets:

```text
0
1–10
11–100
101–1k
1k–10k
10k+
```

чем exact row counts, если exact precision не нужна.

Никогда:

```text
raw line
email
URL
result string
first item
full input length content
```

Event schema должен быть типизирован.

---

# 31. Analytics events

MVP:

```text
tool_used
comparison_completed
option_changed
result_tab_changed
copy_result
download_result
example_loaded
```

Не отправлять `comparison_completed` на каждый keystroke.

Нужна дедупликация/throttling event logic, чтобы live comparison не генерировал event spam.

---

# 32. Ad architecture

Ads выключены в первоначальном release.

Но UI использует provider-agnostic boundary:

```tsx
<AdSlot placement="after-tool" />
```

В disabled state `AdSlot` не должен создавать пустой layout gap.

Architecture:

```text
AdSlot
  ↓
AdProvider interface
  ├── Noop
  ├── YAN adapter          future
  └── Other network       future
```

---

# 33. Third-party ad scripts

Provider scripts:

- загружаются только если provider включён;
- не входят в initial MVP bundle;
- не имеют доступа к list state;
- подключаются централизованно.

Не размещать provider SDK calls внутри compare feature.

---

# 34. i18n architecture

English — единственная locale в MVP.

Но UI copy не должен быть хаотично захардкожен в десятках компонентов.

Recommended:

```ts
export type CompareMessages = {
  listA: string
  listB: string
  pastePlaceholder: string
  trimWhitespace: string
  ignoreEmptyLines: string
  ignoreCase: string
  removeDuplicates: string
  differences: string
  onlyA: string
  onlyB: string
  matches: string
  all: string
  copy: string
  copied: string
  download: string
}
```

English dictionary:

```text
src/content/en.ts
```

Server page передаёт нужный dictionary в client feature.

---

# 35. Why no i18n library in MVP

С одной locale external i18n framework пока не нужен.

Мы заранее обеспечиваем:

- typed messages;
- route-compatible content structure;
- отсутствие product copy внутри domain engine.

Когда появляется `/es/comparar-listas`, можно оценить, нужен ли отдельный i18n package.

Не подключать библиотеку только ради будущей возможности.

---

# 36. Spanish route future shape

Potential:

```text
src/app/es/comparar-listas/page.tsx
src/content/es.ts
```

Обе pages используют:

```text
features/compare-lists
```

с разными message/content dictionaries.

Domain engine не знает о locale.

---

# 37. Instagram feature future shape

Future:

```text
features/
├── compare-lists/
└── instagram-followers/
```

Instagram feature отвечает за:

```text
file selection
    ↓
Instagram export parsing
    ↓
extract follower/following identifiers
    ↓
shared comparison domain logic
    ↓
Instagram-specific result labels
```

Не засовывать Instagram parser внутрь generic `compare-lists/lib`.

Если comparison primitives действительно становятся cross-feature, тогда их можно вынести в более общий domain module.

Только после второго реального consumer.

---

# 38. Shared extraction rule

Не выносить функцию в `shared`, потому что:

> «вдруг когда-нибудь понадобится».

Правило:

```text
first use  → keep local
second real use with same semantics → consider extraction
```

Это относится к:

- buttons;
- formatting;
- parsers;
- comparison logic;
- hooks.

---

# 39. UI primitives

По умолчанию использовать semantic native HTML:

```text
textarea
button
input[type=checkbox]
```

Headless primitive допускается только когда он реально снимает сложную accessibility/interaction проблему.

Tabs должны иметь корректную keyboard/ARIA semantics.

Не подключать визуальный UI kit.

---

# 40. Styling architecture

## Global

```text
tokens.css
globals.css
```

Содержат:

- design tokens;
- reset/base rules;
- body typography;
- global focus conventions.

## Feature

CSS Modules рядом с UI:

```text
compare-tool.module.css
```

Не использовать inline style для постоянного visual system.

Не создавать огромный global stylesheet с feature-specific selectors.

---

# 41. Design token ownership

`DESIGN.md` — source of truth для visual decisions.

CSS tokens отражают его:

```css
:root {
  --color-canvas: #f7f7f5;
  --color-surface: #fff;
  --color-text: #171817;
  --color-accent: #0f766e;

  --space-1: 4px;
  --space-2: 8px;
  ...
}
```

Компоненты используют tokens, а не собственные произвольные palette/spacing values.

---

# 42. Metadata architecture

Page metadata остаётся на server/static стороне.

Use case:

```text
app/page.tsx
```

содержит metadata для English homepage.

Будущая Spanish page имеет собственные локализованные metadata.

Не вычислять SEO title из client state.

---

# 43. Robots and sitemap

Использовать framework metadata routes:

```text
app/robots.ts
app/sitemap.ts
```

Production origin задаётся централизованно через config.

Не копировать hostname вручную по десяткам файлов.

---

# 44. Site config

Recommended:

```ts
export const siteConfig = {
  name: 'Compare Lists',
  url: process.env.NEXT_PUBLIC_SITE_URL,
  defaultLocale: 'en',
} as const
```

Production build должен fail/warn в CI, если critical public URL config отсутствует.

Canonical/sitemap/OG используют один source of truth.

---

# 45. Environment variables

MVP должен иметь минимальное количество env.

Potential:

```text
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_ANALYTICS_ENABLED
NEXT_PUBLIC_ADS_ENABLED
```

Provider-specific keys добавляются только при реальном подключении provider.

Не хранить secrets в `NEXT_PUBLIC_*`.

---

# 46. Error boundaries

Core comparison pure functions не должны использовать exceptions для normal user input.

Normal states:

```text
empty list
no matches
no differences
duplicates
large input
```

не являются errors.

React error boundary нужен только для unexpected application failures, если framework structure это оправдывает.

---

# 47. Security

Основные правила:

- никогда не использовать `dangerouslySetInnerHTML` для user list values;
- user strings рендерятся как text;
- no eval;
- no dynamic code generation;
- no server upload;
- no user content in URLs;
- third-party scripts centralized;
- dependencies minimized.

File import не входит в MVP, поэтому file parsing attack surface пока отсутствует.

---

# 48. Content Security Policy

CSP полезна, но implementation зависит от deployment/third-party scripts.

Не блокировать launch попыткой заранее построить сложную nonce-based CSP при отсутствии server need.

До подключения ads/analytics можно использовать очень строгую и простую policy, если deployment target позволяет установить headers.

Финальная CSP фиксируется в launch/security pass после выбора hosting mode.

---

# 49. Testing strategy

Тесты делятся по ответственности.

## 49.1 Domain unit tests — highest priority

Comparison engine покрывается полностью.

Cases:

```text
empty/empty
A only
B only
exact match
partial match
trim
ignore empty
ignore case
duplicates on
duplicates off / multiset
ordering
CRLF
Unicode strings
long strings
```

## 49.2 Component interaction tests

Проверить:

- paste into both lists;
- live result;
- toggle option;
- swap;
- clear;
- tab change;
- copy feedback;
- empty state.

## 49.3 E2E smoke

Минимальный production-like flow:

```text
open /
paste A
paste B
see differences
copy/download available
```

Не строить огромный E2E suite для чистых domain cases — они дешевле и точнее проверяются unit tests.

---

# 50. Property/invariant tests

Для engine полезны invariants.

Например при dedupe ON:

```text
intersection(A, B) == intersection(B, A) by keys
union(A, B) contains every unique key from both
onlyA and onlyB do not overlap intersection
differences = onlyA + onlyB
```

При duplicates OFF:

```text
matchedCount(key) <= countA(key)
matchedCount(key) <= countB(key)
```

Это помогает ловить edge cases лучше набора только handcrafted examples.

---

# 51. TypeScript rules

Required:

```text
strict: true
```

Avoid:

- `any`;
- unsafe casts;
- broad `Record<string, any>`;
- enums без необходимости;
- non-null assertions как способ скрыть проблему.

Use:

- discriminated unions where useful;
- readonly data where practical;
- `satisfies` for config/dictionaries;
- explicit public return types для core domain API, если это повышает читаемость.

---

# 52. Lint / formatting

CI должен проверять:

```text
lint
typecheck
tests
build
```

Formatting tool может использоваться автоматически.

Не смешивать architectural refactor с massive formatting changes в одном PR.

---

# 53. Package management

Выбирается один package manager и commit lockfile.

Не смешивать:

```text
package-lock.json
pnpm-lock.yaml
yarn.lock
```

в одном repository.

Точный package manager не является архитектурной зависимостью продукта.

---

# 54. Dependency policy

Каждая runtime dependency должна отвечать на вопрос:

> Какую реальную проблему она решает, которую разумно не решать небольшим локальным кодом?

Не подключать:

- lodash ради пары операций;
- date library без дат;
- form library без форм;
- state manager;
- request library;
- icon pack;
- animation library;
- visual component framework.

Минимальная dependency surface — часть security/performance strategy.

---

# 55. Build boundary

Build должен успешно завершаться при:

- no backend;
- no database;
- no external runtime API.

Production homepage не должна зависеть от availability стороннего API.

Analytics/ads failure не должен ломать tool.

---

# 56. Progressive enhancement

SEO/editorial content отображается без JS.

Compare Tool требует JS для interaction — это нормально.

Если client JS не загрузился:

- page остаётся readable;
- privacy/about content доступен;
- tool не должен показывать ложный working state.

Можно показать minimal `<noscript>` message:

```text
JavaScript is required to compare lists in your browser.
```

---

# 57. Observability

MVP observability должна быть минимальной и privacy-safe.

Нужны:

- build/deploy failures;
- client application errors — только если выбран error tracker с безопасной scrub configuration;
- product analytics;
- Search Console отдельно.

Нельзя автоматически прикладывать:

- textarea state;
- DOM snapshots containing user lists;
- breadcrumbs with pasted content

к error reports.

Если error tracker нельзя надёжно настроить без утечки data, лучше стартовать без него.

---

# 58. Performance budget

Initial goals:

```text
no external font
no image-heavy hero
small client boundary
no ads at launch
no analytics SDK unless needed
no unnecessary component library
```

Performance review перед release должен измерять реальные bundle/runtime данные.

Не фиксировать выдуманный numeric bundle limit без build measurement.

Но любое неожиданное крупное dependency увеличение требует review.

---

# 59. Accessibility ownership

Accessibility не является только задачей CSS.

UI architecture должна:

- использовать semantic elements;
- иметь настоящий tablist behavior;
- локально объявлять copy status;
- сохранять native textarea behavior;
- не зависеть от color only.

Accessibility tests входят в component review.

---

# 60. Future feature boundaries

## Spanish

```text
same domain engine
same core UI structure
different page/content/messages
```

## Instagram

```text
new parser + workflow
reuse comparison primitives
```

## CSV

Если появится:

```text
new parser/input feature
```

а не изменение базового newline parser «до универсальности».

## Ads

```text
shared adapter
no imports inside feature domain
```

---

# 61. What we intentionally do not build

Architecture must not include placeholders for:

```text
auth
users
teams
database
billing
API
admin panel
CMS
background jobs
queues
microservices
websocket
SSR user state
feature flags platform
plugin system
generic tool registry
```

Если гипотеза вырастет, architecture меняется на основании новых требований.

---

# 62. Implementation order

Recommended coding sequence:

```text
1. project skeleton
2. design tokens / global styles
3. pure comparison types
4. parser + normalization
5. comparison engine
6. domain tests
7. CompareTool state
8. inputs + options
9. results + tabs
10. copy/download
11. responsive UX
12. editorial/SEO shell
13. metadata / robots / sitemap
14. analytics adapter (Noop first)
15. accessibility pass
16. performance measurements
17. E2E smoke
18. production build
```

Core algorithm should be proven before polishing UI.

---

# 63. Pull request boundaries

Чтобы агент не сделал огромный unreviewable PR, implementation желательно разбить.

Potential sequence:

```text
PR 1 — project foundation + tokens
PR 2 — comparison engine + tests
PR 3 — input/options interaction
PR 4 — result UX + copy/download
PR 5 — page shell + SEO content
PR 6 — responsive/accessibility/performance polish
PR 7 — analytics + launch plumbing
```

Точное количество PR можно уменьшить, если scope остаётся небольшим.

Главное — не смешивать весь project scaffold, architecture refactor, design и analytics в одном diff.

---

# 64. Agent rules

Coding agent должен считать эти документы source of truth:

```text
PRODUCT.md
UX.md
DESIGN.md
SEO.md
ARCHITECTURE.md
```

При конфликте:

```text
product semantics  → PRODUCT.md
interaction        → UX.md
visual styling     → DESIGN.md
search/indexing    → SEO.md
code boundaries    → ARCHITECTURE.md
```

Агент не должен:

- добавлять product features «для удобства»;
- подключать library без rationale;
- изменять approved UX;
- добавлять visual embellishment;
- создавать backend;
- сохранять user data;
- добавлять analytics fields с raw content;
- создавать extra SEO pages.

---

# 65. Architecture acceptance criteria

## Rendering

- [ ] Homepage meaningful content exists in initial HTML.
- [ ] Only interactive feature requires client JS.
- [ ] No unnecessary page-wide client boundary.

## Domain

- [ ] Comparison engine imports no React/Next/browser APIs.
- [ ] Raw value and normalized key are separate.
- [ ] Duplicate semantics are explicitly tested.
- [ ] Result ordering is deterministic.

## Privacy

- [ ] No raw user list network requests.
- [ ] No raw user list analytics.
- [ ] No user list storage.
- [ ] No user content in URL.
- [ ] Download is client-side.

## Dependencies

- [ ] No global state manager.
- [ ] No server-state library.
- [ ] No backend/database dependencies.
- [ ] No visual UI kit.
- [ ] Runtime dependencies are justified.

## Performance

- [ ] 1k / 10k / 100k inputs profiled.
- [ ] Algorithm and DOM cost measured separately.
- [ ] Worker/virtualization added only if measurement justifies them.

## Extensibility

- [ ] UI messages can be localized.
- [ ] Spanish can reuse the feature.
- [ ] Instagram can reuse domain primitives without generic feature pollution.
- [ ] Ads/analytics are adapter-isolated.

## Quality

- [ ] Strict TypeScript.
- [ ] Domain unit tests.
- [ ] Interaction tests.
- [ ] E2E smoke.
- [ ] lint/typecheck/test/build in CI.

---

# 66. Final architecture

```text
                     ┌─────────────────────────┐
                     │      Next.js App        │
                     │   static/server shell   │
                     └────────────┬────────────┘
                                  │
                 ┌────────────────┼────────────────┐
                 │                │                │
                 ↓                ↓                ↓
             Metadata        Editorial HTML     CompareTool
                                                   │
                                            Client boundary
                                                   │
                      ┌────────────────────────────┼──────────────┐
                      │                            │              │
                      ↓                            ↓              ↓
                    Inputs                      Options        Results
                      │                            │              ↑
                      └──────────────┬─────────────┘              │
                                     ↓                            │
                           Pure TypeScript engine ────────────────┘
                                     │
                      ┌──────────────┼──────────────┐
                      ↓              ↓              ↓
                    parse         normalize       compare
                                                    │
                                                    ↓
                                               format/copy
                                               client download

Outside domain:

Analytics adapter ── sanitized events only
Ad provider ──────── disabled in MVP
Locale content ───── typed UI/editorial messages

No database
No compare API
No user-data storage
```

---

# 67. Decisions fixed by this document

С этого момента считаются принятыми:

- Next.js App Router;
- React + strict TypeScript;
- static-first rendering;
- small client boundary around Compare Tool;
- no backend/database;
- pure domain comparison engine;
- feature-first project structure;
- CSS Modules + design tokens;
- no global state manager;
- no server-state library;
- no visual UI kit;
- no list persistence;
- no raw list analytics;
- provider-agnostic analytics/ads boundaries;
- typed localization-ready copy;
- dedupe OFF = multiset semantics;
- input ordering preserved;
- no Web Worker until profiling justifies it;
- no premature shared abstractions.

Any change to these decisions should have a concrete requirement or measurement behind it.
