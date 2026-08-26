# DESIGN.md — Compare Lists

## 1. Purpose

Этот документ фиксирует визуальный язык первой версии Compare Lists.

Он используется вместе с:

- `PRODUCT.md` — что строим;
- `UX.md` — как пользователь взаимодействует с продуктом;
- `DESIGN.md` — как интерфейс должен выглядеть и ощущаться.

Цель — получить **neutral precision utility**, а не generic SaaS landing page и не «AI-generated modern UI».

Визуальный характер продукта:

> спокойный, быстрый, точный, немного технический, но понятный обычному пользователю.

---

# 2. Core visual principles

## 2.1 Tool first

Главный визуальный объект страницы — сам инструмент.

Не создавать отдельный hero, который визуально важнее inputs.

Правильная иерархия:

```text
Page title
Short explanation
Privacy note

Tool workspace
  ↓
Inputs
Options
Summary
Results

Editorial content
```

Неправильная:

```text
Huge hero
Marketing copy
CTA
Feature cards
Testimonials
Tool somewhere below
```

---

## 2.2 Precision over decoration

Характер создаётся через:

- типографическую иерархию;
- плотность;
- правильные borders;
- выравнивание;
- rhythm;
- whitespace;
- состояния controls.

Не через:

- gradients;
- shadows;
- decorative backgrounds;
- 3D;
- glow;
- illustrations.

---

## 2.3 One visual language

На странице не должно быть разных «дизайн-языков» для:

- tool;
- content;
- header;
- future ads.

Везде используются одни и те же:

- tokens;
- radii;
- border colors;
- text colors;
- spacing rules.

---

## 2.4 Calm by default

Интерфейс должен выглядеть надёжным ещё до взаимодействия.

Не использовать визуальные приёмы, которые создают ощущение:

- промо-лендинга;
- крипто-продукта;
- AI-стартапа;
- gamified app;
- aggressive conversion funnel.

---

# 3. Explicit anti-AI-slop contract

Агенту запрещено без отдельного согласования использовать:

- gradients;
- glassmorphism;
- backdrop blur;
- glowing borders;
- decorative blobs;
- oversized hero;
- giant headline 56–80px;
- excessive rounded cards;
- `border-radius: 16px+` для обычных controls;
- pill UI везде;
- card around every section;
- shadows как основной способ группировки;
- floating cards;
- fake dashboards;
- metric cards;
- decorative badges;
- `Fast`, `Secure`, `Free`, `No signup` badges;
- random icons рядом с каждым label;
- gradient text;
- animated backgrounds;
- parallax;
- gratuitous scale-on-hover;
- fake testimonials;
- fake partner logos;
- generic three-column feature grids;
- illustration of documents/lists;
- stock imagery;
- multiple accent colors;
- neon color combinations;
- excessive empty marketing whitespace;
- unnecessary sticky UI;
- translucent surfaces;
- color-coded result categories without text labels.

Особенно:

> **Do not wrap an element in a card unless the border/background communicates a real interaction or grouping boundary.**

---

# 4. Visual reference direction

Не копировать конкретный продукт.

Ориентир по ощущению:

```text
browser utility
+
data tool
+
editorial clarity
```

Интерфейс должен казаться ближе к:

- хорошо спроектированному системному инструменту;
- аккуратному data utility;
- простому developer-facing tool;

чем к SaaS landing page.

---

# 5. Color system

## 5.1 Theme

MVP использует только light theme.

Dark mode не входит в первую версию.

## 5.2 Base palette

```text
--color-canvas:          #F7F7F5
--color-surface:         #FFFFFF
--color-surface-muted:   #F1F2EF

--color-text:            #171817
--color-text-secondary:  #5F645F
--color-text-tertiary:   #818681

--color-border:          #D8DAD5
--color-border-strong:   #B8BBB4

--color-accent:          #0F766E
--color-accent-hover:    #0B645D
--color-accent-soft:     #E7F3F1

--color-danger:          #B42318
--color-danger-soft:     #FBEAE8
```

## 5.3 Accent usage

Accent используется только для:

- focus;
- active tab;
- selected control;
- interactive text hover;
- небольших functional indicators.

Не окрашивать большие поверхности accent-цветом.

Не использовать accent как декоративный background.

## 5.4 Result colors

`Only A`, `Only B`, `Matches` не получают самостоятельные яркие цвета.

Различение строится через:

- label;
- heading;
- layout;
- border;
- typography.

Допускается очень лёгкий neutral tint, если он помогает структуре, но он не должен быть единственным различием.

---

# 6. Typography

## 6.1 Font strategy

Не подключать внешний webfont в MVP.

Использовать системный stack.

### UI / editorial

```css
font-family:
  ui-sans-serif,
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;
```

### Data / result viewer

```css
font-family:
  ui-monospace,
  SFMono-Regular,
  Menlo,
  Monaco,
  Consolas,
  "Liberation Mono",
  monospace;
```

Причины:

- zero font download;
- fast rendering;
- good international coverage;
- меньше layout shift;
- utilitarian visual character.

## 6.2 Type scale

### Desktop

```text
Page H1
32px / 40px
weight 650–700

Section H2
22px / 30px
weight 650

Section H3
17px / 24px
weight 600

Body
16px / 24px
weight 400

Secondary body
14px / 21px
weight 400

UI label
12px / 16px
weight 650
letter-spacing: 0.05em
uppercase only where useful

Control
14px / 20px
weight 550

Summary number
28px / 32px
weight 650

Result data
14px / 22px
weight 400
monospace
```

### Mobile

```text
H1
28px / 34px

H2
21px / 28px

Body
16px / 24px

UI label
12px / 16px

Result data
14px / 21px
```

## 6.3 Typography rules

Не использовать:

- ultra-bold 800/900 everywhere;
- all-caps for paragraphs;
- centered long-form text;
- monospace for the whole page;
- giant marketing type.

Uppercase допускается только для компактных utility labels:

```text
LIST A
ONLY IN A
MATCHES
```

---

# 7. Layout

## 7.1 Main container

```text
max-width: 1120px
```

Desktop horizontal padding:

```text
24px
```

Large screens:

```text
32px
```

Mobile:

```text
16px
```

## 7.2 Editorial width

Контент после инструмента не должен растягиваться на 1120px.

Recommended:

```text
max-width: 720px
```

Это создаёт отличие:

```text
wide workspace
narrow readable content
```

без дополнительных карточек.

## 7.3 Vertical rhythm

Основные интервалы:

```text
4px
8px
12px
16px
24px
32px
48px
64px
```

Не использовать случайные значения вроде:

```text
13px
19px
27px
```

без причины.

---

# 8. Spacing tokens

```text
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 24px
--space-6: 32px
--space-7: 48px
--space-8: 64px
```

Основные правила:

- label → control: `8px`;
- связанные controls: `8–12px`;
- subgroup → subgroup: `16px`;
- major workspace section: `24–32px`;
- editorial section: `48px`.

---

# 9. Borders

Borders — основной способ показать структуру.

## 9.1 Default

```text
1px solid var(--color-border)
```

## 9.2 Strong boundary

```text
1px solid var(--color-border-strong)
```

Использовать только когда обычного border недостаточно.

## 9.3 No decorative double borders

Не использовать:

- nested cards with borders;
- multiple borders around one input;
- decorative outlines.

---

# 10. Radius system

Интерфейс должен ощущаться инструментальным, а не bubble-like.

```text
--radius-sm: 4px
--radius-md: 6px
--radius-lg: 8px
```

Usage:

```text
checkbox / small control: 4px
button:                   5–6px
textarea:                 6px
result viewer:            6px
large workspace grouping: 8px max
```

Не использовать:

```text
12px
16px
20px
24px
9999px
```

для стандартных элементов.

Pill допускается только если семантика действительно требует capsule shape. В MVP такой необходимости нет.

---

# 11. Shadows

По умолчанию:

```text
box-shadow: none
```

Допустимо использовать shadow только если появляется реальная overlay-поверхность:

- popover;
- tooltip;
- future dropdown.

И даже тогда shadow должен быть минимальным.

Input, result, header, summary не используют shadow.

---

# 12. Focus

Focus должен быть хорошо виден.

Recommended:

```text
outline: 2px solid var(--color-accent)
outline-offset: 2px
```

или эквивалентный доступный ring.

Не удалять native focus без полноценной замены.

---

# 13. Header design

Header:

```text
height: approximately 56–64px
```

Без отдельной цветной панели.

Background:

```text
transparent / canvas
```

Нижняя граница необязательна.

Wordmark:

```text
Compare Lists
```

- text only;
- weight ~650;
- no logo icon in MVP.

Links:

- 14px;
- neutral;
- accent only on interaction.

---

# 14. Page heading

H1 располагается слева.

Не центрировать.

Пример:

```text
Compare two lists

Find differences, matches and unique values instantly.
Private by design — your lists stay in your browser.
```

H1 не должен занимать полэкрана.

Recommended:

```text
max-width: 700px
```

для description.

Privacy line визуально вторична, но заметна.

---

# 15. Workspace composition

Инструмент не должен быть одной гигантской rounded-card.

Recommended:

```text
heading

input grid

options

divider

summary

tabs

result viewer
```

Группировка достигается:

- spacing;
- border separators;
- alignment.

Если вокруг всего tool-area появляется surface, она должна быть почти плоской:

```text
background: surface
border: 1px solid border
radius: 8px
```

Но предпочтительный вариант — **без большой wrapper-card**, если page layout и так достаточно ясно группирует инструмент.

---

# 16. Input fields

## 16.1 Textarea

Desktop:

```text
min-height: 260–300px
```

Mobile:

```text
min-height: 200–240px
```

Style:

```text
background: surface
border: 1px solid border
radius: 6px
padding: 12px 14px
font-size: 14px
line-height: 22px
```

Textarea text использует monospace stack.

## 16.2 Hover

Border может слегка усиливаться.

Не использовать:

- background animation;
- glow;
- scale.

## 16.3 Focus

Accent focus ring.

Border itself may also become accent.

## 16.4 Placeholder

Color:

```text
text-tertiary
```

Placeholder не должен выглядеть как actual input content.

---

# 17. Input header row

Структура:

```text
LIST A                              125 rows
```

или:

```text
LIST A
125 rows
```

в зависимости от ширины.

`LIST A` — micro-label.

Counter — secondary text.

`Clear` располагается в зоне действий поля, но визуально не конкурирует с label.

---

# 18. Buttons

В MVP нет большого primary CTA.

Это принципиально.

## 18.1 Secondary button

Для:

- Copy;
- Download;
- Swap;
- Load example.

Style:

```text
height: 36px desktop
min-height: 44px on coarse/touch pointer

padding-inline: 10–12px

background: surface
border: 1px solid border
radius: 5–6px
text: text
```

Hover:

```text
background: surface-muted
border-color: border-strong
```

## 18.2 Text action

Для `Clear` допустима менее заметная text-button форма.

Не делать danger red, потому что действие легко обратимо через normal editing / paste.

## 18.3 Icon rules

Не подключать icon library только ради 2–3 иконок.

Использовать текстовые labels.

Если нужен swap icon — простой inline SVG допустим.

Кнопки не должны быть icon-only без серьёзной причины.

---

# 19. Checkboxes

Предпочтение:

- native checkbox;
- минимальная стилизация;
- сохранение familiar behavior.

Не делать oversized custom toggles.

Эти настройки — boolean options, а не device settings.

Поэтому checkbox лучше switch.

---

# 20. Options row

Desktop:

```text
☑ Trim whitespace
☑ Ignore empty lines
☐ Ignore case
☑ Remove duplicates
```

В одну или две строки в зависимости от ширины.

Mobile:

- wrapping;
- clear vertical rhythm;
- no four separate cards.

Labels:

```text
14px / 20px
```

---

# 21. Divider

Divider используется редко.

Recommended:

```text
1px solid border
```

Основной separator:

```text
inputs/options
────────────
results
```

Не разделять линией каждую маленькую группу.

---

# 22. Summary design

Summary — **strip**, не набор cards.

Desktop:

```text
ONLY IN A            IN BOTH             ONLY IN B
24                   96                  40
```

Возможная структура:

```text
display: grid
grid-template-columns: repeat(3, 1fr)
```

Каждая metric group не получает отдельный background.

Допускаются vertical dividers между группами на desktop.

На mobile:

```text
24 Only in A
96 Matches
40 Only in B
```

или компактная 3-column grid, если помещается без тесноты.

---

# 23. Tabs

Tabs — underline / border style.

Не pill tabs.

Default:

```text
Differences   Only A   Only B   Matches   All
───────────
```

Inactive:

- text-secondary;
- transparent bottom border.

Active:

- text;
- 2px accent bottom border.

Hover:

- text.

Tabs не должны выглядеть как segmented control с пятью rounded capsules.

---

# 24. Result viewer

Result viewer — functional reading surface.

```text
background: surface
border: 1px solid border
radius: 6px
```

Toolbar:

```text
Differences · 64 items                 Copy  Download
```

Toolbar отделяется тонким border-bottom.

Content:

```text
font: monospace
14px / 22px
```

Recommended desktop max-height:

```text
420–480px
```

Mobile:

```text
320–420px
```

Точная высота может адаптироваться к viewport.

---

# 25. Result sections

В `Differences`:

```text
ONLY IN LIST A — 24
```

и:

```text
ONLY IN LIST B — 40
```

Section heading:

- UI label styling;
- text-secondary;
- no colored badge.

Между секциями:

```text
24px
```

---

# 26. Row rendering

Строки результата не получают:

- background;
- card;
- border each;
- zebra striping по умолчанию.

Это обычный data text stream.

При необходимости readability можно поддержать line-height и text selection.

---

# 27. Empty states

Empty state должен быть тихим.

Не использовать:

- illustration;
- giant icon;
- colorful placeholder card.

Пример:

```text
Results

Paste two lists above to see their differences and matches.
```

Title:

```text
16–17px / 24px, weight 600
```

Description:

```text
14px / 21px, text-secondary
```

---

# 28. Copy success

Кнопка:

```text
Copy
```

временно становится:

```text
✓ Copied
```

Не показывать toast.

Success state не требует green surface.

Accent или neutral confirmation достаточно.

---

# 29. Errors

Errors должны быть локальными.

Пример clipboard failure:

```text
Couldn’t copy. Select the result manually.
```

Использовать danger color только для реальной ошибки.

Не использовать red для:

- differences;
- empty result;
- cleared list.

---

# 30. Privacy message

Recommended visual treatment:

```text
Private by design — your lists are processed locally in your browser.
```

Style:

- 14px;
- text-secondary;
- можно использовать небольшой neutral lock icon только если он не создаёт marketing-badge look;
- без отдельной colored card.

Предпочтительно вообще без иконки.

---

# 31. Editorial content

После tool:

```text
How to compare two lists
What each result means
Common use cases
How your data is processed
FAQ
```

Typography:

- narrow column;
- generous section spacing;
- no cards around each section.

Links use accent color.

FAQ может быть обычным sequence of headings + paragraphs.

Не обязательно accordion.

---

# 32. Responsive rules

## 32.1 Desktop

Target:

```text
>= ~760px
```

Два input side-by-side, если каждый остаётся достаточно широким.

## 32.2 Mobile / narrow

При нехватке пространства:

```text
input grid → one column
```

Не сохранять 2-column layout ради формального desktop pattern.

## 32.3 Touch

На coarse pointer:

```text
interactive target min-height: 44px
```

Даже если desktop version визуально компактнее.

---

# 33. Motion

Motion почти отсутствует.

Разрешено:

```text
100–150ms
```

для:

- color;
- border-color;
- background-color.

Не использовать:

- spring animations;
- scaling;
- bouncing;
- sliding sections;
- animated counters.

Result update должен ощущаться мгновенно, а не «анимированно».

---

# 34. Loading / processing

Обычный comparison не показывает loader.

Для реально большого input:

```text
Comparing…
```

маленькая inline status string.

Не использовать:

- spinner overlay;
- skeleton;
- progress bar без реального progress.

---

# 35. Content density

Рабочая часть страницы должна быть плотнее editorial content.

Принцип:

```text
workspace → compact
content   → relaxed
```

Это помогает продукту ощущаться как tool, не как landing template.

---

# 36. Component strategy

Не использовать готовый визуальный UI-kit как источник дизайна.

Preferred:

```text
native HTML
+
headless primitives only when needed
+
project CSS tokens
```

В MVP:

- `textarea` — native;
- `button` — native semantic element, styled locally;
- `checkbox` — native;
- tabs — semantic custom/headless primitive;
- tooltip — только если реально нужен.

Если используется Base UI или другой headless primitive, он отвечает за behavior/accessibility, а не за внешний вид.

---

# 37. CSS architecture rules for the agent

Агент должен:

- использовать design tokens;
- избегать arbitrary colors;
- избегать arbitrary radius;
- избегать arbitrary spacing, если есть существующий token;
- не добавлять новую visual abstraction без необходимости;
- не создавать `Card` component как универсальную обёртку;
- не создавать `Badge` component без конкретного product use case;
- не создавать `Button` variants в количестве 8–10;
- не подключать component library ради одного control;
- не подключать icon library ради одной иконки.

---

# 38. Minimal component inventory

Вероятный visual component set:

```text
PageHeader
ToolIntro
ListInput
InputMeta
SwapAction
ComparisonOptions
SummaryStrip
ResultTabs
ResultViewer
ResultToolbar
InlineFeedback
EditorialSection
Footer
```

Это не означает обязательное разбиение реализации на компоненты 1:1.

Архитектурное решение принимается отдельно.

---

# 39. Footer

Минимальный.

Например:

```text
Compare Lists · Privacy · About
```

После Spanish может появиться language link.

Не создавать multi-column corporate footer.

---

# 40. Future advertising visual constraints

Когда появится реклама:

- ad slot визуально отделяется от product UI;
- ad никогда не выглядит как tool control;
- не использовать sticky overlay ads;
- не перекрывать input/results;
- не вызывать layout shift;
- label `Advertisement` / provider-required disclosure должен быть визуально понятным;
- ad width согласуется с layout, но не наследует styling result/input containers.

---

# 41. Visual QA checklist

Перед merge UI считается непрошедшим review, если обнаружено:

- [ ] gradient;
- [ ] huge hero;
- [ ] unnecessary card;
- [ ] radius > 8px без документированной причины;
- [ ] shadow на обычном static element;
- [ ] pill tabs;
- [ ] badge ради decoration;
- [ ] icon without functional need;
- [ ] inconsistent spacing outside token scale;
- [ ] second accent color без причины;
- [ ] content centered where left alignment is clearer;
- [ ] marketing block before tool;
- [ ] result rows styled as cards;
- [ ] muted contrast ниже accessibility requirement;
- [ ] missing focus state;
- [ ] desktop layout simply squeezed onto mobile.

---

# 42. Design acceptance criteria

## Identity

- [ ] Interface reads as a utility, not SaaS landing.
- [ ] Tool is visually dominant.
- [ ] Character is calm, precise, slightly technical.
- [ ] No generic AI-generated visual clichés.

## Hierarchy

- [ ] H1 is obvious but not oversized.
- [ ] Inputs dominate first interaction area.
- [ ] Options are secondary to inputs.
- [ ] Summary is readable at a glance.
- [ ] Active result is visually clear.
- [ ] Editorial content is subordinate to tool.

## Consistency

- [ ] Only documented colors are used.
- [ ] Radius uses the defined scale.
- [ ] Spacing uses the defined scale.
- [ ] Buttons share consistent anatomy.
- [ ] Borders are used consistently.
- [ ] No arbitrary styling appears in isolated components.

## Accessibility

- [ ] Text contrast meets WCAG AA target.
- [ ] Focus states are clearly visible.
- [ ] Touch targets are usable.
- [ ] Color is not the sole semantic indicator.

## Performance-minded design

- [ ] No required external font.
- [ ] No decorative image assets required.
- [ ] No animation library required.
- [ ] Visual design works with generated static HTML before the client script runs.

---

# 43. Final design direction

Approved direction:

```text
neutral precision utility

warm neutral canvas
white functional surfaces
dark graphite text
single restrained teal accent

system sans for UI/content
system monospace for data

small radii
1px borders
almost no shadows

left-aligned hierarchy
moderately compact workspace
narrow editorial content

no hero spectacle
no SaaS card grid
no AI-slop decoration
```

The interface should feel intentionally designed because of **discipline and detail**, not because of visual effects.

---

# 44. Next step

После `DESIGN.md` следующий документ — `SEO.md`.

Он должен зафиксировать:

- primary keyword cluster;
- search intent;
- indexable page structure;
- title / description / H1;
- content outline;
- canonical;
- hreflang strategy;
- sitemap;
- robots;
- internal linking;
- rules against doorway/scaled thin pages;
- future Spanish localization;
- future Instagram acquisition page.

---

# Accepted post-launch polish — CL-037

This bounded follow-up keeps the neutral precision utility direction and records
the accepted production observations:

- the main workspace may grow to a maximum width of 1200px while editorial
  content remains capped at 720px;
- the home introduction and header use compact vertical spacing so the tool
  starts earlier;
- inputs, comparison options, summary, tabs and result viewer form one
  restrained functional surface;
- that surface may use one border and one neutral background because it
  communicates a real interaction boundary; nested decorative cards remain
  prohibited;
- desktop textareas target roughly 220–240px minimum height and remain
  vertically resizable;
- a small primary navigation or return action may use the accent color, but
  large accent surfaces remain prohibited;
- the visible product wordmark is ListContrast. Descriptive Compare Lists
  wording remains in page headings and SEO copy.
