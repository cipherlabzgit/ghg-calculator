import type { CalculateResponse, CategoryResult } from "../types";

export type ReportLineKind = "source" | "scopeTotal" | "grandTotal";

export type ReportSourceSpec = {
  excelRow: number;
  categoryId: string;
  group: string;
  source: string | null;
};

export type ReportSheetLine = {
  excelRow: number;
  kind: ReportLineKind;
  group: string;
  source: string | null;
  categoryId?: string;
  tCO2e: number;
};

/** Row layout copied from UNFCCC GHG calculator v02.6 Report sheet. */
export const REPORT_SOURCE_SPECS: ReportSourceSpec[] = [
  {
    excelRow: 3,
    categoryId: "fuels",
    group:
      "Direct emissions arising from owned or controlled stationary sources that use fossil fuels and/or emit fugitive emissions",
    source: "Fuels",
  },
  {
    excelRow: 4,
    categoryId: "bioenergy",
    group:
      "Direct emissions arising from owned or controlled stationary sources that use fossil fuels and/or emit fugitive emissions",
    source: "Bioenergy",
  },
  {
    excelRow: 5,
    categoryId: "refrigerants",
    group:
      "Direct emissions arising from owned or controlled stationary sources that use fossil fuels and/or emit fugitive emissions",
    source: "Refrigerants",
  },
  {
    excelRow: 6,
    categoryId: "passengerVehicles",
    group: "Direct emissions from owned or controlled mobile sources",
    source: "Passenger vehicles",
  },
  {
    excelRow: 7,
    categoryId: "deliveryVehicles",
    group: "Direct emissions from owned or controlled mobile sources",
    source: "Delivery vehicles",
  },
  {
    excelRow: 9,
    categoryId: "electricity",
    group: "Location-based emissions from the generation of purchased electricity, heat, steam or cooling",
    source: "Electricity",
  },
  {
    excelRow: 10,
    categoryId: "heatSteam",
    group: "Location-based emissions from the generation of purchased electricity, heat, steam or cooling",
    source: "Heat and steam",
  },
  {
    excelRow: 11,
    categoryId: "electricityForEvs",
    group: "Location-based emissions from the generation of purchased electricity, heat, steam or cooling",
    source: "Electricity for Evs",
  },
  {
    excelRow: 12,
    categoryId: "districtCooling",
    group: "Location-based emissions from the generation of purchased electricity, heat, steam or cooling",
    source: "District cooling",
  },
  {
    excelRow: 14,
    categoryId: "wttFuels",
    group: "Fuel- and energy-related activities",
    source: "All other fuel- and energy related activities",
  },
  {
    excelRow: 15,
    categoryId: "tdLosses",
    group: "Fuel- and energy-related activities",
    source: "Transmission and distribution losses",
  },
  {
    excelRow: 16,
    categoryId: "wasteWater",
    group: "Waste generated in operations",
    source: "Waste water",
  },
  {
    excelRow: 17,
    categoryId: "waste",
    group: "Waste generated in operations",
    source: "Waste",
  },
  {
    excelRow: 18,
    categoryId: "waterSupplied",
    group: "Purchased goods",
    source: "Water supplied",
  },
  {
    excelRow: 19,
    categoryId: "materialUse",
    group: "Purchased goods",
    source: "Material use",
  },
  {
    excelRow: 20,
    categoryId: "flights",
    group: "Business travel",
    source: "All transportation by air",
  },
  {
    excelRow: 21,
    categoryId: "hotels",
    group: "Business travel",
    source: "Emissions arising from hotel accommodation associated with business travel",
  },
  {
    excelRow: 22,
    categoryId: "seaTravel",
    group: "Business travel",
    source: "All transportation by sea",
  },
  {
    excelRow: 23,
    categoryId: "landTravel",
    group: "Business travel",
    source: "All transportation by land, public transport, rented/leased vehicle and taxi",
  },
  {
    excelRow: 24,
    categoryId: "freight",
    group: "Upstream transportation and distribution",
    source: "Freighting goods",
  },
  {
    excelRow: 25,
    categoryId: "commuting",
    group: "Employees commuting",
    source: null,
  },
  {
    excelRow: 26,
    categoryId: "food",
    group: "Food",
    source: null,
  },
  {
    excelRow: 27,
    categoryId: "homeOffice",
    group: "Home office",
    source: null,
  },
];

export function tonnesForCategory(categories: CategoryResult[], id: string): number {
  return categories.find((item) => item.id === id)?.tCO2e ?? 0;
}

export function buildReportTitle(report: CalculateResponse): string {
  return `${report.organisation.name} - ${report.organisation.period} GHG emissions report`;
}

export function buildReportSheetLines(report: CalculateResponse): ReportSheetLine[] {
  const tonnes = (id: string) => tonnesForCategory(report.categories, id);

  return [
    ...REPORT_SOURCE_SPECS.filter((spec) => spec.excelRow <= 7).map((spec) => ({
      excelRow: spec.excelRow,
      kind: "source" as const,
      group: spec.group,
      source: spec.source,
      categoryId: spec.categoryId,
      tCO2e: tonnes(spec.categoryId),
    })),
    { excelRow: 8, kind: "scopeTotal", group: "Total Scope 1", source: null, tCO2e: report.scope1tCO2e },
    ...REPORT_SOURCE_SPECS.filter((spec) => spec.excelRow >= 9 && spec.excelRow <= 12).map((spec) => ({
      excelRow: spec.excelRow,
      kind: "source" as const,
      group: spec.group,
      source: spec.source,
      categoryId: spec.categoryId,
      tCO2e: tonnes(spec.categoryId),
    })),
    { excelRow: 13, kind: "scopeTotal", group: "Total Scope 2", source: null, tCO2e: report.scope2tCO2e },
    ...REPORT_SOURCE_SPECS.filter((spec) => spec.excelRow >= 14).map((spec) => ({
      excelRow: spec.excelRow,
      kind: "source" as const,
      group: spec.group,
      source: spec.source,
      categoryId: spec.categoryId,
      tCO2e: tonnes(spec.categoryId),
    })),
    { excelRow: 28, kind: "scopeTotal", group: "Total Scope 3", source: null, tCO2e: report.scope3tCO2e },
    { excelRow: 29, kind: "grandTotal", group: "Total Emissions", source: null, tCO2e: report.totaltCO2e },
  ];
}
