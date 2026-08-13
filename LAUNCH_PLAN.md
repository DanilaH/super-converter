# LAUNCH_PLAN.md — Compare Lists

## 1. Purpose

Этот документ фиксирует путь от утверждённой спецификации до production launch и первых 90 дней проверки гипотезы.

На этом этапе уже определены:

```text
PRODUCT.md       ✅
UX.md            ✅
DESIGN.md        ✅
SEO.md           ✅
ARCHITECTURE.md  ✅
ANALYTICS.md     ✅
```

`LAUNCH_PLAN.md` отвечает на вопрос:

> В каком порядке строить, проверять, выкатывать и оценивать продукт, чтобы не потратить лишнее время до получения реальных поисковых данных.

Главная цель launch:

> Выпустить минимально убедительную English-версию Compare Lists, корректно проиндексировать её и получить первые реальные данные из Google Search Console.

---

# 2. Launch philosophy

Проект запускается как **controlled SEO/product experiment**.

Это не:

```text
build huge platform
→ polish endlessly
→ monetize
→ maybe look at SEO later
```

Это:

```text
spec
→ focused MVP
→ production
→ indexation
→ search signals
→ product signals
→ iterate / expand / stop
```

Стоимость ошибки должна оставаться низкой до подтверждения acquisition hypothesis.

---

# 3. Scope of first production release

В первый production release входят:

## Product

- two list inputs;
- live comparison;
- trim whitespace;
- ignore empty lines;
- ignore case;
- remove duplicates;
- Differences;
- Only A;
- Only B;
- Matches;
- All;
- summary counts;
- Swap;
- Clear;
- Load example;
- Copy;
- Download TXT;
- privacy statement;
- browser-only processing.

## Pages

```text
/
 /about
 /privacy
```

## SEO

- title;
- meta description;
- H1;
- canonical;
- robots;
- sitemap;
- semantic HTML;
- editorial supporting content;
- Open Graph basics;
- proper 404.

## Quality

- strict TypeScript;
- domain tests;
- interaction tests;
- mobile;
- accessibility;
- performance check;
- production build.

## Analytics

- Search Console after deploy;
- privacy-safe product analytics adapter;
- no raw list content.

---

# 4. Explicitly excluded from first release

Do not delay launch for:

```text
Spanish
Instagram parser
CSV/XLSX import
accounts
auth
history
saved comparisons
backend
database
AI
dark mode
ads
payment
CMS
multi-tool platform
advanced animations
custom design system package
```

These are future phases.

---

# 5. Repository bootstrap

Recommended repository setup:

```text
Next.js
React
TypeScript strict
App Router
CSS Modules
global design tokens
```

Initial repository must include:

```text
README.md
PRODUCT.md
UX.md
DESIGN.md
SEO.md
ARCHITECTURE.md
ANALYTICS.md
LAUNCH_PLAN.md
```

These documents are source of truth for the coding agent.

---

# 6. Bootstrap checklist

Before feature implementation:

- [ ] repository created;
- [ ] package manager selected;
- [ ] one lockfile committed;
- [ ] strict TypeScript enabled;
- [ ] lint configured;
- [ ] formatting configured;
- [ ] test runner configured;
- [ ] build script works;
- [ ] CI skeleton exists;
- [ ] design tokens created;
- [ ] root layout created;
- [ ] production env strategy documented.

Do not spend time on unnecessary tooling beyond these gates.

---

# 7. Implementation sequence

Recommended order:

```text
Phase A — Foundation
Phase B — Domain engine
Phase C — Tool interaction
Phase D — Result UX
Phase E — Page / SEO shell
Phase F — Quality pass
Phase G — Production plumbing
Phase H — Launch
```

---

# 8. Phase A — Foundation

Deliverables:

- project skeleton;
- app router structure;
- global styles;
- tokens from `DESIGN.md`;
- base layout;
- header/footer skeleton;
- no visual UI library;
- no feature logic yet.

Exit criteria:

- `lint` passes;
- `typecheck` passes;
- `build` passes;
- page renders correctly on desktop/mobile baseline.

---

# 9. Phase B — Domain engine

Implement first:

```text
parse
normalize
compare
format
```

Before complex UI.

Core cases:

- empty lists;
- only A;
- only B;
- exact match;
- partial match;
- whitespace;
- blank lines;
- ignore case;
- dedupe ON;
- dedupe OFF / multiset semantics;
- order preservation;
- Unicode;
- CRLF.

Exit criteria:

- pure engine has no React/Next imports;
- tests cover all defined semantics;
- outputs deterministic;
- no raw input mutation.

---

# 10. Phase C — Tool interaction

Implement:

- List A;
- List B;
- counters;
- Clear;
- Swap;
- options;
- live comparison;
- Load example.

Important:

> No mandatory Compare button.

Exit criteria:

- paste → result without submit;
- changing option updates result;
- raw textarea text remains unchanged by normalization;
- single-column mobile layout works.

---

# 11. Phase D — Result UX

Implement:

```text
SummaryStrip
ResultTabs
Differences
Only A
Only B
Matches
All
Copy
Download
```

Exit criteria:

- Differences is default;
- copy feedback local;
- download works fully client-side;
- large result does not produce unusable page height;
- keyboard navigation works.

---

# 12. Phase E — Page / SEO shell

Implement production-facing content:

```text
H1
intro
privacy statement
tool
How to compare two lists
What the results mean
Common use cases
Privacy explanation
FAQ
```

Also:

- metadata;
- canonical;
- sitemap;
- robots;
- About;
- Privacy;
- 404.

Exit criteria:

- meaningful page content visible in initial HTML;
- tool remains above editorial content;
- one H1;
- no synonym doorway pages.

---

# 13. Phase F — Quality pass

Run:

```text
UX review
Design review
Accessibility review
Performance review
Privacy review
SEO technical review
```

This is where specification compliance is checked.

Do not use this phase to add new product features.

---

# 14. Performance verification

Test at least:

```text
1,000 rows
10,000 rows
100,000 rows
```

Measure separately:

```text
parse time
compare time
render time
copy
download
main-thread responsiveness
```

Questions:

```text
Is algorithm fast?
Is DOM rendering the bottleneck?
Does typing/paste freeze?
```

Only if measurement justifies it:

```text
Web Worker
virtualization
deferred rendering
```

No speculative optimization.

---

# 15. Accessibility gate

Before production:

- [ ] all inputs have visible labels;
- [ ] keyboard flow complete;
- [ ] focus visible;
- [ ] tabs accessible;
- [ ] controls use semantic elements;
- [ ] touch targets usable;
- [ ] color not sole meaning carrier;
- [ ] result status understandable by screen reader;
- [ ] no mobile horizontal page scroll.

Accessibility issues blocking core workflow block launch.

---

# 16. Design compliance gate

Review UI against `DESIGN.md`.

Launch is blocked by obvious visual regression such as:

- giant hero;
- gradients;
- unnecessary cards;
- pill tabs;
- excessive shadows;
- >8px arbitrary radius;
- extra accent colors;
- card-per-result-row;
- decorative badges;
- marketing sections before tool.

The project must look deliberately restrained, not agent-generated.

---

# 17. Privacy gate

Production cannot launch until verified:

- [ ] lists never leave browser;
- [ ] list values absent from network requests;
- [ ] list values absent from analytics;
- [ ] list values absent from URL;
- [ ] no list persistence;
- [ ] download generated locally;
- [ ] no session replay;
- [ ] error tracking, if present, cannot capture textarea content.

Use browser DevTools Network panel to verify actual behavior.

---

# 18. CI gate

Every merge to primary branch should run:

```text
lint
typecheck
tests
build
```

Optional later:

```text
E2E smoke
```

Recommended merge rule:

> production branch must never contain code that fails build/typecheck/tests.

---

# 19. Suggested PR sequence

Recommended:

## PR 1

```text
Foundation + design tokens
```

## PR 2

```text
Comparison engine + unit tests
```

## PR 3

```text
Inputs + options + live behavior
```

## PR 4

```text
Results + copy + download
```

## PR 5

```text
SEO shell + content + About/Privacy
```

## PR 6

```text
Responsive + accessibility + performance polish
```

## PR 7

```text
Analytics + production plumbing
```

Can be compressed if changes stay easy to review.

---

# 20. Code review policy

Each implementation PR must be checked against the specs.

Review order:

```text
1. Does behavior match PRODUCT/UX?
2. Does code respect ARCHITECTURE?
3. Does styling respect DESIGN?
4. Does page respect SEO?
5. Does analytics respect privacy?
6. Are tests sufficient?
```

A technically correct implementation that violates product/UX spec is not considered complete.

---

# 21. Pre-production environment

Before public launch, create a protected preview/staging deployment.

Goals:

- validate real browser rendering;
- test mobile;
- run privacy check;
- inspect metadata;
- inspect production-like build;
- test copy/download;
- test 100k-row behavior.

Staging must not become an accidentally indexed duplicate.

Preferred:

```text
deployment protection / authentication
```

If public staging is unavoidable:

```text
noindex
```

plus explicit verification before launch.

---

# 22. Domain decision

Before production deployment, choose final domain.

Requirements:

- short;
- memorable enough;
- neutral enough for future related tools;
- not trademark-conflicting;
- ideally `.com` if reasonably available;
- no hyphen-heavy keyword stuffing;
- no disposable-looking exact-match spam name.

Domain does **not** need to be perfect before implementation.

It is a pre-production decision, not a coding blocker.

---

# 23. Brand naming decision

Working product name:

```text
Compare Lists
```

This may remain visible product name even if domain differs.

Do not block launch by searching for a startup-style brand for weeks.

The tool’s task should remain obvious in:

```text
title
H1
page copy
```

regardless of brand/domain.

---

# 24. Hosting decision

Hosting requirements are simple:

- HTTPS;
- custom domain;
- Next-compatible or static output support;
- reliable global CDN;
- redirects;
- headers;
- environment variables;
- preview deployments;
- low/no cost at MVP traffic.

Hosting vendor is chosen before production.

Architecture intentionally does not depend on one provider.

---

# 25. Production configuration

Centralize:

```text
SITE_URL
analytics enabled
ads enabled
```

Production build must use final canonical origin.

Before launch verify:

```text
https
canonical hostname
redirects
robots
sitemap URLs
Open Graph URL
```

No preview hostname may appear in production metadata.

---

# 26. Production release checklist

## Functional

- [ ] paste A/B works;
- [ ] live comparison;
- [ ] options;
- [ ] swap;
- [ ] clear;
- [ ] example;
- [ ] result tabs;
- [ ] copy;
- [ ] download.

## SEO

- [ ] title;
- [ ] description;
- [ ] H1;
- [ ] canonical;
- [ ] robots;
- [ ] sitemap;
- [ ] About;
- [ ] Privacy;
- [ ] 404;
- [ ] OG;
- [ ] production hostname.

## Privacy

- [ ] no raw data network requests;
- [ ] analytics safe;
- [ ] no storage;
- [ ] no replay.

## Quality

- [ ] lint;
- [ ] typecheck;
- [ ] tests;
- [ ] build;
- [ ] desktop;
- [ ] mobile;
- [ ] keyboard;
- [ ] accessibility;
- [ ] large-input test.

---

# 27. Search Console setup

Immediately after production deployment:

```text
1. Add/verify domain property
2. Submit sitemap
3. Inspect homepage
4. Confirm URL is indexable
5. Check Google-selected canonical
6. Request indexing if appropriate
```

Do not assume successful deploy means successful indexation.

---

# 28. Analytics activation

Production analytics can be activated at launch if:

- provider selected;
- privacy behavior understood;
- events tested;
- no raw input collected.

If provider selection is not ready:

> launch should not be delayed solely because product analytics is absent.

Search Console + basic traffic data can start the SEO experiment.

Architecture already supports adding provider shortly after.

---

# 29. Ads at launch

Ads remain:

```text
OFF
```

Reasons:

- no traffic to monetize yet;
- no need to complicate privacy/consent;
- no need to harm first UX;
- ad network moderation may require real audience;
- acquisition hypothesis must be validated first.

`AdSlot` abstraction may exist, but should render nothing.

---

# 30. Day 0

Production deploy.

Verify manually:

```text
domain
HTTPS
redirects
HTML
tool
mobile
robots
sitemap
canonical
network requests
analytics
```

Save a launch baseline:

```text
launch date
page title
H1
content state
build version
```

---

# 31. Week 1

Primary focus:

```text
technical correctness
indexation
```

Check:

- Google discovered page;
- sitemap processed;
- canonical correct;
- no accidental noindex;
- no crawl block;
- no runtime errors;
- real users can use tool.

Do not panic about rankings.

Do not rewrite title/content daily.

---

# 32. Weeks 2–4

Observe:

```text
impressions
queries
countries
position buckets
tool starts
comparison completions
```

Questions:

```text
Does Google understand the page?
Which query variants appear?
Any unexpected intent?
Any UX friction?
```

Only fix clear problems.

---

# 33. 30-day checkpoint

### Technical gate

```text
indexed?
canonical correct?
no blocking issue?
```

### Search gate

```text
non-brand impressions?
relevant queries?
```

### Product gate

```text
real users using tool?
```

Possible outcomes:

## A. Indexed + impressions appearing

Continue.

## B. Indexed + zero/near-zero visibility

Review relevance, content, links, SERP competitiveness.

## C. Not indexed correctly

Fix technical issue before judging product hypothesis.

---

# 34. Days 30–60

Main work:

```text
Search Console-driven iteration
```

Potential actions:

- improve snippet if CTR weak;
- clarify copy if wrong intent appears;
- strengthen relevant use cases;
- improve UX if clicks do not become tool usage;
- begin careful link acquisition;
- fix performance issues from real usage.

Do not create ten new tools.

---

# 35. Link acquisition phase

Start only after production page is genuinely useful.

Priorities:

```text
contextual useful links
resource pages
articles where list comparison solves a real task
relevant communities/directories
```

Avoid:

```text
PBN
bulk backlink packages
spam comments
fake profiles
mass low-quality directories
```

Goal is not backlink count.

Goal is relevant authority and discovery.

---

# 36. 60-day checkpoint

Review:

```text
impressions trend
query growth
position distribution
clicks
tool usage
completion
countries
```

Strong positive signal:

```text
more relevant queries
+
some queries moving toward page 1
+
real tool use
```

Weak signal:

```text
indexation healthy
but positions stagnate far from useful range
```

Then decide whether to improve relevance/links or lower priority.

---

# 37. Spanish gate

Spanish implementation can begin when:

- English core technically stable;
- no critical indexing issue;
- tool UX proven;
- maintaining Spanish will not block core iteration.

It does **not** require English to already rank top 10.

But it should not be used as a distraction from a broken English launch.

Future:

```text
/es/comparar-listas
```

---

# 38. Instagram gate

Instagram feature can begin when:

- generic engine is stable;
- product architecture proven;
- separate workflow can be implemented without compromising generic tool;
- demand still looks attractive.

It should use official export files, local processing, no login/scraping.

Potential:

```text
/instagram-followers
```

Final route/title require fresh keyword/SERP validation before implementation.

---

# 39. Monetization gate

Ads become worth implementing when there is enough real traffic to measure.

Trigger is not a magic number.

Need:

```text
meaningful recurring pageviews
+
stable UX
+
analytics
+
network availability
```

Then:

```text
YAN baseline
vs
alternative eligible network
```

Measure:

```text
fill rate
page RPM
country mix
viewability
UX impact
```

Do not hardwire one provider.

---

# 40. 90-day decision framework

## GREEN — Grow

Signals:

- relevant impressions increasing;
- query footprint expanding;
- positions improving;
- first meaningful clicks;
- real tool usage;
- some long-tail approaching/entering first page.

Actions:

```text
continue core SEO
Spanish
Instagram
careful backlinks
prepare monetization
```

---

## YELLOW — Iterate

Signals:

- Google clearly understands page;
- impressions exist;
- some clicks/use;
- positions weak/stagnant;
- opportunity still plausible.

Actions:

- improve content relevance;
- improve snippet;
- strengthen trust/use cases;
- improve link profile;
- improve UX where data shows friction.

Run another focused observation cycle.

---

## RED — Stop / change hypothesis

Signals:

- technically healthy indexation;
- enough observation time;
- relevant queries remain negligible;
- positions show no useful movement;
- no meaningful organic users;
- no evidence that iteration is improving trend.

Actions:

```text
do not build 20 adjacent tools
do not keep polishing indefinitely
archive learnings
choose next utility hypothesis
```

---

# 41. What does NOT count as success

Not enough:

```text
site is indexed
some impressions exist
average position is 60
design looks nice
Lighthouse score is good
```

These are intermediate signals.

Business-relevant path:

```text
visibility
→ rankings
→ clicks
→ usage
→ repeatable traffic
→ monetization
```

---

# 42. What does NOT count as failure

Also not enough to kill project:

```text
no top-10 ranking after 2 weeks
low traffic immediately after launch
head keyword ranks poorly while long-tail is emerging
```

A new domain needs observation before judgment.

Decisions use trends and technical context.

---

# 43. Change discipline

After launch, avoid simultaneous broad changes.

Bad:

```text
new H1
new title
new layout
new content
new domain
new result semantics
all at once
```

Good:

```text
identify one bottleneck
→ change one coherent area
→ record date
→ observe
```

This does not require a formal experimentation platform.

It requires discipline.

---

# 44. Release log

Maintain lightweight log:

```text
YYYY-MM-DD
- production launch
- title changed
- copy changed
- Spanish launched
- Instagram launched
- ads enabled
```

This helps explain Search Console trends later.

---

# 45. Agent implementation contract

Before coding, agent must read:

```text
PRODUCT.md
UX.md
DESIGN.md
SEO.md
ARCHITECTURE.md
ANALYTICS.md
LAUNCH_PLAN.md
```

Agent must not:

- redesign approved UX;
- add libraries without need;
- add backend;
- add persistence;
- add SEO pages;
- add ads early;
- add features from future phases;
- reinterpret multiset semantics;
- collect raw user content;
- replace visual direction with generic component-kit defaults.

---

# 46. Definition of MVP done

MVP is done when:

```text
the smallest credible production tool
```

meets:

- product acceptance criteria;
- UX acceptance criteria;
- design acceptance criteria;
- SEO launch checklist;
- architecture acceptance criteria;
- analytics privacy criteria;
- production deployment checklist.

Not when every future idea is implemented.

---

# 47. Decisions required from the owner

Most product/design/architecture decisions are already fixed.

Before implementation begins, only small operational decisions are needed.

## Decision A — Repository

Need:

```text
new repository name
```

Recommended working name:

```text
compare-lists
```

or a future brand name if one is already chosen.

This is not a blocker for product design.

## Decision B — Package manager

Choose one:

```text
npm
pnpm
```

Recommendation:

```text
pnpm
```

if there is no existing project standard.

## Decision C — Hosting

Can be decided near production.

Need a host satisfying section 24.

No need to decide before domain engine implementation.

## Decision D — Domain

Needed before production SEO configuration.

Not needed before coding.

## Decision E — Analytics provider

Needed before product analytics activation.

Not a launch blocker if Search Console is configured.

---

# 48. Recommended immediate next action

Now that all pre-development documents are complete:

```text
1. create repository
2. copy specification files
3. create AGENTS.md / coding-agent brief
4. bootstrap Next.js project
5. execute implementation Phase A
```

The next document worth creating is therefore not another product specification.

It is:

```text
AGENTS.md
```

It should compress the seven source documents into strict operational instructions for the coding agent:

- mandatory reading order;
- architecture boundaries;
- forbidden dependencies;
- UX rules;
- design anti-slop rules;
- privacy constraints;
- required scripts;
- PR workflow;
- definition of done.
