import ExcelJS from "exceljs";
import type { CalculateResponse } from "../types";
import { DEFINITIONS, DISCLAIMER, INFO_SOURCES } from "./reportReference";
import { buildReportSheetLines, buildReportTitle } from "./reportSheet";

export type ExportOptions = {
  showFactors?: boolean;
};

const GREEN_HEADER = "A9CE91";
const GREEN_BODY = "E2EFDA";
const DARK_LABEL = "3A3A3A";
const TEXT = "333F50";
const WHITE = "FFFFFF";
const THIN_BORDER = "A6A6A6";

const ACCOUNTING = '_-* #,##0.00_-;-* #,##0.00_-;_-* "-"??_-;_-@_-';

function border(color = THIN_BORDER): Partial<ExcelJS.Borders> {
  const edge: Partial<ExcelJS.Border> = { style: "thin", color: { argb: `FF${color}` } };
  return { top: edge, left: edge, bottom: edge, right: edge };
}

function fill(hex: string): ExcelJS.Fill {
  return { type: "pattern", pattern: "solid", fgColor: { argb: `FF${hex}` } };
}

function font(opts: Partial<ExcelJS.Font> = {}): Partial<ExcelJS.Font> {
  return { name: "Calibri", size: 11, color: { argb: `FF${TEXT}` }, ...opts };
}

function styleRange(
  sheet: ExcelJS.Worksheet,
  range: string,
  patch: (cell: ExcelJS.Cell) => void,
) {
  const [start, end] = range.split(":");
  const startMatch = start.match(/^([A-Z]+)(\d+)$/);
  const endMatch = (end ?? start).match(/^([A-Z]+)(\d+)$/);
  if (!startMatch || !endMatch) return;
  const colStart = startMatch[1].charCodeAt(0);
  const colEnd = endMatch[1].charCodeAt(0);
  const rowStart = Number(startMatch[2]);
  const rowEnd = Number(endMatch[2]);
  for (let row = rowStart; row <= rowEnd; row += 1) {
    for (let col = colStart; col <= colEnd; col += 1) {
      patch(sheet.getCell(`${String.fromCharCode(col)}${row}`));
    }
  }
}

function downloadBuffer(buffer: ArrayBuffer, filename: string) {
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function addReportSheet(workbook: ExcelJS.Workbook, report: CalculateResponse) {
  const sheet = workbook.addWorksheet("Report", {
    views: [{ showGridLines: false }],
    pageSetup: { printArea: "A1:E29", fitToPage: true, fitToWidth: 1, fitToHeight: 1, orientation: "portrait" },
  });

  sheet.columns = [
    { width: 5.1 },
    { width: 5.1 },
    { width: 41.4 },
    { width: 39.1 },
    { width: 18.6 },
  ];

  for (let row = 1; row <= 29; row += 1) {
    sheet.getRow(row).height = row === 1 || row === 29 ? 33 : 36;
  }

  const title = buildReportTitle(report);
  const lines = buildReportSheetLines(report);
  const byRow = Object.fromEntries(lines.map((line) => [line.excelRow, line]));

  sheet.mergeCells("A1:E1");
  sheet.mergeCells("A2:B2");
  sheet.mergeCells("C2:D2");
  sheet.mergeCells("A3:A28");
  sheet.mergeCells("B3:B8");
  sheet.mergeCells("C3:C5");
  sheet.mergeCells("C6:C7");
  sheet.mergeCells("C8:D8");
  sheet.mergeCells("B9:B13");
  sheet.mergeCells("C9:C12");
  sheet.mergeCells("C13:D13");
  sheet.mergeCells("B14:B28");
  sheet.mergeCells("C14:C15");
  sheet.mergeCells("C16:C17");
  sheet.mergeCells("C18:C19");
  sheet.mergeCells("C20:C23");
  sheet.mergeCells("C25:D25");
  sheet.mergeCells("C26:D26");
  sheet.mergeCells("C27:D27");
  sheet.mergeCells("C28:D28");
  sheet.mergeCells("A29:D29");

  sheet.getCell("A1").value = title;
  sheet.getCell("A1").font = font({ size: 12, bold: true });
  sheet.getCell("A1").alignment = { horizontal: "center", vertical: "middle", wrapText: true };
  sheet.getCell("A1").fill = fill(WHITE);

  sheet.getCell("A2").value = "Category";
  sheet.getCell("C2").value = "Emission source category";
  sheet.getCell("E2").value = "t CO2e";
  styleRange(sheet, "A2:E2", (cell) => {
    cell.fill = fill(GREEN_HEADER);
    cell.font = font({ bold: true });
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.border = border();
  });
  sheet.getCell("E2").numFmt = ACCOUNTING;

  sheet.getCell("A3").value = "GHG Protocol Standards: Corporate Scope - 1 and 2, Value Chain - Scope 3";
  sheet.getCell("A3").fill = fill(DARK_LABEL);
  sheet.getCell("A3").font = font({ bold: true, color: { argb: `FF${WHITE}` } });
  sheet.getCell("A3").alignment = { horizontal: "center", vertical: "middle", wrapText: true, textRotation: 90 };
  styleRange(sheet, "A3:A28", (cell) => {
    cell.fill = fill(DARK_LABEL);
    cell.border = border();
  });

  const scopeLabels: Array<{ cell: string; label: string; range: string }> = [
    { cell: "B3", label: "Scope 1", range: "B3:B8" },
    { cell: "B9", label: "Scope 2", range: "B9:B13" },
    { cell: "B14", label: "Scope 3", range: "B14:B28" },
  ];
  for (const item of scopeLabels) {
    sheet.getCell(item.cell).value = item.label;
    sheet.getCell(item.cell).fill = fill(DARK_LABEL);
    sheet.getCell(item.cell).font = font({ bold: true, color: { argb: `FF${WHITE}` } });
    sheet.getCell(item.cell).alignment = { horizontal: "center", vertical: "middle", wrapText: true, textRotation: 90 };
    styleRange(sheet, item.range, (cell) => {
      cell.fill = fill(DARK_LABEL);
      cell.border = border();
    });
  }

  styleRange(sheet, "C3:E28", (cell) => {
    cell.fill = fill(GREEN_BODY);
    cell.font = font();
    cell.border = border();
    cell.alignment = { horizontal: "left", vertical: "middle", wrapText: true };
  });

  const groupCells: Array<{ cell: string; row: number; align: ExcelJS.Alignment["horizontal"] }> = [
    { cell: "C3", row: 3, align: "left" },
    { cell: "C6", row: 6, align: "left" },
    { cell: "C9", row: 9, align: "center" },
    { cell: "C14", row: 14, align: "left" },
    { cell: "C16", row: 16, align: "left" },
    { cell: "C18", row: 18, align: "left" },
    { cell: "C20", row: 20, align: "left" },
    { cell: "C24", row: 24, align: "left" },
    { cell: "C25", row: 25, align: "left" },
    { cell: "C26", row: 26, align: "left" },
    { cell: "C27", row: 27, align: "left" },
  ];
  for (const item of groupCells) {
    const line = byRow[item.row];
    sheet.getCell(item.cell).value = line.group;
    sheet.getCell(item.cell).alignment = { horizontal: item.align, vertical: "middle", wrapText: true };
  }

  for (const spec of lines.filter((line) => line.kind === "source")) {
    if (spec.source) {
      sheet.getCell(`D${spec.excelRow}`).value = spec.source;
    }
    sheet.getCell(`E${spec.excelRow}`).value = spec.tCO2e;
  }

  sheet.getCell("C8").value = "Total Scope 1";
  sheet.getCell("E8").value = { formula: "SUM(E3:E7)", result: report.scope1tCO2e };
  sheet.getCell("C13").value = "Total Scope 2";
  sheet.getCell("E13").value = { formula: "SUM(E9:E12)", result: report.scope2tCO2e };
  sheet.getCell("C28").value = "Total Scope 3";
  sheet.getCell("E28").value = { formula: "SUM(E14:E27)", result: report.scope3tCO2e };

  for (const row of [8, 13, 28]) {
    sheet.getCell(`C${row}`).font = font({ bold: true });
    sheet.getCell(`C${row}`).alignment = { horizontal: "center", vertical: "middle", wrapText: true };
  }

  styleRange(sheet, "A29:E29", (cell) => {
    cell.fill = fill(GREEN_HEADER);
    cell.font = font({ size: 12, bold: true });
    cell.border = border();
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
  });
  sheet.getCell("A29").value = "Total Emissions";
  sheet.getCell("E29").value = { formula: "SUM(E8,E13,E28)", result: report.totaltCO2e };

  for (let row = 3; row <= 29; row += 1) {
    const cell = sheet.getCell(`E${row}`);
    cell.numFmt = ACCOUNTING;
    cell.alignment = { horizontal: "right", vertical: "middle", wrapText: true };
    cell.font = font({
      size: row === 29 ? 12 : 11,
      bold: row === 8 || row === 13 || row === 28 || row === 29,
    });
  }
}

function addLineItemsSheet(workbook: ExcelJS.Workbook, report: CalculateResponse, showFactors: boolean) {
  const sheet = workbook.addWorksheet("Line items");
  sheet.columns = [
    { header: "Scope", width: 10 },
    { header: "Category", width: 36 },
    { header: "Description", width: 40 },
    { header: "Amount", width: 14 },
    { header: "Unit", width: 16 },
    ...(showFactors ? [{ header: "Factor", width: 14 }] : []),
    { header: "kg CO2e", width: 14 },
    { header: "t CO2e", width: 12 },
    { header: "Source", width: 28 },
    { header: "Year", width: 10 },
  ];

  sheet.getRow(1).font = font({ bold: true, color: { argb: `FF${WHITE}` } });
  sheet.getRow(1).fill = fill(DARK_LABEL);
  sheet.getRow(1).alignment = { vertical: "middle" };

  let rowNumber = 2;
  for (const category of report.categories) {
    if (category.skipped) continue;
    const detailRows =
      category.rows.length === 0
        ? [
            {
              description: "No activity",
              amount: "",
              unit: "",
              factor: "",
              kgCO2e: 0,
              tCO2e: category.tCO2e,
              source: "",
              vintage: "",
            },
          ]
        : category.rows.map((line) => ({
            description: line.description,
            amount: line.amount,
            unit: line.unit,
            factor: line.factor,
            kgCO2e: line.kgCO2e,
            tCO2e: category.tCO2e,
            source: line.source,
            vintage: line.vintage ?? "",
          }));
    for (const line of detailRows) {
      const row = sheet.getRow(rowNumber);
      row.getCell(1).value = category.scope;
      row.getCell(2).value = category.label;
      row.getCell(3).value = line.description;
      row.getCell(4).value = line.amount;
      row.getCell(5).value = line.unit;
      let col = 6;
      if (showFactors) {
        row.getCell(col).value = line.factor;
        col += 1;
      }
      row.getCell(col).value = line.kgCO2e;
      row.getCell(col + 1).value = line.tCO2e;
      row.getCell(col + 2).value = line.source;
      row.getCell(col + 3).value = line.vintage;
      rowNumber += 1;
    }
  }
}

function addDisclaimerSheet(workbook: ExcelJS.Workbook) {
  const sheet = workbook.addWorksheet("Disclaimer", { views: [{ showGridLines: false }] });
  sheet.getColumn(1).width = 116;

  sheet.mergeCells("A1:A1");
  sheet.getCell("A1").value = DISCLAIMER.title;
  sheet.getCell("A1").font = font({ size: 16, bold: true });
  sheet.getCell("A1").alignment = { horizontal: "center", vertical: "middle", wrapText: true };
  sheet.getCell("A1").fill = fill(GREEN_HEADER);
  sheet.getCell("A1").border = border();
  sheet.getRow(1).height = 30;

  sheet.getCell("A2").value = DISCLAIMER.header;
  sheet.getCell("A2").font = font({ size: 12, bold: true });
  sheet.getCell("A2").alignment = { horizontal: "left", vertical: "middle", wrapText: true };
  sheet.getRow(2).height = 52;

  sheet.getCell("A3").value = DISCLAIMER.body.join("\n\n");
  sheet.getCell("A3").font = font({ size: 12 });
  sheet.getCell("A3").alignment = { horizontal: "justify", vertical: "top", wrapText: true };
  sheet.getRow(3).height = 420;
}

function addInfoSheet(workbook: ExcelJS.Workbook) {
  const sheet = workbook.addWorksheet("Info and sources", { views: [{ showGridLines: false }] });
  sheet.columns = [
    { width: 11 },
    { width: 24 },
    { width: 30 },
    { width: 44 },
    { width: 92 },
  ];

  sheet.mergeCells("A1:E1");
  sheet.getCell("A1").value = "Instructions";
  sheet.getCell("A1").font = font({ size: 16, bold: true });
  sheet.getCell("A1").alignment = { horizontal: "center", vertical: "middle" };
  sheet.getCell("A1").fill = fill(GREEN_HEADER);
  sheet.getRow(1).height = 30;

  sheet.mergeCells("A2:E2");
  sheet.getCell("A2").value =
    "Fill the white cells in each sheet with your own data. Factors are provided in the DB sheet. Totals are summarised in the Report tab.";
  sheet.getCell("A2").font = font({ size: 11 });
  sheet.getCell("A2").alignment = { horizontal: "left", vertical: "top", wrapText: true };
  sheet.getRow(2).height = 40;

  sheet.mergeCells("A3:E3");
  sheet.getCell("A3").value = "General information, sources and assumptions";
  sheet.getCell("A3").font = font({ size: 16, bold: true });
  sheet.getCell("A3").alignment = { horizontal: "center", vertical: "middle" };
  sheet.getCell("A3").fill = fill(GREEN_HEADER);
  sheet.getRow(3).height = 30;

  const headers = ["Scope", "Tab", "Activity", "Source", "Assumptions"];
  headers.forEach((label, index) => {
    const cell = sheet.getCell(4, index + 1);
    cell.value = label;
    cell.font = font({ bold: true });
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.fill = fill(GREEN_BODY);
    cell.border = border();
  });
  sheet.getRow(4).height = 24;

  INFO_SOURCES.forEach((row, index) => {
    const excelRow = 5 + index;
    const values = [row.scope, row.tab, row.activity, row.source, row.assumptions];
    values.forEach((value, col) => {
      const cell = sheet.getCell(excelRow, col + 1);
      cell.value = value;
      cell.font = font({ size: 10 });
      cell.alignment = { horizontal: "left", vertical: "top", wrapText: true };
      cell.border = border();
    });
    sheet.getRow(excelRow).height = 42;
  });

  const defsStart = 5 + INFO_SOURCES.length + 1;
  sheet.mergeCells(defsStart, 1, defsStart, 5);
  sheet.getCell(defsStart, 1).value = "Definitions";
  sheet.getCell(defsStart, 1).font = font({ size: 16, bold: true });
  sheet.getCell(defsStart, 1).alignment = { horizontal: "center", vertical: "middle" };
  sheet.getCell(defsStart, 1).fill = fill(GREEN_HEADER);
  sheet.getRow(defsStart).height = 30;

  DEFINITIONS.forEach((def, index) => {
    const excelRow = defsStart + 1 + index;
    sheet.mergeCells(excelRow, 1, excelRow, 5);
    sheet.getCell(excelRow, 1).value = `${def.title}: ${def.body}`;
    sheet.getCell(excelRow, 1).font = font({ size: 10 });
    sheet.getCell(excelRow, 1).alignment = { horizontal: "left", vertical: "top", wrapText: true };
    sheet.getRow(excelRow).height = 60;
  });
}

export async function buildReportWorkbook(
  report: CalculateResponse,
  options?: ExportOptions,
): Promise<ExcelJS.Workbook> {
  const showFactors = options?.showFactors ?? false;
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "GHG Emissions Calculator";
  workbook.created = new Date();
  addDisclaimerSheet(workbook);
  addInfoSheet(workbook);
  addReportSheet(workbook, report);
  addLineItemsSheet(workbook, report, showFactors);
  return workbook;
}

export async function exportExcel(report: CalculateResponse, options?: ExportOptions) {
  const workbook = await buildReportWorkbook(report, options);
  const buffer = await workbook.xlsx.writeBuffer();
  downloadBuffer(buffer as ArrayBuffer, "ghg-emissions-report.xlsx");
}
