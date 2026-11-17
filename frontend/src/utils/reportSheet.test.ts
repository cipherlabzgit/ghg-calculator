import { describe, expect, it } from "vitest";
import type { CalculateResponse, CategoryResult } from "../types";
import { buildReportSheetLines, buildReportTitle, REPORT_SOURCE_SPECS } from "./reportSheet";

function category(partial: Partial<CategoryResult> & Pick<CategoryResult, "id" | "scope" | "label">): CategoryResult {
  return {
    kgCO2e: (partial.tCO2e ?? 0) * 1000,
    tCO2e: 0,
    skipped: false,
    rows: [],
    ...partial,
  };
}

function sampleReport(overrides: Partial<CalculateResponse> = {}): CalculateResponse {
  const categories = [
    category({ id: "fuels", scope: 1, label: "Fuels", tCO2e: 0.444 }),
    category({ id: "passengerVehicles", scope: 1, label: "Passenger vehicles", tCO2e: 0.67 }),
    category({ id: "tdLosses", scope: 3, label: "Transmission and distribution losses", tCO2e: 0 }),
    category({ id: "flights", scope: 3, label: "Flights", tCO2e: 1 }),
  ];
  return {
    organisation: { name: "Acme", country: "Sri Lanka", period: "2025" },
    title: "Acme - 2025 GHG emissions report",
    categories,
    scope1tCO2e: 1.114,
    scope2tCO2e: 0,
    scope3tCO2e: 1,
    totaltCO2e: 2.114,
    ...overrides,
  };
}

describe("report sheet layout", () => {
  it("covers every UNFCCC Report source row", () => {
    expect(REPORT_SOURCE_SPECS.map((spec) => spec.excelRow)).toEqual([
      3, 4, 5, 6, 7, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
    ]);
  });

  it("builds the Excel title from organisation and period", () => {
    expect(buildReportTitle(sampleReport())).toBe("Acme - 2025 GHG emissions report");
  });

  it("places category tonnes on the matching Excel rows", () => {
    const lines = buildReportSheetLines(sampleReport());
    const byRow = Object.fromEntries(lines.map((line) => [line.excelRow, line]));

    expect(byRow[3]).toMatchObject({ source: "Fuels", tCO2e: 0.444 });
    expect(byRow[6]).toMatchObject({ source: "Passenger vehicles", tCO2e: 0.67 });
    expect(byRow[8]).toMatchObject({ group: "Total Scope 1", tCO2e: 1.114 });
    expect(byRow[15]).toMatchObject({ source: "Transmission and distribution losses", tCO2e: 0 });
    expect(byRow[20]).toMatchObject({ source: "All transportation by air", tCO2e: 1 });
    expect(byRow[25].source).toBeNull();
    expect(byRow[29]).toMatchObject({ group: "Total Emissions", tCO2e: 2.114 });
  });

  it("uses zero when a category is missing from the calculation", () => {
    const lines = buildReportSheetLines(sampleReport({ categories: [] }));
    expect(lines.find((line) => line.categoryId === "fuels")?.tCO2e).toBe(0);
  });
});
