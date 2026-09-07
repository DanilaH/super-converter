# SEO.md — Compare Lists

## 1. Purpose

Этот документ фиксирует SEO-стратегию первой версии Compare Lists.

Проект не строится как контентный сайт или «сетка SEO-страниц».

Основная модель:

```text
search intent
    ↓
one strong utility page
    ↓
user immediately solves the task
```

Главная SEO-гипотеза:

> Новый домен с качественной, быстрой и полезной browser-side utility может получить органическую видимость по кластеру запросов вокруг сравнения двух списков.

SEO не должно ухудшать UX, раздувать scope или создавать страницы, существующие только ради поискового трафика.

---

# 2. Research conclusion

Основной подтверждённый кластер — English / Google.

Ключевые US-запросы по проведённому исследованию:

| Query | Approx. monthly volume | CPC signal |
|---|---:|---:|
| `compare lists` | 49,500 | ~$7.90 |
| `list comparison` | 49,500 | ~$7.90 |
| `compare two lists` | 27,100 | ~$7.76 |
| `list diff` | 18,100 | $0 |
| `list comparison tool` | 1,900 | ~$5.78 |
| `compare lists online` | 480 | — |

Важно:

- эти запросы пересекаются по intent;
- их объёмы **нельзя суммировать** как независимый спрос;
- CPC используется только как дополнительный коммерческий сигнал;
- одна сильная страница должна покрывать весь основной кластер.

Дополнительно подтверждены:

- глобальный English-demand за пределами США;
- Spanish как наиболее интересная будущая локализация;
- отдельный Instagram followers/following use case как будущая acquisition page.

---

# 3. Primary search intent

Основной intent:

> Пользователь хочет вставить два списка и быстро увидеть совпадения и различия.

Это **utility / task completion intent**, а не образовательный intent.

Поэтому страница должна:

1. сразу показывать инструмент;
2. позволять начать работу без регистрации;
3. давать результат в рамках той же страницы;
4. содержать достаточное объяснение для понимания результата;
5. не заставлять пользователя читать статью до использования tool.

---

# 4. Indexable page architecture

## MVP

Индексируются:

```text
/
```

Главная страница одновременно является:

- homepage;
- primary utility page;
- основным SEO landing page.

Дополнительные служебные страницы:

```text
/about
/privacy
```

Они могут индексироваться, но не являются acquisition targets.

## Future

После подтверждения основной версии:

```text
/es/comparar-listas
/instagram-followers
```

или окончательно утверждённый Instagram slug после отдельного keyword mapping.

---

# 5. Why the tool lives on `/`

Для первого и главного продукта предпочтительна структура:

```text
https://example.com/
```

а не одновременно:

```text
/
/compare-lists
/compare-two-lists
/list-comparison
/list-diff
```

Причины:

- не дробить один intent на почти одинаковые URL;
- не создавать внутреннюю каннибализацию;
- концентрировать internal links и external links;
- сделать homepage непосредственно полезной;
- избежать doorway-like структуры из страниц под синонимы.

---

# 6. URL rules

## Production origin

Выбирается один canonical origin:

```text
https://example.com/
```

После выбора домена необходимо определить один hostname:

```text
example.com
```

или:

```text
www.example.com
```

Все альтернативные варианты должны делать permanent redirect на выбранный canonical origin:

```text
http → https
www → non-www
```

или наоборот.

Не оставлять несколько доступных копий сайта.

## URL style

- lowercase;
- короткие читаемые slugs;
- без query parameters для индексируемого контента;
- без `.html`;
- без дат в URL;
- без keyword stuffing.

---

# 7. Primary keyword mapping

## Homepage `/`

### Primary phrase

```text
compare lists
```

### Strong secondary phrases

```text
compare two lists
list comparison
list diff
compare lists online
list comparison tool
```

### Natural semantic variants

```text
find differences between two lists
find matches between two lists
compare two sets of values
only in list A
only in list B
common items
unique items
```

Все эти формулировки относятся к одному intent и **не получают отдельные SEO pages в MVP**.

---

# 8. Recommended metadata

## `<title>`

Recommended initial version:

```text
Compare Two Lists Online — Find Differences & Matches
```

Альтернативный вариант для тестирования позднее:

```text
Compare Lists Online — Differences, Matches & Unique Items
```

Не менять title каждую неделю без данных.

## Meta description

Recommended:

```text
Compare two lists online to find differences, matches and unique items. Fast, free and processed locally in your browser.
```

Description пишется для человека, а не как список keywords.

Google может сформировать другой snippet в зависимости от запроса — это нормальное поведение.

## H1

```text
Compare Two Lists Online
```

H1 не обязан дословно совпадать с title, но должен однозначно описывать функцию страницы.

## Intro

Recommended direction:

```text
Find differences, matches and unique values between two lists instantly.
Your data is processed locally in your browser and never uploaded.
```

Коротко. Tool начинается сразу после intro.

---

# 9. On-page structure

Recommended DOM/content order:

```text
<header>

<main>

  <h1>Compare Two Lists Online</h1>

  short description
  privacy statement

  <CompareTool />

  <section>
    <h2>How to compare two lists</h2>
  </section>

  <section>
    <h2>What the comparison results mean</h2>
  </section>

  <section>
    <h2>Common ways to compare lists</h2>
  </section>

  <section>
    <h2>Private browser-side list comparison</h2>
  </section>

  <section>
    <h2>Frequently asked questions</h2>
  </section>

</main>

<footer>
```

Главный инструмент появляется **до SEO/editorial content**.

---

# 10. Tool content must be crawlable

Core explanatory content должен существовать в индексируемом HTML.

Не делать страницу, где сервер отдаёт только:

```html
<div id="root"></div>
```

а весь meaningful content появляется только после client-side execution.

Интерактивный comparison engine может быть client-side, но:

- H1;
- intro;
- labels;
- explanatory sections;
- About/Privacy links

должны быть доступны в server-rendered/static HTML.

---

# 11. Content outline

Контент после инструмента должен быть коротким, полезным и непосредственно связанным с задачей.

## 11.1 How to compare two lists

Цель — объяснить механику в 3–4 шага.

Пример структуры:

1. Paste the first list into List A.
2. Paste the second list into List B.
3. Adjust comparison options if needed.
4. Review differences, matches or all unique values.

Не превращать это в длинный tutorial.

## 11.2 What the comparison results mean

Объяснить:

- Only in A;
- Only in B;
- Matches;
- Differences;
- All / Union.

Использовать человеческий язык, математические обозначения — только как вторичное пояснение.

## 11.3 Common ways to compare lists

Естественно упомянуть реальные сценарии:

- email addresses;
- customer IDs;
- URLs;
- product/SKU lists;
- keywords;
- names;
- copied spreadsheet columns.

Это помогает покрывать long-tail vocabulary без создания тонких отдельных страниц.

## 11.4 Privacy

Объяснить:

- comparison runs locally;
- raw lists do not leave browser;
- raw input/output is not sent to analytics;
- download is generated locally.

Это одновременно product trust content и реальная дифференциация.

## 11.5 FAQ

Только реальные вопросы:

```text
Can I compare two lists with duplicates?
Is the comparison case-sensitive?
Can I compare Excel columns?
Are my lists uploaded to a server?
What does “Only in A” mean?
```

Не писать 20 искусственных вопросов ради keyword coverage.

---

# 12. Content length philosophy

Нет целевого количества слов.

Запрещено задавать требование вроде:

```text
minimum 1500 words
```

или:

```text
write 3000 words for SEO
```

Страница должна быть настолько длинной, насколько нужно для:

- использования инструмента;
- понимания результатов;
- объяснения настроек;
- trust/privacy;
- покрытия основных реальных use cases.

Если содержание можно выразить короче без потери пользы — выбирается более короткий вариант.

---

# 13. No synonym pages

Не создавать:

```text
/compare-two-lists
/compare-lists-online
/list-comparison
/list-diff
/list-comparison-tool
```

с тем же инструментом и перефразированным текстом.

Это один intent.

Одна страница должна естественно использовать разные формулировки.

Отдельная URL оправдана только если появляется:

1. отдельный user intent;
2. отличающийся tool/workflow;
3. самостоятельная пользовательская ценность.

---

# 14. Future long-tail pages rule

Search Console может показать запросы вроде:

```text
compare email lists
compare url lists
compare excel columns
compare keyword lists
```

Это **не означает автоматически**, что нужно создать четыре страницы.

Новая page создаётся только если мы можем сделать для конкретного intent заметно лучший продукт:

```text
different input UX
different parser
different output
different guidance
different use case
```

Если страница отличается только H1 и примером — она не создаётся.

---

# 15. Internal linking

## MVP

Homepage содержит ссылки:

```text
About
Privacy
```

About и Privacy содержат естественную ссылку обратно на основной tool.

Не строить искусственную footer-сетку из keyword anchors.

## Future

Когда появятся самостоятельные products:

```text
Compare Lists
Instagram Followers Compare
```

они могут естественно перелинковываться через:

```text
Related tools
```

только если ссылка реально полезна пользователю.

Spanish language version связывается через language selector / language link, а не через keyword-rich promo block.

---

# 16. Canonical strategy

## Homepage

```html
<link rel="canonical" href="https://example.com/" />
```

Canonical должен указывать на реальный production URL этой страницы.

## About

Self-canonical.

## Privacy

Self-canonical.

## Spanish

Будущая Spanish page:

```text
/es/comparar-listas
```

получает **self-canonical**, а не canonical на English homepage.

Языковая версия — самостоятельная индексируемая страница, а не duplicate, который нужно сводить к English.

---

# 17. Hreflang strategy

До появления второй локали `hreflang` не нужен.

После Spanish:

English:

```html
<link rel="alternate" hreflang="en" href="https://example.com/" />
<link rel="alternate" hreflang="es" href="https://example.com/es/comparar-listas" />
<link rel="alternate" hreflang="x-default" href="https://example.com/" />
```

Spanish page содержит reciprocal annotations.

Не использовать IP-based language switching.

Не перенаправлять пользователя автоматически на Spanish только из-за страны/IP.

Язык должен быть доступен по стабильному отдельному URL.

---

# 18. Spanish localization

Spanish — первая запланированная локализация после проверки English MVP.

Research signal:

```text
comparar listas online
comparar listas
```

показал заметный demand прежде всего в Spain и Mexico, а также дополнительный LATAM-demand.

## URL

Recommended:

```text
/es/comparar-listas
```

## Localization requirement

Переводится не только UI.

Локализуются:

- title;
- meta description;
- H1;
- intro;
- labels;
- instructions;
- use cases;
- privacy text;
- FAQ.

Не делать дословный machine-translated English page без редактуры.

## Spanish initial metadata direction

Title:

```text
Comparar Listas Online — Diferencias y Coincidencias
```

H1:

```text
Comparar dos listas online
```

Окончательные формулировки проверить перед запуском локали по актуальной SERP.

---

# 19. Instagram acquisition page

Instagram use case не добавляется как keyword section на homepage.

Это отдельный workflow и отдельный intent.

Potential page:

```text
/instagram-followers
```

Финальный slug определяется перед реализацией.

Search intent research показал отдельный интерес вокруг:

```text
who doesn't follow me back on instagram
compare instagram followers and following
instagram list compare
```

Страница должна реально уметь работать с официальным Instagram export локально в браузере.

Нельзя создавать страницу под этот intent, пока у неё нет соответствующей функции.

---

# 20. Search snippet principles

Title и description должны обещать только то, что реально существует.

Не использовать:

```text
#1
Best
Ultimate
Most Advanced
Millions of Users
```

без доказуемого основания.

Не добавлять текущий год в title:

```text
Compare Lists 2026
```

если год не имеет пользовательской ценности.

Не использовать ALL CAPS или emoji в title.

---

# 21. Structured data

В MVP специальная structured data **не требуется** для ранжирования utility.

Не добавлять schema только потому, что «SEO checklist требует schema».

Особенно не использовать:

- fake reviews;
- aggregateRating без реальных данных;
- SoftwareApplication ratings;
- FAQ markup ради попытки получить rich result;
- fabricated organization details.

Базовая semantic HTML structure важнее.

Если позднее появляется подходящий реальный structured-data use case, он рассматривается отдельно по актуальной Google documentation.

---

# 22. Semantic HTML

Использовать:

```html
<header>
<nav>
<main>
<section>
<h1>
<h2>
<footer>
<button>
<label>
<textarea>
```

по назначению.

Не строить весь интерфейс из `<div>`.

Visible text должен находиться в DOM.

---

# 23. Robots

Production `robots.txt` не должен блокировать основные страницы или framework assets, необходимые для rendering.

Минимальное направление:

```text
User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml
```

Точный production hostname подставляется после выбора домена.

Не использовать `robots.txt` как способ скрывать staging pages, которые уже доступны публично.

Для staging предпочтительнее:

- authentication;
- deployment protection;
- либо `noindex`, если staging обязан быть публичным.

---

# 24. Sitemap

Production предоставляет:

```text
/sitemap.xml
```

MVP sitemap содержит:

```text
/
/about
/privacy
```

После Spanish и Instagram:

```text
/es/comparar-listas
/instagram-followers
```

В sitemap включаются только:

- canonical;
- indexable;
- production URLs.

Не включать:

- redirects;
- 404;
- staging;
- query variants;
- duplicate URLs.

---

# 25. Search Console

После production launch:

1. добавить domain property;
2. подтвердить ownership;
3. отправить sitemap;
4. проверить homepage через URL Inspection;
5. проверить rendered/indexable state;
6. request indexing для ключевой страницы, если это уместно;
7. отслеживать indexing issues.

Search Console — главный источник данных для SEO-эксперимента.

---

# 26. What to monitor

## Queries

Особенно:

```text
compare lists
compare two lists
list comparison
list diff
```

и неизвестные long-tail queries.

## Metrics

```text
impressions
clicks
CTR
average position
indexed pages
countries
devices
```

Важно анализировать не только head keyword.

Одна page может одновременно:

```text
rank poorly for head
rank moderately for mid-tail
rank well for small long-tail
```

Первые пользователи могут приходить именно через long-tail.

---

# 27. Early SEO success signals

## Stage 1 — discovered/indexed

Google:

- crawls page;
- indexes canonical;
- begins showing impressions.

## Stage 2 — query expansion

Search Console начинает показывать больше non-brand queries.

## Stage 3 — position movement

Некоторые запросы:

```text
70 → 45 → 28
```

Это ещё не business success, но это useful early signal.

## Stage 4 — first-page queries

Часть long-tail queries достигает:

```text
Top 20
Top 10
```

и начинает давать clicks.

## Stage 5 — traffic

Organic clicks и tool usage становятся устойчивыми.

---

# 28. SEO failure interpretation

Позиция 60 сама по себе не считается успехом.

Если через достаточно длительный период:

- page indexed;
- technical SEO healthy;
- impressions exist;
- но все meaningful queries стабильно остаются далеко от first page;
- clicks не растут;

это причина пересмотреть:

- relevance;
- content;
- product differentiation;
- link profile;
- SERP competitiveness.

Не интерпретировать любое количество impressions как доказательство успеха.

---

# 29. 30 / 60 / 90-day review model

Это ориентиры для проверки, а не гарантированные сроки ранжирования.

## Around 30 days

Проверить:

- indexing;
- impressions;
- initial queries;
- crawl/canonical issues.

## Around 60 days

Проверить:

- query growth;
- position direction;
- first long-tail clicks;
- countries;
- unexpected intents.

## Around 90 days

Принять решение:

```text
GROW
ITERATE
or
STOP / CHANGE HYPOTHESIS
```

На основе тренда, а не одного snapshot.

---

# 30. Backlinks

Backlinks могут быть важны для конкурентного SERP, но link acquisition не должен превращаться в spam campaign.

Допустимые направления:

- реальные mentions;
- relevant resource pages;
- articles, где tool действительно решает описанную задачу;
- developer/data/marketing resources;
- useful community references;
- future Instagram how-to references, если tool реально поддерживает workflow.

Не делать:

- PBN;
- bulk guest-post packages;
- sitewide purchased links;
- autogenerated profiles;
- comment spam;
- thousands of low-quality directory submissions.

---

# 31. Competitor backlink lesson

Предварительный competitor research показал две модели:

## Strong contextual links

У части лидеров были ссылки из реальных статей, где utility решала конкретный workflow, например Instagram follower comparison.

Это желаемый тип ссылок:

```text
article explains problem
        ↓
our tool solves it
```

## Spam/PBN-like links

У некоторых слабых конкурентов присутствовали очевидно искусственные SEO links.

Это не модель, которую проект должен копировать.

---

# 32. No scaled content

Нельзя автоматически создавать десятки страниц:

```text
compare X lists
compare Y lists
compare Z lists
```

только заменяя noun.

Нельзя создавать большие объёмы текста с primary purpose «занять больше keywords».

Автоматизация/AI допустимы как рабочий инструмент, но опубликованная page должна иметь самостоятельную пользовательскую ценность.

---

# 33. No doorway strategy

Запрещена структура:

```text
/compare-two-lists
/compare-lists
/list-comparison
/list-diff
```

где страницы почти одинаковы и ведут к одной функции.

Запрещено создавать отдельные geo-pages:

```text
/us/compare-lists
/uk/compare-lists
/canada/compare-lists
```

без реальной локальной разницы.

Spanish — допустима, потому что это реальная языковая локализация с отдельным пользовательским контентом.

---

# 34. AI/search-generation considerations

Не оптимизировать страницу под «LLM keywords» отдельными искусственными блоками.

Основная стратегия остаётся:

- clear problem;
- useful tool;
- explicit functionality;
- semantic HTML;
- trustworthy privacy explanation;
- concise supporting content.

Не создавать искусственные paragraphs, предназначенные только для цитирования AI search systems.

---

# 35. Indexation control

Production indexable pages:

```text
/
about
privacy
```

и позднее подтверждённые product/localization pages.

Не индексировать:

- preview deployments;
- QA pages;
- test routes;
- debug output;
- internal performance pages;
- duplicated experiment variants.

A/B variants, если появятся, проектируются отдельно с корректной canonical/indexing strategy.

---

# 36. Error pages

Несуществующие URL должны возвращать настоящий:

```text
404
```

Не делать soft-404 с `200 OK`.

404 page должна:

- объяснять, что страница не найдена;
- давать ссылку на основную utility.

Не нужно превращать 404 в SEO landing page.

---

# 37. Redirects

Использовать redirects для реальных URL migrations.

Если URL меняется навсегда:

```text
301/308
```

на наиболее релевантный replacement.

Не делать массовые redirects всех удалённых страниц на homepage.

---

# 38. Performance and SEO

SEO page должна оставаться быстрой, потому что UX utility напрямую зависит от responsiveness.

Design уже предусматривает:

- no webfont;
- no decorative images;
- minimal JS outside tool;
- no animation framework.

Implementation должен дополнительно контролировать:

- client bundle;
- client-script scope;
- layout shift;
- third-party scripts.

Ads подключаются только позднее и не должны разрушать layout/performance.

---

# 39. Mobile

Основной контент и функции должны быть доступны на mobile URL без отдельной mobile version.

Не создавать:

```text
m.example.com
```

Mobile и desktop используют один responsive page.

---

# 40. Privacy page

`/privacy` должна честно объяснять:

- что raw list data обрабатывается локально;
- какая analytics используется;
- какие технические данные могут собираться;
- cookies/storage, если они действительно используются;
- future ads only after they actually exist.

Не писать шаблонную политику, которая утверждает использование сервисов, которых сайт ещё не использует.

---

# 41. About page

`/about` должна быть короткой.

Цель:

- объяснить назначение сайта;
- кто/что стоит за инструментом на подходящем уровне прозрачности;
- дать trust context;
- дать ссылку на main tool.

Не раздувать fake-company narrative.

---

# 42. Launch SEO checklist

До production:

- [ ] unique `<title>`;
- [ ] meta description;
- [ ] exactly one clear H1;
- [ ] canonical;
- [ ] production HTTPS;
- [ ] one hostname;
- [ ] semantic HTML;
- [ ] meaningful content available without waiting for interaction;
- [ ] `/robots.txt`;
- [ ] `/sitemap.xml`;
- [ ] 404 returns 404;
- [ ] staging excluded from indexing;
- [ ] mobile layout works;
- [ ] About;
- [ ] Privacy;
- [ ] favicon;
- [ ] Open Graph basics;
- [ ] no accidental `noindex`;
- [ ] no accidental robots block;
- [ ] no duplicate production origin.

After production:

- [ ] Search Console property;
- [ ] sitemap submitted;
- [ ] homepage inspected;
- [ ] Google-selected canonical checked;
- [ ] indexing status checked;
- [ ] analytics does not send raw list content.

---

# 43. First optimization cycle

Не менять страницу хаотично сразу после запуска.

Сначала собрать baseline.

Затем использовать Search Console для вопросов:

```text
Which queries trigger impressions?
Which wording does Google associate with the page?
Which countries show the page?
Which long-tail queries approach page one?
Where is CTR unexpectedly weak?
```

Изменения должны отвечать на наблюдаемую проблему.

Пример:

```text
many impressions for "compare email lists"
+
users engage well
+
intent clearly fits current product
```

→ можно усилить email example/use case на текущей page.

Это **не означает автоматически** создавать `/compare-email-lists`.

---

# 44. Criteria for a new SEO page

Новая indexable product page допускается, если выполнены минимум три условия:

1. есть отдельный подтверждённый search intent;
2. page даёт отдельный workflow/product value;
3. content невозможно честно свести к небольшому блоку на существующей page.

Примеры:

### Valid

```text
Instagram followers/following comparison
```

Потому что:

- отдельный intent;
- отдельный file-import workflow;
- отдельные result semantics.

### Not valid

```text
Compare email lists
```

если это ровно те же две textarea и тот же result engine.

---

# 45. Current SEO roadmap

```text
ENGLISH HOMEPAGE
/
Compare Lists
    ↓
index
    ↓
Search Console data
    ↓
query / position validation

        ├───────────────┐
        ↓               ↓

SPANISH             INSTAGRAM
/es/comparar-listas /instagram-followers
        ↓               ↓

more pages only when
real search + product evidence exists
```

---

# 46. Sources of truth

Для технических SEO-решений использовать актуальную документацию Google Search Central как primary source.

Основные темы:

- Search Essentials;
- SEO Starter Guide;
- canonicalization;
- multilingual/multi-regional sites;
- hreflang;
- sitemap;
- crawling/indexing;
- spam policies.

Не принимать SEO checklist из случайного блога как технический стандарт, если он противоречит Google documentation.

---

# 47. Final SEO direction

Проект должен выиграть не количеством страниц, а сочетанием:

```text
clear search intent
+
excellent utility UX
+
crawlable explanatory content
+
technical cleanliness
+
real user value
+
eventual relevant links
```

Основной принцип:

> **One intent → one strong page. New page only when there is a genuinely different intent and user experience.**

SEO должно усиливать продукт, а не диктовать создание бесполезного контента.
