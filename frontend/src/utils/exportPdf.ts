import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { CalculateResponse } from "../types";
import { formatTonnes } from "./format";

export function exportPdf(report: CalculateResponse) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(report.title, 14, 18);
  doc.setFontSize(10);
  doc.text(`${report.organisation.name} · ${report.organisation.country} · ${report.organisation.period}`, 14, 26);
  doc.text(
    `Scope 1: ${formatTonnes(report.scope1tCO2e)}  Scope 2: ${formatTonnes(report.scope2tCO2e)}  Scope 3: ${formatTonnes(report.scope3tCO2e)}  Total: ${formatTonnes(report.totaltCO2e)} t CO2e`,
    14,
    34,
  );

  autoTable(doc, {
    startY: 40,
    head: [["Scope", "Category", "t CO2e"]],
    body: report.categories
      .filter((item) => !item.skipped)
      .map((item) => [String(item.scope), item.label, formatTonnes(item.tCO2e)]),
  });

  const finalY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 40;
  doc.setFontSize(8);
  doc.text(
    "Factors: DEFRA 2021, IFI GEF 2020/21, Cornell HSB 2020, ICAO, EcoAct, IOC. Awareness tool only — not for certification.",
    14,
    finalY + 10,
    { maxWidth: 180 },
  );
  doc.save("ghg-emissions-report.pdf");
}
