import type { CalculatedLine, DistrictCoolingInput } from "../types";
import { tryLookupCountry } from "./factorLookup";

export function calculateDistrictCooling(
  input: DistrictCoolingInput | undefined,
  countryName?: string,
): CalculatedLine[] {
  if (!input || !input.tons) {
    return [];
  }
  const country = tryLookupCountry(countryName);
  const gef = country?.gefKgPerKwh ?? 0;
  const factor = gef * 0.9;
  return [
    {
      description: `District cooling — ${countryName || "no country selected"}`,
      amount: input.tons,
      unit: "Ton of refrigeration",
      factor,
      kgCO2e: input.tons * factor,
      source: country ? `${country.source} × 0.9 (GSAS SEER)` : "IFI × 0.9 (GSAS SEER)",
      vintage: country?.vintage ?? null,
    },
  ];
}
