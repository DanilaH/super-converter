import { expect, test } from "@playwright/test";
import { compareLists } from "../src/features/compare-lists/lib/compare-lists";
import { formatResult } from "../src/features/compare-lists/lib/format-result";
import { parseList } from "../src/features/compare-lists/lib/parse-list";
import { DEFAULT_COMPARE_OPTIONS } from "../src/features/compare-lists/model/defaults";

// Fixed, documented methodology: deterministic datasets with a 50% overlap,
// current default comparison options, 2 warm-up runs and 5 measured
// iterations, median of the measured iterations in milliseconds.
//
// Every timed call returns its value; the clock stops before the value is
// consumed by a checksum assertion, so the assertions always derive from the
// outputs of the actual measured calls.
const ROW_SIZES = [1_000, 10_000, 100_000] as const;
const OVERLAP = 0.5;
const WARM_UP = 2;
const ITERATIONS = 5;
const RESULT_TYPE = "differences";

function pad(value: number): string {
  return String(value).padStart(6, "0");
}

function buildDatasets(rows: number): { rawA: string; rawB: string } {
  const a = Array.from({ length: rows }, (_, i) => `item-${pad(i)}`);
  const b = [
    ...a.slice(0, rows * OVERLAP),
    ...Array.from(
      { length: rows * (1 - OVERLAP) },
      (_, i) => `item-x-${pad(i)}`,
    ),
  ];
  return { rawA: a.join("\n"), rawB: b.join("\n") };
}

function median(samples: number[]): number {
  const sorted = [...samples].sort((x, y) => x - y);
  return sorted[Math.floor(sorted.length / 2)];
}

function timedCall<T>(fn: () => T): { ms: number; value: T } {
  const start = performance.now();
  const value = fn();
  return { ms: performance.now() - start, value };
}

function measure<T>(fn: () => T, check: (value: T) => void): number[] {
  for (let i = 0; i < WARM_UP; i += 1) {
    check(timedCall(fn).value);
  }
  const samples: number[] = [];
  for (let i = 0; i < ITERATIONS; i += 1) {
    const { ms, value } = timedCall(fn);
    check(value);
    samples.push(ms);
  }
  return samples;
}

async function sampleAsync(fn: () => Promise<number>): Promise<number[]> {
  const samples: number[] = [];
  for (let i = 0; i < ITERATIONS; i += 1) {
    samples.push(await fn());
  }
  return samples;
}

test("performance evidence: 1k, 10k and 100k rows against the production build", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByLabel("List A").fill("probe");
  const viewer = page.locator("[data-result-viewer]");
  await expect(viewer).toBeVisible();

  const tableRows: string[] = [];
  const checksumRows: string[] = [];

  for (const rows of ROW_SIZES) {
    const { rawA, rawB } = buildDatasets(rows);

    const expected = compareLists(rawA, rawB, DEFAULT_COMPARE_OPTIONS);
    const expectedText = formatResult(expected, RESULT_TYPE).text;
    expect(expected.stats).toEqual({
      rowsA: rows,
      rowsB: rows,
      uniqueA: rows,
      uniqueB: rows,
      onlyA: rows * OVERLAP,
      onlyB: rows * OVERLAP,
      matches: rows * OVERLAP,
    });
    expect(expected.union.length).toBe(rows * (2 - OVERLAP));
    expect(expected.differences.length).toBe(rows);
    expect(expectedText.startsWith("ONLY IN LIST A")).toBe(true);
    expect(expectedText).toContain("ONLY IN LIST B");

    const parseOptions = {
      trimWhitespace: DEFAULT_COMPARE_OPTIONS.trimWhitespace,
      ignoreEmptyLines: DEFAULT_COMPARE_OPTIONS.ignoreEmptyLines,
      ignoreCase: DEFAULT_COMPARE_OPTIONS.ignoreCase,
    };

    // Phase 1: parse both lists. Each measured call returns the parsed items;
    // their lengths are asserted after the clock stops.
    const parseMs = median(
      measure(
        () => {
          const a = parseList(rawA, parseOptions);
          const b = parseList(rawB, parseOptions);
          return { aLen: a.length, bLen: b.length };
        },
        (parsed) => {
          expect(parsed.aLen).toBe(rows);
          expect(parsed.bLen).toBe(rows);
        },
      ),
    );

    // Phase 2: public compareLists. The public API includes parsing, so the
    // parse and compare measurements overlap by design. The measured result
    // must match the separately computed expectation exactly.
    const compareMs = median(
      measure(
        () => compareLists(rawA, rawB, DEFAULT_COMPARE_OPTIONS),
        (result) => {
          expect(result.stats).toEqual(expected.stats);
          expect(result.union.length).toBe(expected.union.length);
          expect(result.differences.length).toBe(expected.differences.length);
        },
      ),
    );

    // Phase 3: format a precomputed result. The measured text must equal the
    // expected formatted text exactly.
    const formatMs = median(
      measure(
        () => formatResult(expected, RESULT_TYPE).text,
        (text) => {
          expect(text).toBe(expectedText);
        },
      ),
    );

    // Phase 4: render the formatted text into the real result viewer through
    // textContent, then force a layout read (scrollHeight). The length check
    // runs outside the page timer.
    let renderLength = 0;
    for (let i = 0; i < WARM_UP; i += 1) {
      await page.evaluate((text) => {
        const el = document.querySelector<HTMLPreElement>(
          "[data-result-viewer]",
        );
        if (el === null) {
          throw new Error("result viewer not found");
        }
        el.textContent = text;
        void el.scrollHeight;
      }, expectedText);
    }
    const renderMs = median(
      await sampleAsync(async () => {
        const rendered = await page.evaluate((text) => {
          const start = performance.now();
          const el = document.querySelector<HTMLPreElement>(
            "[data-result-viewer]",
          );
          if (el === null) {
            throw new Error("result viewer not found");
          }
          el.textContent = text;
          void el.scrollHeight;
          return {
            length: el.textContent.length,
            ms: performance.now() - start,
          };
        }, expectedText);
        renderLength = rendered.length;
        expect(renderLength).toBe(expectedText.length);
        return rendered.ms;
      }),
    );

    // Phase 5: prepare copy output (compare + format, no OS clipboard write).
    // The measured text must equal the expected formatted text exactly.
    const copyMs = median(
      measure(
        () =>
          formatResult(
            compareLists(rawA, rawB, DEFAULT_COMPARE_OPTIONS),
            RESULT_TYPE,
          ).text,
        (text) => {
          expect(text).toBe(expectedText);
        },
      ),
    );

    // Phase 6: prepare download output (compare + format + Blob +
    // createObjectURL/revokeObjectURL), excluding the save dialog and
    // filesystem write. The pure compare/format part runs in Node (V8, same
    // engine family as Chromium); the Blob step receives the exact formatted
    // text produced by the same measured iteration, and Playwright transport
    // stays outside the page timer. Per-iteration sums form the sample.
    for (let i = 0; i < WARM_UP; i += 1) {
      const text = formatResult(
        compareLists(rawA, rawB, DEFAULT_COMPARE_OPTIONS),
        RESULT_TYPE,
      ).text;
      expect(text).toBe(expectedText);
      await page.evaluate((t) => {
        const blob = new Blob([t], { type: "text/plain" });
        URL.revokeObjectURL(URL.createObjectURL(blob));
      }, text);
    }
    let blobSize = 0;
    const downloadMs = median(
      await sampleAsync(async () => {
        const node = timedCall(() =>
          formatResult(
            compareLists(rawA, rawB, DEFAULT_COMPARE_OPTIONS),
            RESULT_TYPE,
          ).text,
        );
        expect(node.value).toBe(expectedText);
        const blob = await page.evaluate((text) => {
          const start = performance.now();
          const created = new Blob([text], { type: "text/plain" });
          const url = URL.createObjectURL(created);
          URL.revokeObjectURL(url);
          return { size: created.size, ms: performance.now() - start };
        }, node.value);
        expect(blob.size).toBe(node.value.length);
        blobSize = blob.size;
        return node.ms + blob.ms;
      }),
    );

    tableRows.push(
      [
        `| ${rows}`,
        `${parseMs.toFixed(3)}`,
        `${compareMs.toFixed(3)}`,
        `${formatMs.toFixed(3)}`,
        `${renderMs.toFixed(3)}`,
        `${copyMs.toFixed(3)}`,
        `${downloadMs.toFixed(3)} |`,
      ].join(" | "),
    );
    checksumRows.push(
      [
        `${rows} rows:`,
        `onlyA=${expected.stats.onlyA}`,
        `onlyB=${expected.stats.onlyB}`,
        `matches=${expected.stats.matches}`,
        `union=${expected.union.length}`,
        `differences=${expected.differences.length}`,
        `textLen=${expectedText.length}`,
        `renderLen=${renderLength}`,
        `blobSize=${blobSize}`,
      ].join(" "),
    );
  }

  console.log(
    "CL033 performance evidence | production build | default options | 50% overlap | warm-up " +
      `${WARM_UP} | iterations ${ITERATIONS} | median ms`,
  );
  console.log(
    "| rows | parse | compare | format | render | copy-prep | download-prep |",
  );
  console.log("|---|---|---|---|---|---|---|");
  for (const row of tableRows) {
    console.log(row);
  }
  console.log("checksums:");
  for (const row of checksumRows) {
    console.log(row);
  }
});
