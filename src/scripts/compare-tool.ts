import { compareLists } from "../features/compare-lists/lib/compare-lists";
import { formatResult } from "../features/compare-lists/lib/format-result";
import type {
  CompareOptions,
  CompareResult,
  ResultType,
} from "../features/compare-lists/model/types";

type ToolState = {
  listA: string;
  listB: string;
  options: CompareOptions;
  activeResult: ResultType;
};

type Labels = {
  row: string;
  rows: string;
  item: string;
  items: string;
  noDifferences: string;
  sameValues: string;
  noMatches: string;
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
