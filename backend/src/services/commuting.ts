import type { CalculatedLine, TravelRowInput } from "../types";
import { concatKey, factorValue, lookupFactor } from "./factorLookup";
import { lineFromFactor } from "./calcUtils";

export function calculateCommuting(rows: TravelRowInput[]): CalculatedLine[] {
  return rows.map((row) => {
    const prefix = row.vehicle === "Ferry" ? "Scope 3Business travel- Sea" : "Scope 3Business travel- land";
    const key = concatKey(prefix, row.vehicle, row.type, row.fuel, row.unit);
    const record = lookupFactor(key);
    const kg = factorValue(record) * row.distance;
    return lineFromFactor(
      [row.vehicle, row.type, row.fuel].filter(Boolean).join(" / "),
      row.distance,
      row.unit,
      record,
      kg,
    );
  });
}
