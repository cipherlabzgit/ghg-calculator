import { describe, expect, it } from "vitest";
import { formatExcelTonnes, formatTonnes, toNumber } from "./format";

describe("formatTonnes", () => {
  it("shows three decimal places", () => {
    expect(formatTonnes(0.44423)).toMatch(/0\.444/);
    expect(formatTonnes(1)).toMatch(/1\.000/);
  });
});

describe("formatExcelTonnes", () => {
  it("uses two decimals and a dash for zero", () => {
    expect(formatExcelTonnes(0)).toBe("-");
    expect(formatExcelTonnes(0.67)).toMatch(/0\.67/);
  });
});

describe("toNumber", () => {
  it("parses numeric strings and falls back to 0", () => {
    expect(toNumber("10")).toBe(10);
    expect(toNumber("")).toBe(0);
    expect(toNumber("abc")).toBe(0);
  });
});
