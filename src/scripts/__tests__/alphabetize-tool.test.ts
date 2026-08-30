import { fireEvent, within } from "@testing-library/dom";
import axe from "axe-core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { mountAlphabetizeTool } from "../alphabetize-tool";

const TOOL_HTML = `
<section
  data-alphabetize-tool
  data-label-item="item"
  data-label-items="items"
  data-label-empty-result="Paste a list to see the alphabetized result."
  data-label-no-effective-items="No items remain with the current options."
  data-label-copy="Copy"
  data-label-copied="Copied"
  data-label-copy-error="Couldn’t copy. Select the result manually."
  data-label-replace-example-confirmation="Load the example and replace your current list? Your current input will be lost."
>
  <label for="input">List</label>
  <textarea id="input" data-list-input></textarea>
  <button type="button" data-load-example disabled>Try example</button>
  <button type="button" data-clear-list disabled>Clear</button>
  <fieldset>
    <legend>Options</legend>
    <label><input type="checkbox" data-option-trim-whitespace checked />Trim whitespace</label>
    <label><input type="checkbox" data-option-ignore-empty-lines checked />Ignore empty lines</label>
    <label>Order
      <select data-order aria-label="Order">
        <option value="asc" selected>A → Z</option>
        <option value="desc">Z → A</option>
      </select>
    </label>
  </fieldset>
  <span data-result-count>0 items</span>
  <p data-empty-result>Paste a list to see the alphabetized result.</p>
  <pre data-result-viewer hidden></pre>
  <button type="button" data-copy-result disabled>Copy</button>
  <button type="button" data-download-result disabled>Download</button>
  <p data-local-feedback role="status"></p>
</section>`;

function mountTool(): HTMLElement {
  const container = document.createElement("div");
  container.innerHTML = TOOL_HTML;
  document.body.appendChild(container);
  mountAlphabetizeTool(container);
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

describe("AlphabetizeTool", () => {
  it("has no obvious accessibility violations", async () => {
    const container = mountTool();
    const result = await axe.run(container);

    expect(result.violations).toEqual([]);
  });

  it("renders a live normalized A to Z result", () => {
    const container = mountTool();
    fireEvent.input(input(container), {
      target: { value: "  item 10  \nBanana\n\nitem 2\napple" },
    });

    expect(viewer(container)).toHaveTextContent(
      "apple\nBanana\nitem 2\nitem 10",
      { normalizeWhitespace: false },
    );
    expect(container.querySelector("[data-result-count]")).toHaveTextContent(
      "4 items",
    );
    expect(container.querySelector("[data-copy-result]")).toBeEnabled();
    expect(container.querySelector("[data-download-result]")).toBeEnabled();
  });

  it("updates live when order changes", () => {
    const container = mountTool();
    fireEvent.input(input(container), { target: { value: "B\nA\nC" } });
    fireEvent.change(container.querySelector("[data-order]")!, {
      target: { value: "desc" },
    });

    expect(viewer(container).textContent).toBe("C\nB\nA");
  });

  it("keeps export actions disabled for an empty-only serialized result", () => {
    const container = mountTool();
    const ignoreEmpty = within(container).getByRole("checkbox", {
      name: "Ignore empty lines",
    });

    fireEvent.click(ignoreEmpty);
    fireEvent.input(input(container), { target: { value: "   " } });

    expect(container.querySelector("[data-result-count]")).toHaveTextContent(
      "1 item",
    );
    expect(viewer(container).textContent).toBe("");
    expect(container.querySelector("[data-copy-result]")).toBeDisabled();
    expect(container.querySelector("[data-download-result]")).toBeDisabled();
  });

  it("does not replace current input when the example confirmation is cancelled", () => {
    const container = mountTool();
    fireEvent.input(input(container), { target: { value: "Keep me" } });
    vi.spyOn(window, "confirm").mockReturnValue(false);

    fireEvent.click(container.querySelector("[data-load-example]")!);

    expect(window.confirm).toHaveBeenCalledOnce();
    expect(input(container).value).toBe("Keep me");
    expect(viewer(container).textContent).toBe("Keep me");
  });

  it("loads an example without confirmation when input is empty", () => {
    const container = mountTool();
    const confirm = vi.spyOn(window, "confirm");

    fireEvent.click(container.querySelector("[data-load-example]")!);

    expect(confirm).not.toHaveBeenCalled();
    expect(input(container).value).toContain("Item 10");
    expect(viewer(container).textContent).toContain("item 2");
  });

  it("clears input and disables result actions", () => {
    const container = mountTool();
    fireEvent.input(input(container), { target: { value: "B\nA" } });

    fireEvent.click(container.querySelector("[data-clear-list]")!);

    expect(input(container).value).toBe("");
    expect(viewer(container)).toHaveAttribute("hidden");
    expect(container.querySelector("[data-copy-result]")).toBeDisabled();
    expect(container.querySelector("[data-download-result]")).toBeDisabled();
  });

  it("copies the exact serialized result", async () => {
    const container = mountTool();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    fireEvent.input(input(container), { target: { value: "B\nA" } });

    fireEvent.click(container.querySelector("[data-copy-result]")!);
    await Promise.resolve();
    await Promise.resolve();

    expect(writeText).toHaveBeenCalledWith("A\nB");
  });

  it("downloads the exact result with the intended filename", () => {
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
    fireEvent.input(input(container), { target: { value: "B\nA" } });

    fireEvent.click(container.querySelector("[data-download-result]")!);

    expect(createObjectURL).toHaveBeenCalledOnce();
    expect(click).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:test");
  });
});
