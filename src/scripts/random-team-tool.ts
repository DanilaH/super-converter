import { processListInput } from "../features/list-transform/lib/process-list";
import { splitIntoBalancedGroups } from "../features/random-allocation/lib/random-allocation";
import { bindOutputActions } from "./output-actions";

const LIST_OPTIONS = { trimWhitespace: true, ignoreEmptyLines: true } as const;
const DOWNLOAD_FILENAME = "random-teams.txt";

type Labels = {
  participant: string;
  participants: string;
  generate: string;
  reroll: string;
  team: string;
  emptyResult: string;
  invalidValue: string;
  tooManyTeams: string;
  copy: string;
  copied: string;
  copyError: string;
  replaceExampleConfirmation: string;
};

type Hooks = {
  input: HTMLTextAreaElement;
  clear: HTMLButtonElement;
  loadExample: HTMLButtonElement;
  teamCountMode: HTMLInputElement;
  targetSizeMode: HTMLInputElement;
  value: HTMLInputElement;
  generate: HTMLButtonElement;
  resultCount: HTMLElement;
  emptyResult: HTMLElement;
  viewer: HTMLElement;
  validation: HTMLElement;
  copy: HTMLButtonElement;
  download: HTMLButtonElement;
  feedback: HTMLElement;
};

const mountedRoots = new WeakSet<HTMLElement>();

export function mountRandomTeamTool(scope: ParentNode = document): void {
  for (const root of findRoots(scope)) {
    if (!mountedRoots.has(root)) {
      mountRoot(root);
    }
  }
}

function findRoots(scope: ParentNode): HTMLElement[] {
  if (scope instanceof HTMLElement && scope.matches("[data-random-team-tool]")) {
    return [scope];
  }
  return Array.from(scope.querySelectorAll<HTMLElement>("[data-random-team-tool]"));
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
    hooks.emptyResult.textContent = labels.emptyResult;
    hooks.validation.textContent = "";
    delete hooks.validation.dataset.state;
    hooks.generate.textContent = labels.generate;
    renderInputState(hooks, labels);
    output.sync();
  };

  const generate = (): void => {
    const items = getItems(hooks.input.value);
    if (items.length < 2) {
      invalidate();
      return;
    }

    const value = hooks.value.valueAsNumber;
    if (!Number.isInteger(value) || value <= 0) {
      showValidation(hooks, labels.invalidValue);
      return;
    }
    if (hooks.teamCountMode.checked && value > items.length) {
      showValidation(hooks, labels.tooManyTeams);
      return;
    }

    const groups = splitIntoBalancedGroups(items, {
      mode: hooks.teamCountMode.checked ? "teamCount" : "targetSize",
      value,
    });
    resultText = groups
      .map((group, index) => `${labels.team} ${index + 1}\n${group.join("\n")}`)
      .join("\n\n");

    hooks.validation.textContent = "";
    delete hooks.validation.dataset.state;
    hooks.emptyResult.hidden = true;
    hooks.viewer.hidden = false;
    hooks.viewer.textContent = resultText;
    hooks.generate.textContent = labels.reroll;
    renderInputState(hooks, labels);
    output.sync();
  };

  hooks.input.addEventListener("input", invalidate);
  hooks.teamCountMode.addEventListener("change", invalidate);
  hooks.targetSizeMode.addEventListener("change", invalidate);
  hooks.value.addEventListener("input", invalidate);
  hooks.generate.addEventListener("click", generate);

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
  hooks.generate.disabled = count < 2;
  hooks.resultCount.textContent = `${count} ${count === 1 ? labels.participant : labels.participants}`;
}

function showValidation(hooks: Hooks, message: string): void {
  hooks.validation.textContent = message;
  hooks.validation.dataset.state = "error";
}

function findHooks(root: HTMLElement): Hooks {
  return {
    input: requireElement(root, "[data-list-input]"),
    clear: requireElement(root, "[data-clear-list]"),
    loadExample: requireElement(root, "[data-load-example]"),
    teamCountMode: requireElement(root, '[data-mode="teamCount"]'),
    targetSizeMode: requireElement(root, '[data-mode="targetSize"]'),
    value: requireElement(root, "[data-group-value]"),
    generate: requireElement(root, "[data-generate]"),
    resultCount: requireElement(root, "[data-result-count]"),
    emptyResult: requireElement(root, "[data-empty-result]"),
    viewer: requireElement(root, "[data-result-viewer]"),
    validation: requireElement(root, "[data-validation]"),
    copy: requireElement(root, "[data-copy-result]"),
    download: requireElement(root, "[data-download-result]"),
    feedback: requireElement(root, "[data-local-feedback]"),
  };
}

function requireElement<T extends Element>(root: HTMLElement, selector: string): T {
  const element = root.querySelector<T>(selector);
  if (!element) {
    throw new Error(`RandomTeamTool: missing required hook ${selector}`);
  }
  return element;
}

function readLabels(root: HTMLElement): Labels {
  const labels = {
    participant: root.dataset.labelParticipant ?? "",
    participants: root.dataset.labelParticipants ?? "",
    generate: root.dataset.labelGenerate ?? "",
    reroll: root.dataset.labelReroll ?? "",
    team: root.dataset.labelTeam ?? "",
    emptyResult: root.dataset.labelEmptyResult ?? "",
    invalidValue: root.dataset.labelInvalidValue ?? "",
    tooManyTeams: root.dataset.labelTooManyTeams ?? "",
    copy: root.dataset.labelCopy ?? "",
    copied: root.dataset.labelCopied ?? "",
    copyError: root.dataset.labelCopyError ?? "",
    replaceExampleConfirmation: root.dataset.labelReplaceExampleConfirmation ?? "",
  } satisfies Labels;

  for (const [name, value] of Object.entries(labels)) {
    if (value === "") {
      throw new Error(`RandomTeamTool: missing required label ${name}`);
    }
  }
  return labels;
}
