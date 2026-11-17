import { calculateWater } from "../src/services/water";

describe("water", () => {
  it("matches Excel: 1000 m3 supply = 149 kg CO2e", () => {
    const result = calculateWater([{ kind: "supply", unit: "cubic metres", amount: 1000 }]);
    expect(result.supply[0].kgCO2e).toBeCloseTo(149, 5);
  });

  it("calculates water treatment separately", () => {
    const result = calculateWater([{ kind: "treatment", unit: "cubic metres", amount: 1000 }]);
    expect(result.treatment[0].kgCO2e).toBeCloseTo(272, 5);
  });
});
