import { alphabetizeList } from "../features/alphabetize-list/lib/alphabetize-list";
import type {
  AlphabetizeOptions,
  AlphabetizeResult,
  AlphabetizeOrder,
} from "../features/alphabetize-list/model/types";

const EXAMPLE = ["Banana", "apple", "Item 10", "Cherry", "item 2"].join("\n");
const DOWNLOAD_FILENAME = "alphabetized-list.txt";

type ToolState = {
  input: string;
  options: AlphabetizeOptions;
  result: AlphabetizeResult;
  copyTimer: number | null;
};

type Labels = {
  item: string;
  items: string;
  emptyResult: string;
  noEffectiveItems: string;
  copy: string;
  copied: string;
  copyError: string;
  replaceExampleConfirmation: string;
};

type Hooks = {
  input: HTMLTextAreaElement;
  clear: HTMLButtonElement;
  loadExample: HTMLButtonElement;
  trimWhitespace: HTMLInputElement;
  ignoreEmptyLines: HTMLInputElement;
  order: HTMLSelectElement;
  resultCount: HTMLElement;
  emptyResult: HTMLElement;
  viewer: HTMLElement;
  copy: HTMLButtonElement;
  download: HTMLButtonElement;
  localFeedback: HTMLElement;
};

const mountedRoots = new WeakSet<HTMLElement>();

export function mountAlphabetizeTool(scope: ParentNode = document): void {
  for (const root of findRoots(scope)) {
    mountRoot(root);
  }
}

function findRoots(scope: ParentNode): HTMLElement[] {
  if (scope instanceof HTMLElement && scope.matches("[data-alphabetize-tool]")) {
    return [scope];
  }
  return Array.from(
    scope.querySelectorAll<HTMLElement>("[data-alphabetize-tool]"),
  );
}

function mountRoot(root: HTMLElement): void {
  if (mountedRoots.has(root)) {
    return;
  }

  const hooks = findHooks(root);
  const labels = readLabels(root);
  const state: ToolState = {
    input: hooks.input.value,
    options: {
      trimWhitespace: hooks.trimWhitespace.checked,
      ignoreEmptyLines: hooks.ignoreEmptyLines.checked,
      order: readOrder(hooks.order.value),
    },
    result: { items: [], text: "" },
    copyTimer: null,
  };

  const recompute = (): void => {
    resetCopyFeedback(hooks, labels, state);
    state.result = alphabetizeList(state.input, state.options);
    render(hooks, labels, state);
  };

  hooks.input.addEventListener("input", () => {
    state.input = hooks.input.value;
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

  hooks.order.addEventListener("change", () => {
    state.options.order = readOrder(hooks.order.value);
    recompute();
  });

  hooks.clear.addEventListener("click", () => {
    hooks.input.value = "";
    state.input = "";
    recompute();
    hooks.input.focus();
  });

  hooks.loadExample.addEventListener("click", () => {
    if (
      state.input !== "" &&
      !window.confirm(labels.replaceExampleConfirmation)
    ) {
      return;
    }
    hooks.input.value = EXAMPLE;
    state.input = EXAMPLE;
    recompute();
    hooks.input.focus();
  });

  setupCopy(hooks, labels, state);
  setupDownload(hooks, state);

  hooks.loadExample.disabled = false;
  mountedRoots.add(root);
  recompute();
}

function render(hooks: Hooks, labels: Labels, state: ToolState): void {
  hooks.clear.disabled = state.input === "";
  hooks.resultCount.textContent = pluralize(
    state.result.items.length,
    labels.item,
    labels.items,
  );

  const hasItems = state.result.items.length > 0;
  const hasExportableText = state.result.text.length > 0;

  hooks.emptyResult.hidden = hasItems;
  if (!hasItems) {
    hooks.emptyResult.textContent =
      state.input === "" ? labels.emptyResult : labels.noEffectiveItems;
  }

  hooks.viewer.hidden = !hasItems;
  hooks.viewer.textContent = hasItems ? state.result.text : "";
  hooks.copy.disabled = !hasExportableText;
  hooks.download.disabled = !hasExportableText;
}

function setupCopy(hooks: Hooks, labels: Labels, state: ToolState): void {
  hooks.copy.addEventListener("click", () => {
    const text = state.result.text;
    if (text === "") {
      return;
    }

    resetCopyFeedback(hooks, labels, state);
    hooks.copy.disabled = true;
    const clipboard = navigator.clipboard;
    const writeText = clipboard?.writeText;

    if (!writeText) {
      hooks.copy.disabled = false;
      showCopyError(hooks, labels, state);
      return;
    }

    writeText
      .call(clipboard, text)
      .then(() => {
        if (state.result.text !== text) {
          return;
        }
        hooks.copy.textContent = `\u2713 ${labels.copied}`;
        hooks.localFeedback.textContent = labels.copied;
        hooks.localFeedback.dataset.state = "success";
        state.copyTimer = window.setTimeout(() => {
          hooks.copy.textContent = labels.copy;
          hooks.localFeedback.textContent = "";
          delete hooks.localFeedback.dataset.state;
          state.copyTimer = null;
        }, 2000);
      })
      .catch(() => {
        if (state.result.text === text) {
          showCopyError(hooks, labels, state);
        }
      })
      .finally(() => {
        if (state.result.text === text) {
          hooks.copy.disabled = false;
        }
      });
  });
}

function setupDownload(hooks: Hooks, state: ToolState): void {
  hooks.download.addEventListener("click", () => {
    if (state.result.text === "") {
      return;
    }

    const blob = new Blob([state.result.text], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = hooks.viewer.ownerDocument.createElement("a");
    anchor.href = url;
    anchor.download = DOWNLOAD_FILENAME;
    try {
      anchor.click();
    } finally {
      anchor.remove();
      URL.revokeObjectURL(url);
    }
  });
}

function showCopyError(hooks: Hooks, labels: Labels, state: ToolState): void {
  clearCopyTimer(state);
  hooks.copy.textContent = labels.copy;
  hooks.localFeedback.textContent = labels.copyError;
  hooks.localFeedback.dataset.state = "error";
  state.copyTimer = window.setTimeout(() => {
    hooks.localFeedback.textContent = "";
    delete hooks.localFeedback.dataset.state;
    state.copyTimer = null;
  }, 4000);
}

function resetCopyFeedback(
  hooks: Hooks,
  labels: Labels,
  state: ToolState,
): void {
  clearCopyTimer(state);
  hooks.copy.textContent = labels.copy;
  hooks.localFeedback.textContent = "";
  delete hooks.localFeedback.dataset.state;
}

function clearCopyTimer(state: ToolState): void {
  if (state.copyTimer !== null) {
    window.clearTimeout(state.copyTimer);
    state.copyTimer = null;
  }
}

function findHooks(root: HTMLElement): Hooks {
  return {
    input: requireElement(root, "[data-list-input]"),
    clear: requireElement(root, "[data-clear-list]"),
    loadExample: requireElement(root, "[data-load-example]"),
    trimWhitespace: requireElement(root, "[data-option-trim-whitespace]"),
    ignoreEmptyLines: requireElement(root, "[data-option-ignore-empty-lines]"),
    order: requireElement(root, "[data-order]"),
    resultCount: requireElement(root, "[data-result-count]"),
    emptyResult: requireElement(root, "[data-empty-result]"),
    viewer: requireElement(root, "[data-result-viewer]"),
    copy: requireElement(root, "[data-copy-result]"),
    download: requireElement(root, "[data-download-result]"),
    localFeedback: requireElement(root, "[data-local-feedback]"),
  };
}

function requireElement<T extends Element>(
  root: HTMLElement,
  selector: string,
): T {
  const element = root.querySelector<T>(selector);
  if (!element) {
    throw new Error(`AlphabetizeTool: missing required hook ${selector}`);
  }
  return element;
}

function readLabels(root: HTMLElement): Labels {
  const labels: Labels = {
    item: root.dataset.labelItem ?? "",
    items: root.dataset.labelItems ?? "",
    emptyResult: root.dataset.labelEmptyResult ?? "",
    noEffectiveItems: root.dataset.labelNoEffectiveItems ?? "",
    copy: root.dataset.labelCopy ?? "",
    copied: root.dataset.labelCopied ?? "",
    copyError: root.dataset.labelCopyError ?? "",
    replaceExampleConfirmation:
      root.dataset.labelReplaceExampleConfirmation ?? "",
  };

  for (const [name, value] of Object.entries(labels)) {
    if (value === "") {
      throw new Error(`AlphabetizeTool: missing required label ${name}`);
    }
  }
  return labels;
}

function readOrder(value: string): AlphabetizeOrder {
  if (value === "asc" || value === "desc") {
    return value;
  }
  throw new Error(`AlphabetizeTool: unknown order "${value}"`);
}

function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
