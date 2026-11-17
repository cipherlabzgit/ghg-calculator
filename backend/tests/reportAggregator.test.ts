import { aggregateReport } from "../src/services/reportAggregator";
import { emptyRequest } from "./helpers";

describe("report aggregator", () => {
  it("sums golden Excel cases into the matching report lines", () => {
    const report = aggregateReport(
      emptyRequest({
        scope1: {
          fuels: [{ type: "Gaseous fuels", fuel: "CNG", unit: "litres", amount: 1000 }],
          bioenergy: [],
          refrigerants: [
            { protocol: "Kyoto protocol - standard", gas: "HFC-134a", unit: "kg", amount: 1 },
          ],
          ownedVehicles: [],
        },
        scope3: {
          wttFuels: [],
          water: [{ kind: "supply", unit: "cubic metres", amount: 1000 }],
          materialUse: [
            {
              process: "Primary material production",
              activity: "Construction",
              material: "Aggregates",
              unit: "tonnes",
              tonnes: 10,
            },
          ],
          waste: [],
          flights: [{ kgCO2e: 1000 }],
          hotels: [],
          businessTravel: [],
          freight: [
            {
              vehicle: "Vans",
              type: "Class I (up to 1.305 tonnes)",
              fuel: "Diesel",
              unit: "tonne.km",
              tonnes: 1,
              km: 100,
            },
          ],
          commuting: [],
          food: [{ foodType: "1 average meal", amount: 10 }],
          homeOffice: [],
        },
      }),
    );

    const byId = Object.fromEntries(report.categories.map((item) => [item.id, item]));
    expect(byId.fuels.kgCO2e).toBeCloseTo(444.23, 5);
    expect(byId.refrigerants.kgCO2e).toBe(1430);
    expect(byId.waterSupplied.kgCO2e).toBeCloseTo(149, 5);
    expect(byId.materialUse.kgCO2e).toBeCloseTo(77.589016, 5);
    expect(byId.flights.kgCO2e).toBe(1000);
    expect(byId.freight.kgCO2e).toBeCloseTo(81.485, 5);
    expect(byId.food.kgCO2e).toBeCloseTo(47, 5);
    expect(report.totaltCO2e).toBeCloseTo(report.scope1tCO2e + report.scope2tCO2e + report.scope3tCO2e, 10);
  });

  it("zeros a skipped category", () => {
    const report = aggregateReport(
      emptyRequest({
        skippedCategories: ["fuels"],
        scope1: {
          fuels: [{ type: "Gaseous fuels", fuel: "CNG", unit: "litres", amount: 1000 }],
          bioenergy: [],
          refrigerants: [],
          ownedVehicles: [],
        },
      }),
    );
    const fuels = report.categories.find((item) => item.id === "fuels");
    expect(fuels?.skipped).toBe(true);
    expect(fuels?.kgCO2e).toBe(0);
  });
});
