import { joinColumnItems } from "../features/text-transform/lib/text-transform";
import { bindOutputActions } from "./output-actions";

const DOWNLOAD_FILENAME = "converted-list.txt";

type SeparatorMode =
  | "commaSpace"
  | "comma"
  | "semicolon"
  | "pipe"
  | "tab"
  | "custom";

type Labels = {
  item: string;
  items: string;
  emptyResult: string;
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
  separator: HTMLSelectElement;
  customRow: HTMLElement;
  customSeparator: HTMLInputElement;
  resultCount: HTMLElement;
  emptyResult: HTMLElement;
  viewer: HTMLElement;
  copy: HTMLButtonElement;
  download: HTMLButtonElement;
  feedback: HTMLElement;
};

const mountedRoots = new WeakSet<HTMLElement>();

export function mountColumnToCommaTool(scope: ParentNode = document): void {
  for (const root of findRoots(scope)) {
    if (!mountedRoots.has(root)) {
      mountRoot(root);
    }
  }
}

function findRoots(scope: ParentNode): HTMLElement[] {
  if (
    scope instanceof HTMLElement &&
    scope.matches("[data-column-to-comma-tool]")
  ) {
    return [scope];
  }
  return Array.from(
    scope.querySelectorAll<HTMLElement>("[data-column-to-comma-tool]"),
  );
}

function mountRoot(root: HTMLElement): void {
  const hooks = findHooks(root);
  const labels = readLabels(root);
  const example = root.dataset.example ?? "";
  let resultText = "";

  const output = bindOutputActions({
    copy: hooks.copy,
    download: hooks.download,
    feedback: hooks.feedback,
    ownerDocument: hooks.viewer.ownerDocument,
    filename: DOWNLOAD_FILENAME,
    labels,
    getText: () => resultText,
  });

  const render = (): void => {
    const mode = hooks.separator.value as SeparatorMode;
    hooks.customRow.hidden = mode !== "custom";
    hooks.customSeparator.disabled = mode !== "custom";

    const result = joinColumnItems(
      hooks.input.value,
      {
        trimWhitespace: hooks.trimWhitespace.checked,
        ignoreEmptyLines: hooks.ignoreEmptyLines.checked,
      },
      delimiterFor(mode, hooks.customSeparator.value),
    );
    resultText = result.text;

    hooks.clear.disabled = hooks.input.value === "";
    hooks.resultCount.textContent = `${result.items.length} ${
      result.items.length === 1 ? labels.item : labels.items
    }`;
    const hasItems = result.items.length > 0;
    hooks.emptyResult.hidden = hasItems;
    hooks.emptyResult.textContent = labels.emptyResult;
    hooks.viewer.hidden = !hasItems;
    hooks.viewer.textContent = resultText;
    output.sync();
  };

  hooks.input.addEventListener("input", render);
  hooks.trimWhitespace.addEventListener("change", render);
  hooks.ignoreEmptyLines.addEventListener("change", render);
  hooks.separator.addEventListener("change", render);
  hooks.customSeparator.addEventListener("input", render);

  hooks.clear.addEventListener("click", () => {
    hooks.input.value = "";
    render();
    hooks.input.focus();
  });

  hooks.loadExample.addEventListener("click", () => {
    if (
      hooks.input.value !== "" &&
      !window.confirm(labels.replaceExampleConfirmation)
    ) {
      return;
    }
    hooks.input.value = example;
    render();
    hooks.input.focus();
  });

  hooks.loadExample.disabled = false;
  mountedRoots.add(root);
  render();
}

function delimiterFor(mode: SeparatorMode, custom: string): string {
  switch (mode) {
    case "commaSpace":
      return ", ";
    case "comma":
      return ",";
    case "semicolon":
      return ";";
    case "pipe":
      return "|";
    case "tab":
      return "\t";
    case "custom":
      return custom;
  }
}

function findHooks(root: HTMLElement): Hooks {
  return {
    input: requireElement(root, "[data-list-input]"),
    clear: requireElement(root, "[data-clear-list]"),
    loadExample: requireElement(root, "[data-load-example]"),
    trimWhitespace: requireElement(root, "[data-option-trim-whitespace]"),
    ignoreEmptyLines: requireElement(root, "[data-option-ignore-empty-lines]"),
    separator: requireElement(root, "[data-separator]"),
    customRow: requireElement(root, "[data-custom-row]"),
    customSeparator: requireElement(root, "[data-custom-separator]"),
    resultCount: requireElement(root, "[data-result-count]"),
    emptyResult: requireElement(root, "[data-empty-result]"),
    viewer: requireElement(root, "[data-result-viewer]"),
    copy: requireElement(root, "[data-copy-result]"),
    download: requireElement(root, "[data-download-result]"),
    feedback: requireElement(root, "[data-local-feedback]"),
  };
}

function requireElement<T extends Element>(root: HTMLElement, selector: string): T {
  const element = root.querySelector<T>(selector);
  if (!element) {
    throw new Error(`ColumnToCommaTool: missing required hook ${selector}`);
  }
  return element;
}

function readLabels(root: HTMLElement): Labels {
  const labels = {
    item: root.dataset.labelItem ?? "",
    items: root.dataset.labelItems ?? "",
    emptyResult: root.dataset.labelEmptyResult ?? "",
    copy: root.dataset.labelCopy ?? "",
    copied: root.dataset.labelCopied ?? "",
    copyError: root.dataset.labelCopyError ?? "",
    replaceExampleConfirmation:
      root.dataset.labelReplaceExampleConfirmation ?? "",
  } satisfies Labels;

  for (const [name, value] of Object.entries(labels)) {
    if (value === "") {
      throw new Error(`ColumnToCommaTool: missing required label ${name}`);
    }
  }
  return labels;
}
