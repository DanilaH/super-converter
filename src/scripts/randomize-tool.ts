import { processListInput } from "../features/list-transform/lib/process-list";
import { randomizeList } from "../features/randomize-list/lib/randomize-list";
import type {
  RandomizeOptions,
  RandomizeResult,
} from "../features/randomize-list/model/types";

const EXAMPLE = ["Alpha", "Bravo", "Charlie", "Delta", "Echo"].join("\n");
const DOWNLOAD_FILENAME = "randomized-list.txt";

type ToolState = {
  input: string;
  options: RandomizeOptions;
  result: RandomizeResult | null;
  copyTimer: number | null;
};

type CopySnapshot = {
  input: string;
  options: RandomizeOptions;
  result: RandomizeResult;
  text: string;
};

type Labels = {
  item: string;
  items: string;
  emptyResult: string;
  readyResult: string;
  noEffectiveItems: string;
  randomize: string;
  randomizeAgain: string;
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
  randomize: HTMLButtonElement;
  resultCount: HTMLElement;
  emptyResult: HTMLElement;
  viewer: HTMLElement;
  copy: HTMLButtonElement;
  download: HTMLButtonElement;
  localFeedback: HTMLElement;
};

const mountedRoots = new WeakSet<HTMLElement>();

export function mountRandomizeTool(scope: ParentNode = document): void {
  for (const root of findRoots(scope)) {
    mountRoot(root);
  }
}

function findRoots(scope: ParentNode): HTMLElement[] {
  if (scope instanceof HTMLElement && scope.matches("[data-randomize-tool]")) {
    return [scope];
  }
  return Array.from(
    scope.querySelectorAll<HTMLElement>("[data-randomize-tool]"),
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
    },
    result: null,
    copyTimer: null,
  };

  const invalidateResult = (): void => {
    state.result = null;
    resetCopyFeedback(hooks, labels, state);
    render(hooks, labels, state);
  };

  hooks.input.addEventListener("input", () => {
    state.input = hooks.input.value;
    invalidateResult();
  });

  hooks.trimWhitespace.addEventListener("change", () => {
    state.options.trimWhitespace = hooks.trimWhitespace.checked;
    invalidateResult();
  });

  hooks.ignoreEmptyLines.addEventListener("change", () => {
    state.options.ignoreEmptyLines = hooks.ignoreEmptyLines.checked;
    invalidateResult();
  });

  hooks.clear.addEventListener("click", () => {
    hooks.input.value = "";
    state.input = "";
    invalidateResult();
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
    invalidateResult();
    hooks.input.focus();
  });

  hooks.randomize.addEventListener("click", () => {
    if (processListInput(state.input, state.options).length === 0) {
      return;
    }
    resetCopyFeedback(hooks, labels, state);
    state.result = randomizeList(state.input, state.options);
    render(hooks, labels, state);
  });

  setupCopy(hooks, labels, state);
  setupDownload(hooks, state);

  hooks.loadExample.disabled = false;
  mountedRoots.add(root);
  render(hooks, labels, state);
}

function render(hooks: Hooks, labels: Labels, state: ToolState): void {
  const effectiveItems = processListInput(state.input, state.options);
  const hasEffectiveItems = effectiveItems.length > 0;
  const result = state.result;

  hooks.clear.disabled = state.input === "";
  hooks.randomize.disabled = !hasEffectiveItems;
  hooks.randomize.textContent = result
    ? labels.randomizeAgain
    : labels.randomize;
  hooks.resultCount.textContent = pluralize(
    result?.items.length ?? 0,
    labels.item,
    labels.items,
  );

  if (result === null) {
    hooks.emptyResult.hidden = false;
    hooks.emptyResult.textContent =
      state.input === ""
        ? labels.emptyResult
        : hasEffectiveItems
          ? labels.readyResult
          : labels.noEffectiveItems;
    hooks.viewer.hidden = true;
    hooks.viewer.textContent = "";
    hooks.copy.disabled = true;
    hooks.download.disabled = true;
    return;
  }

  hooks.emptyResult.hidden = true;
  hooks.viewer.hidden = false;
  hooks.viewer.textContent = result.text;
  const hasExportableText = result.text.length > 0;
  hooks.copy.disabled = !hasExportableText;
  hooks.download.disabled = !hasExportableText;
}

function captureCopySnapshot(state: ToolState): CopySnapshot | null {
  if (state.result === null) {
    return null;
  }
  return {
    input: state.input,
    options: { ...state.options },
    result: state.result,
    text: state.result.text,
  };
}

function isCopySnapshotCurrent(
  state: ToolState,
  snapshot: CopySnapshot,
): boolean {
  return (
    state.result === snapshot.result &&
    state.input === snapshot.input &&
    state.options.trimWhitespace === snapshot.options.trimWhitespace &&
    state.options.ignoreEmptyLines === snapshot.options.ignoreEmptyLines &&
    state.result.text === snapshot.text
  );
}

function setupCopy(hooks: Hooks, labels: Labels, state: ToolState): void {
  hooks.copy.addEventListener("click", () => {
    const snapshot = captureCopySnapshot(state);
    if (snapshot === null || snapshot.text === "") {
      return;
    }

    resetCopyFeedback(hooks, labels, state);
    hooks.copy.disabled = true;
    const clipboard = navigator.clipboard;
    const writeText = clipboard?.writeText;

    if (!writeText) {
      hooks.copy.disabled = state.result === null || state.result.text === "";
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
          hooks.copy.disabled =
            state.result === null || state.result.text === "";
        }
      });
  });
}

function setupDownload(hooks: Hooks, state: ToolState): void {
  hooks.download.addEventListener("click", () => {
    const text = state.result?.text ?? "";
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
    randomize: requireElement(root, "[data-randomize-list]"),
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
    throw new Error(`RandomizeTool: missing required hook ${selector}`);
  }
  return element;
}

function readLabels(root: HTMLElement): Labels {
  const labels: Labels = {
    item: root.dataset.labelItem ?? "",
    items: root.dataset.labelItems ?? "",
    emptyResult: root.dataset.labelEmptyResult ?? "",
    readyResult: root.dataset.labelReadyResult ?? "",
    noEffectiveItems: root.dataset.labelNoEffectiveItems ?? "",
    randomize: root.dataset.labelRandomize ?? "",
    randomizeAgain: root.dataset.labelRandomizeAgain ?? "",
    copy: root.dataset.labelCopy ?? "",
    copied: root.dataset.labelCopied ?? "",
    copyError: root.dataset.labelCopyError ?? "",
    replaceExampleConfirmation:
      root.dataset.labelReplaceExampleConfirmation ?? "",
  };

  for (const [name, value] of Object.entries(labels)) {
    if (value === "") {
      throw new Error(`RandomizeTool: missing required label ${name}`);
    }
  }
  return labels;
}

function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
