import { calculateMaterialUse } from "../src/services/materialUse";

describe("material use", () => {
  it("matches Excel: 10 t aggregates = 77.589016 kg", () => {
    const rows = calculateMaterialUse([
      {
        process: "Primary material production",
        activity: "Construction",
        material: "Aggregates",
        unit: "tonnes",
        tonnes: 10,
      },
    ]);
    expect(rows[0].kgCO2e).toBeCloseTo(77.589016, 6);
  });
});
