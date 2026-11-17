import type { CalculatedLine, ElectricityRowInput } from "../types";
import { factorValue, getTdElectricityFactor, lookupCountry } from "./factorLookup";

export type ElectricitySplit = {
  generation: CalculatedLine[];
  tdLosses: CalculatedLine[];
};

export function calculateElectricity(rows: ElectricityRowInput[]): ElectricitySplit {
  const generation: CalculatedLine[] = [];
  const tdLosses: CalculatedLine[] = [];
  const tdRecord = getTdElectricityFactor();

  for (const row of rows) {
    const country = lookupCountry(row.country);
    const gef = row.customGef ?? country.gefKgPerKwh;
    const td = row.customTd ?? factorValue(tdRecord);
    const renewable = row.renewable;
    const genKg = renewable ? 0 : row.kWh * gef;
    const tdKg = renewable ? 0 : row.kWh * td;

    generation.push({
      description: `Electricity — ${row.country}${renewable ? " (renewable contract)" : ""}`,
      amount: row.kWh,
      unit: "kWh",
      factor: renewable ? 0 : gef,
      kgCO2e: genKg,
      source: row.customGef != null ? "User-supplied factor" : country.source,
      vintage: row.customGef != null ? null : country.vintage,
    });

    tdLosses.push({
      description: `T&D losses — ${row.country}${renewable ? " (renewable contract)" : ""}`,
      amount: row.kWh,
      unit: "kWh",
      factor: renewable ? 0 : td,
      kgCO2e: tdKg,
      source: row.customTd != null ? "User-supplied factor" : tdRecord.source,
      vintage: row.customTd != null ? null : tdRecord.vintage,
    });
  }

  return { generation, tdLosses };
}
