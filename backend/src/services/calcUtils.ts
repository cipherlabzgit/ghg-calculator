import type { CalculatedLine, CategoryResult, FactorRecord } from "../types";
import { factorValue } from "./factorLookup";

export function kgToTonnes(kg: number): number {
  return kg / 1000;
}

export function lineFromFactor(
  description: string,
  amount: number,
  unit: string,
  record: FactorRecord,
  kgCO2e: number,
): CalculatedLine {
  return {
    description,
    amount,
    unit,
    factor: factorValue(record),
    kgCO2e,
    source: record.source,
    vintage: record.vintage,
  };
}

export function sumKg(rows: CalculatedLine[]): number {
  return rows.reduce((total, row) => total + row.kgCO2e, 0);
}

export function categoryResult(
  id: string,
  scope: 1 | 2 | 3,
  label: string,
  rows: CalculatedLine[],
  skipped: boolean,
): CategoryResult {
  const kgCO2e = skipped ? 0 : sumKg(rows);
  return {
    id,
    scope,
    label,
    kgCO2e,
    tCO2e: kgToTonnes(kgCO2e),
    skipped,
    rows: skipped ? [] : rows,
  };
}

export function emptyCategory(id: string, scope: 1 | 2 | 3, label: string, skipped: boolean): CategoryResult {
  return categoryResult(id, scope, label, [], skipped);
}
