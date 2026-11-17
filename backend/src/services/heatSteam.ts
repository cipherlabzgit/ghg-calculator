import type { CalculatedLine, HeatSteamRowInput } from "../types";
import { concatKey, factorValue, getTdHeatFactor, lookupFactor } from "./factorLookup";
import { lineFromFactor } from "./calcUtils";

export type HeatSteamSplit = {
  generation: CalculatedLine[];
  tdLosses: CalculatedLine[];
};

export function calculateHeatSteam(rows: HeatSteamRowInput[]): HeatSteamSplit {
  const generation: CalculatedLine[] = [];
  const tdLosses: CalculatedLine[] = [];
  const tdRecord = getTdHeatFactor();

  for (const row of rows) {
    const key = concatKey("Scope 2", "Heat and steam", "Heat and steam", row.type, "kWh");
    const record = lookupFactor(key);
    const genKg = factorValue(record) * row.kWh;
    generation.push(lineFromFactor(row.type, row.kWh, "kWh", record, genKg));

    const tdKg = factorValue(tdRecord) * row.kWh;
    tdLosses.push(lineFromFactor(`${row.type} T&D`, row.kWh, "kWh", tdRecord, tdKg));
  }

  return { generation, tdLosses };
}
