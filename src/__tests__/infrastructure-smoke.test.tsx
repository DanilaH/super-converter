import { useState } from "react"
import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

function SmokeButton() {
  const [clicked, setClicked] = useState(false)

  return (
    <div>
      <button type="button" onClick={() => setClicked(true)}>
        Mark as done
      </button>
      <p>{clicked ? "Done" : "Pending"}</p>
    </div>
  )
}

describe("test infrastructure", () => {
  it("renders a component, performs a user action and asserts with jest-dom", async () => {
    const user = userEvent.setup()

    render(<SmokeButton />)

    const button = screen.getByRole("button", { name: "Mark as done" })
    expect(button).toBeInTheDocument()
    expect(screen.getByText("Pending")).toBeVisible()

    await user.click(button)

    expect(screen.getByText("Done")).toBeInTheDocument()
    expect(screen.queryByText("Pending")).not.toBeInTheDocument()
  })
})
