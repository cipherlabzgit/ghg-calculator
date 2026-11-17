import type { CalculatedLine, OwnedVehicleRowInput } from "../types";
import {
  concatKey,
  factorValue,
  getUkElectricityFactor,
  lookupFactor,
  tryLookupCountry,
} from "./factorLookup";

export type OwnedVehicleSplit = {
  passenger: CalculatedLine[];
  delivery: CalculatedLine[];
  evElectricity: CalculatedLine[];
};

function scaledEvFactor(row: OwnedVehicleRowInput, countryName?: string): { factor: number; source: string; vintage: number | null } {
  const evKey = concatKey("Scope 2UK electricity for Evs", row.level2, row.level3, row.fuel, row.unit);
  let ukEv = 0;
  let source = "DEFRA / IFI";
  let vintage: number | null = 2021;
  try {
    const evRecord = lookupFactor(evKey);
    ukEv = factorValue(evRecord);
    source = evRecord.source;
    vintage = evRecord.vintage;
  } catch {
    return { factor: 0, source, vintage };
  }

  const ukElectricity = factorValue(getUkElectricityFactor());
  const country = tryLookupCountry(countryName);
  const countryGef = country?.gefKgPerKwh ?? 0;
  if (!ukElectricity) {
    return { factor: 0, source, vintage };
  }
  return {
    factor: (ukEv / ukElectricity) * countryGef,
    source: country ? `${source} / ${country.source}` : source,
    vintage: country?.vintage ?? vintage,
  };
}

export function calculateOwnedVehicles(
  rows: OwnedVehicleRowInput[],
  countryName?: string,
): OwnedVehicleSplit {
  const passenger: CalculatedLine[] = [];
  const delivery: CalculatedLine[] = [];
  const evElectricity: CalculatedLine[] = [];

  for (const row of rows) {
    const fuelKey = concatKey("Scope 1", row.level1, row.level2, row.level3, row.fuel, row.unit);
    const fuelRecord = lookupFactor(fuelKey);
    const fuelFactor = factorValue(fuelRecord);
    const ev = scaledEvFactor(row, countryName);
    const label = [row.level1, row.level2, row.level3, row.fuel].filter(Boolean).join(" / ");

    const fuelLine: CalculatedLine = {
      description: label,
      amount: row.distanceKm,
      unit: row.unit,
      factor: fuelFactor,
      kgCO2e: fuelFactor * row.distanceKm,
      source: fuelRecord.source,
      vintage: fuelRecord.vintage,
    };

    if (row.level1 === "Delivery vehicles") {
      delivery.push(fuelLine);
    } else {
      passenger.push(fuelLine);
    }

    if (ev.factor) {
      evElectricity.push({
        description: `${label} (EV electricity)`,
        amount: row.distanceKm,
        unit: row.unit,
        factor: ev.factor,
        kgCO2e: ev.factor * row.distanceKm,
        source: ev.source,
        vintage: ev.vintage,
      });
    }
  }

  return { passenger, delivery, evElectricity };
}

export function ownedVehicleDisplayLine(row: OwnedVehicleRowInput, countryName?: string): CalculatedLine {
  const split = calculateOwnedVehicles([row], countryName);
  const fuel = [...split.passenger, ...split.delivery][0];
  const ev = split.evElectricity[0];
  const evFactor = ev?.factor ?? 0;
  return {
    ...fuel,
    factor: fuel.factor + evFactor,
    kgCO2e: (fuel.factor + evFactor) * row.distanceKm,
  };
}
