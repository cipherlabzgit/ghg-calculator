import { calculateOwnedVehicles } from "../src/services/ownedVehicles";
import { factorValue, getUkElectricityFactor, lookupCountry, lookupFactor } from "../src/services/factorLookup";

const UK = "United Kingdom of Great Britain and Northern Ireland";

describe("owned vehicles", () => {
  it("splits fuel to Scope 1 and scaled EV electricity to Scope 2", () => {
    const row = {
      level1: "Passenger vehicles",
      level2: "Cars (by size)",
      level3: "Small car",
      fuel: "Plug-in Hybrid Electric Vehicle",
      unit: "km",
      distanceKm: 30000,
    };
    const split = calculateOwnedVehicles([row], UK);
    const fuelFactor = factorValue(
      lookupFactor("Scope 1Passenger vehiclesCars (by size)Small carPlug-in Hybrid Electric Vehiclekm"),
    );
    const ukEv = factorValue(
      lookupFactor("Scope 2UK electricity for EvsCars (by size)Small carPlug-in Hybrid Electric Vehiclekm"),
    );
    const ukElec = factorValue(getUkElectricityFactor());
    const gef = lookupCountry(UK).gefKgPerKwh;
    const evFactor = (ukEv / ukElec) * gef;

    expect(split.passenger).toHaveLength(1);
    expect(split.delivery).toHaveLength(0);
    expect(split.passenger[0].kgCO2e).toBeCloseTo(fuelFactor * 30000, 6);
    expect(split.evElectricity[0].kgCO2e).toBeCloseTo(evFactor * 30000, 6);
  });

  it("puts delivery vans in the delivery bucket", () => {
    const split = calculateOwnedVehicles(
      [
        {
          level1: "Delivery vehicles",
          level2: "Vans",
          level3: "Class I (up to 1.305 tonnes)",
          fuel: "Diesel",
          unit: "km",
          distanceKm: 100,
        },
      ],
      UK,
    );
    expect(split.delivery).toHaveLength(1);
    expect(split.passenger).toHaveLength(0);
  });
});
