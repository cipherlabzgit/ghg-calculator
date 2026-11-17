import { calculateElectricity } from "../src/services/electricity";
import { calculateDistrictCooling } from "../src/services/districtCooling";
import { lookupCountry } from "../src/services/factorLookup";

const UK = "United Kingdom of Great Britain and Northern Ireland";

describe("electricity and cooling", () => {
  it("sets generation and T&D to zero when the contract is renewable", () => {
    const result = calculateElectricity([
      { country: UK, kWh: 1000, renewable: true },
    ]);
    expect(result.generation[0].kgCO2e).toBe(0);
    expect(result.tdLosses[0].kgCO2e).toBe(0);
  });

  it("uses the IFI country GEF and the UK T&D factor", () => {
    const gef = lookupCountry(UK).gefKgPerKwh;
    const result = calculateElectricity([
      { country: UK, kWh: 1000, renewable: false },
    ]);
    expect(result.generation[0].kgCO2e).toBeCloseTo(1000 * gef, 8);
    expect(result.tdLosses[0].factor).toBeCloseTo(0.01879, 5);
    expect(result.tdLosses[0].kgCO2e).toBeCloseTo(18.79, 5);
  });

  it("applies district cooling as GEF x 0.9 x tons", () => {
    const gef = lookupCountry("Sri Lanka").gefKgPerKwh;
    const rows = calculateDistrictCooling({ tons: 10 }, "Sri Lanka");
    expect(rows[0].kgCO2e).toBeCloseTo(10 * gef * 0.9, 8);
  });
});
