import type { MonthlyAmounts } from "../config/annualise";

export type CountryRecord = {
  name: string;
  gefKgPerKwh: number;
  source: string;
  vintage: number | null;
};

export type FoodFactor = {
  foodType: string;
  unit: string;
  factor: number;
  source: string;
  vintage: number | null;
};

export type HomeOfficeConfig = {
  hoursPerMonth: number;
  types: Array<{
    officeType: string;
    unit: string;
    kWhPerHour: number;
    source: string;
  }>;
};

export type FactorOption = Record<string, string>;

export type OrganisationDraft = {
  name: string;
  country: string;
  city: string;
  period: string;
  employees: string;
};

export type FuelRow = { type: string; fuel: string; unit: string; amount: string } & MonthlyAmounts;
export type RefrigerantRow = { protocol: string; gas: string; unit: string; amount: string } & MonthlyAmounts;
export type VehicleRow = {
  level1: string;
  level2: string;
  level3: string;
  fuel: string;
  unit: string;
  distanceKm: string;
} & MonthlyAmounts;
export type ElectricityRow = {
  country: string;
  kWh: string;
  renewable: boolean;
  customGef: string;
  customTd: string;
} & MonthlyAmounts;
export type HeatSteamRow = { type: string; kWh: string } & MonthlyAmounts;
export type WaterRow = { kind: "supply" | "treatment"; unit: string; amount: string } & MonthlyAmounts;
export type MaterialRow = {
  process: string;
  activity: string;
  material: string;
  unit: string;
  tonnes: string;
} & MonthlyAmounts;
export type WasteRow = {
  process: string;
  activity: string;
  wasteType: string;
  unit: string;
  amount: string;
} & MonthlyAmounts;
export type FlightRow = {
  origin: string;
  destination: string;
  travelClass: string;
  tripType: string;
  kgCO2e: string;
};
export type HotelRow = { country: string; rooms: string; nights: string };
export type TravelRow = { vehicle: string; type: string; fuel: string; unit: string; distance: string } & MonthlyAmounts;
export type FreightRow = { vehicle: string; type: string; fuel: string; unit: string; tonnes: string; km: string };
export type FoodRow = { foodType: string; amount: string } & MonthlyAmounts;
export type HomeOfficeRow = {
  officeType: string;
  country: string;
  employees: string;
  workingRegimePercent: string;
  wfhPercent: string;
  months: string;
};

export type WizardDraft = {
  organisation: OrganisationDraft;
  skippedCategories: string[];
  scope1: {
    fuels: FuelRow[];
    bioenergy: FuelRow[];
    refrigerants: RefrigerantRow[];
    ownedVehicles: VehicleRow[];
  };
  scope2: {
    electricity: ElectricityRow[];
    heatSteam: HeatSteamRow[];
    districtCoolingTons: string;
    districtCoolingMonthly?: MonthlyAmounts;
  };
  scope3: {
    wttFuels: FuelRow[];
    water: WaterRow[];
    materialUse: MaterialRow[];
    waste: WasteRow[];
    flights: FlightRow[];
    hotels: HotelRow[];
    businessTravel: TravelRow[];
    freight: FreightRow[];
    commuting: TravelRow[];
    food: FoodRow[];
    homeOffice: HomeOfficeRow[];
  };
};

export type CalculatedLine = {
  description: string;
  amount: number;
  unit: string;
  factor: number;
  kgCO2e: number;
  source: string;
  vintage: number | null;
};

export type CategoryResult = {
  id: string;
  scope: 1 | 2 | 3;
  label: string;
  kgCO2e: number;
  tCO2e: number;
  skipped: boolean;
  rows: CalculatedLine[];
};

export type CalculateResponse = {
  organisation: {
    name: string;
    country: string;
    city?: string;
    period: string;
    employees?: number;
  };
  title: string;
  categories: CategoryResult[];
  scope1tCO2e: number;
  scope2tCO2e: number;
  scope3tCO2e: number;
  totaltCO2e: number;
};

export type MetaResponse = {
  version: string;
  publication: string;
  icaoUrl: string;
  ukElectricityKgPerKwh: number;
  tdElectricityKgPerKwh: number;
  homeOffice: HomeOfficeConfig;
  food: FoodFactor[];
  sources: Array<{ name: string; year: number | null; use: string }>;
};
