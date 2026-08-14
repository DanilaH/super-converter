import { fireEvent, within } from "@testing-library/dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { mountCompareTool } from "../compare-tool";

const COPIED_BUTTON_TEXT = "\u2713 Copied";
const COPY_ERROR_TEXT = "Couldn’t copy. Select the result manually.";

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
  >
    <div class="tool-heading">
      <h2 id="compare-tool-heading">Compare lists</h2>
      <button type="button" data-load-example disabled>Load example</button>
    </div>

    <div class="lists">
      <div class="list">
        <label for="list-a">List A</label>
        <textarea id="list-a" name="list-a" data-list-a rows="10" placeholder="Paste one item per line" spellcheck="false"></textarea>
        <div class="list-footer">
          <output for="list-a" data-list-a-count>0 rows</output>
          <button type="button" data-clear-list-a disabled>Clear</button>
        </div>
      </div>

      <button type="button" class="swap" data-swap-lists disabled>Swap</button>

      <div class="list">
        <label for="list-b">List B</label>
        <textarea id="list-b" name="list-b" data-list-b rows="10" placeholder="Paste one item per line" spellcheck="false"></textarea>
        <div class="list-footer">
          <output for="list-b" data-list-b-count>0 rows</output>
          <button type="button" data-clear-list-b disabled>Clear</button>
        </div>
      </div>
    </div>

    <fieldset data-compare-options class="options">
      <legend>Comparison options</legend>
      <label class="option">
        <input type="checkbox" id="option-trim-whitespace" name="trim-whitespace" data-option-trim-whitespace checked />
        Trim whitespace
      </label>
      <label class="option">
        <input type="checkbox" id="option-ignore-empty-lines" name="ignore-empty-lines" data-option-ignore-empty-lines checked />
        Ignore empty lines
      </label>
      <label class="option">
        <input type="checkbox" id="option-ignore-case" name="ignore-case" data-option-ignore-case />
        Ignore case
      </label>
      <label class="option">
        <input type="checkbox" id="option-remove-duplicates" name="remove-duplicates" data-option-remove-duplicates checked />
        Remove duplicates
      </label>
    </fieldset>

    <section data-results hidden class="results">
      <h3>Results</h3>

      <p data-empty-results>Paste two lists above to see their differences and matches.</p>

      <dl data-summary class="summary" hidden>
        <div class="summary-item">
          <dt>Only in A</dt>
          <dd data-summary-only-a>0</dd>
        </div>
        <div class="summary-item">
          <dt>In both</dt>
          <dd data-summary-matches>0</dd>
        </div>
        <div class="summary-item">
          <dt>Only in B</dt>
          <dd data-summary-only-b>0</dd>
        </div>
      </dl>

      <div role="tablist" data-result-tabs class="tabs" aria-label="Results" hidden>
        <button type="button" role="tab" id="tab-differences" class="tab" aria-controls="result-panel" aria-selected="true" tabindex="0" data-result-tab="differences">Differences</button>
        <button type="button" role="tab" id="tab-only-a" class="tab" aria-controls="result-panel" aria-selected="false" tabindex="-1" data-result-tab="onlyA">Only A</button>
        <button type="button" role="tab" id="tab-only-b" class="tab" aria-controls="result-panel" aria-selected="false" tabindex="-1" data-result-tab="onlyB">Only B</button>
        <button type="button" role="tab" id="tab-matches" class="tab" aria-controls="result-panel" aria-selected="false" tabindex="-1" data-result-tab="matches">Matches</button>
        <button type="button" role="tab" id="tab-all" class="tab" aria-controls="result-panel" aria-selected="false" tabindex="-1" data-result-tab="all">All</button>
      </div>

      <div role="tabpanel" id="result-panel" class="panel" aria-labelledby="tab-differences" data-result-panel hidden>
        <div class="result-toolbar">
          <h4 class="panel-heading" data-result-heading>Differences</h4>
          <p class="panel-count" data-result-count>0 items</p>
          <div class="result-actions">
            <button type="button" class="action" data-copy-result disabled>Copy</button>
            <button type="button" class="action" data-download-result disabled>Download</button>
          </div>
          <p class="local-feedback" data-local-feedback role="status" aria-live="polite" aria-atomic="true"></p>
        </div>
        <pre class="viewer" data-result-viewer tabindex="0"></pre>
      </div>
    </section>
  </section>
`;

function mountTool(): HTMLElement {
  const container = document.createElement("div");
  container.innerHTML = TOOL_HTML;
  document.body.appendChild(container);
  mountCompareTool(container);
  return container;
}

function textarea(
  container: HTMLElement,
  selector: string,
): HTMLTextAreaElement {
  return (
    container.querySelector<HTMLTextAreaElement>(selector) ?? (null as never)
  );
}

function hook<T extends HTMLElement>(
  container: HTMLElement,
  selector: string,
): T {
  return container.querySelector<T>(selector) ?? (null as never);
}

function typeCanonical(container: HTMLElement): void {
  fireEvent.input(textarea(container, "[data-list-a]"), {
    target: { value: "b\na\nb\nc" },
  });
  fireEvent.input(textarea(container, "[data-list-b]"), {
    target: { value: "a\nd\nb\ne\nd" },
  });
}

function activeTabValue(container: HTMLElement): string {
  const selected = container.querySelector<HTMLElement>(
    '[data-result-tab][aria-selected="true"]',
  );
  return selected?.dataset.resultTab ?? "";
}

function clickTab(container: HTMLElement, value: string): void {
  fireEvent.click(
    hook<HTMLButtonElement>(container, `[data-result-tab="${value}"]`),
  );
}

const NO_DIFFERENCES_TEXT =
  "No differences found.\n\nBoth lists contain the same values with the current comparison settings.";

describe("compare-tool", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    vi.useRealTimers();
    vi.restoreAllMocks();
    Reflect.deleteProperty(navigator, "clipboard");
  });

  it("shows the both-empty state: results and empty copy visible, summary/tabs/panel hidden, zero counters", () => {
    const container = mountTool();

    expect(hook(container, "[data-results]").hidden).toBe(false);
    expect(hook(container, "[data-empty-results]").hidden).toBe(false);
    expect(hook(container, "[data-summary]").hidden).toBe(true);
    expect(hook(container, "[data-result-tabs]").hidden).toBe(true);
    expect(hook(container, "[data-result-panel]").hidden).toBe(true);
    expect(hook(container, "[data-result-viewer]").textContent).toBe("");
    expect(hook(container, "[data-result-count]").textContent).toBe("0 items");
    expect(within(container).getAllByText("0 rows")).toHaveLength(2);
    expect(
      hook<HTMLButtonElement>(container, "[data-clear-list-a]").disabled,
    ).toBe(false);
    expect(
      hook<HTMLButtonElement>(container, "[data-clear-list-b]").disabled,
    ).toBe(false);
    expect(
      hook<HTMLButtonElement>(container, "[data-swap-lists]").disabled,
    ).toBe(false);
    expect(
      hook<HTMLButtonElement>(container, "[data-load-example]").disabled,
    ).toBe(false);
  });

  it("shows summary, tabs and panel when one input is filled and hides the empty copy", () => {
    const container = mountTool();

    fireEvent.input(textarea(container, "[data-list-a]"), {
      target: { value: "a\nb" },
    });

    expect(hook(container, "[data-empty-results]").hidden).toBe(true);
    expect(hook(container, "[data-summary]").hidden).toBe(false);
    expect(hook(container, "[data-result-tabs]").hidden).toBe(false);
    expect(hook(container, "[data-result-panel]").hidden).toBe(false);
    expect(within(container).getByText("2 rows")).toBeTruthy();
  });

  it("shows exact summary counts and updates them live", () => {
    const container = mountTool();

    typeCanonical(container);

    expect(hook(container, "[data-summary-only-a]").textContent).toBe("1");
    expect(hook(container, "[data-summary-matches]").textContent).toBe("2");
    expect(hook(container, "[data-summary-only-b]").textContent).toBe("2");

    fireEvent.click(hook(container, "[data-option-remove-duplicates]"));

    expect(hook(container, "[data-summary-only-a]").textContent).toBe("2");
    expect(hook(container, "[data-summary-matches]").textContent).toBe("2");
    expect(hook(container, "[data-summary-only-b]").textContent).toBe("3");
  });

  it("keeps Differences as the default active tab", () => {
    const container = mountTool();

    typeCanonical(container);

    expect(activeTabValue(container)).toBe("differences");
    expect(hook(container, "[data-result-heading]").textContent).toBe(
      "Differences",
    );
    expect(
      hook(container, "[data-result-panel]").getAttribute("aria-labelledby"),
    ).toBe("tab-differences");
    expect(hook(container, "[data-result-count]").textContent).toBe("3 items");
    expect(hook(container, "[data-result-viewer]").textContent).toBe(
      "ONLY IN LIST A\nc\n\nONLY IN LIST B\nd\ne",
    );
  });

  it("updates selection, heading, aria-labelledby, text and count on every tab click", () => {
    const container = mountTool();

    typeCanonical(container);

    const views = [
      {
        value: "onlyA",
        id: "tab-only-a",
        label: "Only A",
        count: "1 item",
        text: "c",
      },
      {
        value: "onlyB",
        id: "tab-only-b",
        label: "Only B",
        count: "2 items",
        text: "d\ne",
      },
      {
        value: "matches",
        id: "tab-matches",
        label: "Matches",
        count: "2 items",
        text: "b\na",
      },
      {
        value: "all",
        id: "tab-all",
        label: "All",
        count: "5 items",
        text: "b\na\nc\nd\ne",
      },
      {
        value: "differences",
        id: "tab-differences",
        label: "Differences",
        count: "3 items",
        text: "ONLY IN LIST A\nc\n\nONLY IN LIST B\nd\ne",
      },
    ];

    for (const view of views) {
      clickTab(container, view.value);

      expect(activeTabValue(container)).toBe(view.value);
      expect(
        hook<HTMLButtonElement>(
          container,
          `[data-result-tab="${view.value}"]`,
        ).getAttribute("aria-selected"),
      ).toBe("true");
      expect(
        hook<HTMLButtonElement>(container, `[data-result-tab="${view.value}"]`)
          .tabIndex,
      ).toBe(0);
      expect(hook(container, "[data-result-heading]").textContent).toBe(
        view.label,
      );
      expect(
        hook(container, "[data-result-panel]").getAttribute("aria-labelledby"),
      ).toBe(view.id);
      expect(hook(container, "[data-result-count]").textContent).toBe(
        view.count,
      );
      expect(hook(container, "[data-result-viewer]").textContent).toBe(
        view.text,
      );
    }
  });

  it("handles ArrowRight/ArrowLeft with wrap, Home and End", () => {
    const container = mountTool();

    typeCanonical(container);

    const tabOf = (value: string): HTMLButtonElement =>
      hook<HTMLButtonElement>(container, `[data-result-tab="${value}"]`);

    tabOf("differences").focus();

    fireEvent.keyDown(tabOf("differences"), { key: "ArrowRight" });
    expect(activeTabValue(container)).toBe("onlyA");
    expect(document.activeElement).toBe(tabOf("onlyA"));

    fireEvent.keyDown(tabOf("onlyB"), { key: "ArrowRight" });
    expect(activeTabValue(container)).toBe("matches");

    fireEvent.keyDown(tabOf("all"), { key: "ArrowRight" });
    expect(activeTabValue(container)).toBe("differences");
    expect(document.activeElement).toBe(tabOf("differences"));

    fireEvent.keyDown(tabOf("differences"), { key: "ArrowLeft" });
    expect(activeTabValue(container)).toBe("all");
    expect(document.activeElement).toBe(tabOf("all"));

    fireEvent.keyDown(tabOf("all"), { key: "End" });
    expect(activeTabValue(container)).toBe("all");
    expect(document.activeElement).toBe(tabOf("all"));

    fireEvent.keyDown(tabOf("all"), { key: "Home" });
    expect(activeTabValue(container)).toBe("differences");
    expect(document.activeElement).toBe(tabOf("differences"));

    fireEvent.keyDown(tabOf("differences"), { key: "a" });
    expect(activeTabValue(container)).toBe("differences");
  });

  it("keeps the active tab across input, option change, Clear, Swap and Load example", () => {
    const container = mountTool();

    typeCanonical(container);
    clickTab(container, "onlyA");

    fireEvent.input(textarea(container, "[data-list-a]"), {
      target: { value: "x\ny" },
    });
    expect(activeTabValue(container)).toBe("onlyA");
    expect(hook(container, "[data-result-viewer]").textContent).toBe("x\ny");

    fireEvent.click(hook(container, "[data-option-remove-duplicates]"));
    expect(activeTabValue(container)).toBe("onlyA");

    fireEvent.click(hook(container, "[data-clear-list-b]"));
    expect(activeTabValue(container)).toBe("onlyA");

    fireEvent.click(hook(container, "[data-swap-lists]"));
    expect(activeTabValue(container)).toBe("onlyA");

    fireEvent.click(hook(container, "[data-load-example]"));
    expect(activeTabValue(container)).toBe("onlyA");
    expect(hook(container, "[data-result-viewer]").textContent).toBe(
      "alice@example.com",
    );
  });

  it("shows the exact no-differences copy and updates it live", () => {
    const container = mountTool();

    fireEvent.input(textarea(container, "[data-list-a]"), {
      target: { value: "A\nb" },
    });
    fireEvent.input(textarea(container, "[data-list-b]"), {
      target: { value: "a\nB" },
    });

    expect(hook(container, "[data-result-count]").textContent).toBe("4 items");
    expect(hook(container, "[data-result-viewer]").textContent).toBe(
      "ONLY IN LIST A\nA\nb\n\nONLY IN LIST B\na\nB",
    );

    fireEvent.click(hook(container, "[data-option-ignore-case]"));

    expect(hook(container, "[data-result-count]").textContent).toBe("0 items");
    expect(hook(container, "[data-result-viewer]").textContent).toBe(
      NO_DIFFERENCES_TEXT,
    );

    fireEvent.click(hook(container, "[data-option-ignore-case]"));

    expect(hook(container, "[data-result-viewer]").textContent).toBe(
      "ONLY IN LIST A\nA\nb\n\nONLY IN LIST B\na\nB",
    );
  });

  it("shows the exact no-matches copy", () => {
    const container = mountTool();

    fireEvent.input(textarea(container, "[data-list-a]"), {
      target: { value: "a" },
    });
    fireEvent.input(textarea(container, "[data-list-b]"), {
      target: { value: "b" },
    });

    clickTab(container, "matches");

    expect(hook(container, "[data-result-count]").textContent).toBe("0 items");
    expect(hook(container, "[data-result-viewer]").textContent).toBe(
      "No matching values.",
    );
  });

  it("keeps formatted text empty for empty Only A, Only B and All views", () => {
    const container = mountTool();

    fireEvent.input(textarea(container, "[data-list-a]"), {
      target: { value: "a" },
    });
    fireEvent.input(textarea(container, "[data-list-b]"), {
      target: { value: "a\nb" },
    });

    clickTab(container, "onlyA");
    expect(hook(container, "[data-result-count]").textContent).toBe("0 items");
    expect(hook(container, "[data-result-viewer]").textContent).toBe("");

    clickTab(container, "onlyB");
    expect(hook(container, "[data-result-count]").textContent).toBe("1 item");
    expect(hook(container, "[data-result-viewer]").textContent).toBe("b");
  });

  it("returns to the both-empty state and back to results on re-input", () => {
    const container = mountTool();

    typeCanonical(container);
    clickTab(container, "matches");
    expect(hook(container, "[data-summary]").hidden).toBe(false);

    fireEvent.click(hook(container, "[data-clear-list-a]"));
    fireEvent.click(hook(container, "[data-clear-list-b]"));

    expect(hook(container, "[data-empty-results]").hidden).toBe(false);
    expect(hook(container, "[data-summary]").hidden).toBe(true);
    expect(hook(container, "[data-result-tabs]").hidden).toBe(true);
    expect(hook(container, "[data-result-panel]").hidden).toBe(true);
    expect(hook(container, "[data-result-viewer]").textContent).toBe("");
    expect(hook(container, "[data-result-count]").textContent).toBe("0 items");

    typeCanonical(container);

    expect(hook(container, "[data-empty-results]").hidden).toBe(true);
    expect(activeTabValue(container)).toBe("matches");
    expect(hook(container, "[data-result-count]").textContent).toBe("2 items");
    expect(hook(container, "[data-result-viewer]").textContent).toBe("b\na");
  });

  it("uses singular and plural labels for the active count", () => {
    const container = mountTool();

    typeCanonical(container);
    clickTab(container, "onlyA");
    expect(hook(container, "[data-result-count]").textContent).toBe("1 item");

    clickTab(container, "matches");
    expect(hook(container, "[data-result-count]").textContent).toBe("2 items");
  });

  it("counts parsed rows and reacts to Ignore empty lines", () => {
    const container = mountTool();

    fireEvent.input(textarea(container, "[data-list-a]"), {
      target: { value: "a\n\nb" },
    });
    expect(hook(container, "[data-list-a-count]").textContent).toBe("2 rows");

    fireEvent.click(hook(container, "[data-option-ignore-empty-lines]"));

    expect(hook(container, "[data-list-a-count]").textContent).toBe("3 rows");
  });

  it("recomputes live after each option change", () => {
    const container = mountTool();
    const viewer = hook(container, "[data-result-viewer]");

    fireEvent.input(textarea(container, "[data-list-a]"), {
      target: { value: " A \nb" },
    });
    fireEvent.input(textarea(container, "[data-list-b]"), {
      target: { value: "a\nB " },
    });

    const fullText = "ONLY IN LIST A\n A \nb\n\nONLY IN LIST B\na\nB ";

    expect(viewer.textContent).toBe(fullText);

    fireEvent.click(hook(container, "[data-option-ignore-case]"));
    expect(viewer.textContent).toBe(NO_DIFFERENCES_TEXT);

    fireEvent.click(hook(container, "[data-option-trim-whitespace]"));
    expect(viewer.textContent).toBe(fullText);

    fireEvent.click(hook(container, "[data-option-ignore-empty-lines]"));
    expect(viewer.textContent).toBe(fullText);

    fireEvent.click(hook(container, "[data-option-remove-duplicates]"));
    expect(viewer.textContent).toBe(fullText);
  });

  it("normalizes for comparison without rewriting raw textarea values", () => {
    const container = mountTool();

    fireEvent.input(textarea(container, "[data-list-a]"), {
      target: { value: "A\nB" },
    });
    fireEvent.input(textarea(container, "[data-list-b]"), {
      target: { value: "a\nb" },
    });

    expect(hook(container, "[data-result-viewer]").textContent).toBe(
      "ONLY IN LIST A\nA\nB\n\nONLY IN LIST B\na\nb",
    );

    fireEvent.click(hook(container, "[data-option-ignore-case]"));

    expect(hook(container, "[data-result-viewer]").textContent).toBe(
      NO_DIFFERENCES_TEXT,
    );
    expect(textarea(container, "[data-list-a]").value).toBe("A\nB");
    expect(textarea(container, "[data-list-b]").value).toBe("a\nb");
  });

  it("clears only the clicked list", () => {
    const container = mountTool();

    fireEvent.input(textarea(container, "[data-list-a]"), {
      target: { value: "a\nb" },
    });
    fireEvent.input(textarea(container, "[data-list-b]"), {
      target: { value: "x" },
    });

    fireEvent.click(hook(container, "[data-clear-list-a]"));

    expect(textarea(container, "[data-list-a]").value).toBe("");
    expect(textarea(container, "[data-list-b]").value).toBe("x");
    expect(hook(container, "[data-list-a-count]").textContent).toBe("0 rows");

    fireEvent.click(hook(container, "[data-clear-list-b]"));

    expect(textarea(container, "[data-list-b]").value).toBe("");
  });

  it("swap preserves raw values, options, the selected tab and focus", () => {
    const container = mountTool();
    const listA = textarea(container, "[data-list-a]");
    const ignoreCase = hook<HTMLInputElement>(
      container,
      "[data-option-ignore-case]",
    );

    fireEvent.input(listA, { target: { value: " a \n" } });
    fireEvent.input(textarea(container, "[data-list-b]"), {
      target: { value: "b  \n" },
    });
    fireEvent.click(ignoreCase);
    clickTab(container, "onlyB");
    listA.focus();

    fireEvent.click(hook(container, "[data-swap-lists]"));

    expect(listA.value).toBe("b  \n");
    expect(textarea(container, "[data-list-b]").value).toBe(" a \n");
    expect(ignoreCase.checked).toBe(true);
    expect(activeTabValue(container)).toBe("onlyB");
    expect(document.activeElement).toBe(listA);
  });

  it("load example fills the exact values and shows the result", () => {
    const container = mountTool();

    fireEvent.click(hook(container, "[data-load-example]"));

    expect(textarea(container, "[data-list-a]").value).toBe(
      "alice@example.com\nbob@example.com\ncarol@example.com",
    );
    expect(textarea(container, "[data-list-b]").value).toBe(
      "bob@example.com\ncarol@example.com\ndave@example.com",
    );
    expect(hook(container, "[data-empty-results]").hidden).toBe(true);
    expect(hook(container, "[data-result-viewer]").textContent).toBe(
      "ONLY IN LIST A\nalice@example.com\n\nONLY IN LIST B\ndave@example.com",
    );
    expect(hook(container, "[data-result-count]").textContent).toBe("2 items");
  });

  it("does not bind listeners twice for the same root", () => {
    const container = mountTool();
    const listA = textarea(container, "[data-list-a]");
    const listB = textarea(container, "[data-list-b]");

    fireEvent.input(listA, { target: { value: "a" } });
    fireEvent.input(listB, { target: { value: "b" } });

    mountCompareTool(container);
    mountCompareTool(container);

    fireEvent.click(hook(container, "[data-swap-lists]"));

    expect(listA.value).toBe("b");
    expect(listB.value).toBe("a");

    clickTab(container, "onlyA");
    expect(activeTabValue(container)).toBe("onlyA");
  });

  it("renders user content as text and never as HTML elements", () => {
    const container = mountTool();

    fireEvent.input(textarea(container, "[data-list-a]"), {
      target: { value: "<img src=x onerror=alert(1)>" },
    });

    expect(hook(container, "[data-result-viewer]").textContent).toContain(
      "<img src=x onerror=alert(1)>",
    );
    expect(container.querySelector("img")).toBeNull();
  });
});

function mockClipboard(rejects = false): ReturnType<typeof vi.fn> {
  const writeText = rejects
    ? vi.fn().mockRejectedValue(new Error("clipboard denied"))
    : vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
  return writeText;
}

function mockUrls(): {
  create: ReturnType<typeof vi.fn>;
  revoke: ReturnType<typeof vi.fn>;
} {
  const create = vi
    .spyOn(URL, "createObjectURL")
    .mockReturnValue("blob:mock-1");
  const revoke = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
  return { create, revoke };
}

function mockAnchorClick(): ReturnType<typeof vi.spyOn> {
  return vi
    .spyOn(HTMLAnchorElement.prototype, "click")
    .mockImplementation(() => {});
}

async function flushPromises(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

describe("copy and download", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    vi.useRealTimers();
    vi.restoreAllMocks();
    Reflect.deleteProperty(navigator, "clipboard");
  });

  function mountCanvas(): HTMLElement {
    const container = mountTool();
    typeCanonical(container);
    return container;
  }

  it("keeps Copy and Download disabled in the both-empty state and enables them after input", () => {
    const container = mountTool();
    const copy = hook<HTMLButtonElement>(container, "[data-copy-result]");
    const download = hook<HTMLButtonElement>(
      container,
      "[data-download-result]",
    );

    expect(copy.disabled).toBe(true);
    expect(download.disabled).toBe(true);

    fireEvent.input(textarea(container, "[data-list-a]"), {
      target: { value: "a" },
    });

    expect(copy.disabled).toBe(false);
    expect(download.disabled).toBe(false);

    fireEvent.click(hook(container, "[data-clear-list-a]"));

    expect(copy.disabled).toBe(true);
    expect(download.disabled).toBe(true);
  });

  it("copies the exact Differences formatted text", async () => {
    const writeText = mockClipboard();
    const container = mountCanvas();

    fireEvent.click(hook(container, "[data-copy-result]"));
    await flushPromises();

    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText).toHaveBeenCalledWith(
      "ONLY IN LIST A\nc\n\nONLY IN LIST B\nd\ne",
    );
  });

  it("copies the active formatted text after switching tabs", async () => {
    const writeText = mockClipboard();
    const container = mountCanvas();

    const expected: Array<{ tab: string; text: string }> = [
      { tab: "differences", text: "ONLY IN LIST A\nc\n\nONLY IN LIST B\nd\ne" },
      { tab: "onlyA", text: "c" },
      { tab: "onlyB", text: "d\ne" },
      { tab: "matches", text: "b\na" },
      { tab: "all", text: "b\na\nc\nd\ne" },
    ];

    for (const view of expected) {
      clickTab(container, view.tab);
      fireEvent.click(hook(container, "[data-copy-result]"));
      await flushPromises();
      expect(writeText).toHaveBeenLastCalledWith(view.text);
    }
    expect(writeText).toHaveBeenCalledTimes(expected.length);
  });

  it("never puts the empty-state UI copy into the clipboard", async () => {
    const writeText = mockClipboard();
    const container = mountTool();

    fireEvent.input(textarea(container, "[data-list-a]"), {
      target: { value: "A\nb" },
    });
    fireEvent.input(textarea(container, "[data-list-b]"), {
      target: { value: "a\nB" },
    });
    fireEvent.click(hook(container, "[data-option-ignore-case]"));

    expect(hook(container, "[data-result-viewer]").textContent).toBe(
      NO_DIFFERENCES_TEXT,
    );

    fireEvent.click(hook(container, "[data-copy-result]"));
    await flushPromises();

    expect(writeText).toHaveBeenCalledWith("ONLY IN LIST A\n\nONLY IN LIST B");
  });

  it("never puts the no-matches UI copy into the clipboard", async () => {
    const writeText = mockClipboard();
    const container = mountTool();

    fireEvent.input(textarea(container, "[data-list-a]"), {
      target: { value: "a" },
    });
    fireEvent.input(textarea(container, "[data-list-b]"), {
      target: { value: "b" },
    });
    clickTab(container, "matches");

    expect(hook(container, "[data-result-viewer]").textContent).toBe(
      "No matching values.",
    );

    fireEvent.click(hook(container, "[data-copy-result]"));
    await flushPromises();

    expect(writeText).toHaveBeenCalledWith("");
  });

  it("copies an empty string for an empty active result", async () => {
    const writeText = mockClipboard();
    const container = mountTool();

    fireEvent.input(textarea(container, "[data-list-a]"), {
      target: { value: "a" },
    });
    fireEvent.input(textarea(container, "[data-list-b]"), {
      target: { value: "a\nb" },
    });
    clickTab(container, "onlyA");

    fireEvent.click(hook(container, "[data-copy-result]"));
    await flushPromises();

    expect(writeText).toHaveBeenCalledWith("");
  });

  it("shows ✓ Copied feedback and resets after 2000 ms", async () => {
    vi.useFakeTimers();
    mockClipboard();
    const container = mountCanvas();
    const copy = hook<HTMLButtonElement>(container, "[data-copy-result]");
    const feedback = hook(container, "[data-local-feedback]");

    fireEvent.click(copy);
    await flushPromises();

    expect(copy.textContent).toBe(COPIED_BUTTON_TEXT);
    expect(feedback.textContent).toBe("Copied");

    vi.advanceTimersByTime(2000);

    expect(copy.textContent).toBe("Copy");
    expect(feedback.textContent).toBe("");
    expect(copy.disabled).toBe(false);
  });

  it("shows the exact local error on a rejected promise and resets after 4000 ms", async () => {
    vi.useFakeTimers();
    mockClipboard(true);
    const container = mountCanvas();
    const copy = hook<HTMLButtonElement>(container, "[data-copy-result]");
    const feedback = hook(container, "[data-local-feedback]");

    fireEvent.click(copy);
    await flushPromises();

    expect(feedback.textContent).toBe(COPY_ERROR_TEXT);
    expect(copy.textContent).toBe("Copy");
    expect(copy.disabled).toBe(false);

    vi.advanceTimersByTime(4000);

    expect(feedback.textContent).toBe("");
  });

  it("shows the exact local error when the Clipboard API is missing", () => {
    vi.useFakeTimers();
    const container = mountCanvas();
    const copy = hook<HTMLButtonElement>(container, "[data-copy-result]");
    const feedback = hook(container, "[data-local-feedback]");

    fireEvent.click(copy);

    expect(feedback.textContent).toBe(COPY_ERROR_TEXT);
    expect(copy.textContent).toBe("Copy");
    expect(copy.disabled).toBe(false);

    vi.advanceTimersByTime(4000);

    expect(feedback.textContent).toBe("");
    expect(copy.disabled).toBe(false);
  });

  it("shows the exact local error when the Clipboard API has no writeText", () => {
    vi.useFakeTimers();
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {},
    });
    const container = mountCanvas();
    const copy = hook<HTMLButtonElement>(container, "[data-copy-result]");
    const feedback = hook(container, "[data-local-feedback]");

    fireEvent.click(copy);

    expect(feedback.textContent).toBe(COPY_ERROR_TEXT);
    expect(copy.textContent).toBe("Copy");
    expect(copy.disabled).toBe(false);

    vi.advanceTimersByTime(4000);

    expect(feedback.textContent).toBe("");
    expect(copy.disabled).toBe(false);
  });

  it("a new Copy click restarts its own feedback interval", async () => {
    vi.useFakeTimers();
    mockClipboard(true);
    const container = mountCanvas();
    const copy = hook<HTMLButtonElement>(container, "[data-copy-result]");
    const feedback = hook(container, "[data-local-feedback]");

    fireEvent.click(copy);
    await flushPromises();
    expect(feedback.textContent).toBe(COPY_ERROR_TEXT);

    fireEvent.click(copy);
    await flushPromises();

    vi.advanceTimersByTime(2000);
    expect(feedback.textContent).toBe(COPY_ERROR_TEXT);

    vi.advanceTimersByTime(2000);
    expect(feedback.textContent).toBe("");
  });

  it("downloads a Blob with the exact text and MIME type", async () => {
    const { create } = mockUrls();
    mockAnchorClick();
    const container = mountCanvas();

    fireEvent.click(hook(container, "[data-download-result]"));

    const blob = create.mock.calls[0][0] as Blob;
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe("text/plain;charset=utf-8");
    expect(await blob.text()).toBe("ONLY IN LIST A\nc\n\nONLY IN LIST B\nd\ne");
  });

  it("uses stable filenames for every result view", () => {
    mockUrls();
    mockAnchorClick();
    const container = mountCanvas();

    const filenames: Record<string, string> = {
      differences: "compare-lists-differences.txt",
      onlyA: "compare-lists-only-a.txt",
      onlyB: "compare-lists-only-b.txt",
      matches: "compare-lists-matches.txt",
      all: "compare-lists-all.txt",
    };

    for (const [tab, filename] of Object.entries(filenames)) {
      clickTab(container, tab);
      fireEvent.click(hook(container, "[data-download-result]"));
      const instances = vi.mocked(HTMLAnchorElement.prototype.click).mock
        .instances;
      const anchor = instances[instances.length - 1] as HTMLAnchorElement;
      expect(anchor.download).toBe(filename);
    }
  });

  it("creates a temporary anchor with href and download, clicks it and removes it", () => {
    const { create } = mockUrls();
    const clickSpy = mockAnchorClick();
    const removeSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "remove")
      .mockImplementation(() => {});
    const container = mountCanvas();

    fireEvent.click(hook(container, "[data-download-result]"));

    const anchor = clickSpy.mock.instances[0] as HTMLAnchorElement;
    expect(anchor).toBeInstanceOf(HTMLAnchorElement);
    expect(anchor.getAttribute("href")).toBe(create.mock.results[0].value);
    expect(anchor.download).toBe("compare-lists-differences.txt");
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(removeSpy).toHaveBeenCalledTimes(1);
  });

  it("revokes each object URL exactly once, even when the anchor click throws", () => {
    const { create, revoke } = mockUrls();
    mockAnchorClick().mockImplementation(() => {
      throw new Error("boom");
    });
    const removeSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "remove")
      .mockImplementation(() => {});
    const container = mountCanvas();

    fireEvent.click(hook(container, "[data-download-result]"));

    expect(create).toHaveBeenCalledTimes(1);
    expect(revoke).toHaveBeenCalledTimes(1);
    expect(revoke).toHaveBeenCalledWith("blob:mock-1");
    expect(removeSpy).toHaveBeenCalledTimes(1);
  });

  it("revokes the object URL exactly once on a normal download", () => {
    const { revoke } = mockUrls();
    mockAnchorClick();
    const container = mountCanvas();

    fireEvent.click(hook(container, "[data-download-result]"));
    fireEvent.click(hook(container, "[data-download-result]"));

    expect(revoke).toHaveBeenCalledTimes(2);
    expect(revoke.mock.calls.map((call) => call[0])).toEqual([
      "blob:mock-1",
      "blob:mock-1",
    ]);
  });

  it("supports the complete flow: input → summary → tab → copy → download", async () => {
    const writeText = mockClipboard();
    const { create } = mockUrls();
    mockAnchorClick();
    const container = mountTool();

    typeCanonical(container);
    expect(hook(container, "[data-summary-only-a]").textContent).toBe("1");

    clickTab(container, "matches");
    expect(hook(container, "[data-result-count]").textContent).toBe("2 items");

    fireEvent.click(hook(container, "[data-copy-result]"));
    await flushPromises();
    expect(writeText).toHaveBeenCalledWith("b\na");

    fireEvent.click(hook(container, "[data-download-result]"));

    const blob = create.mock.calls[0][0] as Blob;
    expect(await blob.text()).toBe("b\na");
    const instances = vi.mocked(HTMLAnchorElement.prototype.click).mock
      .instances;
    expect(
      (instances[instances.length - 1] as HTMLAnchorElement).download,
    ).toBe("compare-lists-matches.txt");
  });

  it("does not duplicate copy/download side effects on double mount", async () => {
    const writeText = mockClipboard();
    const { create, revoke } = mockUrls();
    mockAnchorClick();
    const container = mountCanvas();

    mountCompareTool(container);
    mountCompareTool(container);

    fireEvent.click(hook(container, "[data-copy-result]"));
    await flushPromises();
    expect(writeText).toHaveBeenCalledTimes(1);

    fireEvent.click(hook(container, "[data-download-result]"));
    fireEvent.click(hook(container, "[data-download-result]"));
    expect(create).toHaveBeenCalledTimes(2);
    expect(revoke).toHaveBeenCalledTimes(2);
  });
});
