import { calculateRefrigerants } from "../src/services/refrigerants";

describe("refrigerants", () => {
  it("matches Excel: 1 kg HFC-134a = 1430 kg CO2e", () => {
    const rows = calculateRefrigerants([
      {
        protocol: "Kyoto protocol - standard",
        gas: "HFC-134a",
        unit: "kg",
        amount: 1,
      },
    ]);
    expect(rows[0].kgCO2e).toBe(1430);
  });
});
