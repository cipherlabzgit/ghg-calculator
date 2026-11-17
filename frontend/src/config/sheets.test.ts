import { describe, expect, it } from "vitest";
import { adjacentSheets, CALC_SHEETS } from "./sheets";

const EXCEL_INPUT_SHEETS = [
  "Your organisation",
  "Fuels",
  "Bioenergy",
  "Refrigerants",
  "Electricity, heat, cooling, T&D",
  "Owned vehicles",
  "WTT- fuels",
  "Material use",
  "Waste disposal",
  "Flight and Accommodation",
  "Business travel - land and sea",
  "Freighting goods",
  "Employees commuting",
  "Food",
  "Home Office",
  "Water",
  "Report",
];

describe("calculator sheets", () => {
  it("includes every Excel calculation sheet in workbook order", () => {
    expect(CALC_SHEETS.map((sheet) => sheet.excelName)).toEqual(EXCEL_INPUT_SHEETS);
  });

  it("gives every sheet a short readable tab label", () => {
    for (const sheet of CALC_SHEETS) {
      expect(sheet.shortLabel.length).toBeGreaterThan(0);
      expect(sheet.shortLabel.includes("andAccommodation")).toBe(false);
      expect(sheet.help.length).toBeGreaterThan(0);
    }
  });

  it("links adjacent sheets from organisation through the report", () => {
    const first = adjacentSheets("organisation");
    expect(first.prev).toBeUndefined();
    expect(first.next?.id).toBe("fuels");
    const last = adjacentSheets("report");
    expect(last.prev?.id).toBe("water");
    expect(last.next).toBeUndefined();
  });
});
