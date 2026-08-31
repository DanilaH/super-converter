import { fireEvent } from "@testing-library/dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { mountAlphabetizeTool } from "../alphabetize-tool";
import { mountRandomizeTool } from "../randomize-tool";
import { mountRemoveDuplicateLinesTool } from "../remove-duplicate-lines-tool";

const COMMON_LABELS = `
  data-label-item="item"
  data-label-items="items"
  data-label-copy="Copy"
  data-label-copied="Copied"
  data-label-copy-error="Couldn’t copy."
  data-label-replace-example-confirmation="Replace current input?"
`;

const ALPHABETIZER_HTML = `
<section data-alphabetize-tool ${COMMON_LABELS}
  data-label-empty-result="Paste a list."
  data-label-no-effective-items="No items remain."
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

const RANDOMIZER_HTML = `
<section data-randomize-tool ${COMMON_LABELS}
  data-label-empty-result="Paste a list."
  data-label-ready-result="Select Randomize."
  data-label-no-effective-items="No items remain."
  data-label-randomize="Randomize"
  data-label-randomize-again="Randomize again"
>
  <textarea data-list-input></textarea>
  <button data-clear-list disabled>Clear</button>
  <button data-load-example disabled>Try example</button>
  <input type="checkbox" data-option-trim-whitespace checked />
  <input type="checkbox" data-option-ignore-empty-lines checked />
  <button data-randomize-list disabled>Randomize</button>
  <span data-result-count>0 items</span>
  <p data-empty-result></p>
  <pre data-result-viewer hidden></pre>
  <button data-copy-result disabled>Copy</button>
  <button data-download-result disabled>Download</button>
  <p data-local-feedback></p>
</section>`;

const DEDUPE_HTML = `
<section data-remove-duplicate-lines-tool ${COMMON_LABELS}
  data-label-empty-result="Paste a list."
  data-label-no-effective-items="No lines remain."
  data-label-input="Input"
  data-label-unique="Unique"
  data-label-removed="Removed"
>
  <textarea data-list-input></textarea>
  <button data-clear-list disabled>Clear</button>
  <button data-load-example disabled>Try example</button>
  <input type="checkbox" data-option-trim-whitespace checked />
  <input type="checkbox" data-option-ignore-empty-lines checked />
  <input type="checkbox" data-option-ignore-case />
  <p data-summary hidden>
    <span data-summary-input></span>
    <span data-summary-unique></span>
    <span data-summary-removed></span>
  </p>
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

function mount(
  html: string,
  mountTool: (scope: ParentNode) => void,
): HTMLElement {
  const root = document.createElement("div");
  root.innerHTML = html;
  document.body.appendChild(root);
  mountTool(root);
  return root;
}

function deferred(): { promise: Promise<void>; resolve: () => void } {
  let resolve!: () => void;
  const promise = new Promise<void>((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
}

async function flushPromises(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

function installDeferredClipboard(): {
  pending: ReturnType<typeof deferred>;
  writeText: ReturnType<typeof vi.fn>;
} {
  const pending = deferred();
  const writeText = vi.fn().mockReturnValue(pending.promise);
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
  return { pending, writeText };
}

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
  Reflect.deleteProperty(navigator, "clipboard");
});

describe("Copy snapshot equivalence", () => {
  it("does not restore Alphabetizer feedback when normalized output stays equal after a raw input change", async () => {
    const { pending } = installDeferredClipboard();
    const root = mount(ALPHABETIZER_HTML, mountAlphabetizeTool);
    const input = element<HTMLTextAreaElement>(root, "[data-list-input]");
    const copy = element<HTMLButtonElement>(root, "[data-copy-result]");
    const feedback = element<HTMLElement>(root, "[data-local-feedback]");

    fireEvent.input(input, { target: { value: " B \nA" } });
    fireEvent.click(copy);
    fireEvent.input(input, { target: { value: "B\nA" } });

    expect(element(root, "[data-result-viewer]").textContent).toBe("A\nB");
    pending.resolve();
    await flushPromises();

    expect(copy.textContent).toBe("Copy");
    expect(feedback.textContent).toBe("");
  });

  it("does not restore Dedupe feedback when adding a duplicate leaves output unchanged", async () => {
    const { pending } = installDeferredClipboard();
    const root = mount(DEDUPE_HTML, mountRemoveDuplicateLinesTool);
    const input = element<HTMLTextAreaElement>(root, "[data-list-input]");
    const copy = element<HTMLButtonElement>(root, "[data-copy-result]");
    const feedback = element<HTMLElement>(root, "[data-local-feedback]");

    fireEvent.input(input, { target: { value: "A" } });
    fireEvent.click(copy);
    fireEvent.input(input, { target: { value: "A\nA" } });

    expect(element(root, "[data-result-viewer]").textContent).toBe("A");
    pending.resolve();
    await flushPromises();

    expect(copy.textContent).toBe("Copy");
    expect(feedback.textContent).toBe("");
  });

  it("does not restore Randomizer feedback after source normalization changes even if the rerun text is equal", async () => {
    const { pending } = installDeferredClipboard();
    const root = mount(RANDOMIZER_HTML, mountRandomizeTool);
    const input = element<HTMLTextAreaElement>(root, "[data-list-input]");
    const randomize = element<HTMLButtonElement>(root, "[data-randomize-list]");
    const copy = element<HTMLButtonElement>(root, "[data-copy-result]");
    const feedback = element<HTMLElement>(root, "[data-local-feedback]");

    fireEvent.input(input, { target: { value: " A " } });
    fireEvent.click(randomize);
    fireEvent.click(copy);

    fireEvent.input(input, { target: { value: "A" } });
    fireEvent.click(randomize);
    expect(element(root, "[data-result-viewer]").textContent).toBe("A");

    pending.resolve();
    await flushPromises();

    expect(copy.textContent).toBe("Copy");
    expect(feedback.textContent).toBe("");
  });

  it("does not restore Randomizer feedback when Randomize again produces the same text", async () => {
    const { pending } = installDeferredClipboard();
    const root = mount(RANDOMIZER_HTML, mountRandomizeTool);
    const input = element<HTMLTextAreaElement>(root, "[data-list-input]");
    const randomize = element<HTMLButtonElement>(root, "[data-randomize-list]");
    const copy = element<HTMLButtonElement>(root, "[data-copy-result]");
    const feedback = element<HTMLElement>(root, "[data-local-feedback]");

    fireEvent.input(input, { target: { value: "A" } });
    fireEvent.click(randomize);
    fireEvent.click(copy);
    fireEvent.click(randomize);

    expect(element(root, "[data-result-viewer]").textContent).toBe("A");
    pending.resolve();
    await flushPromises();

    expect(copy.textContent).toBe("Copy");
    expect(feedback.textContent).toBe("");
  });
});
