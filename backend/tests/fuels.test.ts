import { calculateFuels } from "../src/services/fuels";

describe("fuels", () => {
  it("matches Excel: 1000 litres CNG = 444.23 kg CO2e", () => {
    const rows = calculateFuels([
      { type: "Gaseous fuels", fuel: "CNG", unit: "litres", amount: 1000 },
    ]);
    expect(rows[0].kgCO2e).toBeCloseTo(444.23, 5);
    expect(rows[0].source).toBe("DEFRA");
  });
});
