import { fireEvent, within } from "@testing-library/dom";
import axe from "axe-core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { mountRemoveDuplicateLinesTool } from "../remove-duplicate-lines-tool";

const TOOL_HTML = `
<section
  data-remove-duplicate-lines-tool
  aria-labelledby="dedupe-heading"
  data-label-item="item"
  data-label-items="items"
  data-label-empty-result="Paste text or a list to remove duplicate lines."
  data-label-no-effective-items="No lines remain with the current options."
  data-label-input="Input"
  data-label-unique="Unique"
  data-label-removed="Removed"
  data-label-copy="Copy"
  data-label-copied="Copied"
  data-label-copy-error="Couldn’t copy. Select the result manually."
  data-label-replace-example-confirmation="Load the example and replace your current text? Your current input will be lost."
>
  <h2 id="dedupe-heading">Remove duplicate lines</h2>
  <label for="input">List</label>
  <textarea id="input" data-list-input></textarea>
  <button type="button" data-load-example disabled>Try example</button>
  <button type="button" data-clear-list disabled>Clear</button>
  <fieldset>
    <legend>Options</legend>
    <label><input type="checkbox" data-option-trim-whitespace checked />Trim surrounding whitespace</label>
    <label><input type="checkbox" data-option-ignore-empty-lines checked />Ignore empty lines</label>
    <label><input type="checkbox" data-option-ignore-case />Ignore case</label>
  </fieldset>
  <p data-summary>
    <span data-summary-input>Input: 0</span>
    <span data-summary-unique>Unique: 0</span>
    <span data-summary-removed>Removed: 0</span>
  </p>
  <span data-result-count>0 items</span>
  <p data-empty-result>Paste text or a list to remove duplicate lines.</p>
  <pre data-result-viewer tabindex="0" hidden></pre>
  <button type="button" data-copy-result disabled>Copy</button>
  <button type="button" data-download-result disabled>Download</button>
  <p data-local-feedback role="status" aria-live="polite" aria-atomic="true"></p>
</section>`;

function mountTool(): HTMLElement {
  const container = document.createElement("div");
  container.innerHTML = TOOL_HTML;
  document.body.appendChild(container);
  mountRemoveDuplicateLinesTool(container);
  return container;
}

function input(container: HTMLElement): HTMLTextAreaElement {
  return container.querySelector<HTMLTextAreaElement>("[data-list-input]")!;
}

function viewer(container: HTMLElement): HTMLElement {
  return container.querySelector<HTMLElement>("[data-result-viewer]")!;
}

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("RemoveDuplicateLinesTool", () => {
  it("deduplicates live and renders compact stats", () => {
    const container = mountTool();
    fireEvent.input(input(container), {
      target: { value: "B\nA\nB\nC\nA" },
    });

    expect(viewer(container).textContent).toBe("B\nA\nC");
    expect(container.querySelector("[data-summary-input]")).toHaveTextContent(
      "Input: 5",
    );
    expect(container.querySelector("[data-summary-unique]")).toHaveTextContent(
      "Unique: 3",
    );
    expect(container.querySelector("[data-summary-removed]")).toHaveTextContent(
      "Removed: 2",
    );
    expect(container.querySelector("[data-result-count]")).toHaveTextContent(
      "3 items",
    );
    expect(container.querySelector("[data-copy-result]")).toBeEnabled();
  });

  it("recomputes identity live when Ignore case changes", () => {
    const container = mountTool();
    fireEvent.input(input(container), {
      target: { value: "Apple\napple\nAPPLE" },
    });
    expect(viewer(container).textContent).toBe("Apple\napple\nAPPLE");

    fireEvent.click(
      within(container).getByRole("checkbox", { name: "Ignore case" }),
    );

    expect(viewer(container).textContent).toBe("Apple");
    expect(container.querySelector("[data-summary-removed]")).toHaveTextContent(
      "Removed: 2",
    );
  });

  it("does not lowercase the first retained representation", () => {
    const container = mountTool();
    fireEvent.click(
      within(container).getByRole("checkbox", { name: "Ignore case" }),
    );
    fireEvent.input(input(container), {
      target: { value: "Apple\napple" },
    });

    expect(viewer(container).textContent).toBe("Apple");
  });

  it("keeps zero stats visible and exports disabled for untouched empty input", () => {
    const container = mountTool();

    expect(container.querySelector("[data-summary]")).not.toHaveAttribute(
      "hidden",
    );
    expect(container.querySelector("[data-summary-input]")).toHaveTextContent(
      "Input: 0",
    );
    expect(container.querySelector("[data-summary-unique]")).toHaveTextContent(
      "Unique: 0",
    );
    expect(container.querySelector("[data-summary-removed]")).toHaveTextContent(
      "Removed: 0",
    );
    expect(container.querySelector("[data-copy-result]")).toBeDisabled();
    expect(container.querySelector("[data-download-result]")).toBeDisabled();
  });

  it("shows zero-effective state for non-empty filtered input", () => {
    const container = mountTool();
    fireEvent.input(input(container), { target: { value: "   \n  " } });

    expect(container.querySelector("[data-summary]")).not.toHaveAttribute(
      "hidden",
    );
    expect(container.querySelector("[data-summary-input]")).toHaveTextContent(
      "Input: 0",
    );
    expect(container.querySelector("[data-empty-result]")).toHaveTextContent(
      "No lines remain with the current options.",
    );
  });

  it("keeps one intentional empty item non-exportable", () => {
    const container = mountTool();
    fireEvent.click(
      within(container).getByRole("checkbox", { name: "Ignore empty lines" }),
    );
    fireEvent.input(input(container), { target: { value: "   " } });

    expect(container.querySelector("[data-result-count]")).toHaveTextContent(
      "1 item",
    );
    expect(viewer(container).textContent).toBe("");
    expect(container.querySelector("[data-copy-result]")).toBeDisabled();
    expect(container.querySelector("[data-download-result]")).toBeDisabled();
  });

  it("loads an example live and respects replacement cancellation", () => {
    const container = mountTool();
    fireEvent.click(container.querySelector("[data-load-example]")!);
    expect(input(container).value).toContain("Apple");
    expect(viewer(container).textContent).toBe("Apple\nBanana\nCherry\nbanana");

    fireEvent.input(input(container), { target: { value: "Keep me" } });
    vi.spyOn(window, "confirm").mockReturnValue(false);
    fireEvent.click(container.querySelector("[data-load-example]")!);
    expect(input(container).value).toBe("Keep me");
  });

  it("replaces a non-empty list after example confirmation", () => {
    const container = mountTool();
    fireEvent.input(input(container), { target: { value: "Replace me" } });
    const confirm = vi.spyOn(window, "confirm").mockReturnValue(true);

    fireEvent.click(container.querySelector("[data-load-example]")!);

    expect(confirm).toHaveBeenCalledOnce();
    expect(input(container).value).toContain("Apple");
    expect(viewer(container).textContent).toBe("Apple\nBanana\nCherry\nbanana");
  });

  it("clears input while keeping the zero-stat layout and exports disabled", () => {
    const container = mountTool();
    fireEvent.input(input(container), { target: { value: "A\nA" } });
    fireEvent.click(container.querySelector("[data-clear-list]")!);

    expect(input(container).value).toBe("");
    expect(container.querySelector("[data-summary]")).not.toHaveAttribute(
      "hidden",
    );
    expect(container.querySelector("[data-summary-input]")).toHaveTextContent(
      "Input: 0",
    );
    expect(viewer(container)).toHaveAttribute("hidden");
    expect(container.querySelector("[data-copy-result]")).toBeDisabled();
  });

  it("copies the exact current live result", async () => {
    const container = mountTool();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    fireEvent.input(input(container), { target: { value: "B\nA\nB" } });

    fireEvent.click(container.querySelector("[data-copy-result]")!);
    await Promise.resolve();
    await Promise.resolve();

    expect(writeText).toHaveBeenCalledWith("B\nA");
  });

  it("downloads through Blob and revokes the object URL", () => {
    const container = mountTool();
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});
    const createObjectURL = vi.fn().mockReturnValue("blob:test");
    const revokeObjectURL = vi.fn();
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: createObjectURL,
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      value: revokeObjectURL,
    });
    fireEvent.input(input(container), { target: { value: "B\nA\nB" } });

    fireEvent.click(container.querySelector("[data-download-result]")!);

    expect(click).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:test");
  });

  it("has no obvious accessibility violations in the mounted state", async () => {
    const container = mountTool();
    const result = await axe.run(container);
    expect(result.violations).toEqual([]);
  });
});
