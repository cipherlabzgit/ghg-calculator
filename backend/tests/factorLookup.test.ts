import { FactorLookupError } from "../src/types";
import { factorValue, lookupCountry, lookupFactor } from "../src/services/factorLookup";

describe("factorLookup", () => {
  it("finds CNG litres using the Excel concatenated key", () => {
    const record = lookupFactor("Scope 1FuelsGaseous fuelsCNGlitres");
    expect(factorValue(record)).toBeCloseTo(0.44423, 5);
    expect(record.source).toBe("DEFRA");
    expect(record.vintage).toBe(2021);
  });

  it("matches keys case-insensitively like Excel VLOOKUP", () => {
    const record = lookupFactor("scope 3water supplywater supplywater supplycubic metres");
    expect(factorValue(record)).toBeCloseTo(0.149, 5);
  });

  it("returns the first duplicate key (Gross CV before Net CV)", () => {
    const record = lookupFactor("Scope 1FuelsGaseous fuelsCNGkWh");
    expect(factorValue(record)).toBeCloseTo(0.18316, 5);
  });

  it("looks up a country grid factor", () => {
    const country = lookupCountry("Sri Lanka");
    expect(country.gefKgPerKwh).toBeGreaterThan(0);
    expect(country.source).toBe("IFI");
  });

  it("throws a 400-style error for an unknown key", () => {
    expect(() => lookupFactor("not-a-real-key")).toThrow(FactorLookupError);
  });
});
