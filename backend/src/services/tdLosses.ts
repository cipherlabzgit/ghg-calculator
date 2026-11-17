import type { CalculatedLine } from "../types";

export function collectTdLosses(
  electricityTd: CalculatedLine[],
  heatTd: CalculatedLine[],
): CalculatedLine[] {
  return [...electricityTd, ...heatTd];
}
