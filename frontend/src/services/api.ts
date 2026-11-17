import type { CalculateResponse, CountryRecord, MetaResponse, WizardDraft } from "../types";
import { toNumber } from "../utils/format";

/** Full API base including `/api`. Empty/unset uses the Vite proxy at `/api`. */
export function apiBaseUrl(raw: string | undefined = import.meta.env.VITE_API_BASE_URL): string {
  const configured = raw?.trim();
  if (!configured) return "/api";
  return configured.replace(/\/+$/, "");
}

const API = apiBaseUrl();

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Request failed (${response.status})`);
  }
  return data as T;
}

export function fetchCountries() {
  return request<CountryRecord[]>("/countries");
}

export function fetchMeta() {
  return request<MetaResponse>("/meta");
}

export type FactorCatalogRow = {
  lookupKey: string;
  level2: string;
  level3: string;
  unit: string;
  ghg?: string;
  factor: number | null;
  source: string;
  vintage: number | null;
  category: string;
};

export function fetchFactors(category: string) {
  return request<{
    category: string;
    tree: Array<Record<string, string | number>> | string[];
    factors: FactorCatalogRow[];
  }>(`/factors?category=${encodeURIComponent(category)}`);
}

function optionalNumber(value: string): number | undefined {
  if (value === "" || value == null) return undefined;
  return toNumber(value);
}

export function draftToPayload(draft: WizardDraft) {
  const employees = optionalNumber(draft.organisation.employees);
  return {
    organisation: {
      name: draft.organisation.name,
      country: draft.organisation.country,
      city: draft.organisation.city || undefined,
      period: draft.organisation.period,
      employees: employees != null ? Math.round(employees) : undefined,
    },
    skippedCategories: draft.skippedCategories,
    scope1: {
      fuels: draft.scope1.fuels
        .filter((row) => row.type && row.fuel && row.unit)
        .map((row) => ({
          type: row.type,
          fuel: row.fuel,
          unit: row.unit,
          amount: toNumber(row.amount),
        })),
      bioenergy: draft.scope1.bioenergy
        .filter((row) => row.type && row.fuel && row.unit)
        .map((row) => ({
          type: row.type,
          fuel: row.fuel,
          unit: row.unit,
          amount: toNumber(row.amount),
        })),
      refrigerants: draft.scope1.refrigerants
        .filter((row) => row.protocol && row.gas && row.unit)
        .map((row) => ({
          protocol: row.protocol,
          gas: row.gas,
          unit: row.unit,
          amount: toNumber(row.amount),
        })),
      ownedVehicles: draft.scope1.ownedVehicles
        .filter((row) => row.level1 && row.level2 && row.level3 && row.unit)
        .map((row) => ({
          level1: row.level1,
          level2: row.level2,
          level3: row.level3,
          fuel: row.fuel || undefined,
          unit: row.unit,
          distanceKm: toNumber(row.distanceKm),
        })),
    },
    scope2: {
      electricity: draft.scope2.electricity
        .filter((row) => row.country || draft.organisation.country)
        .map((row) => ({
          country: row.country || draft.organisation.country,
          kWh: toNumber(row.kWh),
          renewable: row.renewable,
          customGef: optionalNumber(row.customGef),
          customTd: optionalNumber(row.customTd),
        })),
      heatSteam: draft.scope2.heatSteam
        .filter((row) => row.type)
        .map((row) => ({
          type: row.type,
          kWh: toNumber(row.kWh),
        })),
      districtCooling: draft.scope2.districtCoolingTons
        ? { tons: toNumber(draft.scope2.districtCoolingTons) }
        : undefined,
    },
    scope3: {
      wttFuels: draft.scope3.wttFuels
        .filter((row) => row.type && row.fuel && row.unit)
        .map((row) => ({
          type: row.type,
          fuel: row.fuel,
          unit: row.unit,
          amount: toNumber(row.amount),
        })),
      water: draft.scope3.water
        .filter((row) => row.kind && row.unit)
        .map((row) => ({
          kind: row.kind,
          unit: row.unit,
          amount: toNumber(row.amount),
        })),
      materialUse: draft.scope3.materialUse
        .filter((row) => row.process && row.activity && row.material && row.unit)
        .map((row) => ({
          process: row.process,
          activity: row.activity,
          material: row.material,
          unit: row.unit,
          tonnes: toNumber(row.tonnes),
        })),
      waste: draft.scope3.waste
        .filter((row) => row.process && row.activity && row.wasteType && row.unit)
        .map((row) => ({
          process: row.process,
          activity: row.activity,
          wasteType: row.wasteType,
          unit: row.unit,
          amount: toNumber(row.amount),
        })),
      flights: draft.scope3.flights.map((row) => ({
        origin: row.origin || undefined,
        destination: row.destination || undefined,
        travelClass: row.travelClass || undefined,
        tripType: row.tripType || undefined,
        kgCO2e: toNumber(row.kgCO2e),
      })),
      hotels: draft.scope3.hotels
        .filter((row) => row.country)
        .map((row) => ({
          country: row.country,
          rooms: toNumber(row.rooms),
          nights: toNumber(row.nights),
        })),
      businessTravel: draft.scope3.businessTravel
        .filter((row) => row.vehicle && row.type && row.unit)
        .map((row) => ({
          vehicle: row.vehicle,
          type: row.type,
          fuel: row.fuel || undefined,
          unit: row.unit,
          distance: toNumber(row.distance),
        })),
      freight: draft.scope3.freight
        .filter((row) => row.vehicle && row.type && row.unit)
        .map((row) => ({
          vehicle: row.vehicle,
          type: row.type,
          fuel: row.fuel || undefined,
          unit: row.unit,
          tonnes: toNumber(row.tonnes),
          km: toNumber(row.km),
        })),
      commuting: draft.scope3.commuting
        .filter((row) => row.vehicle && row.type && row.unit)
        .map((row) => ({
          vehicle: row.vehicle,
          type: row.type,
          fuel: row.fuel || undefined,
          unit: row.unit,
          distance: toNumber(row.distance),
        })),
      food: draft.scope3.food
        .filter((row) => row.foodType)
        .map((row) => ({
          foodType: row.foodType,
          amount: toNumber(row.amount),
        })),
      homeOffice: draft.scope3.homeOffice
        .filter((row) => row.officeType && row.country)
        .map((row) => ({
        officeType: row.officeType,
        country: row.country,
        employees: toNumber(row.employees),
        workingRegimePercent: toNumber(row.workingRegimePercent),
        wfhPercent: toNumber(row.wfhPercent),
        months: toNumber(row.months),
      })),
    },
  };
}

export function calculate(draft: WizardDraft) {
  return request<CalculateResponse>("/calculate", {
    method: "POST",
    body: JSON.stringify(draftToPayload(draft)),
  });
}
