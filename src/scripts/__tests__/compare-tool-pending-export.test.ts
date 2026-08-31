import { fireEvent } from "@testing-library/dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { mountCompareTool } from "../compare-tool";

const TOOL_HTML = `
  <section
    data-compare-tool
    aria-labelledby="compare-tool-heading"
    data-label-row="row"
    data-label-rows="rows"
    data-label-item="item"
    data-label-items="items"
    data-label-no-differences="No differences found."
    data-label-same-values="Both lists contain the same values with the current comparison settings."
    data-label-no-matches="No matching values."
    data-label-copy="Copy"
    data-label-copied="Copied"
    data-label-copy-error="Couldn’t copy. Select the result manually."
    data-label-replace-example-confirmation="Load the example and replace both current lists? Your current input will be lost."
  >
    <h2 id="compare-tool-heading">Compare lists</h2>
    <textarea data-list-a></textarea>
    <output data-list-a-count></output>
    <button type="button" data-clear-list-a disabled>Clear A</button>
    <textarea data-list-b></textarea>
    <output data-list-b-count></output>
    <button type="button" data-clear-list-b disabled>Clear B</button>
    <button type="button" data-swap-lists disabled>Swap</button>
    <button type="button" data-load-example disabled>Load example</button>
    <input type="checkbox" data-option-trim-whitespace checked />
    <input type="checkbox" data-option-ignore-empty-lines checked />
    <input type="checkbox" data-option-ignore-case />
    <input type="checkbox" data-option-remove-duplicates checked />

    <section data-results hidden>
      <p data-empty-results></p>
      <dl data-summary hidden>
        <dd data-summary-only-a></dd>
        <dd data-summary-matches></dd>
        <dd data-summary-only-b></dd>
      </dl>
      <div role="tablist" data-result-tabs hidden>
        <button type="button" role="tab" id="tab-differences" aria-controls="result-panel" aria-selected="true" tabindex="0" data-result-tab="differences">Differences</button>
        <button type="button" role="tab" id="tab-only-a" aria-controls="result-panel" aria-selected="false" tabindex="-1" data-result-tab="onlyA">Only A</button>
        <button type="button" role="tab" id="tab-only-b" aria-controls="result-panel" aria-selected="false" tabindex="-1" data-result-tab="onlyB">Only B</button>
        <button type="button" role="tab" id="tab-matches" aria-controls="result-panel" aria-selected="false" tabindex="-1" data-result-tab="matches">Matches</button>
        <button type="button" role="tab" id="tab-all" aria-controls="result-panel" aria-selected="false" tabindex="-1" data-result-tab="all">All</button>
      </div>
      <div role="tabpanel" id="result-panel" aria-labelledby="tab-differences" data-result-panel hidden>
        <h3 data-result-heading>Differences</h3>
        <p data-result-count></p>
        <pre data-result-viewer></pre>
        <button type="button" data-copy-result disabled>Copy</button>
        <button type="button" data-download-result disabled>Download</button>
        <p data-local-feedback></p>
      </div>
    </section>
  </section>
`;

function hook<T extends HTMLElement>(
  container: HTMLElement,
  selector: string,
): T {
  const element = container.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Missing test hook ${selector}`);
  }
  return element;
}

function mountTool(): HTMLElement {
  const container = document.createElement("div");
  container.innerHTML = TOOL_HTML;
  document.body.appendChild(container);
  mountCompareTool(container);
  return container;
}

describe("CompareTool pending large-input export lifecycle", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    vi.useRealTimers();
    vi.restoreAllMocks();
    Reflect.deleteProperty(navigator, "clipboard");
  });

  it("keeps stale visible results non-exportable until the debounced recompute finishes", async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    const createObjectURL = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:pending-export");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    const container = mountTool();
    const listA = hook<HTMLTextAreaElement>(container, "[data-list-a]");
    const listB = hook<HTMLTextAreaElement>(container, "[data-list-b]");
    const viewer = hook(container, "[data-result-viewer]");
    const copy = hook<HTMLButtonElement>(container, "[data-copy-result]");
    const download = hook<HTMLButtonElement>(
      container,
      "[data-download-result]",
    );

    fireEvent.input(listA, { target: { value: "a\nb" } });
    fireEvent.input(listB, { target: { value: "b\nc" } });

    const previousVisibleResult = viewer.textContent;
    expect(previousVisibleResult).toBe(
      "ONLY IN LIST A\na\n\nONLY IN LIST B\nc",
    );
    expect(copy.disabled).toBe(false);
    expect(download.disabled).toBe(false);

    const large = "x".repeat(500_000);
    fireEvent.input(listA, { target: { value: large } });

    expect(viewer.textContent).toBe(previousVisibleResult);
    expect(copy.disabled).toBe(true);
    expect(download.disabled).toBe(true);

    copy.click();
    download.click();
    await Promise.resolve();
    expect(writeText).not.toHaveBeenCalled();
    expect(createObjectURL).not.toHaveBeenCalled();

    vi.advanceTimersByTime(199);
    expect(viewer.textContent).toBe(previousVisibleResult);
    expect(copy.disabled).toBe(true);
    expect(download.disabled).toBe(true);

    vi.advanceTimersByTime(1);
    expect(viewer.textContent).toContain(large);
    expect(copy.disabled).toBe(false);
    expect(download.disabled).toBe(false);

    fireEvent.click(copy);
    await Promise.resolve();
    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText.mock.calls[0]?.[0]).toContain(large);

    fireEvent.click(download);
    expect(createObjectURL).toHaveBeenCalledTimes(1);
  });
});
