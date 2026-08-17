# PERFORMANCE_PRIVACY_EVIDENCE

Evidence collected for the production Astro build. Evidence only: no production
code, options or dependencies were changed in this task.

## Measurement date and tested commit

- Date: 2026-08-16
- Tested commit: `5cb1986` on `main`-based
  `task/cl-033-performance-privacy-evidence`, built from base `fa82c40`
- Build: `pnpm build` (4 pages, ~0.8s)

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
  away. Every timed call returns its value and the clock stops before the
  value is consumed by a checksum assertion, so the assertions always derive
  from the outputs of the actual measured calls: parsed item counts, exact
  equality of the measured `CompareResult.stats` and `union`/`differences`
  lengths with the independently computed expectation, exact equality of the
  measured formatted text with the expected text, rendered length and blob
  size equality.

## Measured results (median ms)

| rows | parse | compare | format | render | copy-prep | download-prep |
| --- | --- | --- | --- | --- | --- | --- |
| 1,000 | 0.335 | 1.030 | 0.140 | 4.300 | 1.346 | 1.241 |
| 10,000 | 1.522 | 8.769 | 0.608 | 27.600 | 6.514 | 9.772 |
| 100,000 | 14.665 | 195.155 | 5.534 | 350.100 | 209.045 | 198.246 |

Checksums (all asserted): `onlyA = onlyB = matches = N/2`,
`union = 1.5 * N`, `differences = N`, and
`textLen = renderLen = blobSize` (13,030 / 130,030 / 1,300,030 characters for
1k / 10k / 100k).

## Measurement boundaries

- The pure-function phases run in Node (V8), the DOM phases in Chromium (V8).
  The phase-6 total composes per-iteration Node and page measurements, and the
  Blob step always receives the exact formatted text produced by the same
  measured iteration; Playwright transport into the page stays outside the
  page timer.
- The public `compareLists` API includes parsing, so the parse (phase 1) and
  compare (phase 2) measurements overlap by design.
- OS clipboard write, save dialog and filesystem write are excluded, as are
  data transfers into the page.
- The interactive product calls synchronous `recompute()` on every input
  event (`src/scripts/compare-tool.ts`), which is why the separate compare and
  render medians matter for the editing path; this is discussed in the
  conclusion.
- One machine only: no universal performance guarantee is claimed.
- There are no timing thresholds or timing assertions; correctness is always
  asserted.

## Privacy checklist

| Claim | Automated evidence |
| --- | --- |
| List content is rendered as text only | `e2e/privacy-security.spec.ts`: the marker appears in the result viewer as text; `[data-cl033-probe]` count is 0; `window.__cl033Probe` stays undefined |
| No network leakage | spec captures every request and body, before reload and after the complete reload/benign-comparison flow; neither URLs nor bodies contain the marker or its stable `cl033-probe` token |
| No URL leakage | `page.url()` never contains the marker or its token |
| No storage leakage | `localStorage`, `sessionStorage`, cookies and context cookies never contain the marker or its token, before reload and after the complete reload/benign-comparison flow |
| No console/error leakage | all console messages and page errors are captured, before reload and after the complete reload/benign-comparison flow, and never contain the marker or its stable `cl033-probe` token |
| No state persistence | after selecting a non-default tab and reloading, both textareas are empty |
| Default Differences tab after a benign comparison | asserted after the reload |
| Raw content never serialized into analytics events | existing Vitest integration test `src/scripts/__tests__/compare-tool.test.ts` ("never serializes raw content or forbidden fields into any event") |
| Production analytics boundary (noop) | `src/features/analytics/lib/analytics.test.ts` ("selects the default adapter by mode": production mode returns `NoopAnalytics`) |

The reserved production origin is unchanged; real-domain configuration belongs
to CL-035/CL-036.

## Conclusion

At 100k rows rendering is the heaviest measured operation (~350 ms), followed
by compare (~195 ms) and copy/download preparation (~198–209 ms). The product
runs synchronous `recompute()` on every input event, so the sum of the
separate 100k compare and render medians (~545 ms on this machine) indicates a
noticeable main-thread blocking risk when editing an already-large input.
Typical list sizes stay comfortably responsive (the 10k compare + render sum
is ~36 ms). The privacy E2E scenario passes on both desktop and mobile
projects, and no leakage channel was found.

## Follow-up recommendation

Implemented in CL-033F as an evidence-driven decision based on the measured
~545 ms 100k compare+render median sum: the tool now coalesces rapid input
events for the large-input class.

- Fixed threshold: combined raw length of List A and List B of 500,000
  characters or more (allocation-free length check, no splitting, parsing or
  scanning to decide).
- Fixed delay: 200 ms after the latest input event.
- Normal inputs (below the threshold) remain fully synchronous with no added
  delay.
- Bursts of large inputs are coalesced: raw state updates immediately on every
  input event, the previous pending recompute timer is cancelled, and exactly
  one recompute runs 200 ms after the last event, emitting
  `comparison_completed` from that fresh result through the existing analytics
  boundary.
- Immediate actions (option changes, Clear, Swap, Load example, result-tab
  changes) cancel or flush the pending large-input timer before their
  synchronous recompute, so no stale output can apply afterward; when a
  pending large-input recompute is flushed (for example by a result-tab
  selection), `comparison_completed` is scheduled from that exact fresh
  result, and an ordinary action with no pending input schedules no extra
  completion.
- Automated coverage: 9 new fake-timer tests in
  `src/scripts/__tests__/compare-tool.test.ts` (synchronous normal input,
  no render before 200 ms, window reset with only the final value rendered,
  crossing back below the threshold, immediate-action cancellation, tab-flush
  completion from the fresh result, once-only `tool_used` plus a single
  `comparison_completed` from the final result, double-mount safety).

Remaining limitation: one final 100k recompute/render can still be a noticeable
main-thread task (the debounce only reduces how often it runs).

Worker, manual Compare mode and viewer virtualization remain out of scope
unless protected-preview validation proves another change is necessary. A
re-run on a second, slower machine would strengthen the evidence before
release.