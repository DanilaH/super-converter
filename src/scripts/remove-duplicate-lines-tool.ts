import { removeDuplicateLines } from "../features/remove-duplicate-lines/lib/remove-duplicate-lines";
import type {
  RemoveDuplicateLinesOptions,
  RemoveDuplicateLinesResult,
} from "../features/remove-duplicate-lines/model/types";

const EXAMPLE = ["Apple", "Banana", "Apple", "Cherry", "banana"].join("\n");
const DOWNLOAD_FILENAME = "unique-lines.txt";

type ToolState = {
  input: string;
  options: RemoveDuplicateLinesOptions;
  result: RemoveDuplicateLinesResult;
  copyTimer: number | null;
};

type CopySnapshot = {
  input: string;
  options: RemoveDuplicateLinesOptions;
  text: string;
};

type Labels = {
  item: string;
  items: string;
  emptyResult: string;
  noEffectiveItems: string;
  input: string;
  unique: string;
  removed: string;
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
  ignoreCase: HTMLInputElement;
  summary: HTMLElement;
  summaryInput: HTMLElement;
  summaryUnique: HTMLElement;
  summaryRemoved: HTMLElement;
  resultCount: HTMLElement;
  emptyResult: HTMLElement;
  viewer: HTMLElement;
  copy: HTMLButtonElement;
  download: HTMLButtonElement;
  localFeedback: HTMLElement;
};

const mountedRoots = new WeakSet<HTMLElement>();

export function mountRemoveDuplicateLinesTool(
  scope: ParentNode = document,
): void {
  for (const root of findRoots(scope)) {
    mountRoot(root);
  }
}

function findRoots(scope: ParentNode): HTMLElement[] {
  if (
    scope instanceof HTMLElement &&
    scope.matches("[data-remove-duplicate-lines-tool]")
  ) {
    return [scope];
  }
  return Array.from(
    scope.querySelectorAll<HTMLElement>("[data-remove-duplicate-lines-tool]"),
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
      ignoreCase: hooks.ignoreCase.checked,
    },
    result: emptyResult(),
    copyTimer: null,
  };

  const recompute = (): void => {
    resetCopyFeedback(hooks, labels, state);
    state.result = removeDuplicateLines(state.input, state.options);
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

  hooks.ignoreCase.addEventListener("change", () => {
    state.options.ignoreCase = hooks.ignoreCase.checked;
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

function emptyResult(): RemoveDuplicateLinesResult {
  return {
    items: [],
    text: "",
    stats: { input: 0, unique: 0, removed: 0 },
  };
}

function render(hooks: Hooks, labels: Labels, state: ToolState): void {
  hooks.clear.disabled = state.input === "";
  hooks.summary.hidden = false;
  hooks.summaryInput.textContent = `${labels.input}: ${state.result.stats.input}`;
  hooks.summaryUnique.textContent = `${labels.unique}: ${state.result.stats.unique}`;
  hooks.summaryRemoved.textContent = `${labels.removed}: ${state.result.stats.removed}`;
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

function captureCopySnapshot(state: ToolState): CopySnapshot {
  return {
    input: state.input,
    options: { ...state.options },
    text: state.result.text,
  };
}

function isCopySnapshotCurrent(
  state: ToolState,
  snapshot: CopySnapshot,
): boolean {
  return (
    state.input === snapshot.input &&
    state.options.trimWhitespace === snapshot.options.trimWhitespace &&
    state.options.ignoreEmptyLines === snapshot.options.ignoreEmptyLines &&
    state.options.ignoreCase === snapshot.options.ignoreCase &&
    state.result.text === snapshot.text
  );
}

function setupCopy(hooks: Hooks, labels: Labels, state: ToolState): void {
  hooks.copy.addEventListener("click", () => {
    const snapshot = captureCopySnapshot(state);
    if (snapshot.text === "") {
      return;
    }

    resetCopyFeedback(hooks, labels, state);
    hooks.copy.disabled = true;
    const clipboard = navigator.clipboard;
    const writeText = clipboard?.writeText;

    if (!writeText) {
      hooks.copy.disabled = state.result.text === "";
      showCopyError(hooks, labels, state);
      return;
    }

    writeText
      .call(clipboard, snapshot.text)
      .then(() => {
        if (!isCopySnapshotCurrent(state, snapshot)) {
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
        if (isCopySnapshotCurrent(state, snapshot)) {
          showCopyError(hooks, labels, state);
        }
      })
      .finally(() => {
        if (isCopySnapshotCurrent(state, snapshot)) {
          hooks.copy.disabled = state.result.text === "";
        }
      });
  });
}

function setupDownload(hooks: Hooks, state: ToolState): void {
  hooks.download.addEventListener("click", () => {
    const text = state.result.text;
    if (text === "") {
      return;
    }

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
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
    ignoreCase: requireElement(root, "[data-option-ignore-case]"),
    summary: requireElement(root, "[data-summary]"),
    summaryInput: requireElement(root, "[data-summary-input]"),
    summaryUnique: requireElement(root, "[data-summary-unique]"),
    summaryRemoved: requireElement(root, "[data-summary-removed]"),
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
    throw new Error(
      `RemoveDuplicateLinesTool: missing required hook ${selector}`,
    );
  }
  return element;
}

function readLabels(root: HTMLElement): Labels {
  const labels: Labels = {
    item: root.dataset.labelItem ?? "",
    items: root.dataset.labelItems ?? "",
    emptyResult: root.dataset.labelEmptyResult ?? "",
    noEffectiveItems: root.dataset.labelNoEffectiveItems ?? "",
    input: root.dataset.labelInput ?? "",
    unique: root.dataset.labelUnique ?? "",
    removed: root.dataset.labelRemoved ?? "",
    copy: root.dataset.labelCopy ?? "",
    copied: root.dataset.labelCopied ?? "",
    copyError: root.dataset.labelCopyError ?? "",
    replaceExampleConfirmation:
      root.dataset.labelReplaceExampleConfirmation ?? "",
  };

  for (const [name, value] of Object.entries(labels)) {
    if (value === "") {
      throw new Error(
        `RemoveDuplicateLinesTool: missing required label ${name}`,
      );
    }
  }
  return labels;
}

function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
