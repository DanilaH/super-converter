# CL-040 Alphabetizer performance smoke

Measured 2026-08-30 against the pure `alphabetizeList()` domain implementation on the implementation worker runtime (Node 22.16.0).

This is algorithm evidence, not a browser responsiveness SLA. Browser interaction still requires preview/manual smoke.

## Method

- fixed English `Intl.Collator` configuration from the implementation;
- `Trim whitespace = ON`;
- `Ignore empty lines = ON`;
- A → Z order;
- descending synthetic `Item N` inputs;
- 2 warm-up runs + 5 measured runs per size;
- reported value is the median measured duration.

| Lines | Median | Observed measured range |
| ---: | ---: | ---: |
| 10 | 0.01 ms | 0.01–0.01 ms |
| 1,000 | 0.73 ms | 0.30–1.62 ms |
| 10,000 | 3.22 ms | 3.11–3.84 ms |
| 100,000 | 41.29 ms | 33.43–44.48 ms |

## Decision

No Web Worker or special large-input debounce is justified by the pure algorithm measurement in CL-040. Revisit only if browser/DOM measurements show a meaningful UI freeze.
