import type { CalculatedLine, MaterialRowInput } from "../types";
import { concatKey, factorValue, lookupFactor } from "./factorLookup";
import { lineFromFactor } from "./calcUtils";

export function calculateMaterialUse(rows: MaterialRowInput[]): CalculatedLine[] {
  return rows.map((row) => {
    const key = concatKey("Scope 3", "Material use", row.activity, row.material, row.process, row.unit);
    const record = lookupFactor(key);
    const kg = factorValue(record) * row.tonnes;
    return lineFromFactor(`${row.material} (${row.activity})`, row.tonnes, row.unit, record, kg);
  });
}
