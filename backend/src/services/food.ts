import type { CalculatedLine, FoodRowInput } from "../types";
import { lookupFood } from "./factorLookup";

export function calculateFood(rows: FoodRowInput[]): CalculatedLine[] {
  return rows.map((row) => {
    const record = lookupFood(row.foodType);
    return {
      description: row.foodType,
      amount: row.amount,
      unit: record.unit,
      factor: record.factor,
      kgCO2e: record.factor * row.amount,
      source: record.source,
      vintage: record.vintage,
    };
  });
}
