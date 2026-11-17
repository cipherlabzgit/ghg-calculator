import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { CalculateResponse } from "../../types";
import { ExcelReportTable } from "./ExcelReportTable";

const report: CalculateResponse = {
  organisation: { name: "Acme", country: "Sri Lanka", period: "2025" },
  title: "Acme - 2025 GHG emissions report",
  categories: [
    {
      id: "passengerVehicles",
      scope: 1,
      label: "Passenger vehicles",
      kgCO2e: 670,
      tCO2e: 0.67,
      skipped: false,
      rows: [],
    },
  ],
  scope1tCO2e: 0.67,
  scope2tCO2e: 0,
  scope3tCO2e: 0,
  totaltCO2e: 0.67,
};

describe("ExcelReportTable", () => {
  it("renders the UNFCCC Report sheet labels and values", () => {
    render(<ExcelReportTable report={report} />);
    expect(screen.getByText("Acme - 2025 GHG emissions report")).toBeInTheDocument();
    expect(screen.getByText("Passenger vehicles")).toBeInTheDocument();
    expect(screen.getAllByText("0.67").length).toBeGreaterThan(0);
    expect(screen.getByText("Total Scope 1")).toBeInTheDocument();
    expect(screen.getByText("Total Emissions")).toBeInTheDocument();
    expect(screen.getByText("All transportation by air")).toBeInTheDocument();
    expect(screen.getByText("Employees commuting")).toBeInTheDocument();
  });
});
