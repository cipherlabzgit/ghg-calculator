import fs from "fs";
import path from "path";
import type {
  CountryRecord,
  FactorRecord,
  FoodFactor,
  HomeOfficeConfig,
} from "../types";
import { FactorLookupError } from "../types";

// tsx (src/services) and compiled (dist/services) both resolve ../data next to that tree.
const DATA_DIR = path.join(__dirname, "../data");

function readJson<T>(filename: string): T {
  const filePath = path.join(DATA_DIR, filename);
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
}

const factors = readJson<FactorRecord[]>("emission-factors.json");
const countries = readJson<CountryRecord[]>("countries.json");
const foodFactors = readJson<FoodFactor[]>("food-factors.json");
const homeOffice = readJson<HomeOfficeConfig>("home-office.json");

const firstByKey = new Map<string, FactorRecord>();
for (const factor of factors) {
  const key = factor.lookupKey.toLowerCase();
  if (!firstByKey.has(key)) {
    firstByKey.set(key, factor);
  }
}

const countryByName = new Map<string, CountryRecord>();
for (const country of countries) {
  countryByName.set(country.name.toLowerCase(), country);
}

const foodByType = new Map<string, FoodFactor>();
for (const food of foodFactors) {
  foodByType.set(food.foodType.toLowerCase(), food);
}

const homeOfficeByType = new Map(
  homeOffice.types.map((item) => [item.officeType.toLowerCase(), item]),
);

export function concatKey(...parts: Array<string | undefined | null>): string {
  return parts.map((part) => (part ?? "").toString()).join("");
}

export function lookupFactor(key: string): FactorRecord {
  const match = firstByKey.get(key.toLowerCase());
  if (!match) {
    throw new FactorLookupError(`No emission factor found for key: ${key}`);
  }
  return match;
}

export function factorValue(record: FactorRecord): number {
  return record.factor ?? 0;
}

export function lookupCountry(name: string): CountryRecord {
  const match = countryByName.get(name.toLowerCase());
  if (!match) {
    throw new FactorLookupError(`No grid emission factor found for country: ${name}`);
  }
  return match;
}

export function tryLookupCountry(name?: string): CountryRecord | undefined {
  if (!name) return undefined;
  return countryByName.get(name.toLowerCase());
}

export function lookupFood(foodType: string): FoodFactor {
  const match = foodByType.get(foodType.toLowerCase());
  if (!match) {
    throw new FactorLookupError(`No food emission factor found for: ${foodType}`);
  }
  return match;
}

export function lookupHomeOfficeType(officeType: string) {
  const match = homeOfficeByType.get(officeType.toLowerCase());
  if (!match) {
    throw new FactorLookupError(`Unknown home office type: ${officeType}`);
  }
  return match;
}

export function getUkElectricityFactor(): FactorRecord {
  const match = factors.find((item) => item.level1 === "UK electricity" && item.factor != null);
  if (!match) {
    throw new FactorLookupError("UK electricity factor is missing from the factor table");
  }
  return match;
}

export function getTdElectricityFactor(): FactorRecord {
  return lookupFactor("Scope 3Transmission and distributionT&D- UK electricityElectricity: UKkWh");
}

export function getTdHeatFactor(): FactorRecord {
  return lookupFactor("Scope 3Transmission and distributionDistribution - district heat & steam5% losskWh");
}

export function getHoursPerMonth(): number {
  return homeOffice.hoursPerMonth;
}

export function getAllFactors(): FactorRecord[] {
  return factors;
}

export function getCountries(): CountryRecord[] {
  return countries;
}

export function getFoodFactors(): FoodFactor[] {
  return foodFactors;
}

export function getHomeOfficeConfig(): HomeOfficeConfig {
  return homeOffice;
}

export function getFactorTrees(): Record<string, unknown> {
  return readJson<Record<string, unknown>>("factor-trees.json");
}

export function factorsByCategory(category: string): FactorRecord[] {
  return factors.filter((item) => item.category === category);
}
