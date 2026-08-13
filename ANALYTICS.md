# ANALYTICS.md — Compare Lists

## 1. Purpose

Этот документ фиксирует аналитическую модель первой production-версии Compare Lists.

Главная задача analytics здесь — не «собрать всё, что можно», а ответить на несколько конкретных вопросов:

1. Google вообще начинает показывать страницу?
2. По каким запросам и в каких странах?
3. Люди, пришедшие на страницу, реально используют инструмент?
4. Доходят ли они до полезного результата?
5. Какие функции результата востребованы?
6. Есть ли основания развивать продукт дальше?

Analytics не должна нарушать главное privacy-свойство продукта:

> содержимое пользовательских списков никогда не отправляется в аналитику.

---

# 2. Sources of truth

В проекте есть два разных класса аналитики.

## 2.1 Search acquisition analytics

Главный источник:

```text
Google Search Console
```

Он отвечает на вопросы:

- impressions;
- clicks;
- queries;
- average position;
- CTR;
- pages;
- countries;
- devices;
- indexing.

Это главный источник истины для SEO-гипотезы.

---

## 2.2 Product analytics

Product analytics отвечает на вопросы:

- открыл ли пользователь инструмент;
- начал ли сравнение;
- получил ли результат;
- переключал ли options;
- копировал ли результат;
- скачивал ли результат;
- какой result tab использовал.

Product analytics **не заменяет Search Console**.

---

# 3. Primary experiment model

Первая версия продукта проверяет acquisition hypothesis:

```text
Google impression
      ↓
click
      ↓
landing
      ↓
tool usage
      ↓
useful result
      ↓
copy/download
```

Нам важно различать:

```text
SEO problem
```

от:

```text
product UX problem
```

Пример:

```text
мало impressions
→ acquisition / SEO issue
```

```text
много clicks
но почти никто не использует tool
→ landing / intent / UX issue
```

```text
tool используют
но почти никто не копирует/скачивает
→ возможно результат непонятен или value слабый
```

---

# 4. Analytics principles

## 4.1 Collect minimum necessary data

Каждое событие должно отвечать на конкретный продуктовый вопрос.

Если поле не используется для решения — не собирать.

---

## 4.2 Never collect raw list content

Запрещено отправлять:

```text
raw List A
raw List B
result values
first line
last line
email addresses
URLs
IDs
keywords
names
```

Никаких snippets.

---

## 4.3 Prefer coarse buckets

Если нужен размер списков, использовать buckets:

```text
0
1–10
11–100
101–1,000
1,001–10,000
10,001+
```

а не exact values.

Это уменьшает privacy risk и всё равно отвечает на продуктовый вопрос.

---

## 4.4 No analytics on every keystroke

Live comparison может пересчитываться десятки раз за несколько секунд.

Это не должно генерировать десятки analytics events.

Comparison calculation и analytics event — разные вещи.

---

## 4.5 Analytics must not affect tool behavior

Если analytics provider:

- заблокирован;
- не загрузился;
- вернул ошибку;

Compare Tool продолжает работать полностью.

Analytics является optional side effect.

---

# 5. Provider abstraction

Feature code не должен напрямую зависеть от конкретного analytics SDK.

Recommended boundary:

```ts
export interface Analytics {
  track(
    event: AnalyticsEvent,
    payload?: AnalyticsPayload
  ): void
}
```

Пример:

```ts
analytics.track('copy_result', {
  resultType: 'differences',
})
```

Не:

```ts
gtag('event', ...)
```

внутри UI components.

---

# 6. Initial analytics provider policy

Архитектура должна поддерживать:

```text
NoopAnalytics
RealAnalyticsProvider
```

В development/test:

```text
NoopAnalytics
```

или debug implementation.

В production provider подключается централизованно.

Конкретный SDK не является частью domain layer.

---

# 7. Search Console metrics

Для SEO-эксперимента отслеживаются:

```text
impressions
clicks
CTR
average position
queries
countries
devices
pages
```

---

# 8. Search Console — primary query groups

Основной head cluster:

```text
compare lists
compare two lists
list comparison
list diff
list comparison tool
compare lists online
```

Важно:

- не оценивать страницу только по одному head keyword;
- сохранять неизвестные long-tail queries;
- смотреть направление изменения позиций;
- смотреть отдельные страны.

---

# 9. Query classification

После появления данных запросы можно классифицировать вручную:

```text
CORE
compare lists
compare two lists
list diff

TASK-SPECIFIC
compare email lists
compare url lists
compare names

FORMAT-SPECIFIC
compare excel columns
compare csv lists

FEATURE-SPECIFIC
remove duplicates compare lists
case insensitive list compare

UNRELATED
queries with wrong intent
```

Эта классификация используется для roadmap, а не для автоматической генерации SEO-pages.

---

# 10. Product event taxonomy

MVP events:

```text
tool_used
comparison_completed
option_changed
result_tab_changed
copy_result
download_result
example_loaded
```

Дополнительные технические события могут быть добавлены позже, но только при наличии вопроса, на который они отвечают.

---

# 11. `tool_used`

## Purpose

Понять, какая доля посетителей реально взаимодействует с utility.

## Trigger

Отправляется **один раз на page visit/session context**, когда пользователь впервые:

- вводит текст;
- вставляет текст;
- загружает example;
- меняет comparison option до ввода данных.

Рекомендуемый более строгий вариант:

> считать `tool_used` только при первом изменении List A или List B.

Так event лучше отражает реальное начало задачи.

## Payload

```ts
{
  inputMethod?: 'typing' | 'paste' | 'example'
}
```

`inputMethod` можно не собирать в первой версии, если это не нужно.

---

# 12. `comparison_completed`

## Purpose

Понять, что пользователь действительно дошёл до валидного сравнения.

## Trigger

Не отправлять после каждого recalculation.

Рекомендуемая семантика:

> event отправляется, когда оба списка непустые и после короткого периода стабильности пользователь получил сравнение.

Например:

```text
both lists non-empty
        ↓
no input changes for ~1–2 seconds
        ↓
comparison_completed
```

После этого event не повторяется на каждое изменение.

Допустимо повторно отправить event только если пользователь существенно изменил dataset после предыдущего stable comparison.

Для MVP проще:

```text
maximum 1 comparison_completed per page visit
```

Этого достаточно для conversion funnel.

## Payload

```ts
{
  sizeA: SizeBucket
  sizeB: SizeBucket
  hasDifferences: boolean
  hasMatches: boolean
}
```

Не отправлять:

```text
exact counts
result text
```

если они не нужны для решения.

---

# 13. Size buckets

Recommended type:

```ts
type SizeBucket =
  | '0'
  | '1-10'
  | '11-100'
  | '101-1000'
  | '1001-10000'
  | '10001+'
```

Bucket считается после basic parsing.

Не использовать bucket как UI element — это только analytics representation.

---

# 14. `option_changed`

## Purpose

Понять, какие normalization controls реально используются.

## Trigger

При явном изменении пользователем.

## Payload

```ts
{
  option:
    | 'trimWhitespace'
    | 'ignoreEmptyLines'
    | 'ignoreCase'
    | 'removeDuplicates'

  enabled: boolean
}
```

Не отправлять initial defaults как user events.

---

# 15. `result_tab_changed`

## Purpose

Понять, какие виды результата нужны после default Differences.

## Trigger

Когда пользователь вручную меняет active tab.

## Payload

```ts
{
  resultType:
    | 'differences'
    | 'onlyA'
    | 'onlyB'
    | 'matches'
    | 'all'
}
```

Не отправлять initial `differences` как tab change.

---

# 16. `copy_result`

## Purpose

Сильный сигнал task completion.

## Trigger

После успешного Clipboard API action.

Не после самого click, если copy завершился ошибкой.

## Payload

```ts
{
  resultType:
    | 'differences'
    | 'onlyA'
    | 'onlyB'
    | 'matches'
    | 'all'
}
```

Можно добавить coarse result-size bucket только если позднее появится конкретный аналитический вопрос.

В MVP не требуется.

---

# 17. `download_result`

## Purpose

Ещё один сильный сигнал task completion.

## Trigger

Когда local download инициирован успешно.

## Payload

```ts
{
  resultType:
    | 'differences'
    | 'onlyA'
    | 'onlyB'
    | 'matches'
    | 'all'
}
```

---

# 18. `example_loaded`

## Purpose

Понять, пользуются ли посетители встроенным example и помогает ли он first-use.

## Trigger

User click on `Load example`.

Payload не требуется.

---

# 19. Events intentionally not tracked

Не собирать в MVP:

```text
every textarea focus
every keypress
scroll depth
mouse movement
hover
selection
time spent inside textarea
full click maps
heatmaps
session replay
```

Особенно **session replay** требует отдельной privacy review, потому что на странице обрабатываются потенциально чувствительные пользовательские данные.

Default policy:

```text
NO SESSION REPLAY
```

---

# 20. Funnel

Основной product funnel:

```text
page_view
   ↓
tool_used
   ↓
comparison_completed
   ↓
copy_result OR download_result
```

`page_view` обычно предоставляет сам analytics provider.

Derived metrics:

```text
Tool start rate
= tool_used / page_view

Comparison completion rate
= comparison_completed / tool_used

Task export rate
= users with copy/download / comparison_completed
```

---

# 21. Important interpretation caveat

Отсутствие `copy_result` или `download_result` **не означает**, что пользователь не получил value.

Он может:

- просто посмотреть differences;
- визуально проверить совпадение;
- вручную выделить данные;
- закрыть страницу после ответа.

Поэтому copy/download — сильный positive signal, но не единственная definition of success.

---

# 22. Core product metrics

Для MVP достаточно пяти:

```text
1. Organic impressions
2. Organic clicks
3. Tool start rate
4. Comparison completion rate
5. Copy/download completion rate
```

Дополнительно:

```text
queries count
countries
position distribution
```

Не создавать dashboard из 40 vanity metrics.

---

# 23. SEO stage metrics

## Discovery stage

Смотреть:

```text
indexed?
impressions > 0?
queries appearing?
```

## Growth stage

Смотреть:

```text
impressions trend
query count trend
position movement
countries
```

## Traffic stage

Смотреть:

```text
clicks
CTR
landing sessions
tool usage
```

---

# 24. Position buckets

Для удобства analysis queries можно группировать:

```text
1–3
4–10
11–20
21–50
51–100
```

Это полезнее, чем смотреть только average position.

Например:

```text
0 queries in top 10
3 queries in 11–20
17 queries in 21–50
```

уже даёт понятную картину продвижения.

---

# 25. Country analysis

Отдельно смотреть:

```text
US
Spain
Mexico
India
Italy
UAE
other
```

не потому что все они требуют localization, а чтобы увидеть реальное распределение English demand.

Spanish localization запускается не автоматически из-за страны, а по заранее установленному roadmap + search evidence.

---

# 26. Device analysis

Смотреть:

```text
desktop
mobile
tablet
```

Если Search Console показывает много mobile impressions/clicks, а product analytics показывает низкий tool start/completion на mobile, это повод отдельно проверить UX.

Не предполагать заранее, что utility используется только desktop-аудиторией.

---

# 27. Event privacy contract

Запрещённые event properties:

```text
listA
listB
rawInput
result
firstItem
lastItem
sampleItem
email
url
id
keyword
clipboardText
downloadContent
```

Запрещено даже временно добавлять их «для дебага» в production.

---

# 28. Error analytics

Если позднее подключается error monitoring:

allowed:

```text
error type
component name
browser info
route
stack trace
```

только после scrubbing review.

Forbidden:

```text
React state dump
textarea values
DOM snapshot
event payload with pasted text
breadcrumbs containing user content
```

Session replay остаётся выключенным.

---

# 29. Development analytics

В local development удобно иметь debug adapter:

```ts
analytics.track(...)
```

может писать:

```text
[event] comparison_completed
{
  sizeA: '11-100',
  sizeB: '11-100'
}
```

Но debug adapter также не должен логировать raw input.

Это позволяет проверить schema без privacy violation.

---

# 30. Testing analytics

Unit/component tests должны проверять:

```text
tool_used fires once
comparison_completed is deduplicated
option_changed sends safe enum values
copy_result only after success
download_result contains result type only
no event receives raw list content
```

---

# 31. Analytics type safety

Event names и payload должны быть связаны типами.

Recommended model:

```ts
type AnalyticsEventMap = {
  tool_used: {
    inputMethod?: 'typing' | 'paste' | 'example'
  }

  comparison_completed: {
    sizeA: SizeBucket
    sizeB: SizeBucket
    hasDifferences: boolean
    hasMatches: boolean
  }

  option_changed: {
    option: CompareOptionName
    enabled: boolean
  }

  result_tab_changed: {
    resultType: ResultType
  }

  copy_result: {
    resultType: ResultType
  }

  download_result: {
    resultType: ResultType
  }

  example_loaded: undefined
}
```

`track` generic должен гарантировать правильный payload для конкретного event.

---

# 32. No analytics coupling to domain engine

Pure comparison functions не вызывают analytics.

Неправильно:

```ts
compareLists() {
  analytics.track(...)
}
```

Правильно:

```text
domain returns result
       ↓
interaction layer decides whether an analytics event is appropriate
```

Analytics — side effect UI/application layer.

---

# 33. Consent / privacy implementation

Какие consent mechanisms нужны, зависит от:

- выбранного analytics provider;
- cookies/storage;
- географии пользователей;
- будущих advertising scripts.

Поэтому нельзя заранее делать fake cookie banner без понимания реальных trackers.

Rule:

> сначала определить фактически используемые technologies, затем реализовать соответствующий consent/privacy flow.

На launch checklist это проходит отдельную legal/privacy verification.

---

# 34. Analytics and ads are separate

Не связывать:

```text
analytics enabled
```

с:

```text
ads enabled
```

Это разные providers и разные privacy implications.

Architecture:

```text
AnalyticsProvider
AdProvider
```

отдельно.

---

# 35. Search Console setup

После production deployment:

```text
1. Create/verify domain property
2. Submit sitemap
3. Inspect homepage
4. Confirm Google-selected canonical
5. Confirm indexability
6. Monitor Coverage / indexing issues
```

Не ждать analytics dashboard, чтобы обнаружить indexing mistake.

---

# 36. Search Console review cadence

В первые недели не нужно смотреть позиции каждый час.

Recommended operational rhythm:

```text
first week:
technical/indexing checks

then:
weekly review
```

Позднее:

```text
weekly / biweekly
```

в зависимости от объёма данных.

Главное — смотреть trend, а не daily noise.

---

# 37. Product analytics review cadence

После появления реального traffic:

```text
weekly
```

достаточно для MVP.

До десятков/сотен реальных sessions выводы по conversion rates могут быть нестабильны.

Не оптимизировать UX на основании 5 посетителей.

---

# 38. 30-day review

Основные вопросы:

```text
Is homepage indexed?
Are non-brand impressions appearing?
Which queries?
Which countries?
Are any users starting the tool?
Any obvious tracking/privacy bugs?
```

На этом этапе revenue не является критерием.

---

# 39. 60-day review

Смотреть:

```text
impression trend
query count
position movement
clicks
tool start rate
comparison completion
top result actions
```

Отдельно:

```text
unexpected long-tail queries
```

могут дать новые product hypotheses.

---

# 40. 90-day review

Decision frame:

## GROW

```text
organic visibility growing
+
real tool usage
+
some first-page / near-first-page queries
+
positive trend
```

## ITERATE

```text
Google understands the page
+
some traffic/use
+
positions weak or conversion weak
```

Нужна точечная работа:

- relevance;
- UX;
- content;
- links;
- performance.

## STOP / CHANGE HYPOTHESIS

```text
technical SEO healthy
+
enough observation time
+
almost no meaningful visibility
+
no positive trend
```

Не масштабировать слабый signal в десятки tools.

---

# 41. Expansion trigger — Spanish

Spanish page не запускается потому, что «она уже запланирована».

Перед запуском проверить:

```text
English MVP technically stable
no critical indexing issue
core tool interaction proven
localization does not block primary iteration
```

После launch Spanish получает отдельный page-level analysis:

```text
/es/comparar-listas
```

Search Console фильтр по page + country + query.

---

# 42. Expansion trigger — Instagram

Instagram page должна иметь отдельные analytics события, потому что workflow другой.

Potential future funnel:

```text
page_view
    ↓
instagram_file_selected
    ↓
instagram_files_parsed
    ↓
instagram_comparison_completed
    ↓
copy/download
```

Но эти events **не добавляются в generic MVP заранее**.

---

# 43. Monetization metrics — future

До подключения рекламы не добавлять ad metrics в product dashboard.

После ads понадобятся отдельно:

```text
ad impressions
fill rate
page RPM
viewability
revenue by country
revenue by provider
```

Они принадлежат monetization layer, а не Compare Tool analytics.

---

# 44. UX vs SEO diagnosis matrix

Пример интерпретации:

| Situation | Likely area |
|---|---|
| No impressions | indexing / relevance / SEO |
| Impressions but no clicks | position / snippet / intent |
| Clicks but low `tool_used` | landing clarity / wrong intent |
| `tool_used` high, completion low | UX / performance / semantics |
| Completion high, copy/download low | may be normal; inspect behavior |
| Strong usage but no SEO growth | acquisition problem, not product problem |

Не делать продуктовый редизайн, если проблема находится в acquisition.

---

# 45. Baseline before changes

Перед крупным изменением:

- title;
- H1;
- page content;
- UX layout;
- result semantics;

фиксировать baseline period.

Не менять одновременно пять SEO/UX variables, если потом важно понять эффект.

Для маленького проекта строгий experimentation platform не нужен, но дисциплина изменений нужна.

---

# 46. A/B testing

A/B framework не входит в MVP.

Причины:

- маленький первоначальный traffic;
- дополнительный JS/complexity;
- сложно получить статистическую мощность;
- SEO-page changes требуют осторожности.

Сначала использовать:

```text
before/after observation
+
Search Console
+
product analytics
```

A/B появится только при достаточном traffic.

---

# 47. Data retention principle

Не хранить analytics data дольше, чем это нужно для trend analysis и выбранного provider policy.

Конкретный retention period фиксируется после выбора provider и privacy/legal review.

Raw list data retention:

```text
0
```

потому что оно вообще не собирается.

---

# 48. Naming conventions

Event names:

```text
snake_case
verb/object oriented
```

Examples:

```text
tool_used
option_changed
copy_result
download_result
```

Не смешивать:

```text
ToolUsed
tool-use
tool_use_event
```

---

# 49. Versioning analytics schema

Если event semantics меняется существенно, нельзя тихо продолжать считать старые и новые данные одинаковыми.

Варианты:

- новый event name;
- version property;
- documented migration date.

Для MVP достаточно вести changelog analytics events в этом документе.

---

# 50. Dashboard structure

Если строится dashboard, он должен быть маленьким.

Recommended sections:

```text
SEO
- impressions
- clicks
- CTR
- query count
- position buckets

Product
- page views
- tool_used
- comparison_completed
- copy/download

Breakdowns
- country
- device
- result type
```

Не добавлять vanity widgets ради заполнения экрана.

---

# 51. Weekly review template

Каждую неделю можно отвечать на 7 вопросов:

```text
1. Изменились ли impressions?
2. Появились ли новые relevant queries?
3. Есть ли движение в position buckets?
4. Откуда приходят clicks?
5. Какая доля посетителей использует tool?
6. Есть ли технические/UX anomalies?
7. Какое одно изменение имеет наибольший смысл сейчас?
```

Последний вопрос важен:

> одна осмысленная итерация лучше пяти одновременных изменений.

---

# 52. Privacy QA checklist

Перед production:

- [ ] raw List A never enters analytics payload;
- [ ] raw List B never enters analytics payload;
- [ ] results never enter analytics payload;
- [ ] no analytics call on every keypress;
- [ ] session replay disabled;
- [ ] DOM capture disabled if provider supports it;
- [ ] error tracking does not capture textarea content;
- [ ] debug logs do not contain list values;
- [ ] URL contains no list data;
- [ ] clipboard content is not logged;
- [ ] downloaded content is not logged.

---

# 53. Analytics acceptance criteria

## Search

- [ ] Search Console property configured after production launch.
- [ ] Sitemap submitted.
- [ ] Homepage indexing monitored.
- [ ] Queries/countries/devices available for review.

## Product

- [ ] `tool_used` implemented.
- [ ] `comparison_completed` deduplicated.
- [ ] `option_changed` safe and typed.
- [ ] `result_tab_changed` safe and typed.
- [ ] `copy_result` fires only on successful copy.
- [ ] `download_result` fires on local download.
- [ ] `example_loaded` implemented if example ships.

## Privacy

- [ ] No raw list content.
- [ ] No raw result content.
- [ ] No session replay.
- [ ] No analytics dependency in comparison domain.
- [ ] Provider failure cannot break tool.

## Quality

- [ ] Events are type-safe.
- [ ] Development adapter exists.
- [ ] Event tests cover deduplication and safe payloads.
- [ ] Event semantics documented.

---

# 54. Current KPI hierarchy

Важно не путать промежуточные и конечные сигналы.

```text
LEVEL 1
Indexation

LEVEL 2
Search impressions

LEVEL 3
Useful rankings / clicks

LEVEL 4
Tool usage

LEVEL 5
Task completion

LEVEL 6
Monetizable traffic
```

На первом этапе:

```text
revenue
```

не является primary KPI.

---

# 55. Final analytics direction

Analytics должна быть минимальной, типизированной и privacy-safe.

Основная модель:

```text
Search Console
     ↓
Can Google distribute the page?

Product analytics
     ↓
Do users actually use the tool?

Copy / Download
     ↓
Strong task-completion signals

Later ads analytics
     ↓
Can traffic be monetized efficiently?
```

Ключевой принцип:

> **Collect behavior, never user list content.**

---

# 56. Next step

После `ANALYTICS.md` остаётся последний pre-development документ:

```text
LAUNCH_PLAN.md
```

Он должен зафиксировать:

- project bootstrap;
- domain/hosting decisions;
- implementation sequence;
- CI;
- testing gates;
- production deployment;
- Search Console setup;
- analytics activation;
- indexing checks;
- first 30/60/90-day operating plan;
- Spanish/Instagram expansion gates;
- monetization gate;
- explicit GO / ITERATE / STOP criteria.
