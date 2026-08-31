import { fireEvent, within } from "@testing-library/dom";
import axe from "axe-core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { mountRandomizeTool } from "../randomize-tool";

const TOOL_HTML = `
<section
  data-randomize-tool
  aria-labelledby="randomize-tool-heading"
  data-label-item="item"
  data-label-items="items"
  data-label-empty-result="Paste a list to create a randomized result."
  data-label-ready-result="Select Randomize to shuffle the current list."
  data-label-no-effective-items="No items remain with the current options."
  data-label-randomize="Randomize"
  data-label-copy="Copy"
  data-label-copied="Copied"
  data-label-copy-error="Couldn’t copy. Select the result manually."
  data-label-replace-example-confirmation="Load the example and replace your current list? Your current input will be lost."
>
  <h2 id="randomize-tool-heading">Randomize list</h2>
  <label for="input">List</label>
  <textarea id="input" data-list-input></textarea>
  <button type="button" data-load-example disabled>Try example</button>
  <button type="button" data-clear-list disabled>Clear</button>
  <fieldset>
    <legend>Options</legend>
    <label><input type="checkbox" data-option-trim-whitespace checked />Trim surrounding whitespace</label>
    <label><input type="checkbox" data-option-ignore-empty-lines checked />Ignore empty lines</label>
  </fieldset>
  <button type="button" data-randomize-list disabled>Randomize</button>
  <span data-result-count>0 items</span>
  <p data-empty-result>Paste a list to create a randomized result.</p>
  <pre data-result-viewer tabindex="0" hidden></pre>
  <button type="button" data-copy-result disabled>Copy</button>
  <button type="button" data-download-result disabled>Download</button>
  <p data-local-feedback role="status" aria-live="polite" aria-atomic="true"></p>
</section>`;

function mountTool(): HTMLElement {
  const container = document.createElement("div");
  container.innerHTML = TOOL_HTML;
  document.body.appendChild(container);
  mountRandomizeTool(container);
  return container;
}

function input(container: HTMLElement): HTMLTextAreaElement {
  return container.querySelector<HTMLTextAreaElement>("[data-list-input]")!;
}

function viewer(container: HTMLElement): HTMLElement {
  return container.querySelector<HTMLElement>("[data-result-viewer]")!;
}

function randomizeButton(container: HTMLElement): HTMLButtonElement {
  return container.querySelector<HTMLButtonElement>("[data-randomize-list]")!;
}

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("RandomizeTool", () => {
  it("waits for an explicit Randomize action", () => {
    const container = mountTool();
    fireEvent.input(input(container), { target: { value: "A\nB\nC" } });

    expect(viewer(container)).toHaveAttribute("hidden");
    expect(container.querySelector("[data-empty-result]")).toHaveTextContent(
      "Select Randomize to shuffle the current list.",
    );
    expect(randomizeButton(container)).toBeEnabled();
    expect(container.querySelector("[data-copy-result]")).toBeDisabled();
  });

  it("randomizes on demand while keeping the action label stable", () => {
    const container = mountTool();
    vi.spyOn(Math, "random").mockReturnValue(0);
    fireEvent.input(input(container), { target: { value: "A\nB\nC" } });

    fireEvent.click(randomizeButton(container));

    expect(viewer(container).textContent).toBe("B\nC\nA");
    expect(randomizeButton(container)).toHaveTextContent("Randomize");
    expect(container.querySelector("[data-result-count]")).toHaveTextContent(
      "3 items",
    );
    expect(container.querySelector("[data-copy-result]")).toBeEnabled();
    expect(container.querySelector("[data-download-result]")).toBeEnabled();
  });

  it("invalidates the result after source input changes", () => {
    const container = mountTool();
    vi.spyOn(Math, "random").mockReturnValue(0);
    fireEvent.input(input(container), { target: { value: "A\nB\nC" } });
    fireEvent.click(randomizeButton(container));

    fireEvent.input(input(container), { target: { value: "A\nB\nC\nD" } });

    expect(viewer(container)).toHaveAttribute("hidden");
    expect(viewer(container).textContent).toBe("");
    expect(randomizeButton(container)).toHaveTextContent("Randomize");
    expect(container.querySelector("[data-copy-result]")).toBeDisabled();
    expect(container.querySelector("[data-download-result]")).toBeDisabled();
  });

  it("invalidates the result after a processing option changes", () => {
    const container = mountTool();
    vi.spyOn(Math, "random").mockReturnValue(0);
    fireEvent.input(input(container), { target: { value: " A \nB" } });
    fireEvent.click(randomizeButton(container));

    fireEvent.click(
      within(container).getByRole("checkbox", {
        name: "Trim surrounding whitespace",
      }),
    );

    expect(viewer(container)).toHaveAttribute("hidden");
    expect(randomizeButton(container)).toHaveTextContent("Randomize");
  });

  it("loads an example without randomizing it", () => {
    const container = mountTool();
    fireEvent.click(container.querySelector("[data-load-example]")!);

    expect(input(container).value).toContain("Charlie");
    expect(viewer(container)).toHaveAttribute("hidden");
    expect(randomizeButton(container)).toHaveTextContent("Randomize");
    expect(container.querySelector("[data-copy-result]")).toBeDisabled();
  });

  it("does not replace current input when example confirmation is cancelled", () => {
    const container = mountTool();
    fireEvent.input(input(container), { target: { value: "Keep me" } });
    vi.spyOn(window, "confirm").mockReturnValue(false);

    fireEvent.click(container.querySelector("[data-load-example]")!);

    expect(input(container).value).toBe("Keep me");
    expect(viewer(container)).toHaveAttribute("hidden");
  });

  it("disables Randomize when no effective items remain", () => {
    const container = mountTool();
    fireEvent.input(input(container), { target: { value: "   \n  " } });

    expect(randomizeButton(container)).toBeDisabled();
    expect(container.querySelector("[data-empty-result]")).toHaveTextContent(
      "No items remain with the current options.",
    );
  });

  it("clears the source and stale result", () => {
    const container = mountTool();
    vi.spyOn(Math, "random").mockReturnValue(0);
    fireEvent.input(input(container), { target: { value: "A\nB" } });
    fireEvent.click(randomizeButton(container));

    fireEvent.click(container.querySelector("[data-clear-list]")!);

    expect(input(container).value).toBe("");
    expect(viewer(container)).toHaveAttribute("hidden");
    expect(randomizeButton(container)).toBeDisabled();
    expect(randomizeButton(container)).toHaveTextContent("Randomize");
  });

  it("copies the exact current randomized result", async () => {
    const container = mountTool();
    vi.spyOn(Math, "random").mockReturnValue(0);
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    fireEvent.input(input(container), { target: { value: "A\nB\nC" } });
    fireEvent.click(randomizeButton(container));

    fireEvent.click(container.querySelector("[data-copy-result]")!);
    await Promise.resolve();
    await Promise.resolve();

    expect(writeText).toHaveBeenCalledWith("B\nC\nA");
  });

  it("downloads the current result with the stable filename", () => {
    const container = mountTool();
    vi.spyOn(Math, "random").mockReturnValue(0);
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
    fireEvent.input(input(container), { target: { value: "A\nB\nC" } });
    fireEvent.click(randomizeButton(container));

    fireEvent.click(container.querySelector("[data-download-result]")!);

    expect(click).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:test");
  });

  it("keeps an intentional empty item non-exportable", () => {
    const container = mountTool();
    fireEvent.click(
      within(container).getByRole("checkbox", { name: "Ignore empty lines" }),
    );
    fireEvent.input(input(container), { target: { value: "   " } });

    fireEvent.click(randomizeButton(container));

    expect(container.querySelector("[data-result-count]")).toHaveTextContent(
      "1 item",
    );
    expect(viewer(container).textContent).toBe("");
    expect(container.querySelector("[data-copy-result]")).toBeDisabled();
    expect(container.querySelector("[data-download-result]")).toBeDisabled();
  });

  it("has no obvious accessibility violations in the mounted state", async () => {
    const container = mountTool();
    const result = await axe.run(container);
    expect(result.violations).toEqual([]);
  });
});
