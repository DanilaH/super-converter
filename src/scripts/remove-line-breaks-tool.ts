import { removeLineBreaks } from "../features/text-transform/lib/text-transform";
import { bindOutputActions } from "./output-actions";

const DOWNLOAD_FILENAME = "text-without-line-breaks.txt";

type SeparatorMode =
  "space" | "nothing" | "comma" | "commaSpace" | "semicolon" | "custom";

type Labels = {
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
  separator: HTMLSelectElement;
  customRow: HTMLElement;
  customSeparator: HTMLInputElement;
  keepParagraphs: HTMLInputElement;
  trimEachLine: HTMLInputElement;
  collapseSpaces: HTMLInputElement;
  emptyResult: HTMLElement;
  viewer: HTMLElement;
  copy: HTMLButtonElement;
  download: HTMLButtonElement;
  feedback: HTMLElement;
};

const mountedRoots = new WeakSet<HTMLElement>();

export function mountRemoveLineBreaksTool(scope: ParentNode = document): void {
  for (const root of findRoots(scope)) {
    if (!mountedRoots.has(root)) {
      mountRoot(root);
    }
  }
}

function findRoots(scope: ParentNode): HTMLElement[] {
  if (
    scope instanceof HTMLElement &&
    scope.matches("[data-remove-line-breaks-tool]")
  ) {
    return [scope];
  }
  return Array.from(
    scope.querySelectorAll<HTMLElement>("[data-remove-line-breaks-tool]"),
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

    resultText = removeLineBreaks(hooks.input.value, {
      replacement: replacementFor(mode, hooks.customSeparator.value),
      keepParagraphs: hooks.keepParagraphs.checked,
      trimEachLine: hooks.trimEachLine.checked,
      collapseSpaces: hooks.collapseSpaces.checked,
    });

    hooks.clear.disabled = hooks.input.value === "";
    const hasInput = hooks.input.value !== "";
    hooks.emptyResult.hidden = hasInput;
    hooks.emptyResult.textContent = labels.emptyResult;
    hooks.viewer.hidden = !hasInput;
    hooks.viewer.textContent = resultText;
    output.sync();
  };

  hooks.input.addEventListener("input", render);
  hooks.separator.addEventListener("change", render);
  hooks.customSeparator.addEventListener("input", render);
  hooks.keepParagraphs.addEventListener("change", render);
  hooks.trimEachLine.addEventListener("change", render);
  hooks.collapseSpaces.addEventListener("change", render);

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

function replacementFor(mode: SeparatorMode, custom: string): string {
  switch (mode) {
    case "space":
      return " ";
    case "nothing":
      return "";
    case "comma":
      return ",";
    case "commaSpace":
      return ", ";
    case "semicolon":
      return ";";
    case "custom":
      return custom;
  }
}

function findHooks(root: HTMLElement): Hooks {
  return {
    input: requireElement(root, "[data-text-input]"),
    clear: requireElement(root, "[data-clear-text]"),
    loadExample: requireElement(root, "[data-load-example]"),
    separator: requireElement(root, "[data-separator]"),
    customRow: requireElement(root, "[data-custom-row]"),
    customSeparator: requireElement(root, "[data-custom-separator]"),
    keepParagraphs: requireElement(root, "[data-keep-paragraphs]"),
    trimEachLine: requireElement(root, "[data-trim-each-line]"),
    collapseSpaces: requireElement(root, "[data-collapse-spaces]"),
    emptyResult: requireElement(root, "[data-empty-result]"),
    viewer: requireElement(root, "[data-result-viewer]"),
    copy: requireElement(root, "[data-copy-result]"),
    download: requireElement(root, "[data-download-result]"),
    feedback: requireElement(root, "[data-local-feedback]"),
  };
}

function requireElement<T extends Element>(
  root: HTMLElement,
  selector: string,
): T {
  const element = root.querySelector<T>(selector);
  if (!element) {
    throw new Error(`RemoveLineBreaksTool: missing required hook ${selector}`);
  }
  return element;
}

function readLabels(root: HTMLElement): Labels {
  const labels = {
    emptyResult: root.dataset.labelEmptyResult ?? "",
    copy: root.dataset.labelCopy ?? "",
    copied: root.dataset.labelCopied ?? "",
    copyError: root.dataset.labelCopyError ?? "",
    replaceExampleConfirmation:
      root.dataset.labelReplaceExampleConfirmation ?? "",
  } satisfies Labels;

  for (const [name, value] of Object.entries(labels)) {
    if (value === "") {
      throw new Error(`RemoveLineBreaksTool: missing required label ${name}`);
    }
  }
  return labels;
}
