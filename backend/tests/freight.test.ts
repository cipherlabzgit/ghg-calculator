import { calculateFreight } from "../src/services/freight";

describe("freight", () => {
  it("matches Excel: 1 t x 100 km Class I diesel van = 81.485 kg", () => {
    const rows = calculateFreight([
      {
        vehicle: "Vans",
        type: "Class I (up to 1.305 tonnes)",
        fuel: "Diesel",
        unit: "tonne.km",
        tonnes: 1,
        km: 100,
      },
    ]);
    expect(rows[0].kgCO2e).toBeCloseTo(81.485, 5);
  });
});
