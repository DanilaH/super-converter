# Final pre-production release audit

Audit package: CL-036A  
Audit date: 2026-08-26  
Audited baseline: `73645957b72e9bfce93cb1167846bb864065d3c2`  
Target production origin: `https://listcontrast.com`

## Decision

**Conditional GO for the separate production-cutover package.**

The accepted protected preview is suitable for production cutover. No
application-level release blocker was found in the audited evidence.

This is not a statement that production is already live. The current build
intentionally uses `https://example.com`, remains non-indexable, and only has
an isolated preview Compose service. Production origin, production container,
public Caddy/DNS configuration and live post-deploy verification are mandatory
cutover work and must remain outside this audit PR.

## Evidence types

- **Automated**: repository tests, CI, Playwright and recorded performance
  evidence.
- **Source/config inspection**: current accepted files at the audited commit.
- **Owner manual**: observations from the protected VPS preview, explicitly
  labelled below.

No authenticated live request was performed by the audit author. Real preview
credentials are not repository artifacts and were not used.

## Gate summary

| Gate | Result | Evidence |
| --- | --- | --- |
| Functional behavior | PASS | Unit/DOM tests cover comparison semantics, options, states, tabs, Clear, Swap, example, Copy and Download. Playwright smoke covers the main flow on desktop and mobile Chromium. Owner manually confirmed the deployed comparison and result actions. |
| Static pages and routing | PASS | Astro static build is part of CI. nginx serves the generated directory routes and custom 404. Owner manually observed `200` for `/`, `/about`, `/privacy` and `404` for an unknown path. |
| SEO before cutover | PASS | One validated Astro `site` source drives canonical/Open Graph/sitemap URLs. The reserved origin triggers page `noindex,nofollow`; placeholder robots disallows all crawling. The preview ingress adds `X-Robots-Tag: noindex, nofollow, noarchive`. |
| SEO production readiness | CONDITIONAL | The source is ready to derive indexable output after replacing the single origin. Cutover must set `https://listcontrast.com`, verify canonical/Open Graph/robots/sitemap output, prevent preview-host leakage and keep 404 non-indexable. |
| Privacy and injection safety | PASS | Raw lists remain current-tab memory only. Privacy E2E verifies no marker leakage into requests, URL, storage, cookies, console or page errors and verifies text rendering without HTML execution. Analytics tests reject raw content; production adapter is noop. |
| Accessibility | PASS | Semantic labels, native controls, ARIA tabs, keyboard tab navigation, visible focus and live feedback are implemented. The DOM suite includes an axe check with no supported-rule violations. |
| Responsive behavior | PASS WITH LIMITATION | The tool stacks on narrow screens, uses a two-column desktop layout and 44 px coarse-pointer targets. Playwright runs desktop and mobile Chromium projects. No separate Firefox/WebKit run is part of the accepted scope. |
| Performance | PASS WITH LIMITATION | Recorded medians remain responsive through 10k rows. At 100k rows, compare plus render measured about 545 ms on the evidence machine; CL-033F added a bounded 200 ms large-input debounce. One final 100k render may still be noticeable. |
| Visual/product scope | PASS | The deployed owner-reviewed page follows the approved neutral utility direction. No UI framework, SaaS shell, account flow, backend, ads, dark mode or unrelated feature expansion is present. |
| Runtime architecture | PASS | Multi-stage build produces static files served by nginx. Runtime contains no Node application server, backend, database or application secrets. The preview publishes no host port and is reachable only through the shared Docker network. |
| Preview ingress | PASS | Owner manually confirmed DNS/HTTPS, `401` without Basic Auth, `200` with valid Basic Auth and the noindex response header. Existing Caddy owns public TLS and is outside this repository. |
| Deployment and rollback | PASS FOR PREVIEW | The runbook documents bounded deploy, internal/public verification, update, logs, rollback and removal commands that affect only the preview Compose project. |
| CI and build | PASS | PR #39 CI run 60 completed successfully: format, lint, typecheck, tests, build and the two-project Playwright smoke. The CL-036A PR must also be green before merge. |

## Functional acceptance

The following accepted behaviors have automated coverage or owner preview
evidence:

- one physical line per item;
- trim, ignore-empty, ignore-case and deduplication options;
- set and multiset semantics;
- Differences, Only A, Only B, Matches and All;
- stable ordering and raw display representations;
- live counters and summaries;
- exact raw Swap, per-list Clear and Load example;
- accessible result-tab navigation;
- local Copy and TXT Download;
- both-empty, no-differences and no-matches states;
- client-side state reset after reload;
- desktop and mobile Chromium smoke.

No open product defect is recorded by this audit.

## SEO and indexing acceptance

Current intentional pre-production behavior:

```text
Astro site: https://example.com
page robots: noindex,nofollow
robots.txt: Disallow: /
preview response: X-Robots-Tag noindex, nofollow, noarchive
```

Required cutover behavior:

```text
canonical origin: https://listcontrast.com
indexable routes: /, /about, /privacy
404: always noindex,nofollow and no canonical
robots.txt: Allow: / plus production sitemap URL
sitemap.xml: exactly the three indexable production URLs
preview hostname: absent from generated SEO output
www: redirect to the selected apex canonical origin
```

Search Console verification and sitemap submission happen only after the live
production checks pass.

## Privacy and security acceptance

Accepted evidence confirms:

- no backend receives list content;
- no list/result data enters URL or browser storage;
- output uses `textContent` rather than parsing user values as HTML;
- no session replay or production analytics provider is enabled;
- analytics contracts use enums, booleans and coarse size buckets only;
- Clipboard and Blob actions remain local browser operations;
- the container has no application secrets and no published host port;
- preview access is protected by HTTPS and Basic Auth.

Residual hardening items are not MVP release blockers:

- the runtime base image currently uses the moving `nginx:alpine` tag rather
  than a digest;
- automated browser smoke is Chromium-only;
- the shared Caddy and host security remain operational responsibilities
  outside this repository.

## Performance acceptance

Recorded median evidence:

| Rows | Parse | Compare | Format | Render | Copy preparation | Download preparation |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 1,000 | 0.335 ms | 1.030 ms | 0.140 ms | 4.300 ms | 1.346 ms | 1.241 ms |
| 10,000 | 1.522 ms | 8.769 ms | 0.608 ms | 27.600 ms | 6.514 ms | 9.772 ms |
| 100,000 | 14.665 ms | 195.155 ms | 5.534 ms | 350.100 ms | 209.045 ms | 198.246 ms |

These values come from one Windows/Chromium machine and are not universal
guarantees. The evidence contains no timing assertions. The accepted large-input
debounce reduces repeated heavy recomputes but does not make the final 100k
render instantaneous.

## Required production-cutover package

The follow-up package must remain bounded to release configuration and
operations:

1. replace the single Astro origin with `https://listcontrast.com`;
2. add a production Compose service/container separate from preview;
3. validate generated canonical, Open Graph, robots and sitemap output;
4. deploy the production container on the existing external Docker network;
5. configure apex DNS and the chosen `www` redirect;
6. add a public Caddy block without Basic Auth or noindex;
7. verify HTTPS, routes, 404, headers, assets and comparison actions live;
8. verify preview remains protected and non-indexable;
9. verify Search Console and submit `/sitemap.xml`;
10. record the deployed commit and rollback command.

The preview container and preview hostname must not be repurposed as production.

## Release stop conditions

Stop the cutover and roll back if any of these occurs:

- canonical, Open Graph or sitemap contains the placeholder or preview host;
- production robots or page metadata still blocks the three indexable routes;
- 404 returns `200` or becomes indexable;
- HTTPS or apex/`www` redirect is incorrect;
- production exposes nginx directly on a host port;
- preview loses Basic Auth or noindex protection;
- raw list content appears in a request, URL, storage or log;
- CI/build fails for the production-config commit;
- live comparison, Copy or Download fails.

## Final conclusion

The protected preview passes the pre-production product, quality, privacy and
deployment-readiness gates with the documented browser/performance limitations.
The project may proceed to a separate, reversible production cutover after this
audit PR is reviewed and merged.
