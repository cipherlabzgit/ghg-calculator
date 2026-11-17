export type FactorRecord = {
  lookupKey: string;
  scope: string;
  level1: string;
  level2: string;
  level3: string;
  level4: string;
  columnText: string;
  unit: string;
  unitFull: string;
  ghg: string;
  factor: number | null;
  source: string;
  country: string;
  vintage: number | null;
  category: string;
};

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

export type OrganisationInput = {
  name: string;
  country: string;
  city?: string;
  period: string;
  employees?: number;
};

export type FuelRowInput = {
  type: string;
  fuel: string;
  unit: string;
  amount: number;
};

export type RefrigerantRowInput = {
  protocol: string;
  gas: string;
  unit: string;
  amount: number;
};

export type OwnedVehicleRowInput = {
  level1: string;
  level2: string;
  level3: string;
  fuel?: string;
  unit: string;
  distanceKm: number;
};

export type ElectricityRowInput = {
  country: string;
  kWh: number;
  renewable: boolean;
  customGef?: number;
  customTd?: number;
};

export type HeatSteamRowInput = {
  type: string;
  kWh: number;
};

export type DistrictCoolingInput = {
  tons: number;
};

export type WaterRowInput = {
  kind: "supply" | "treatment";
  unit: string;
  amount: number;
};

export type MaterialRowInput = {
  process: string;
  activity: string;
  material: string;
  unit: string;
  tonnes: number;
};

export type WasteRowInput = {
  process: string;
  activity: string;
  wasteType: string;
  unit: string;
  amount: number;
};

export type FlightRowInput = {
  origin?: string;
  destination?: string;
  travelClass?: string;
  tripType?: string;
  kgCO2e: number;
};

export type HotelRowInput = {
  country: string;
  rooms: number;
  nights: number;
};

export type TravelRowInput = {
  vehicle: string;
  type: string;
  fuel?: string;
  unit: string;
  distance: number;
};

export type FreightRowInput = {
  vehicle: string;
  type: string;
  fuel?: string;
  unit: string;
  tonnes: number;
  km: number;
};

export type FoodRowInput = {
  foodType: string;
  amount: number;
};

export type HomeOfficeRowInput = {
  officeType: string;
  country: string;
  employees: number;
  workingRegimePercent: number;
  wfhPercent: number;
  months: number;
};

export type CalculateRequest = {
  organisation: OrganisationInput;
  skippedCategories: string[];
  scope1: {
    fuels: FuelRowInput[];
    bioenergy: FuelRowInput[];
    refrigerants: RefrigerantRowInput[];
    ownedVehicles: OwnedVehicleRowInput[];
  };
  scope2: {
    electricity: ElectricityRowInput[];
    heatSteam: HeatSteamRowInput[];
    districtCooling?: DistrictCoolingInput;
  };
  scope3: {
    wttFuels: FuelRowInput[];
    water: WaterRowInput[];
    materialUse: MaterialRowInput[];
    waste: WasteRowInput[];
    flights: FlightRowInput[];
    hotels: HotelRowInput[];
    businessTravel: TravelRowInput[];
    freight: FreightRowInput[];
    commuting: TravelRowInput[];
    food: FoodRowInput[];
    homeOffice: HomeOfficeRowInput[];
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
  organisation: OrganisationInput;
  title: string;
  categories: CategoryResult[];
  scope1tCO2e: number;
  scope2tCO2e: number;
  scope3tCO2e: number;
  totaltCO2e: number;
};

export class FactorLookupError extends Error {
  status = 400;
  constructor(message: string) {
    super(message);
    this.name = "FactorLookupError";
  }
}
