import { calculateWttFuels } from "../src/services/wttFuels";

describe("WTT fuels", () => {
  it("calculates well-to-tank CNG litres", () => {
    const rows = calculateWttFuels([
      { type: "WTT- gaseous fuels", fuel: "CNG", unit: "litres", amount: 1000 },
    ]);
    expect(rows[0].kgCO2e).toBeCloseTo(94.87, 4);
  });
});
