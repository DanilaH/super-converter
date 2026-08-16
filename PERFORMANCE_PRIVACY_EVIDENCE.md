# PERFORMANCE_PRIVACY_EVIDENCE

Evidence collected for the production Astro build. Evidence only: no production
code, options or dependencies were changed in this task.

## Measurement date and tested commit

- Date: 2026-08-16
- Tested commit: `613730b` on `main`-based `task/cl-033-performance-privacy-evidence`, built from base `fa82c40`
- Build: `pnpm build` (4 pages, ~0.6s)

## Environment

| Item | Version |
| --- | --- |
| OS | Windows 11 (build 10.0.28000) |
| CPU | AMD Ryzen 5 4600H (6 cores / 12 threads) |
| Node | v24.14.0 |
| pnpm | 11.10.0 |
| @playwright/test | 1.62.1 |
| Chromium | Chrome for Testing 151.0.7922.34 (chromium v1234) |

## Exact commands

```bash
pnpm build
pnpm evidence:performance
pnpm test:e2e
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
git diff --check
```

## Performance methodology

- Deterministic datasets, one line per item: List A contains `item-000000` …
  `item-{N-1}`; List B contains the first `N/2` values of A followed by
  `item-x-000000` … `item-x-{N/2-1}`.
- Documented overlap: 50% of B's rows are shared with A.
- Options: current defaults (`DEFAULT_COMPARE_OPTIONS`:
  `trimWhitespace: true`, `ignoreEmptyLines: true`, `ignoreCase: false`,
  `removeDuplicates: true` — set semantics).
- Warm-up: 2 runs per phase per size. Measured iterations: 5.
- Reported value: median of the 5 measured iterations, in milliseconds.
- Phases:
  1. `parseList` for both lists (Node, V8);
  2. public `compareLists` (Node, V8);
  3. `formatResult` of a precomputed result (Node, V8);
  4. render the formatted text into the real result viewer (`textContent`)
     plus a forced layout read (`scrollHeight`) in the real Chromium page;
  5. copy output preparation: `compareLists` + `formatResult`, no OS clipboard
     write (Node, V8);
  6. download output preparation: `compareLists` + `formatResult` (Node, V8)
     + `Blob` + `URL.createObjectURL`/`revokeObjectURL` (Chromium page),
     no save dialog and no filesystem write; the phase-6 value is the sum of
     the Node and page components per iteration.
- Data transfer/setup (text into the page, `page.goto`, making the viewer
  visible) happens outside the timed regions.
- Correctness checks/checksums prevent the measured work from being optimized
  away: stats assertions, formatted text headers, rendered length and blob
  size equality.

## Measured results (median ms)

| rows | parse | compare | format | render | copy-prep | download-prep |
| --- | --- | --- | --- | --- | --- | --- |
| 1,000 | 0.253 | 1.690 | 0.084 | 2.900 | 1.216 | 1.391 |
| 10,000 | 1.321 | 6.846 | 0.325 | 26.200 | 8.278 | 9.275 |
| 100,000 | 14.678 | 142.139 | 4.210 | 286.700 | 177.597 | 201.532 |

Checksums (all asserted): `onlyA = onlyB = matches = N/2`,
`union = 1.5 * N`, `differences = N`, and
`textLen = renderLen = blobSize` (13,030 / 130,030 / 1,300,030 characters for
1k / 10k / 100k).

## Measurement boundaries

- The pure-function phases run in Node (V8), the DOM phases in Chromium (V8).
  The phase-6 total composes per-iteration Node and page measurements.
- The public `compareLists` API includes parsing, so the parse (phase 1) and
  compare (phase 2) measurements overlap by design.
- OS clipboard write, save dialog and filesystem write are excluded, as are
  data transfers into the page.
- One machine only: no universal performance guarantee is claimed.
- There are no timing thresholds or timing assertions; correctness is always
  asserted.

## Privacy checklist

| Claim | Automated evidence |
| --- | --- |
| List content is rendered as text only | `e2e/privacy-security.spec.ts`: the marker appears in the result viewer as text; `[data-cl033-probe]` count is 0; `window.__cl033Probe` stays undefined |
| No network leakage | spec captures every request and body; neither URLs nor bodies contain the marker |
| No URL leakage | `page.url()` never contains the marker |
| No storage leakage | `localStorage`, `sessionStorage`, cookies and context cookies never contain the marker |
| No console/error leakage | all console messages and page errors are captured and never contain the marker |
| No state persistence | after selecting a non-default tab and reloading, both textareas are empty |
| Default Differences tab after a benign comparison | asserted after the reload |
| Analytics boundary | existing Vitest coverage `src/features/analytics/lib/analytics.test.ts` verifies the raw-marker analytics boundary; the production analytics adapter is a noop, so no raw content can leave the page through analytics |

The reserved production origin is unchanged; real-domain configuration belongs
to CL-035/CL-036.

## Conclusion

At 100k rows the heaviest measured operation is rendering (~287 ms), followed
by the full comparison (~142 ms) and copy/download preparation (~178–202 ms);
a full one-shot recompute (compare + render) stays under ~450 ms on this
machine. At 10k rows the same pipeline is ~33 ms. Interactive live updates
remain comfortably responsive for typical list sizes, and the 100k worst case
remains a one-shot operation (paste or example load), not a per-keystroke one.

## Follow-up recommendation

No optimization is warranted from this evidence alone. If 100k-row live typing
ever becomes a real workflow, a Worker or input debounce would be a separate
follow-up task; both are out of scope here. A re-run on a second, slower
machine would strengthen the evidence before release.