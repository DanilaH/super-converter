import { fireEvent } from "@testing-library/dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { mountAlphabetizeTool } from "../alphabetize-tool";
import { mountCompareTool } from "../compare-tool";

const COMPARE_HTML = `
<section
  data-compare-tool
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
  data-label-replace-example-confirmation="Replace current lists?"
>
  <textarea data-list-a></textarea>
  <textarea data-list-b></textarea>
  <output data-list-a-count>0 rows</output>
  <output data-list-b-count>0 rows</output>
  <button data-clear-list-a disabled>Clear A</button>
  <button data-clear-list-b disabled>Clear B</button>
  <button data-swap-lists disabled>Swap</button>
  <button data-load-example disabled>Try example</button>
  <input type="checkbox" data-option-trim-whitespace checked />
  <input type="checkbox" data-option-ignore-empty-lines checked />
  <input type="checkbox" data-option-ignore-case />
  <input type="checkbox" data-option-remove-duplicates checked />
  <section data-results hidden>
    <p data-empty-results></p>
    <dl data-summary hidden>
      <dd data-summary-only-a>0</dd>
      <dd data-summary-matches>0</dd>
      <dd data-summary-only-b>0</dd>
    </dl>
    <div role="tablist" data-result-tabs hidden>
      <button id="tab-differences" role="tab" aria-selected="true" data-result-tab="differences">Differences</button>
      <button id="tab-only-a" role="tab" aria-selected="false" data-result-tab="onlyA">Only A</button>
      <button id="tab-only-b" role="tab" aria-selected="false" data-result-tab="onlyB">Only B</button>
      <button id="tab-matches" role="tab" aria-selected="false" data-result-tab="matches">Matches</button>
      <button id="tab-all" role="tab" aria-selected="false" data-result-tab="all">All</button>
    </div>
    <div data-result-panel hidden>
      <h4 data-result-heading>Differences</h4>
      <span data-result-count>0 items</span>
      <pre data-result-viewer></pre>
      <button data-copy-result disabled>Copy</button>
      <button data-download-result disabled>Download</button>
      <p data-local-feedback></p>
    </div>
  </section>
</section>`;

const ALPHABETIZE_HTML = `
<section
  data-alphabetize-tool
  data-label-item="item"
  data-label-items="items"
  data-label-empty-result="Paste a list."
  data-label-no-effective-items="No items remain."
  data-label-copy="Copy"
  data-label-copied="Copied"
  data-label-copy-error="Couldn’t copy."
  data-label-replace-example-confirmation="Replace current list?"
>
  <textarea data-list-input></textarea>
  <button data-clear-list disabled>Clear</button>
  <button data-load-example disabled>Try example</button>
  <input type="checkbox" data-option-trim-whitespace checked />
  <input type="checkbox" data-option-ignore-empty-lines checked />
  <select data-order><option value="asc" selected>A-Z</option><option value="desc">Z-A</option></select>
  <span data-result-count>0 items</span>
  <p data-empty-result></p>
  <pre data-result-viewer hidden></pre>
  <button data-copy-result disabled>Copy</button>
  <button data-download-result disabled>Download</button>
  <p data-local-feedback></p>
</section>`;

function element<T extends Element>(root: ParentNode, selector: string): T {
  const value = root.querySelector<T>(selector);
  if (!value) {
    throw new Error(`Missing test element ${selector}`);
  }
  return value;
}

function mountCompare(): HTMLElement {
  const root = document.createElement("div");
  root.innerHTML = COMPARE_HTML;
  document.body.appendChild(root);
  mountCompareTool(root);
  return root;
}

function mountAlphabetizer(): HTMLElement {
  const root = document.createElement("div");
  root.innerHTML = ALPHABETIZE_HTML;
  document.body.appendChild(root);
  mountAlphabetizeTool(root);
  return root;
}

function deferred(): {
  promise: Promise<void>;
  resolve: () => void;
  reject: (reason?: unknown) => void;
} {
  let resolve!: () => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<void>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

async function flushPromises(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
  Reflect.deleteProperty(navigator, "clipboard");
});

describe("cross-tool export lifecycle", () => {
  it("disables comparer exports whenever the selected result has no exportable content", () => {
    const root = mountCompare();
    const listA = element<HTMLTextAreaElement>(root, "[data-list-a]");
    const listB = element<HTMLTextAreaElement>(root, "[data-list-b]");
    const copy = element<HTMLButtonElement>(root, "[data-copy-result]");
    const download = element<HTMLButtonElement>(root, "[data-download-result]");

    fireEvent.input(listA, { target: { value: "a" } });
    fireEvent.input(listB, { target: { value: "a\nb" } });
    fireEvent.click(element(root, '[data-result-tab="onlyA"]'));

    expect(copy.disabled).toBe(true);
    expect(download.disabled).toBe(true);

    fireEvent.click(element(root, '[data-result-tab="onlyB"]'));
    expect(copy.disabled).toBe(false);
    expect(download.disabled).toBe(false);

    fireEvent.input(listB, { target: { value: "a" } });
    expect(copy.disabled).toBe(true);
    expect(download.disabled).toBe(true);
  });

  it("does not show stale comparer Copied feedback after source changes during an async copy", async () => {
    const pending = deferred();
    const writeText = vi.fn().mockReturnValue(pending.promise);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    const root = mountCompare();
    const listA = element<HTMLTextAreaElement>(root, "[data-list-a]");
    const listB = element<HTMLTextAreaElement>(root, "[data-list-b]");
    const copy = element<HTMLButtonElement>(root, "[data-copy-result]");
    const feedback = element<HTMLElement>(root, "[data-local-feedback]");

    fireEvent.input(listA, { target: { value: "a" } });
    fireEvent.input(listB, { target: { value: "b" } });
    fireEvent.click(copy);
    expect(writeText).toHaveBeenCalledOnce();

    fireEvent.input(listA, { target: { value: "z" } });
    expect(copy.textContent).toBe("Copy");
    expect(feedback.textContent).toBe("");

    pending.resolve();
    await flushPromises();

    expect(copy.textContent).toBe("Copy");
    expect(feedback.textContent).toBe("");
  });

  it("clears comparer Copied feedback when the active result changes", async () => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    });

    const root = mountCompare();
    fireEvent.input(element(root, "[data-list-a]"), { target: { value: "a" } });
    fireEvent.input(element(root, "[data-list-b]"), { target: { value: "b" } });
    const copy = element<HTMLButtonElement>(root, "[data-copy-result]");
    const feedback = element<HTMLElement>(root, "[data-local-feedback]");

    fireEvent.click(copy);
    await flushPromises();
    expect(feedback.textContent).toBe("Copied");

    fireEvent.click(element(root, '[data-result-tab="onlyA"]'));
    expect(copy.textContent).toBe("Copy");
    expect(feedback.textContent).toBe("");
  });

  it("does not show stale Alphabetizer Copied feedback after input changes during async copy", async () => {
    const pending = deferred();
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockReturnValue(pending.promise) },
    });

    const root = mountAlphabetizer();
    const input = element<HTMLTextAreaElement>(root, "[data-list-input]");
    const copy = element<HTMLButtonElement>(root, "[data-copy-result]");
    const feedback = element<HTMLElement>(root, "[data-local-feedback]");

    fireEvent.input(input, { target: { value: "B\nA" } });
    fireEvent.click(copy);
    fireEvent.input(input, { target: { value: "D\nC" } });

    expect(copy.textContent).toBe("Copy");
    expect(feedback.textContent).toBe("");

    pending.resolve();
    await flushPromises();

    expect(copy.textContent).toBe("Copy");
    expect(feedback.textContent).toBe("");
  });

  it("clears Alphabetizer Copied feedback when ordering changes", async () => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    });

    const root = mountAlphabetizer();
    fireEvent.input(element(root, "[data-list-input]"), {
      target: { value: "B\nA" },
    });
    const copy = element<HTMLButtonElement>(root, "[data-copy-result]");
    const feedback = element<HTMLElement>(root, "[data-local-feedback]");

    fireEvent.click(copy);
    await flushPromises();
    expect(feedback.textContent).toBe("Copied");

    fireEvent.change(element<HTMLSelectElement>(root, "[data-order]"), {
      target: { value: "desc" },
    });

    expect(copy.textContent).toBe("Copy");
    expect(feedback.textContent).toBe("");
  });
});
