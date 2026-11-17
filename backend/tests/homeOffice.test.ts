import { calculateHomeOffice } from "../src/services/homeOffice";
import { lookupCountry } from "../src/services/factorLookup";

const UK = "United Kingdom of Great Britain and Northern Ireland";

describe("home office", () => {
  it("uses EcoAct kWh/h, 160 hours/month, and the country GEF", () => {
    const gef = lookupCountry(UK).gefKgPerKwh;
    const rows = calculateHomeOffice([
      {
        officeType: "No heating/No cooling",
        country: UK,
        employees: 1,
        workingRegimePercent: 100,
        wfhPercent: 50,
        months: 12,
      },
    ]);
    const expected = 1 * (1 * 160) * 0.5 * 0.15 * gef * 12;
    expect(rows[0].kgCO2e).toBeCloseTo(expected, 8);
  });
});
