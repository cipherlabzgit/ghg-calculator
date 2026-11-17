import { calculateHeatSteam } from "../src/services/heatSteam";

describe("heat and steam", () => {
  it("splits generation (Scope 2) from T&D (Scope 3)", () => {
    const result = calculateHeatSteam([{ type: "District heat and steam", kWh: 1000 }]);
    expect(result.generation[0].kgCO2e).toBeCloseTo(170.73, 4);
    expect(result.tdLosses[0].kgCO2e).toBeCloseTo(8.99, 4);
  });
});
