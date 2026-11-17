import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { FACTORS_UNLOCK_STORAGE_KEY } from "../config/features";
import { ShowFactorsProvider } from "../hooks/useShowFactors";
import { OperatorPage } from "./OperatorPage";

function renderOperator() {
  return render(
    <MemoryRouter>
      <ShowFactorsProvider pin="secret">
        <OperatorPage />
      </ShowFactorsProvider>
    </MemoryRouter>,
  );
}

describe("OperatorPage", () => {
  afterEach(() => {
    localStorage.removeItem(FACTORS_UNLOCK_STORAGE_KEY);
  });

  it("rejects a wrong PIN and unlocks with the operator PIN", () => {
    renderOperator();
    fireEvent.change(screen.getByLabelText("PIN"), { target: { value: "nope" } });
    fireEvent.click(screen.getByRole("button", { name: "Show factors" }));
    expect(screen.getByText("That PIN is not recognised.")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("PIN"), { target: { value: "secret" } });
    fireEvent.click(screen.getByRole("button", { name: "Show factors" }));
    expect(screen.getByText(/Factor columns are visible/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Hide factors" }));
    expect(screen.getByLabelText("PIN")).toBeInTheDocument();
  });
});
