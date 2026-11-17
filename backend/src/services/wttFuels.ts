import type { CalculatedLine, FuelRowInput } from "../types";
import { concatKey, factorValue, lookupFactor } from "./factorLookup";
import { lineFromFactor } from "./calcUtils";

export function calculateWttFuels(rows: FuelRowInput[]): CalculatedLine[] {
  return rows.map((row) => {
    const key = concatKey("Scope 3", "WTT- fuels", row.type, row.fuel, row.unit);
    const record = lookupFactor(key);
    const kg = factorValue(record) * row.amount;
    return lineFromFactor(`${row.fuel} (${row.type})`, row.amount, row.unit, record, kg);
  });
}
