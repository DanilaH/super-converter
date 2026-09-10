import { processListInput } from "../features/list-transform/lib/process-list";
import { pairRandomly } from "../features/random-allocation/lib/random-allocation";
import { bindOutputActions } from "./output-actions";

const LIST_OPTIONS = { trimWhitespace: true, ignoreEmptyLines: true } as const;
const DOWNLOAD_FILENAME = "random-pairs.txt";

type Labels = {
  item: string;
  items: string;
  generate: string;
  reroll: string;
  pair: string;
  unpaired: string;
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
  generate: HTMLButtonElement;
  resultCount: HTMLElement;
  emptyResult: HTMLElement;
  viewer: HTMLElement;
  copy: HTMLButtonElement;
  download: HTMLButtonElement;
  feedback: HTMLElement;
};

const mountedRoots = new WeakSet<HTMLElement>();

export function mountRandomPairTool(scope: ParentNode = document): void {
  for (const root of findRoots(scope)) {
    if (!mountedRoots.has(root)) {
      mountRoot(root);
    }
  }
}

function findRoots(scope: ParentNode): HTMLElement[] {
  if (scope instanceof HTMLElement && scope.matches("[data-random-pair-tool]")) {
    return [scope];
  }
  return Array.from(scope.querySelectorAll<HTMLElement>("[data-random-pair-tool]"));
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

  const invalidate = (): void => {
    resultText = "";
    hooks.viewer.hidden = true;
    hooks.viewer.textContent = "";
    hooks.emptyResult.hidden = false;
    hooks.generate.textContent = labels.generate;
    renderInputState(hooks, labels);
    output.sync();
  };

  hooks.generate.addEventListener("click", () => {
    const items = getItems(hooks.input.value);
    if (items.length === 0) {
      invalidate();
      return;
    }

    const result = pairRandomly(items);
    const blocks = result.pairs.map(
      (pair, index) => `${labels.pair} ${index + 1}\n${pair[0]}\n${pair[1]}`,
    );
    if (result.unpaired !== null) {
      blocks.push(`${labels.unpaired}\n${result.unpaired}`);
    }
    resultText = blocks.join("\n\n");
    hooks.emptyResult.hidden = true;
    hooks.viewer.hidden = false;
    hooks.viewer.textContent = resultText;
    hooks.generate.textContent = labels.reroll;
    renderInputState(hooks, labels);
    output.sync();
  });

  hooks.input.addEventListener("input", invalidate);
  hooks.clear.addEventListener("click", () => {
    hooks.input.value = "";
    invalidate();
    hooks.input.focus();
  });
  hooks.loadExample.addEventListener("click", () => {
    if (hooks.input.value !== "" && !window.confirm(labels.replaceExampleConfirmation)) {
      return;
    }
    hooks.input.value = example;
    invalidate();
    hooks.input.focus();
  });

  hooks.loadExample.disabled = false;
  mountedRoots.add(root);
  invalidate();
}

function getItems(input: string): string[] {
  return processListInput(input.replace(/\r\n?/g, "\n"), LIST_OPTIONS);
}

function renderInputState(hooks: Hooks, labels: Labels): void {
  const count = getItems(hooks.input.value).length;
  hooks.clear.disabled = hooks.input.value === "";
  hooks.generate.disabled = count === 0;
  hooks.resultCount.textContent = `${count} ${count === 1 ? labels.item : labels.items}`;
}

function findHooks(root: HTMLElement): Hooks {
  return {
    input: requireElement(root, "[data-list-input]"),
    clear: requireElement(root, "[data-clear-list]"),
    loadExample: requireElement(root, "[data-load-example]"),
    generate: requireElement(root, "[data-generate]"),
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
    throw new Error(`RandomPairTool: missing required hook ${selector}`);
  }
  return element;
}

function readLabels(root: HTMLElement): Labels {
  const labels = {
    item: root.dataset.labelItem ?? "",
    items: root.dataset.labelItems ?? "",
    generate: root.dataset.labelGenerate ?? "",
    reroll: root.dataset.labelReroll ?? "",
    pair: root.dataset.labelPair ?? "",
    unpaired: root.dataset.labelUnpaired ?? "",
    emptyResult: root.dataset.labelEmptyResult ?? "",
    copy: root.dataset.labelCopy ?? "",
    copied: root.dataset.labelCopied ?? "",
    copyError: root.dataset.labelCopyError ?? "",
    replaceExampleConfirmation: root.dataset.labelReplaceExampleConfirmation ?? "",
  } satisfies Labels;

  for (const [name, value] of Object.entries(labels)) {
    if (value === "") {
      throw new Error(`RandomPairTool: missing required label ${name}`);
    }
  }
  return labels;
}
