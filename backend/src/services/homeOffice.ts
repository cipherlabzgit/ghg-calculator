import type { CalculatedLine, HomeOfficeRowInput } from "../types";
import { getHoursPerMonth, lookupCountry, lookupHomeOfficeType } from "./factorLookup";

export function calculateHomeOffice(rows: HomeOfficeRowInput[]): CalculatedLine[] {
  const hoursPerMonth = getHoursPerMonth();

  return rows.map((row) => {
    const office = lookupHomeOfficeType(row.officeType);
    const country = lookupCountry(row.country);
    const regime = row.workingRegimePercent / 100;
    const wfh = row.wfhPercent / 100;
    const kg =
      row.employees *
      (regime * hoursPerMonth) *
      wfh *
      office.kWhPerHour *
      country.gefKgPerKwh *
      row.months;

    return {
      description: `${row.officeType} — ${row.country}`,
      amount: row.employees,
      unit: "employees",
      factor: office.kWhPerHour * country.gefKgPerKwh,
      kgCO2e: kg,
      source: `${office.source}; ${country.source}`,
      vintage: country.vintage,
    };
  });
}
