import { describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";

describe("test infrastructure", () => {
  it("exercises jsdom, user-event and jest-dom without a UI framework", async () => {
    const user = userEvent.setup();
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Mark as done";
    document.body.appendChild(button);

    const status = document.createElement("p");
    status.textContent = "Pending";
    document.body.appendChild(status);

    expect(button).toBeInTheDocument();
    expect(status).toBeVisible();

    await user.click(button);
    status.textContent = "Done";
    button.disabled = true;

    expect(status).toHaveTextContent("Done");
    expect(button).toBeDisabled();
  });
});
