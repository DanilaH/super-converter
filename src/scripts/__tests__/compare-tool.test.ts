import { fireEvent, within } from "@testing-library/dom";
import { afterEach, describe, expect, it } from "vitest";
import { mountCompareTool } from "../compare-tool";

const TOOL_HTML = `
  <section
    data-compare-tool
    aria-labelledby="compare-tool-heading"
    data-label-row="row"
    data-label-rows="rows"
    data-label-item="item"
    data-label-items="items"
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

      <dl data-summary class="summary" hidden>
        <div class="summary-item">
          <dt>Only A</dt>
          <dd data-summary-only-a>0</dd>
        </div>
        <div class="summary-item">
          <dt>Matches</dt>
          <dd data-summary-matches>0</dd>
        </div>
        <div class="summary-item">
          <dt>Only B</dt>
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

      <div role="tabpanel" id="result-panel" class="panel" aria-labelledby="tab-differences" data-result-panel>
        <h4 class="panel-heading" data-result-heading>Differences</h4>
        <p class="panel-count" data-result-count>0 items</p>
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

describe("compare-tool", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("mounts with zero counters, hidden results and enabled action buttons", () => {
    const container = mountTool();

    expect(within(container).getAllByText("0 rows")).toHaveLength(2);
    expect(hook(container, "[data-result-count]").textContent).toBe("0 items");
    expect(hook(container, "[data-results]").hidden).toBe(true);
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

  it("updates counters and shows results on manual input in both lists", () => {
    const container = mountTool();

    fireEvent.input(textarea(container, "[data-list-a]"), {
      target: { value: "a\nb\nc" },
    });

    expect(hook(container, "[data-list-a-count]").textContent).toBe("3 rows");
    expect(hook(container, "[data-results]").hidden).toBe(false);

    fireEvent.input(textarea(container, "[data-list-b]"), {
      target: { value: "x\ny" },
    });

    expect(hook(container, "[data-list-b-count]").textContent).toBe("2 rows");
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
    const matchText = "ONLY IN LIST A\n\nONLY IN LIST B";

    expect(viewer.textContent).toBe(fullText);

    fireEvent.click(hook(container, "[data-option-ignore-case]"));
    expect(viewer.textContent).toBe(matchText);

    fireEvent.click(hook(container, "[data-option-trim-whitespace]"));
    expect(viewer.textContent).toBe(fullText);

    fireEvent.click(hook(container, "[data-option-ignore-empty-lines]"));
    expect(viewer.textContent).toBe(fullText);

    fireEvent.click(hook(container, "[data-option-remove-duplicates]"));
    expect(viewer.textContent).toBe(fullText);
  });

  it("shows the exact Differences text and count", () => {
    const container = mountTool();

    fireEvent.input(textarea(container, "[data-list-a]"), {
      target: { value: "b\na\nb\nc" },
    });
    fireEvent.input(textarea(container, "[data-list-b]"), {
      target: { value: "a\nd\nb\ne\nd" },
    });

    expect(hook(container, "[data-result-viewer]").textContent).toBe(
      "ONLY IN LIST A\nc\n\nONLY IN LIST B\nd\ne",
    );
    expect(hook(container, "[data-result-count]").textContent).toBe("3 items");
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
      "ONLY IN LIST A\n\nONLY IN LIST B",
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

  it("swap preserves whitespace, trailing newline, options, selected tab and focus", () => {
    const container = mountTool();
    const listA = textarea(container, "[data-list-a]");
    const ignoreCase = hook<HTMLInputElement>(
      container,
      "[data-option-ignore-case]",
    );

    fireEvent.input(listA, { target: { value: " a \n" } });
    fireEvent.input(textarea(container, "[data-list-b]"), {
      target: { value: "b  \r\n" },
    });
    fireEvent.click(ignoreCase);
    listA.focus();

    fireEvent.click(hook(container, "[data-swap-lists]"));

    expect(listA.value).toBe("b  \n");
    expect(textarea(container, "[data-list-b]").value).toBe(" a \n");
    expect(ignoreCase.checked).toBe(true);
    expect(
      hook(container, '[data-result-tab="differences"]').getAttribute(
        "aria-selected",
      ),
    ).toBe("true");
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
    expect(hook(container, "[data-results]").hidden).toBe(false);
    expect(hook(container, "[data-result-viewer]").textContent).toBe(
      "ONLY IN LIST A\nalice@example.com\n\nONLY IN LIST B\ndave@example.com",
    );
  });

  it("hides results and clears the viewer when both raw values are empty again", () => {
    const container = mountTool();

    fireEvent.input(textarea(container, "[data-list-a]"), {
      target: { value: "a" },
    });
    fireEvent.input(textarea(container, "[data-list-b]"), {
      target: { value: "b" },
    });
    expect(hook(container, "[data-results]").hidden).toBe(false);

    fireEvent.input(textarea(container, "[data-list-a]"), {
      target: { value: "" },
    });
    fireEvent.input(textarea(container, "[data-list-b]"), {
      target: { value: "" },
    });

    expect(hook(container, "[data-results]").hidden).toBe(true);
    expect(hook(container, "[data-result-viewer]").textContent).toBe("");
    expect(hook(container, "[data-result-count]").textContent).toBe("0 items");
  });

  it("keeps summary and tablist hidden", () => {
    const container = mountTool();

    fireEvent.input(textarea(container, "[data-list-a]"), {
      target: { value: "a" },
    });

    expect(hook(container, "[data-summary]").hidden).toBe(true);
    expect(hook(container, "[data-result-tabs]").hidden).toBe(true);
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
