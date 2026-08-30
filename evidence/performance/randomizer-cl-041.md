# CL-041 Randomizer performance smoke

Date: 2026-08-30  
Environment: Node.js 22.16.0 in the implementation container.

This is a focused pure-processing smoke, not a browser performance certification. It measures the approved transform preprocessing + Fisher–Yates shuffle + LF serialization path with default `Trim whitespace = ON` and `Ignore empty lines = ON`.

For each size, the implementation received three warm-up runs followed by nine measured runs. The table reports the median and slowest measured sample.

| Lines | Median | Slowest sample |
|---:|---:|---:|
| 10 | 0.01 ms | 0.04 ms |
| 1,000 | 0.56 ms | 0.73 ms |
| 10,000 | 1.10 ms | 1.82 ms |
| 100,000 | 15.87 ms | 24.82 ms |

## Conclusion

The pure Randomizer path does not justify a Web Worker, special large-input debounce, or another runtime abstraction at this stage. Browser rendering and interaction still require normal E2E/manual verification because these Node measurements intentionally exclude textarea/DOM cost.

No timing threshold is used as a correctness test.
