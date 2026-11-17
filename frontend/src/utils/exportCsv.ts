import type { CalculateResponse } from "../types";

export function exportCsv(report: CalculateResponse, showFactors = false) {
  const detailHeader = showFactors
    ? ["Scope", "Category", "t CO2e", "Description", "Amount", "Unit", "Factor", "kg CO2e", "Source", "Year"]
    : ["Scope", "Category", "t CO2e", "Description", "Amount", "Unit", "kg CO2e", "Source", "Year"];
  const emptyDetail = showFactors ? ["", "", "", "", "", "", ""] : ["", "", "", "", "", ""];

  const lines = [
    ["Title", report.title],
    ["Organisation", report.organisation.name],
    ["Country", report.organisation.country],
    ["Period", report.organisation.period],
    [],
    ["Scope", "t CO2e"],
    ["Scope 1", String(report.scope1tCO2e)],
    ["Scope 2", String(report.scope2tCO2e)],
    ["Scope 3", String(report.scope3tCO2e)],
    ["Total", String(report.totaltCO2e)],
    [],
    detailHeader,
  ];

  for (const category of report.categories) {
    if (category.skipped) continue;
    if (category.rows.length === 0) {
      lines.push([String(category.scope), category.label, String(category.tCO2e), ...emptyDetail]);
      continue;
    }
    for (const row of category.rows) {
      lines.push([
        String(category.scope),
        category.label,
        String(category.tCO2e),
        row.description,
        String(row.amount),
        row.unit,
        ...(showFactors ? [String(row.factor)] : []),
        String(row.kgCO2e),
        row.source,
        row.vintage == null ? "" : String(row.vintage),
      ]);
    }
  }

  const csv = lines.map((row) => row.map((cell) => `"${String(cell).split('"').join('""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "ghg-emissions-report.csv";
  link.click();
  URL.revokeObjectURL(url);
}
