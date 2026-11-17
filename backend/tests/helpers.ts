import type { CalculateRequest } from "../src/types";

export function emptyRequest(overrides: Partial<CalculateRequest> = {}): CalculateRequest {
  return {
    organisation: {
      name: "Test Org",
      country: "United Kingdom of Great Britain and Northern Ireland",
      period: "2024",
      city: "London",
      employees: 10,
    },
    skippedCategories: [],
    scope1: { fuels: [], bioenergy: [], refrigerants: [], ownedVehicles: [] },
    scope2: { electricity: [], heatSteam: [] },
    scope3: {
      wttFuels: [],
      water: [],
      materialUse: [],
      waste: [],
      flights: [],
      hotels: [],
      businessTravel: [],
      freight: [],
      commuting: [],
      food: [],
      homeOffice: [],
    },
    ...overrides,
  };
}
