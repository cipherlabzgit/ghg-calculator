import type { CalculatedLine, FlightRowInput } from "../types";

export function calculateFlights(rows: FlightRowInput[]): CalculatedLine[] {
  return rows.map((row) => {
    const route = [row.origin, row.destination].filter(Boolean).join(" → ") || "Flight";
    const extra = [row.travelClass, row.tripType].filter(Boolean).join(", ");
    return {
      description: extra ? `${route} (${extra})` : route,
      amount: row.kgCO2e,
      unit: "kg CO2e",
      factor: 1,
      kgCO2e: row.kgCO2e,
      source: "ICAO carbon emissions calculator (user-entered)",
      vintage: null,
    };
  });
}
