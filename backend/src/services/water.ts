import type { CalculatedLine, WaterRowInput } from "../types";
import { concatKey, factorValue, lookupFactor } from "./factorLookup";
import { lineFromFactor } from "./calcUtils";

export type WaterSplit = {
  supply: CalculatedLine[];
  treatment: CalculatedLine[];
};

export function calculateWater(rows: WaterRowInput[]): WaterSplit {
  const supply: CalculatedLine[] = [];
  const treatment: CalculatedLine[] = [];

  for (const row of rows) {
    const key =
      row.kind === "supply"
        ? concatKey("Scope 3", "Water supply", "Water supply", "Water supply", row.unit)
        : concatKey("Scope 3", "Water treatment", "Water treatment", "Water treatment", row.unit);
    const record = lookupFactor(key);
    const kg = factorValue(record) * row.amount;
    const line = lineFromFactor(
      row.kind === "supply" ? "Water supply" : "Water treatment",
      row.amount,
      row.unit,
      record,
      kg,
    );
    if (row.kind === "supply") {
      supply.push(line);
    } else {
      treatment.push(line);
    }
  }

  return { supply, treatment };
}
