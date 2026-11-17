import type { CalculatedLine, TravelRowInput } from "../types";
import { concatKey, factorValue, lookupFactor } from "./factorLookup";
import { lineFromFactor } from "./calcUtils";

export type TravelSplit = {
  sea: CalculatedLine[];
  land: CalculatedLine[];
};

function travelKey(row: TravelRowInput): string {
  const prefix = row.vehicle === "Ferry" ? "Scope 3Business travel- Sea" : "Scope 3Business travel- land";
  return concatKey(prefix, row.vehicle, row.type, row.fuel, row.unit);
}

export function calculateBusinessTravel(rows: TravelRowInput[]): TravelSplit {
  const sea: CalculatedLine[] = [];
  const land: CalculatedLine[] = [];

  for (const row of rows) {
    const record = lookupFactor(travelKey(row));
    const kg = factorValue(record) * row.distance;
    const line = lineFromFactor(
      [row.vehicle, row.type, row.fuel].filter(Boolean).join(" / "),
      row.distance,
      row.unit,
      record,
      kg,
    );
    if (row.vehicle === "Ferry") {
      sea.push(line);
    } else {
      land.push(line);
    }
  }

  return { sea, land };
}

export function calculateTravelRows(rows: TravelRowInput[]): CalculatedLine[] {
  const split = calculateBusinessTravel(rows);
  return [...split.sea, ...split.land];
}
