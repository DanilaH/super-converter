# CL-042 — Remove Duplicate Lines performance smoke

Focused pure-processing measurements for the approved Dedupe implementation. These measurements complement, but do not replace, browser/E2E verification.

## Environment

- Node.js 22.16.0
- implementation path: shared transform preprocessing → first-occurrence `Set` dedupe → LF serialization
- options: Trim whitespace ON, Ignore empty lines ON, Ignore case ON
- dataset intentionally contains repeated values so both preprocessing and duplicate-key checks execute
- 3 warm-up runs, then 9 measured samples per size

## Results

| Input lines | Median | Worst measured sample |
| ---: | ---: | ---: |
| 10 | 0.01 ms | 0.01 ms |
| 1,000 | 0.45 ms | 0.93 ms |
| 10,000 | 1.83 ms | 2.75 ms |
| 100,000 | 28.99 ms | 31.80 ms |

## Decision

The pure transformation is comfortably below a level that justifies adding a Web Worker or a special debounce path. Keep the current live-transform architecture and verify full browser/DOM behavior separately during the final local/browser gate.

This evidence does not claim identical timings across browsers or devices; it only supports the implementation decision not to add complexity without measured need.
