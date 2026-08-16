import { expect, test } from "@playwright/test";
import { compareLists } from "../src/features/compare-lists/lib/compare-lists";
import { formatResult } from "../src/features/compare-lists/lib/format-result";
import { parseList } from "../src/features/compare-lists/lib/parse-list";
import { DEFAULT_COMPARE_OPTIONS } from "../src/features/compare-lists/model/defaults";

// Fixed, documented methodology: deterministic datasets with a 50% overlap,
// current default comparison options, 2 warm-up runs and 5 measured
// iterations, median of the measured iterations in milliseconds.
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

function timed(fn: () => void): number {
  const start = performance.now();
  fn();
  return performance.now() - start;
}

function sample(fn: () => void): number[] {
  for (let i = 0; i < WARM_UP; i += 1) {
    fn();
  }
  return Array.from({ length: ITERATIONS }, () => timed(fn));
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

    // Correctness checks/checksums: the measured work cannot be optimized away.
    const expected = compareLists(rawA, rawB, DEFAULT_COMPARE_OPTIONS);
    expect(expected.stats.rowsA).toBe(rows);
    expect(expected.stats.rowsB).toBe(rows);
    expect(expected.stats.uniqueA).toBe(rows);
    expect(expected.stats.uniqueB).toBe(rows);
    expect(expected.stats.onlyA).toBe(rows * OVERLAP);
    expect(expected.stats.onlyB).toBe(rows * OVERLAP);
    expect(expected.stats.matches).toBe(rows * OVERLAP);
    expect(expected.union.length).toBe(rows * (2 - OVERLAP));
    expect(expected.differences.length).toBe(rows);
    const expectedText = formatResult(expected, RESULT_TYPE).text;
    expect(expectedText.startsWith("ONLY IN LIST A")).toBe(true);
    expect(expectedText).toContain("ONLY IN LIST B");

    const parseOptions = {
      trimWhitespace: DEFAULT_COMPARE_OPTIONS.trimWhitespace,
      ignoreEmptyLines: DEFAULT_COMPARE_OPTIONS.ignoreEmptyLines,
      ignoreCase: DEFAULT_COMPARE_OPTIONS.ignoreCase,
    };

    // Phase 1: parse both lists.
    const parseMs = median(
      sample(() => {
        parseList(rawA, parseOptions);
        parseList(rawB, parseOptions);
      }),
    );

    // Phase 2: public compareLists. The public API includes parsing, so the
    // parse and compare measurements overlap by design.
    const compareMs = median(
      sample(() => {
        compareLists(rawA, rawB, DEFAULT_COMPARE_OPTIONS);
      }),
    );

    // Phase 3: format a precomputed result.
    const formatMs = median(
      sample(() => {
        formatResult(expected, RESULT_TYPE);
      }),
    );

    // Phase 4: render the formatted text into the real result viewer through
    // textContent, then force a layout read (scrollHeight).
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
    const copyMs = median(
      sample(() => {
        formatResult(
          compareLists(rawA, rawB, DEFAULT_COMPARE_OPTIONS),
          RESULT_TYPE,
        );
      }),
    );

    // Phase 6: prepare download output (compare + format + Blob +
    // createObjectURL/revokeObjectURL), excluding the save dialog and
    // filesystem write. The pure compare/format part runs in Node (V8, same
    // engine family as Chromium); Blob and URL.createObjectURL are browser
    // APIs and run in the real page. Per-iteration sums form the sample.
    for (let i = 0; i < WARM_UP; i += 1) {
      formatResult(
        compareLists(rawA, rawB, DEFAULT_COMPARE_OPTIONS),
        RESULT_TYPE,
      );
      await page.evaluate((text) => {
        const blob = new Blob([text], { type: "text/plain" });
        URL.revokeObjectURL(URL.createObjectURL(blob));
      }, expectedText);
    }
    let blobSize = 0;
    const downloadMs = median(
      await sampleAsync(async () => {
        const nodeMs = timed(() => {
          formatResult(
            compareLists(rawA, rawB, DEFAULT_COMPARE_OPTIONS),
            RESULT_TYPE,
          );
        });
        const blobResult = await page.evaluate((text) => {
          const start = performance.now();
          const blob = new Blob([text], { type: "text/plain" });
          const url = URL.createObjectURL(blob);
          URL.revokeObjectURL(url);
          return { size: blob.size, ms: performance.now() - start };
        }, expectedText);
        expect(blobResult.size).toBe(expectedText.length);
        blobSize = blobResult.size;
        return nodeMs + blobResult.ms;
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
