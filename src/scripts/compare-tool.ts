import { compareLists } from "../features/compare-lists/lib/compare-lists";
import { formatResult } from "../features/compare-lists/lib/format-result";
import type {
  CompareOptions,
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
  resultCount: HTMLElement;
  resultViewer: HTMLElement;
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
    resultCount: requireElement(root, "[data-result-count]"),
    resultViewer: requireElement(root, "[data-result-viewer]"),
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
      hooks.results.hidden = true;
      hooks.resultViewer.textContent = "";
      hooks.resultCount.textContent = `0 ${labels.items}`;
      hooks.listACount.textContent = `0 ${labels.rows}`;
      hooks.listBCount.textContent = `0 ${labels.rows}`;
      return;
    }

    hooks.results.hidden = false;
    const result = compareLists(state.listA, state.listB, state.options);
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
    hooks.resultViewer.textContent = formatResult(
      result,
      state.activeResult,
    ).text;
    hooks.resultCount.textContent = pluralize(
      result.differences.length,
      labels.item,
      labels.items,
    );
  };
}

function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
