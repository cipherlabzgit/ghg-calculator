import { describe, expect, it } from "vitest";
import type { CalculateResponse } from "../types";
import { buildReportWorkbook } from "./exportExcel";

const report: CalculateResponse = {
  organisation: { name: "Acme", country: "Sri Lanka", city: "Colombo", period: "2025" },
  title: "Acme - 2025 GHG emissions report",
  categories: [
    {
      id: "fuels",
      scope: 1,
      label: "Fuels",
      kgCO2e: 444,
      tCO2e: 0.444,
      skipped: false,
      rows: [
        {
          description: "CNG",
          amount: 1000,
          unit: "litres",
          factor: 0.444,
          kgCO2e: 444,
          source: "DEFRA",
          vintage: 2021,
        },
      ],
    },
  ],
  scope1tCO2e: 0.444,
  scope2tCO2e: 0,
  scope3tCO2e: 0,
  totaltCO2e: 0.444,
};

describe("Excel report workbook", () => {
  it("adds Disclaimer and Info and sources sheets ahead of the Report", async () => {
    const workbook = await buildReportWorkbook(report);
    expect(workbook.worksheets.map((s) => s.name)).toEqual([
      "Disclaimer",
      "Info and sources",
      "Report",
      "Line items",
    ]);
    expect(workbook.getWorksheet("Disclaimer")?.getCell("A1").value).toBe("Disclaimer");
    expect(workbook.getWorksheet("Info and sources")?.getCell("A3").value).toBe(
      "General information, sources and assumptions",
    );
  });

  it("writes the UNFCCC Report sheet values and totals", async () => {
    const workbook = await buildReportWorkbook(report);
    const sheet = workbook.getWorksheet("Report");
    expect(sheet).toBeDefined();
    expect(sheet?.getCell("A1").value).toBe("Acme - 2025 GHG emissions report");
    expect(sheet?.getCell("D3").value).toBe("Fuels");
    expect(sheet?.getCell("E3").value).toBe(0.444);
    expect(sheet?.getCell("C8").value).toBe("Total Scope 1");
    expect(sheet?.getCell("E8").value).toEqual({ formula: "SUM(E3:E7)", result: 0.444 });
    expect(sheet?.getCell("A29").value).toBe("Total Emissions");
    expect(sheet?.getCell("E29").value).toEqual({ formula: "SUM(E8,E13,E28)", result: 0.444 });
    expect(sheet?.getCell("D20").value).toBe("All transportation by air");
    expect(sheet?.getCell("C25").value).toBe("Employees commuting");
  });

  it("includes a line-items sheet for activity detail without factors by default", async () => {
    const workbook = await buildReportWorkbook(report);
    const sheet = workbook.getWorksheet("Line items");
    expect(sheet?.getRow(1).getCell(6).value).toBe("kg CO2e");
    expect(sheet?.getRow(2).getCell(2).value).toBe("Fuels");
    expect(sheet?.getRow(2).getCell(3).value).toBe("CNG");
    expect(sheet?.getRow(2).getCell(6).value).toBe(444);
  });

  it("includes the Factor column when the operator has unlocked factors", async () => {
    const workbook = await buildReportWorkbook(report, { showFactors: true });
    const sheet = workbook.getWorksheet("Line items");
    expect(sheet?.getRow(1).getCell(6).value).toBe("Factor");
    expect(sheet?.getRow(2).getCell(6).value).toBe(0.444);
    expect(sheet?.getRow(2).getCell(7).value).toBe(444);
  });
});
