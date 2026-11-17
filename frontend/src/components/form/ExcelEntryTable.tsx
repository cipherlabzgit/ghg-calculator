import { useShowFactors } from "../../hooks/useShowFactors";
import type { ExcelLine } from "./ExcelCatalogTable";
import { formatExcelNumber } from "./ExcelCatalogTable";

export type EntryColumn = {
  key: string;
  label: string;
  kind?: "text" | "number" | "select" | "readonly";
  options?: string[];
};

type Props = {
  columns: EntryColumn[];
  rows: ExcelLine[];
  blankRow: ExcelLine;
  minRows?: number;
  hint?: string;
  kgFor?: (row: ExcelLine) => number;
  factorFor?: (row: ExcelLine) => number | null | undefined;
  factorLabel?: string;
  onChange: (rows: ExcelLine[]) => void;
};

function isFilled(row: ExcelLine, columns: EntryColumn[]) {
  return columns.some((column) => column.kind !== "readonly" && String(row[column.key] ?? "").trim() !== "");
}

export function ExcelEntryTable({
  columns,
  rows,
  blankRow,
  minRows = 8,
  hint,
  kgFor,
  factorFor,
  factorLabel = "Factors",
  onChange,
}: Props) {
  const display = [...rows];
  while (display.length < minRows) display.push({ ...blankRow });
  const { showFactors } = useShowFactors();
  const factorVisible = Boolean(factorFor) && showFactors;

  function patch(index: number, key: string, value: string) {
    const next = display.map((row, rowIndex) => (rowIndex === index ? { ...row, [key]: value } : row));
    onChange(next.filter((row) => isFilled(row, columns)));
  }

  return (
    <div className="excel-wrap">
      {hint ? <p className="mb-3 text-sm text-slate-700">{hint}</p> : null}
      <div className="overflow-auto border border-[#8fbc8f] bg-white">
        <table className="excel-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
              {factorVisible ? <th>{factorLabel}</th> : null}
              {kgFor ? <th>kg CO2e</th> : null}
            </tr>
          </thead>
          <tbody>
            {display.map((row, index) => {
              const filled = isFilled(row, columns);
              const kg = kgFor?.(row) ?? 0;
              return (
                <tr key={`entry-${index}`} className={filled ? "excel-filled" : undefined}>
                  {columns.map((column) => {
                    const value = String(row[column.key] ?? "");
                    if (column.kind === "readonly") {
                      return <td key={column.key}>{value}</td>;
                    }
                    if (column.kind === "select") {
                      return (
                        <td key={column.key}>
                          <select
                            className="excel-select"
                            value={value}
                            onChange={(event) => patch(index, column.key, event.target.value)}
                          >
                            <option value=""> </option>
                            {(column.options ?? []).map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </td>
                      );
                    }
                    return (
                      <td key={column.key}>
                        <input
                          className="excel-input"
                          type={column.kind === "number" ? "number" : "text"}
                          min={column.kind === "number" ? 0 : undefined}
                          step={column.kind === "number" ? "any" : undefined}
                          value={value}
                          onChange={(event) => patch(index, column.key, event.target.value)}
                        />
                      </td>
                    );
                  })}
                  {factorVisible ? <td>{formatExcelNumber(factorFor?.(row))}</td> : null}
                  {kgFor ? <td>{filled ? kg.toFixed(2) : "0.00"}</td> : null}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        className="mt-3 text-sm font-medium text-brand-800 underline"
        onClick={() => onChange([...rows, { ...blankRow }])}
      >
        Add another row
      </button>
    </div>
  );
}
