import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { FACTORS_UNLOCK_STORAGE_KEY } from "../../config/features";
import { ShowFactorsProvider } from "../../hooks/useShowFactors";
import { ExcelCatalogTable } from "./ExcelCatalogTable";

const lines = [{ type: "Gaseous fuels", fuel: "CNG", unit: "litres", factor: 0.444 }];

function renderTable(monthlyInputs = false) {
  return render(
    <ExcelCatalogTable
      lines={lines}
      columns={[
        { key: "type", label: "Type" },
        { key: "fuel", label: "Fuel" },
      ]}
      amounts={[{ key: "amount", label: "Amount" }]}
      monthlyInputs={monthlyInputs}
      rows={[]}
      extraAfterFactor={[{ key: "evFactor", label: "Factor EV" }]}
      onChange={() => undefined}
    />,
  );
}

describe("ExcelCatalogTable", () => {
  afterEach(() => {
    cleanup();
    localStorage.removeItem(FACTORS_UNLOCK_STORAGE_KEY);
  });

  it("hides the Factor column for end customers", () => {
    renderTable();
    expect(screen.getByText("Fuel")).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();
    expect(screen.queryByText("Factor")).not.toBeInTheDocument();
    expect(screen.queryByText("Factor EV")).not.toBeInTheDocument();
    expect(screen.queryByText("0.444")).not.toBeInTheDocument();
    expect(screen.getByText("kg CO2e")).toBeInTheDocument();
  });

  it("shows 12 month amount columns and sums them when factors are hidden", () => {
    render(
      <ExcelCatalogTable
        lines={lines}
        columns={[
          { key: "type", label: "Type" },
          { key: "fuel", label: "Fuel" },
        ]}
        amounts={[{ key: "amount", label: "Amount" }]}
        monthlyInputs
        rows={[{ type: "Gaseous fuels", fuel: "CNG", m1: "10", m2: "20" }]}
        extraAfterFactor={[{ key: "evFactor", label: "Factor EV" }]}
        onChange={() => undefined}
      />,
    );
    expect(screen.getByText("Jan")).toBeInTheDocument();
    expect(screen.getByText("Dec")).toBeInTheDocument();
    expect(screen.getByText("Year total")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("13.32")).toBeInTheDocument();
    expect(screen.queryByText("Factor")).not.toBeInTheDocument();
    expect(screen.queryByText("53.28")).not.toBeInTheDocument();
  });

  it("shows factor columns and a single Amount after the operator unlocks", () => {
    localStorage.setItem(FACTORS_UNLOCK_STORAGE_KEY, "1");
    render(
      <ShowFactorsProvider pin="secret">
        <ExcelCatalogTable
          lines={lines}
          columns={[
            { key: "type", label: "Type" },
            { key: "fuel", label: "Fuel" },
          ]}
          amounts={[{ key: "amount", label: "Amount" }]}
          monthlyInputs
          rows={[]}
          extraAfterFactor={[{ key: "evFactor", label: "Factor EV" }]}
          onChange={() => undefined}
        />
      </ShowFactorsProvider>,
    );
    expect(screen.getByText("Factor")).toBeInTheDocument();
    expect(screen.getByText("Factor EV")).toBeInTheDocument();
    expect(screen.getByText("0.444")).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();
    expect(screen.queryByText("Jan")).not.toBeInTheDocument();
    expect(screen.queryByText("Year total")).not.toBeInTheDocument();
  });
});
