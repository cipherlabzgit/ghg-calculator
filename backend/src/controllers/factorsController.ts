import type { Request, Response } from "express";
import {
  factorValue,
  factorsByCategory,
  getAllFactors,
  getCountries,
  getFactorTrees,
  getFoodFactors,
  getHomeOfficeConfig,
  getTdElectricityFactor,
  getUkElectricityFactor,
} from "../services/factorLookup";

function nestTree(items: Array<Record<string, string>>, levels: string[]) {
  const root: Record<string, unknown> = {};
  for (const item of items) {
    let cursor = root;
    levels.forEach((level, index) => {
      const value = item[level] || "(none)";
      const isLeaf = index === levels.length - 1;
      if (isLeaf) {
        const existing = (cursor[level] as string[] | undefined) ?? [];
        if (!existing.includes(value)) existing.push(value);
        cursor[level] = existing;
        return;
      }
      if (!cursor[value]) cursor[value] = {};
      cursor = cursor[value] as Record<string, unknown>;
    });
  }
  return root;
}

export function getHealth(_req: Request, res: Response) {
  res.json({ ok: true, version: "02.6" });
}

export function getCountriesHandler(_req: Request, res: Response) {
  res.json(getCountries());
}

export function getMeta(_req: Request, res: Response) {
  res.json({
    version: "02.6",
    publication: "September 2022",
    icaoUrl: "https://www.icao.int/environmental-protection/Carbonoffset/Pages/default.aspx",
    ukElectricityKgPerKwh: factorValue(getUkElectricityFactor()),
    tdElectricityKgPerKwh: factorValue(getTdElectricityFactor()),
    homeOffice: getHomeOfficeConfig(),
    food: getFoodFactors(),
    sources: [
      { name: "DEFRA", year: 2021, use: "Fuels, vehicles, waste, travel, water, materials, T&D" },
      { name: "IFI Harmonized GEF", year: 2020, use: "Country electricity grid factors" },
      { name: "Cornell Hotel Sustainability Benchmarking", year: 2020, use: "Hotel stays" },
      { name: "ICAO", year: null, use: "Flights (user-entered kg CO2e)" },
      { name: "EcoAct", year: null, use: "Home office kWh per hour" },
      { name: "IOC / Olympic methodology", year: null, use: "Food" },
    ],
  });
}

export function getFactors(req: Request, res: Response) {
  const category = typeof req.query.category === "string" ? req.query.category : undefined;
  const trees = getFactorTrees();
  const list = category ? factorsByCategory(category) : getAllFactors();

  res.json({
    category: category ?? "all",
    tree: category && trees[category] ? trees[category] : trees,
    factors: list.map((item) => ({
      lookupKey: item.lookupKey,
      scope: item.scope,
      level1: item.level1,
      level2: item.level2,
      level3: item.level3,
      level4: item.level4,
      columnText: item.columnText,
      unit: item.unit,
      ghg: item.ghg,
      factor: item.factor,
      source: item.source,
      vintage: item.vintage,
      category: item.category,
    })),
    nested: category
      ? nestTree(
          list.map((item) => ({
            type: item.level2,
            fuel: item.level3 || item.columnText,
            unit: item.unit,
          })),
          ["type", "fuel", "unit"],
        )
      : undefined,
  });
}
