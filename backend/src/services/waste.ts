import type { CalculatedLine, WasteRowInput } from "../types";
import { concatKey, factorValue, lookupFactor } from "./factorLookup";
import { lineFromFactor } from "./calcUtils";

export function calculateWaste(rows: WasteRowInput[]): CalculatedLine[] {
  return rows.map((row) => {
    const key = concatKey("Scope 3", "Waste disposal", row.activity, row.wasteType, row.process, row.unit);
    const record = lookupFactor(key);
    const kg = factorValue(record) * row.amount;
    return lineFromFactor(`${row.wasteType} / ${row.process}`, row.amount, row.unit, record, kg);
  });
}
