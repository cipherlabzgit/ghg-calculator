import { calculateCommuting } from "../src/services/commuting";

describe("commuting", () => {
  it("uses the same land-travel factor family as business travel", () => {
    const rows = calculateCommuting([
      {
        vehicle: "Cars (by size)",
        type: "Small car",
        fuel: "Petrol",
        unit: "km",
        distance: 100,
      },
    ]);
    expect(rows[0].kgCO2e).toBeGreaterThan(0);
  });
});
