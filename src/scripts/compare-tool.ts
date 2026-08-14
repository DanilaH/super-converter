import { compareLists } from "../features/compare-lists/lib/compare-lists";
import { formatResult } from "../features/compare-lists/lib/format-result";
import type {
  CompareOptions,
  CompareResult,
  FormattedResult,
  ResultType,
} from "../features/compare-lists/model/types";

type ToolState = {
  listA: string;
  listB: string;
  options: CompareOptions;
  activeResult: ResultType;
  copyTimer: number | null;
};

type Labels = {
  row: string;
  rows: string;
  item: string;
  items: string;
  noDifferences: string;
  sameValues: string;
  noMatches: string;
  copy: string;
  copied: string;
  copyError: string;
};

type Hooks = {
  listA: HTMLTextAreaElement;
  listB: HTMLTextAreaElement;
  listACount: HTMLOutputElement;
  listBCount: HTMLOutputElement;
  clearListA: HTMLButtonElement;
  clearListB: HTMLButtonElement;
  swap: HTMLButtonElement;
  loadExample: HTMLButtonElement;
  trimWhitespace: HTMLInputElement;
  ignoreEmptyLines: HTMLInputElement;
  ignoreCase: HTMLInputElement;
  removeDuplicates: HTMLInputElement;
  results: HTMLElement;
  emptyResults: HTMLElement;
  summary: HTMLElement;
  summaryOnlyA: HTMLElement;
  summaryMatches: HTMLElement;
  summaryOnlyB: HTMLElement;
  resultTabs: HTMLElement;
  resultPanel: HTMLElement;
  resultHeading: HTMLElement;
  resultCount: HTMLElement;
  resultViewer: HTMLElement;
  copyResult: HTMLButtonElement;
  downloadResult: HTMLButtonElement;
  localFeedback: HTMLElement;
  tabs: HTMLButtonElement[];
};

const RESULT_TYPES: readonly ResultType[] = [
  "differences",
  "onlyA",
  "onlyB",
  "matches",
  "all",
];

const EXAMPLE_A = [
  "alice@example.com",
  "bob@example.com",
  "carol@example.com",
].join("\n");

const EXAMPLE_B = [
  "bob@example.com",
  "carol@example.com",
  "dave@example.com",
].join("\n");

const mountedRoots = new WeakSet<HTMLElement>();

export function mountCompareTool(scope: ParentNode = document): void {
  for (const root of findRoots(scope)) {
    mountRoot(root);
  }
}

function findRoots(scope: ParentNode): HTMLElement[] {
  if (scope instanceof HTMLElement && scope.matches("[data-compare-tool]")) {
    return [scope];
  }
  return Array.from(scope.querySelectorAll<HTMLElement>("[data-compare-tool]"));
}

function mountRoot(root: HTMLElement): void {
  if (mountedRoots.has(root)) {
    return;
  }

  const hooks = findHooks(root);
  const labels = readLabels(root);

  const state: ToolState = {
    listA: hooks.listA.value,
    listB: hooks.listB.value,
    options: {
      trimWhitespace: hooks.trimWhitespace.checked,
      ignoreEmptyLines: hooks.ignoreEmptyLines.checked,
      ignoreCase: hooks.ignoreCase.checked,
      removeDuplicates: hooks.removeDuplicates.checked,
    },
    activeResult: readActiveResult(root),
    copyTimer: null,
  };

  const recompute = createRecompute(hooks, labels, state);

  hooks.listA.addEventListener("input", () => {
    state.listA = hooks.listA.value;
    recompute();
  });
  hooks.listB.addEventListener("input", () => {
    state.listB = hooks.listB.value;
    recompute();
  });
  hooks.trimWhitespace.addEventListener("change", () => {
    state.options.trimWhitespace = hooks.trimWhitespace.checked;
    recompute();
  });
  hooks.ignoreEmptyLines.addEventListener("change", () => {
    state.options.ignoreEmptyLines = hooks.ignoreEmptyLines.checked;
    recompute();
  });
  hooks.ignoreCase.addEventListener("change", () => {
    state.options.ignoreCase = hooks.ignoreCase.checked;
    recompute();
  });
  hooks.removeDuplicates.addEventListener("change", () => {
    state.options.removeDuplicates = hooks.removeDuplicates.checked;
    recompute();
  });
  hooks.clearListA.addEventListener("click", () => {
    hooks.listA.value = "";
    state.listA = "";
    recompute();
  });
  hooks.clearListB.addEventListener("click", () => {
    hooks.listB.value = "";
    state.listB = "";
    recompute();
  });
  hooks.swap.addEventListener("click", () => {
    const previousA = hooks.listA.value;
    hooks.listA.value = hooks.listB.value;
    hooks.listB.value = previousA;
    state.listA = hooks.listA.value;
    state.listB = hooks.listB.value;
    recompute();
  });
  hooks.loadExample.addEventListener("click", () => {
    hooks.listA.value = EXAMPLE_A;
    hooks.listB.value = EXAMPLE_B;
    state.listA = EXAMPLE_A;
    state.listB = EXAMPLE_B;
    recompute();
  });

  setupTabs(hooks, state, recompute);
  setupCopy(hooks, labels, state);
  setupDownload(hooks, state);

  hooks.copyResult.disabled = false;
  hooks.downloadResult.disabled = false;
  hooks.clearListA.disabled = false;
  hooks.clearListB.disabled = false;
  hooks.swap.disabled = false;
  hooks.loadExample.disabled = false;

  mountedRoots.add(root);

  recompute();
}

function findHooks(root: HTMLElement): Hooks {
  return {
    listA: requireElement(root, "[data-list-a]"),
    listB: requireElement(root, "[data-list-b]"),
    listACount: requireElement(root, "[data-list-a-count]"),
    listBCount: requireElement(root, "[data-list-b-count]"),
    clearListA: requireElement(root, "[data-clear-list-a]"),
    clearListB: requireElement(root, "[data-clear-list-b]"),
    swap: requireElement(root, "[data-swap-lists]"),
    loadExample: requireElement(root, "[data-load-example]"),
    trimWhitespace: requireElement(root, "[data-option-trim-whitespace]"),
    ignoreEmptyLines: requireElement(root, "[data-option-ignore-empty-lines]"),
    ignoreCase: requireElement(root, "[data-option-ignore-case]"),
    removeDuplicates: requireElement(root, "[data-option-remove-duplicates]"),
    results: requireElement(root, "[data-results]"),
    emptyResults: requireElement(root, "[data-empty-results]"),
    summary: requireElement(root, "[data-summary]"),
    summaryOnlyA: requireElement(root, "[data-summary-only-a]"),
    summaryMatches: requireElement(root, "[data-summary-matches]"),
    summaryOnlyB: requireElement(root, "[data-summary-only-b]"),
    resultTabs: requireElement(root, "[data-result-tabs]"),
    resultPanel: requireElement(root, "[data-result-panel]"),
    resultHeading: requireElement(root, "[data-result-heading]"),
    resultCount: requireElement(root, "[data-result-count]"),
    resultViewer: requireElement(root, "[data-result-viewer]"),
    copyResult: requireElement(root, "[data-copy-result]"),
    downloadResult: requireElement(root, "[data-download-result]"),
    localFeedback: requireElement(root, "[data-local-feedback]"),
    tabs: Array.from(
      root.querySelectorAll<HTMLButtonElement>("[data-result-tab]"),
    ),
  };
}

function requireElement<T extends Element>(
  root: HTMLElement,
  selector: string,
): T {
  const element = root.querySelector<T>(selector);
  if (!element) {
    throw new Error(`CompareTool: missing required hook ${selector}`);
  }
  return element;
}

function readLabels(root: HTMLElement): Labels {
  const labels: Labels = {
    row: root.dataset.labelRow ?? "",
    rows: root.dataset.labelRows ?? "",
    item: root.dataset.labelItem ?? "",
    items: root.dataset.labelItems ?? "",
    noDifferences: root.dataset.labelNoDifferences ?? "",
    sameValues: root.dataset.labelSameValues ?? "",
    noMatches: root.dataset.labelNoMatches ?? "",
    copy: root.dataset.labelCopy ?? "",
    copied: root.dataset.labelCopied ?? "",
    copyError: root.dataset.labelCopyError ?? "",
  };
  for (const [name, value] of Object.entries(labels)) {
    if (value === "") {
      throw new Error(`CompareTool: missing required hook data-label-${name}`);
    }
  }
  return labels;
}

function readActiveResult(root: HTMLElement): ResultType {
  const selectedTab = root.querySelector<HTMLElement>(
    '[data-result-tab][aria-selected="true"]',
  );
  if (!selectedTab) {
    throw new Error(
      'CompareTool: missing required hook [data-result-tab][aria-selected="true"]',
    );
  }
  const value = selectedTab.dataset.resultTab ?? "";
  if (!isResultType(value)) {
    throw new Error(`CompareTool: unknown result type "${value}"`);
  }
  return value;
}

function isResultType(value: string): value is ResultType {
  return RESULT_TYPES.some((type) => type === value);
}

function createRecompute(
  hooks: Hooks,
  labels: Labels,
  state: ToolState,
): () => void {
  return () => {
    if (state.listA === "" && state.listB === "") {
      hooks.results.hidden = false;
      hooks.emptyResults.hidden = false;
      hooks.summary.hidden = true;
      hooks.resultTabs.hidden = true;
      hooks.resultPanel.hidden = true;
      hooks.copyResult.disabled = true;
      hooks.downloadResult.disabled = true;
      hooks.resultViewer.textContent = "";
      hooks.resultCount.textContent = `0 ${labels.items}`;
      hooks.listACount.textContent = `0 ${labels.rows}`;
      hooks.listBCount.textContent = `0 ${labels.rows}`;
      return;
    }

    const result = compareLists(state.listA, state.listB, state.options);

    hooks.results.hidden = false;
    hooks.emptyResults.hidden = true;
    hooks.summary.hidden = false;
    hooks.resultTabs.hidden = false;
    hooks.resultPanel.hidden = false;
    hooks.copyResult.disabled = false;
    hooks.downloadResult.disabled = false;
    hooks.listACount.textContent = pluralize(
      result.stats.rowsA,
      labels.row,
      labels.rows,
    );
    hooks.listBCount.textContent = pluralize(
      result.stats.rowsB,
      labels.row,
      labels.rows,
    );
    hooks.summaryOnlyA.textContent = String(result.stats.onlyA);
    hooks.summaryMatches.textContent = String(result.stats.matches);
    hooks.summaryOnlyB.textContent = String(result.stats.onlyB);

    renderResult(hooks, labels, state, result);
  };
}

function renderResult(
  hooks: Hooks,
  labels: Labels,
  state: ToolState,
  result: CompareResult,
): void {
  const count = resultCountFor(state.activeResult, result);
  hooks.resultCount.textContent = pluralize(count, labels.item, labels.items);

  if (count === 0) {
    if (state.activeResult === "differences") {
      hooks.resultViewer.textContent = `${labels.noDifferences}\n\n${labels.sameValues}`;
      return;
    }
    if (state.activeResult === "matches") {
      hooks.resultViewer.textContent = labels.noMatches;
      return;
    }
  }

  hooks.resultViewer.textContent = formatResult(
    result,
    state.activeResult,
  ).text;
}

function resultCountFor(type: ResultType, result: CompareResult): number {
  switch (type) {
    case "differences":
      return result.differences.length;
    case "onlyA":
      return result.onlyA.length;
    case "onlyB":
      return result.onlyB.length;
    case "matches":
      return result.matches.length;
    case "all":
      return result.union.length;
  }
}

function getCurrentFormatted(state: ToolState): FormattedResult {
  const result = compareLists(state.listA, state.listB, state.options);
  return formatResult(result, state.activeResult);
}

function setupCopy(hooks: Hooks, labels: Labels, state: ToolState): void {
  hooks.copyResult.addEventListener("click", () => {
    if (state.listA === "" && state.listB === "") {
      return;
    }
    const formatted = getCurrentFormatted(state);
    clearCopyTimer(state);
    hooks.copyResult.disabled = true;

    const clipboard = navigator.clipboard;
    const writeText = clipboard?.writeText;
    if (!writeText) {
      showCopyError(hooks, labels, state);
      return;
    }

    writeText
      .call(clipboard, formatted.text)
      .then(() => {
        hooks.copyResult.textContent = `\u2713 ${labels.copied}`;
        hooks.localFeedback.textContent = labels.copied;
        hooks.localFeedback.dataset.state = "success";
        state.copyTimer = window.setTimeout(() => {
          hooks.copyResult.textContent = labels.copy;
          hooks.localFeedback.textContent = "";
          delete hooks.localFeedback.dataset.state;
          state.copyTimer = null;
        }, 2000);
      })
      .catch(() => {
        showCopyError(hooks, labels, state);
      })
      .finally(() => {
        hooks.copyResult.disabled = state.listA === "" && state.listB === "";
      });
  });
}

function showCopyError(hooks: Hooks, labels: Labels, state: ToolState): void {
  clearCopyTimer(state);
  hooks.copyResult.textContent = labels.copy;
  hooks.localFeedback.textContent = labels.copyError;
  hooks.localFeedback.dataset.state = "error";
  state.copyTimer = window.setTimeout(() => {
    hooks.localFeedback.textContent = "";
    delete hooks.localFeedback.dataset.state;
    state.copyTimer = null;
  }, 4000);
}

function clearCopyTimer(state: ToolState): void {
  if (state.copyTimer !== null) {
    window.clearTimeout(state.copyTimer);
    state.copyTimer = null;
  }
}

function setupDownload(hooks: Hooks, state: ToolState): void {
  hooks.downloadResult.addEventListener("click", () => {
    if (state.listA === "" && state.listB === "") {
      return;
    }
    const formatted = getCurrentFormatted(state);
    const blob = new Blob([formatted.text], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = hooks.resultPanel.ownerDocument.createElement("a");
    anchor.href = url;
    anchor.download = formatted.filename;
    try {
      anchor.click();
    } catch {
      return;
    } finally {
      anchor.remove();
      URL.revokeObjectURL(url);
    }
  });
}

function setupTabs(
  hooks: Hooks,
  state: ToolState,
  recompute: () => void,
): void {
  const tabs = hooks.tabs;

  const selectTab = (tab: HTMLButtonElement): void => {
    const value = tab.dataset.resultTab ?? "";
    if (!isResultType(value)) {
      return;
    }
    state.activeResult = value;
    for (const candidate of tabs) {
      const selected = candidate === tab;
      candidate.setAttribute("aria-selected", String(selected));
      candidate.tabIndex = selected ? 0 : -1;
    }
    hooks.resultPanel.setAttribute("aria-labelledby", tab.id);
    hooks.resultHeading.textContent = tab.textContent;
    recompute();
  };

  for (const [index, tab] of tabs.entries()) {
    tab.addEventListener("click", () => {
      selectTab(tab);
    });
    tab.addEventListener("keydown", (event) => {
      const nextIndex = nextTabIndex(tabs.length, index, event);
      if (nextIndex === null) {
        return;
      }
      event.preventDefault();
      selectTab(tabs[nextIndex]);
      tabs[nextIndex].focus();
    });
  }

  const activeTab = tabs.find(
    (tab) => tab.dataset.resultTab === state.activeResult,
  );
  if (activeTab) {
    hooks.resultPanel.setAttribute("aria-labelledby", activeTab.id);
    hooks.resultHeading.textContent = activeTab.textContent;
  }
}

function nextTabIndex(
  count: number,
  current: number,
  event: KeyboardEvent,
): number | null {
  switch (event.key) {
    case "ArrowRight":
      return (current + 1) % count;
    case "ArrowLeft":
      return (current - 1 + count) % count;
    case "Home":
      return 0;
    case "End":
      return count - 1;
    default:
      return null;
  }
}

function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
