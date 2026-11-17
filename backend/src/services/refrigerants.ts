import type { CalculatedLine, RefrigerantRowInput } from "../types";
import { concatKey, factorValue, lookupFactor } from "./factorLookup";
import { lineFromFactor } from "./calcUtils";

export function calculateRefrigerants(rows: RefrigerantRowInput[]): CalculatedLine[] {
  return rows.map((row) => {
    const key = concatKey("Scope 1", "Refrigerant & other", row.protocol, row.gas, row.unit);
    const record = lookupFactor(key);
    const kg = factorValue(record) * row.amount;
    return lineFromFactor(row.gas, row.amount, row.unit, record, kg);
  });
}
