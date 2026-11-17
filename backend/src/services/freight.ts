import type { CalculatedLine, FreightRowInput } from "../types";
import { concatKey, factorValue, lookupFactor } from "./factorLookup";
import { lineFromFactor } from "./calcUtils";

export function calculateFreight(rows: FreightRowInput[]): CalculatedLine[] {
  return rows.map((row) => {
    const key = concatKey("Scope 3Freighting goods", row.vehicle, row.type, row.fuel, row.unit);
    const record = lookupFactor(key);
    const kg = factorValue(record) * row.tonnes * row.km;
    return lineFromFactor(
      `${[row.vehicle, row.type, row.fuel].filter(Boolean).join(" / ")} (${row.tonnes} t × ${row.km} km)`,
      row.tonnes * row.km,
      row.unit,
      record,
      kg,
    );
  });
}
