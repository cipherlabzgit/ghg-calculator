import { describe, expect, it } from "vitest";
import { isFactorColumn } from "./features";

describe("isFactorColumn", () => {
  it("matches factor labels and keys used in the Excel tables", () => {
    expect(isFactorColumn({ key: "factor", label: "Factors" })).toBe(true);
    expect(isFactorColumn({ key: "evFactor", label: "Factor EV" })).toBe(true);
    expect(isFactorColumn({ key: "gef", label: "GEF Factors KgCO2" })).toBe(true);
    expect(isFactorColumn({ key: "td", label: "T&D Factors KgCO2" })).toBe(true);
    expect(isFactorColumn({ key: "consumption", label: "Consumption kWh/hour" })).toBe(false);
    expect(isFactorColumn({ key: "amount", label: "Amount" })).toBe(false);
  });
});
