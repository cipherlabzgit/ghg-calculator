import { calculateWaste } from "../src/services/waste";

describe("waste", () => {
  it("looks up landfill aggregates", () => {
    const rows = calculateWaste([
      {
        process: "Landfill",
        activity: "Construction",
        wasteType: "Aggregates",
        unit: "tonnes",
        amount: 1,
      },
    ]);
    expect(rows[0].kgCO2e).toBeCloseTo(1.2393136, 6);
  });

  it("looks up closed-loop recycling from the DB sheet", () => {
    const rows = calculateWaste([
      {
        process: "Closed-loop",
        activity: "Construction",
        wasteType: "Aggregates",
        unit: "tonnes",
        amount: 10,
      },
    ]);
    expect(rows[0].kgCO2e).toBeGreaterThan(0);
  });
});
