type OutputActionLabels = {
  copy: string;
  copied: string;
  copyError: string;
};

type OutputActionOptions = {
  copy: HTMLButtonElement;
  download: HTMLButtonElement;
  feedback: HTMLElement;
  ownerDocument: Document;
  filename: string;
  labels: OutputActionLabels;
  getText: () => string;
};

export type OutputActions = {
  sync: () => void;
  reset: () => void;
};

export function bindOutputActions(options: OutputActionOptions): OutputActions {
  let timer: number | null = null;

  const clearTimer = (): void => {
    if (timer !== null) {
      window.clearTimeout(timer);
      timer = null;
    }
  };

  const reset = (): void => {
    clearTimer();
    options.copy.textContent = options.labels.copy;
    options.feedback.textContent = "";
    delete options.feedback.dataset.state;
  };

  const sync = (): void => {
    reset();
    const disabled = options.getText() === "";
    options.copy.disabled = disabled;
    options.download.disabled = disabled;
  };

  const showError = (): void => {
    reset();
    options.feedback.textContent = options.labels.copyError;
    options.feedback.dataset.state = "error";
    timer = window.setTimeout(() => {
      options.feedback.textContent = "";
      delete options.feedback.dataset.state;
      timer = null;
    }, 4000);
  };

  options.copy.addEventListener("click", () => {
    const text = options.getText();
    if (text === "") {
      return;
    }

    reset();
    options.copy.disabled = true;
    const clipboard = navigator.clipboard;
    const writeText = clipboard?.writeText;

    if (!writeText) {
      options.copy.disabled = false;
      showError();
      return;
    }

    writeText
      .call(clipboard, text)
      .then(() => {
        if (options.getText() !== text) {
          return;
        }
        options.copy.textContent = `\u2713 ${options.labels.copied}`;
        options.feedback.textContent = options.labels.copied;
        options.feedback.dataset.state = "success";
        timer = window.setTimeout(() => {
          options.copy.textContent = options.labels.copy;
          options.feedback.textContent = "";
          delete options.feedback.dataset.state;
          timer = null;
        }, 2000);
      })
      .catch(() => {
        if (options.getText() === text) {
          showError();
        }
      })
      .finally(() => {
        options.copy.disabled = options.getText() === "";
      });
  });

  options.download.addEventListener("click", () => {
    const text = options.getText();
    if (text === "") {
      return;
    }
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = options.ownerDocument.createElement("a");
    anchor.href = url;
    anchor.download = options.filename;
    try {
      anchor.click();
    } finally {
      anchor.remove();
      URL.revokeObjectURL(url);
    }
  });

  sync();
  return { sync, reset };
}
