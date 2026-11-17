import { calculateHotels } from "../src/services/hotels";

describe("hotels", () => {
  it("uses the Cornell short key: rooms x nights x factor", () => {
    const rows = calculateHotels([{ country: "Argentina", rooms: 2, nights: 3 }]);
    expect(rows[0].kgCO2e).toBeCloseTo(77.0804243080567 * 6, 6);
    expect(rows[0].source).toBe("CORNELL");
  });
});
