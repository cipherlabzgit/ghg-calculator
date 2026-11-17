import { calculateBusinessTravel } from "../src/services/businessTravel";

describe("business travel", () => {
  it("sends Ferry rows to sea and others to land", () => {
    const split = calculateBusinessTravel([
      {
        vehicle: "Ferry",
        type: "Foot passenger",
        unit: "passenger.km",
        distance: 100,
      },
      {
        vehicle: "Bus",
        type: "Average local bus",
        fuel: "",
        unit: "passenger.km",
        distance: 50,
      },
    ]);
    expect(split.sea).toHaveLength(1);
    expect(split.land).toHaveLength(1);
    expect(split.sea[0].kgCO2e).toBeCloseTo(1.8738, 4);
  });
});
