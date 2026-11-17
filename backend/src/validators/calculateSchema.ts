import { z } from "zod";

const nonNegative = z.number().finite().min(0);
const percent = z.number().finite().min(0).max(100);

const fuelRow = z.object({
  type: z.string().min(1),
  fuel: z.string().min(1),
  unit: z.string().min(1),
  amount: nonNegative,
});

const refrigerantRow = z.object({
  protocol: z.string().min(1),
  gas: z.string().min(1),
  unit: z.string().min(1),
  amount: nonNegative,
});

const vehicleRow = z.object({
  level1: z.string().min(1),
  level2: z.string().min(1),
  level3: z.string().min(1),
  fuel: z.string().optional(),
  unit: z.string().min(1),
  distanceKm: nonNegative,
});

const electricityRow = z.object({
  country: z.string().min(1),
  kWh: nonNegative,
  renewable: z.boolean(),
  customGef: z.number().finite().min(0).optional(),
  customTd: z.number().finite().min(0).optional(),
});

const travelRow = z.object({
  vehicle: z.string().min(1),
  type: z.string().min(1),
  fuel: z.string().optional(),
  unit: z.string().min(1),
  distance: nonNegative,
});

export const calculateSchema = z.object({
  organisation: z.object({
    name: z.string().min(1, "Organisation name is required"),
    country: z.string().min(1, "Country is required"),
    city: z.string().optional(),
    period: z.string().min(1, "Reporting period is required"),
    employees: z.number().finite().int().min(0).optional(),
  }),
  skippedCategories: z.array(z.string()).default([]),
  scope1: z
    .object({
      fuels: z.array(fuelRow).default([]),
      bioenergy: z.array(fuelRow).default([]),
      refrigerants: z.array(refrigerantRow).default([]),
      ownedVehicles: z.array(vehicleRow).default([]),
    })
    .default({ fuels: [], bioenergy: [], refrigerants: [], ownedVehicles: [] }),
  scope2: z
    .object({
      electricity: z.array(electricityRow).default([]),
      heatSteam: z
        .array(
          z.object({
            type: z.string().min(1),
            kWh: nonNegative,
          }),
        )
        .default([]),
      districtCooling: z
        .object({
          tons: nonNegative,
        })
        .optional(),
    })
    .default({ electricity: [], heatSteam: [] }),
  scope3: z
    .object({
      wttFuels: z.array(fuelRow).default([]),
      water: z
        .array(
          z.object({
            kind: z.enum(["supply", "treatment"]),
            unit: z.string().min(1),
            amount: nonNegative,
          }),
        )
        .default([]),
      materialUse: z
        .array(
          z.object({
            process: z.string().min(1),
            activity: z.string().min(1),
            material: z.string().min(1),
            unit: z.string().min(1),
            tonnes: nonNegative,
          }),
        )
        .default([]),
      waste: z
        .array(
          z.object({
            process: z.string().min(1),
            activity: z.string().min(1),
            wasteType: z.string().min(1),
            unit: z.string().min(1),
            amount: nonNegative,
          }),
        )
        .default([]),
      flights: z
        .array(
          z.object({
            origin: z.string().optional(),
            destination: z.string().optional(),
            travelClass: z.string().optional(),
            tripType: z.string().optional(),
            kgCO2e: nonNegative,
          }),
        )
        .default([]),
      hotels: z
        .array(
          z.object({
            country: z.string().min(1),
            rooms: z.number().finite().min(0),
            nights: z.number().finite().min(0),
          }),
        )
        .default([]),
      businessTravel: z.array(travelRow).default([]),
      freight: z
        .array(
          z.object({
            vehicle: z.string().min(1),
            type: z.string().min(1),
            fuel: z.string().optional(),
            unit: z.string().min(1),
            tonnes: nonNegative,
            km: nonNegative,
          }),
        )
        .default([]),
      commuting: z.array(travelRow).default([]),
      food: z
        .array(
          z.object({
            foodType: z.string().min(1),
            amount: nonNegative,
          }),
        )
        .default([]),
      homeOffice: z
        .array(
          z.object({
            officeType: z.string().min(1),
            country: z.string().min(1),
            employees: z.number().finite().min(0),
            workingRegimePercent: percent,
            wfhPercent: percent,
            months: z.number().finite().min(0).max(12),
          }),
        )
        .default([]),
    })
    .default({
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
    }),
});

export type CalculateBody = z.infer<typeof calculateSchema>;
