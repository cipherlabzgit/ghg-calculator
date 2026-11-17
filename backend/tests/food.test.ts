import { calculateFood } from "../src/services/food";

describe("food", () => {
  it("matches Excel: 10 average meals = 47 kg", () => {
    const rows = calculateFood([{ foodType: "1 average meal", amount: 10 }]);
    expect(rows[0].kgCO2e).toBeCloseTo(47, 5);
  });
});
