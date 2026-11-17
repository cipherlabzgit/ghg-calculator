import type { CalculatedLine, HotelRowInput } from "../types";
import { concatKey, factorValue, lookupFactor } from "./factorLookup";
import { lineFromFactor } from "./calcUtils";

export function calculateHotels(rows: HotelRowInput[]): CalculatedLine[] {
  return rows.map((row) => {
    const key = concatKey("Scope 3", "Hotel stay", row.country);
    const record = lookupFactor(key);
    const amount = row.rooms * row.nights;
    const kg = factorValue(record) * amount;
    return lineFromFactor(
      `Hotel stay — ${row.country} (${row.rooms} rooms × ${row.nights} nights)`,
      amount,
      "Room per night",
      record,
      kg,
    );
  });
}
