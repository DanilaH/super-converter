# UX.md — Compare Lists

## 1. Purpose

Этот документ фиксирует UX-модель первой версии Compare Lists.

Цель интерфейса — дать пользователю максимально короткий путь от поискового запроса до полезного результата:

```text
Google
  ↓
Compare Lists
  ↓
Paste List A + List B
  ↓
Instant comparison
  ↓
Copy / Download
  ↓
Leave
```

Продукт проектируется как **neutral precision utility**: универсальный, слегка технический, компактный, но не похожий на IDE или SaaS-dashboard.

Основные принципы:

- tool first;
- minimum interaction cost;
- no mandatory onboarding;
- no account;
- no blocking submit step;
- local processing;
- predictable behavior;
- large datasets are a normal use case;
- mobile is supported, but desktop remains the primary composition target.

---

## 2. Approved UX decisions

Следующие решения считаются утверждёнными и не требуют повторного согласования.

### Product character

**Neutral precision utility.**

Интерфейс должен одинаково естественно восприниматься:

- разработчиком;
- SEO-специалистом;
- маркетологом;
- операционным сотрудником;
- обычным пользователем, который просто сравнивает два набора строк.

Не проектировать продукт как devtool-only и не превращать его в consumer entertainment UI.

### Comparison model

**Live comparison.**

Нет обязательной кнопки `Compare`.

Результат пересчитывается автоматически после изменения входных данных или настроек.

### Results model

**Summary + result tabs.**

Сначала пользователь видит краткую сводку, затем один активный result view.

### Default result

**Differences** — активный результат по умолчанию.

### Density

**Moderately compact.**

Интерфейс должен эффективно использовать экран, но не быть тесным.

### File import

Файловый импорт не входит в первый MVP.

Архитектура интерфейса не должна препятствовать его добавлению позднее.

---

## 3. Primary user intent

Пользователь приходит с уже существующими данными.

Он не хочет:

- изучать продукт;
- создавать workspace;
- выбирать шаблон;
- проходить wizard;
- регистрироваться;
- настраивать проект.

Он хочет получить ответ на один или несколько вопросов:

- что есть только в первом списке;
- что есть только во втором;
- что совпадает;
- какие значения отличаются;
- какие уникальные значения присутствуют вообще.

Поэтому главный UX-критерий:

> Пользователь должен начать решать задачу практически сразу после открытия страницы.

---

## 4. Entry state

### 4.1 Above the fold

Первый экран содержит:

1. компактный header;
2. H1;
3. короткое функциональное описание;
4. privacy statement;
5. оба input;
6. comparison options;
7. начало results area, если viewport позволяет.

Не использовать отдельный маркетинговый hero.

### Recommended structure

```text
┌──────────────────────────────────────────────────────────────┐
│ Compare Lists                                        About   │
│                                                              │
│ Compare two lists and instantly find differences,            │
│ matches and unique items.                                    │
│ Private by design — your lists stay in your browser.         │
│                                                              │
│ LIST A                              LIST B                    │
│ ┌────────────────────────────┐     ┌────────────────────────┐ │
│ │ Paste one item per line…   │     │ Paste one item per     │ │
│ │                            │     │ line…                  │ │
│ │                            │     │                        │ │
│ │                            │     │                        │ │
│ └────────────────────────────┘     └────────────────────────┘ │
│ 0 rows         Clear        ⇄ Swap        Clear       0 rows │
│                                                              │
│ ☑ Trim whitespace    ☑ Ignore empty lines                   │
│ ☐ Ignore case        ☑ Remove duplicates                    │
└──────────────────────────────────────────────────────────────┘
```

---

## 5. Header

Header должен быть компактным и утилитарным.

MVP:

```text
Compare Lists                                      About
```

Допустимо добавить:

- Privacy;
- GitHub — только если проект действительно открыт;
- language switcher — только после появления второй локали.

Не использовать:

- sticky navigation без причины;
- Product / Solutions / Resources;
- pricing;
- sign in;
- CTA-кнопку;
- mega menu.

Header не должен конкурировать с инструментом.

---

## 6. Input area

### 6.1 Layout

Desktop:

```text
List A          List B
[ textarea ]    [ textarea ]
```

Оба input имеют одинаковую ширину и визуальный вес.

Mobile:

```text
List A
[ textarea ]

Swap

List B
[ textarea ]
```

На мобильном не сохранять две узкие колонки.

### 6.2 Input anatomy

Каждый input содержит:

```text
LIST A                                      125 rows

┌────────────────────────────────────────────────────┐
│ alice@example.com                                  │
│ bob@example.com                                    │
│ ...                                                │
└────────────────────────────────────────────────────┘

Clear
```

`List A` / `List B` всегда видимы и не заменяются placeholder.

Placeholder:

> Paste one item per line

### 6.3 Input behavior

Поддерживаются:

- paste;
- manual typing;
- multiline editing;
- select all;
- normal browser undo/redo;
- keyboard shortcuts;
- native text selection.

Не перехватывать привычное поведение textarea без необходимости.

### 6.4 Clear

У каждого input собственное действие `Clear`.

Правила:

- действие локально относится только к своему полю;
- не использовать confirm dialog;
- после очистки результат пересчитывается;
- `Clear` не должен выглядеть как primary action.

Для `Clear all` отдельная кнопка в MVP не обязательна.

### 6.5 Swap

Между input доступно действие:

```text
⇄ Swap
```

Оно меняет местами raw values List A и List B.

После swap:

- настройки остаются прежними;
- активный result tab остаётся прежним;
- результаты пересчитываются автоматически;
- focus не должен случайно теряться в непредсказуемое место.

На mobile иконка может визуально перейти в вертикальную ориентацию, но название `Swap` остаётся доступным для assistive technologies.

### 6.6 Item counter

Счётчик должен отражать количество parsed rows с учётом `Ignore empty lines`.

Если `Remove duplicates` включён, уникальные значения показываются отдельно в summary.

Не пытаться одним числом одновременно показывать raw rows, normalized rows и unique items.

---

## 7. Example data

Рядом с input-area допускается secondary action:

```text
Load example
```

При нажатии:

- заполняются оба списка;
- сравнение запускается автоматически;
- пользователь видит рабочий result state.

Example data должны быть короткими и объяснять механику без дополнительных инструкций.

Не создавать отдельный tutorial mode.

---

## 8. Comparison options

MVP:

```text
☑ Trim whitespace
☑ Ignore empty lines
☐ Ignore case
☑ Remove duplicates
```

### 8.1 Defaults

```text
Trim whitespace      ON
Ignore empty lines   ON
Ignore case          OFF
Remove duplicates    ON
```

### 8.2 Presentation

Опции находятся одним компактным блоком непосредственно под inputs.

Не делать:

- по карточке на каждую настройку;
- accordion `Advanced settings`;
- отдельный settings modal;
- tooltip на каждом очевидном control.

Короткое пояснение допускается только для неоднозначной настройки.

### 8.3 Live effect

Изменение любой опции пересчитывает результат без дополнительного submit.

---

## 9. Live comparison

### 9.1 Trigger

Comparison выполняется после:

- изменения List A;
- изменения List B;
- изменения normalization option;
- swap;
- clear;
- load example.

### 9.2 Debounce

Для typing допускается короткий debounce, чтобы избежать лишних вычислений.

Цель debounce — performance, а не искусственное ощущение loading.

### 9.3 Loading state

Для обычных списков отдельный loading state не нужен.

Если вычисление длится достаточно долго, чтобы пользователь заметил задержку, появляется минимальный processing state:

```text
Comparing…
```

Не использовать skeleton screens.

---

## 10. Results area

Results состоит из двух уровней:

1. summary;
2. active result view.

---

## 11. Summary

Summary появляется, когда есть хотя бы один непустой input.

Recommended structure:

```text
────────────────────────────────────────────────────

ONLY IN A          IN BOTH           ONLY IN B
24                 96                40

────────────────────────────────────────────────────
```

Не использовать dashboard cards.

Дополнительно допустимо компактно показать:

```text
A: 120 unique · B: 136 unique
```

если это помогает понять влияние deduplication.

---

## 12. Result tabs

Рекомендуемый набор:

```text
Differences | Only A | Only B | Matches | All
```

### Meaning

**Differences** — все элементы, которые присутствуют только в одном из списков.

**Only A** — `A \ B`.

**Only B** — `B \ A`.

**Matches** — intersection.

**All** — union.

`Differences` активен по умолчанию.

---

## 13. Differences view

Default result должен быть понятен без знания математической терминологии.

```text
Differences · 64 items                         Copy  Download

ONLY IN LIST A — 24

kate@example.com
mike@example.com
...

ONLY IN LIST B — 40

alice@example.com
david@example.com
...
```

Не использовать только цвет для различения секций.

---

## 14. Other result views

### Only A

```text
Only in List A · 24 items                     Copy  Download

kate@example.com
mike@example.com
...
```

### Only B

Аналогично.

### Matches

```text
Matches · 96 items                            Copy  Download
```

### All

Union обоих списков.

---

## 15. Result viewer behavior

Большой result не должен увеличивать страницу на десятки тысяч пикселей.

Result viewer имеет разумную максимальную высоту и собственный vertical scroll.

Принципы:

- текст легко выделяется;
- строки не оформляются отдельными карточками;
- длинные строки не ломают layout;
- copy/download работают для полного результата, а не только видимого viewport.

До performance testing не фиксировать virtualization как обязательную реализацию.

---

## 16. Copy

Каждый result view имеет action:

```text
Copy
```

После успешного копирования:

```text
✓ Copied
```

через короткое время состояние возвращается к `Copy`.

Не показывать глобальный toast для локального действия.

---

## 17. Download

Каждый result view можно скачать как `.txt`.

Download:

- использует текущий normalized result;
- не отправляет данные на сервер;
- создаётся локально в браузере.

Примеры имён:

```text
compare-lists-differences.txt
compare-lists-only-a.txt
compare-lists-matches.txt
```

---

## 18. Empty states

### 18.1 Both inputs empty

```text
Results

Paste two lists above to see their differences and matches.
```

### 18.2 Only A filled

Comparison остаётся валидным:

```text
Only A: N
Matches: 0
Only B: 0
```

### 18.3 Only B filled

Симметрично.

### 18.4 No differences

```text
No differences found.

Both lists contain the same values with the current comparison settings.
```

### 18.5 No matches

```text
No matching values.
```

---

## 19. Edge cases

### Duplicates

Поведение зависит от `Remove duplicates`.

Если настройка выключена, точная семантика duplicate comparison фиксируется в technical specification и тестах.

### Case

При `Ignore case = ON` comparison key нормализуется отдельно. Raw input пользователя не переписывается.

### Whitespace

Whitespace normalization влияет на comparison, но textarea продолжает показывать пользовательский raw text.

### Empty lines

Они могут игнорироваться вычислением, но input не переписывается автоматически.

**Главный принцип: настройки сравнения не должны мутировать текст пользователя.**

---

## 20. Large datasets

Большие списки считаются допустимым сценарием.

До релиза проверить:

- 1k rows;
- 10k rows;
- 100k rows.

UX requirements:

- paste не должен приводить к crash;
- интерфейс должен оставаться управляемым;
- result rendering не должен блокировать страницу надолго;
- пользователь должен иметь возможность copy/download полного результата.

Если обнаруживается заметный UI freeze, техническое решение выбирается на основе профилирования:

- optimized plain text rendering;
- deferred rendering;
- virtualization;
- Web Worker.

Не добавлять сложность заранее.

---

## 21. Privacy UX

Около основного tool-area:

> **Private by design.** Your lists are processed locally in your browser and are never uploaded.

Дополнительное объяснение ниже страницы.

Не использовать alarmist security marketing:

- `100% SECURE`;
- flashing lock icons;
- giant privacy cards;
- unverifiable security claims.

Privacy должна восприниматься как техническое свойство продукта.

---

## 22. Keyboard behavior

MVP должен нормально работать без мыши.

Минимум:

- Tab проходит controls в логическом порядке;
- Shift+Tab работает;
- focus visible;
- Space переключает checkbox;
- textarea сохраняет стандартные keyboard shortcuts;
- result tabs доступны с клавиатуры;
- Copy/Download доступны через focus;
- Swap имеет keyboard-accessible control.

Не создавать собственные shortcuts, которые конфликтуют с browser/OS conventions.

---

## 23. Accessibility

Требования:

- semantic headings;
- explicit labels;
- proper button elements;
- accessible tab semantics;
- visible focus;
- sufficient contrast;
- status feedback доступен screen reader;
- color не является единственным носителем смысла;
- hit targets достаточного размера на touch devices.

---

## 24. Mobile UX

Mobile layout:

```text
Compare Lists

description
privacy

LIST A
[ textarea ]
rows · Clear

      Swap

LIST B
[ textarea ]
rows · Clear

options

summary

Differences | Only A | Only B | ...
------------------------------------
result
```

Rules:

- single-column;
- no horizontal page scrolling;
- textarea достаточно высокая для реального использования;
- controls не становятся микроскопическими;
- result tabs могут использовать horizontal scroll, если это лучше переноса;
- result area сохраняет собственный scroll только если это не конфликтует с mobile page scroll.

---

## 25. Responsive desktop behavior

На широких экранах рабочая область не должна бесконечно растягиваться.

Используется ограниченная content width.

Две колонки должны оставаться достаточно широкими для email, URL и ID.

При уменьшении viewport layout переходит в single-column до того, как inputs становятся неудобно узкими.

Точный breakpoint определяется реализацией, а не выбирается ради стандартного значения.

---

## 26. Content below the tool

После рабочей области допускаются:

1. How to compare two lists
2. What the results mean
3. Common use cases
4. How your data is processed
5. FAQ

Это editorial content, а не продолжение app UI.

Не оформлять каждый раздел отдельной feature-card.

---

## 27. Future ad placements

Реклама не входит в MVP, но UX не должен делать её дальнейшее добавление невозможным.

Потенциально допустимая область:

```text
[ Header ]

[ Tool ]

[ Result ]

-----------------------
optional ad slot
-----------------------

[ Editorial content ]
```

Нельзя резервировать рекламный блок:

- между List A и List B;
- внутри result toolbar;
- поверх input;
- в месте, где он выглядит как control;
- таким образом, чтобы layout прыгал после загрузки рекламы.

---

## 28. Explicit UX anti-patterns

Запрещено без отдельного обоснования:

- mandatory Compare button;
- onboarding wizard;
- modal before using tool;
- account prompt;
- newsletter popup;
- result hidden below marketing content;
- tabs inside tabs;
- accordion for four basic options;
- global toast for every small action;
- full-page loading state;
- confirmation for reversible low-risk actions;
- mutation of user input during normalization;
- hiding core options behind a gear icon;
- artificial limits intended only to push registration.

---

## 29. State model

Основные состояния страницы:

```text
EMPTY
  ↓
ONE_SIDE_FILLED
  ↓
COMPARABLE
  ↓
RESULTS
```

Дополнительные transient states:

```text
PROCESSING_LARGE_INPUT
COPY_SUCCESS
COPY_ERROR
DOWNLOAD
```

---

## 30. Primary flow

```text
1. User lands from search
2. Immediately identifies the tool
3. Pastes List A
4. Pastes List B
5. Comparison appears automatically
6. Reads summary
7. Differences tab is already active
8. Optionally changes normalization
9. Copies or downloads desired result
10. Leaves
```

Целевой flow не требует ни одного обязательного клика между paste и result.

---

## 31. Secondary flow — inspect specific subset

```text
1. Compare two lists
2. See summary
3. Select Only A / Only B / Matches / All
4. Inspect result
5. Copy or download
```

---

## 32. Secondary flow — correct interpretation

```text
1. User sees unexpected differences
2. Enables Trim / Ignore case / Remove duplicates
3. Results update live
4. User understands why the result changed
```

Настройки должны помогать исправить интерпретацию данных, а не ощущаться как configuration screen.

---

## 33. UX acceptance criteria

### First-use clarity

- [ ] H1 и inputs видны без поиска по странице.
- [ ] Пользователь понимает, что вставлять данные нужно в два поля.
- [ ] Есть понятное обещание результата.
- [ ] Privacy statement находится рядом с tool.

### Interaction cost

- [ ] Нет обязательного submit.
- [ ] Comparison запускается автоматически.
- [ ] Swap выполняется одним действием.
- [ ] Clear выполняется локально для каждого списка.
- [ ] Core options доступны без modal/accordion.

### Results

- [ ] Summary быстро показывает масштаб совпадений/различий.
- [ ] Differences открыт по умолчанию.
- [ ] Only A / Only B / Matches / All доступны без повторного вычисления пользователем.
- [ ] Copy даёт локальный feedback.
- [ ] Download работает без сервера.

### Data integrity

- [ ] Normalization settings не мутируют raw input.
- [ ] User content не отправляется на backend.
- [ ] Analytics не содержит raw lists/results.

### Responsive

- [ ] Desktop использует две колонки.
- [ ] Mobile использует одну колонку.
- [ ] Нет page-level horizontal scroll.
- [ ] Controls остаются touch-friendly.

### Accessibility

- [ ] Полный keyboard flow работает.
- [ ] Focus visible.
- [ ] Controls имеют labels.
- [ ] Tabs имеют корректную semantics.
- [ ] Цвет не используется как единственный маркер.

---

## 34. Decisions intentionally deferred

Эти решения не блокируют UX specification и будут приняты позднее:

- exact typography;
- color palette;
- spacing scale;
- radii;
- border hierarchy;
- exact component styling;
- exact responsive breakpoint;
- whether result rendering needs virtualization;
- whether comparison needs Web Worker;
- file import UX;
- advertising format;
- Spanish language switcher behavior.

Они переходят соответственно в `DESIGN.md`, `ARCHITECTURE.md` и будущие phase specifications.

---

## 35. Next step

После утверждения этого UX-документа создаётся `DESIGN.md`.

Он фиксирует:

- visual direction;
- typography;
- color system;
- density;
- spacing scale;
- surfaces;
- borders;
- radii;
- controls;
- textarea styling;
- result styling;
- responsive visual rules;
- explicit anti-AI-slop constraints.

Только после UX + Design следует переходить к реализации интерфейса.
