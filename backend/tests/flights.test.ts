import { calculateFlights } from "../src/services/flights";

describe("flights", () => {
  it("passes through user-entered ICAO kg CO2e", () => {
    const rows = calculateFlights([
      { origin: "CMB", destination: "LHR", travelClass: "Economy", tripType: "Return", kgCO2e: 890 },
    ]);
    expect(rows[0].kgCO2e).toBe(890);
    expect(rows[0].source).toMatch(/ICAO/);
  });
});
