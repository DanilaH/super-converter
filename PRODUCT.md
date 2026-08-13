# Compare Lists — Product Specification

## 1. Product

**Working name:** Compare Lists  
**Product type:** browser-based utility  
**Primary market:** English-speaking / global  
**Primary acquisition channel:** organic Google Search

Первая версия продукта решает одну задачу:

> Пользователь вставляет два списка и мгновенно получает совпадения и различия между ними.

Продукт не требует регистрации, не отправляет содержимое списков на сервер и не требует установки приложения.

---

## 2. Product hypothesis

Существует устойчивый поисковый спрос по запросам:

- `compare lists`
- `compare two lists`
- `list comparison`
- `list diff`
- `list comparison tool`
- `compare lists online`

В выдаче по этим запросам присутствуют небольшие специализированные utility-сайты, поэтому новый независимый продукт потенциально способен получить поисковую видимость.

### Проверяемая гипотеза

Если создать:

- быстрый;
- понятный;
- полностью client-side;
- SEO-оптимизированный

инструмент сравнения списков, то новый домен сможет начать получать органические impressions и затем clicks по этому поисковому кластеру.

Первая версия является **SEO/product experiment**, а не попыткой сразу построить большой SaaS.

---

## 3. Primary user intent

Пользователь уже имеет два набора данных и хочет быстро ответить на один или несколько вопросов:

- Какие элементы присутствуют только в первом списке?
- Какие элементы присутствуют только во втором списке?
- Какие элементы присутствуют в обоих списках?
- Какие уникальные элементы присутствуют хотя бы в одном списке?
- Чем два списка отличаются?

Пользователю не нужен сложный data-processing product.

Основной сценарий:

```text
Google
  ↓
Compare Lists
  ↓
Paste List A
Paste List B
  ↓
instant comparison
  ↓
Copy / Download result
  ↓
leave
```

Одноразовое использование считается нормальным поведением.

Retention не является основной метрикой продукта.

---

## 4. Example use cases

Продукт должен быть нейтральным относительно типа данных.

Примеры:

### Email lists

```text
List A
john@example.com
kate@example.com
bob@example.com

List B
john@example.com
alice@example.com
bob@example.com
```

Результат:

```text
Only A:
kate@example.com

Both:
john@example.com
bob@example.com

Only B:
alice@example.com
```

### Names

Сравнение:

- участников;
- сотрудников;
- клиентов;
- зарегистрированных пользователей.

### IDs

Сравнение:

- customer IDs;
- order IDs;
- database IDs;
- SKU;
- product IDs.

### URLs

Сравнение двух наборов:

- URLs;
- domains;
- redirects;
- crawled pages.

### Keywords

Сравнение:

- SEO keyword lists;
- campaign keywords;
- tags.

### Spreadsheet columns

Пользователь копирует два столбца из Excel / Google Sheets и вставляет их как обычные списки.

---

## 5. MVP

### 5.1 Inputs

На странице находятся два основных поля:

- **List A**
- **List B**

Каждая новая строка по умолчанию считается отдельным элементом списка.

Пользователь должен иметь возможность:

- вставить текст;
- вводить текст вручную;
- очистить один список;
- очистить оба списка;
- поменять List A и List B местами;
- загрузить демонстрационные данные.

---

### 5.2 Comparison

После нормализации должны вычисляться:

### Only in A

```text
A \ B
```

Элементы, присутствующие в List A и отсутствующие в List B.

### In both

```text
A ∩ B
```

Элементы, присутствующие в обоих списках.

### Only in B

```text
B \ A
```

Элементы, присутствующие в List B и отсутствующие в List A.

### Union

```text
A ∪ B
```

Все уникальные элементы из обоих списков.

### Symmetric difference

```text
(A \ B) ∪ (B \ A)
```

Все элементы, присутствующие только в одном из списков.

---

### 5.3 Normalization options

MVP поддерживает:

- Trim whitespace
- Ignore empty lines
- Ignore case
- Remove duplicates

### 5.4 Defaults

```text
Trim whitespace      ON
Ignore empty lines   ON
Ignore case          OFF
Remove duplicates    ON
```

Мы не должны неожиданно менять регистр пользовательских данных без его согласия.

---

### 5.5 Result

После ввода данных пользователь видит summary:

```text
List A        120 items
List B        136 items

Only A         24
In both        96
Only B         40
```

После summary располагаются результаты.

Минимально доступны:

- Only A
- In both
- Only B
- Union
- Differences

Для каждого результата:

- количество элементов;
- текстовый результат;
- Copy;
- Download `.txt`.

---

## 6. Interaction model

Основной comparison должен выполняться автоматически.

Не требуется обязательная кнопка `Compare`.

Ожидаемое взаимодействие:

```text
paste
  ↓
short debounce
  ↓
result updates
```

Кнопка может появиться позднее только если реальные performance measurements покажут необходимость ручного запуска для очень больших наборов данных.

---

## 7. Privacy

Это одно из основных свойств продукта.

Содержимое пользовательских списков:

- не отправляется на backend;
- не сохраняется в базе данных;
- не передаётся analytics;
- не логируется;
- не используется для рекламы.

Comparison выполняется непосредственно в браузере пользователя.

На странице должно быть явно указано:

> Your lists are processed locally in your browser and are never uploaded to our servers.

Analytics не должна содержать значения элементов списков.

---

## 8. Performance requirements

Основной алгоритм должен масштабироваться примерно линейно:

```text
O(n + m)
```

Базовый implementation может использовать:

```text
Set<string>
Map<string, ...>
```

До production release проверить минимум:

- 10 элементов;
- 1 000 элементов;
- 10 000 элементов;
- 100 000 элементов.

Web Worker не является обязательной частью MVP и добавляется только при подтверждённых UI freezes.

---

## 9. Responsive behavior

Desktop: два input side-by-side.  
Mobile: inputs располагаются вертикально.

Все основные операции должны быть доступны с мобильного устройства без горизонтального скролла интерфейса.

---

## 10. Accessibility

MVP должен обеспечивать:

- keyboard navigation;
- корректные `<label>`;
- видимый focus state;
- достаточный contrast;
- semantic headings;
- доступные названия controls;
- отсутствие зависимости только от цвета.

---

## 11. Error and edge cases

Продукт должен корректно обрабатывать:

- empty lists;
- duplicate values;
- whitespace-only lines;
- Unicode;
- very long lines;
- very large lists.

Если один список пуст, сравнение всё равно остаётся валидным.

---

## 12. SEO/product content

Основной инструмент является главным содержимым страницы.

После него допускаются короткие полезные разделы:

- How to compare two lists
- What the results mean
- Common uses
- Privacy
- FAQ

Не добавлять искусственные SEO-разделы ради увеличения количества текста.

---

## 13. Out of scope for MVP

Не реализовывать до проверки основной гипотезы:

- accounts;
- authentication;
- user profiles;
- cloud storage;
- history;
- saved comparisons;
- synchronization;
- collaboration;
- backend processing;
- database;
- subscriptions;
- payments;
- AI features;
- API;
- browser extension;
- native/mobile app;
- arbitrary utility collection;
- Instagram export parser;
- Spanish localization;
- CSV-specific comparison;
- XLS/XLSX parser;
- multi-list comparison;
- advanced replacement rules.

---

## 14. Monetization

Монетизация **не является частью первоначальной проверки acquisition hypothesis**.

Первый production release запускается без рекламы.

Архитектура UI должна позволять позднее добавить рекламные slots без переработки core layout.

Конкретный provider не должен быть частью domain logic.

---

## 15. Phase 2 — Spanish localization

После стабильного запуска английской версии планируется:

```text
/es/comparar-listas
```

Используется тот же comparison engine.

Локализуются:

- UI;
- title;
- meta description;
- headings;
- instructions;
- examples;
- FAQ;
- structured SEO content.

Primary Spanish intents:

```text
comparar listas online
comparar listas
```

---

## 16. Phase 3 — Instagram comparison

Отдельная utility-page:

```text
/instagram-followers
```

Пользователь загружает официальный Instagram data export.

Продукт не должен:

- запрашивать Instagram password;
- авторизовываться в Instagram;
- scraping Instagram;
- использовать неофициальный обход API.

Обрабатываются export-файлы пользователя локально.

Результат:

- people you follow who do not follow you back;
- people who follow you but you do not follow;
- mutual followers.

Для вычислений переиспользуется core comparison engine.

---

## 17. Success definition

MVP считается продуктово готовым, если пользователь может:

1. открыть страницу;
2. вставить два списка;
3. получить корректный результат без дополнительной настройки;
4. переключить normalization options;
5. увидеть Only A / Both / Only B;
6. скопировать результат;
7. скачать результат;
8. выполнить всё без передачи содержимого списков на сервер.

---

## 18. Experiment boundaries

The purpose of MVP is not:

> Build the best list-processing platform on the internet.

The purpose is:

> Determine whether a new high-quality Compare Lists utility can acquire organic search visibility.

Поэтому:

```text
Build minimum credible product
        ↓
Deploy
        ↓
Index
        ↓
Observe real search behavior
        ↓
Decide whether to expand
```

Development of additional tools must be justified by actual search or user data after launch.
