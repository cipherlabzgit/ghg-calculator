import { calculateBioenergy } from "../src/services/bioenergy";

describe("bioenergy", () => {
  it("multiplies the DEFRA bioenergy factor by amount", () => {
    const rows = calculateBioenergy([
      { type: "Biofuel", fuel: "Bioethanol", unit: "litres", amount: 10 },
    ]);
    expect(rows[0].kgCO2e).toBeGreaterThan(0);
    expect(rows[0].source).toBe("DEFRA");
  });
});
