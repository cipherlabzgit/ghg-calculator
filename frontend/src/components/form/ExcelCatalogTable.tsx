import { useMemo, useState } from "react";
import {
  MONTHLY_AMOUNT_HINT,
  MONTH_AMOUNT_COLUMNS,
  MONTH_KEYS,
  activityAmount,
  hasMonthlyValues,
  isMonthKey,
  sumMonthlyValues,
} from "../../config/annualise";
import { isFactorColumn } from "../../config/features";
import { useShowFactors } from "../../hooks/useShowFactors";

export type ExcelColumn = {
  key: string;
  label: string;
  hideRepeat?: boolean;
};

export type ExcelAmount = {
  key: string;
  label: string;
};

export type ExcelSelect = {
  key: string;
  label: string;
  optionsFor: (line: ExcelLine) => string[];
};

export type ExcelLine = Record<string, string | number | boolean | null | undefined>;

export type ExcelKgColumn = {
  label: string;
  compute: (line: ExcelLine, saved: ExcelLine | undefined) => number;
};

type Props = {
  lines: ExcelLine[];
  columns: ExcelColumn[];
  amounts: ExcelAmount[];
  rows: ExcelLine[];
  loading?: boolean;
  error?: string | null;
  hint?: string;
  searchPlaceholder?: string;
  factorLabel?: string;
  showFactor?: boolean;
  extraBeforeFactor?: ExcelColumn[];
  extraAfterFactor?: ExcelColumn[];
  kgLabel?: string;
  showKg?: boolean;
  extraKg?: ExcelKgColumn[];
  identityKeys?: string[];
  selects?: ExcelSelect[];
  factorFor?: (line: ExcelLine, saved: ExcelLine | undefined) => number | null | undefined;
  computeKg?: (line: ExcelLine, saved: ExcelLine | undefined) => number;
  monthlyInputs?: boolean;
  onChange: (rows: ExcelLine[]) => void;
};

function identity(line: ExcelLine, keys: string[]) {
  return keys.map((key) => String(line[key] ?? "")).join("|");
}

function asNumber(value: string | number | boolean | null | undefined) {
  if (value === "" || value == null || typeof value === "boolean") return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function formatExcelNumber(value: string | number | boolean | null | undefined) {
  if (value == null || value === "") return "0";
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value);
  if (Number.isInteger(n)) return String(n);
  return String(parseFloat(n.toFixed(5)));
}

function defaultKg(line: ExcelLine, saved: ExcelLine | undefined, amounts: ExcelAmount[]) {
  const factor = asNumber(line.factor);
  if (!saved) return 0;
  const tonnes = asNumber(saved.tonnes);
  const km = asNumber(saved.km);
  if (amounts.some((item) => item.key === "tonnes") && amounts.some((item) => item.key === "km")) {
    return tonnes * km * factor;
  }
  const rooms = asNumber(saved.rooms);
  const nights = asNumber(saved.nights);
  if (amounts.some((item) => item.key === "rooms") && amounts.some((item) => item.key === "nights")) {
    return rooms * nights * factor;
  }
  const first = amounts[0];
  if (!first) return 0;
  return activityAmount(saved, first.key) * factor;
}

export function ExcelCatalogTable({
  lines,
  columns,
  amounts,
  rows,
  loading,
  error,
  hint = "Please enter the amount for each applicable row. Leave the rest blank.",
  searchPlaceholder = "Search this table…",
  factorLabel = "Factor",
  showFactor = true,
  extraBeforeFactor = [],
  extraAfterFactor = [],
  kgLabel = "kg CO2e",
  showKg = true,
  extraKg = [],
  identityKeys,
  selects = [],
  factorFor,
  computeKg,
  monthlyInputs = false,
  onChange,
}: Props) {
  const [query, setQuery] = useState("");
  const [overrides, setOverrides] = useState<Record<string, ExcelLine>>({});
  const keys = identityKeys ?? columns.map((column) => column.key);
  const { showFactors } = useShowFactors();
  const factorVisible = showFactor && showFactors;
  const showMonthColumns = monthlyInputs && !showFactors;
  const annualKey = amounts[0]?.key ?? "amount";
  const amountColumns = showMonthColumns ? MONTH_AMOUNT_COLUMNS : amounts;
  const displayHint = showMonthColumns ? `${hint} ${MONTHLY_AMOUNT_HINT}` : hint;
  const beforeFactor = showFactors
    ? extraBeforeFactor
    : extraBeforeFactor.filter((column) => !isFactorColumn(column));
  const afterFactor = showFactors
    ? extraAfterFactor
    : extraAfterFactor.filter((column) => !isFactorColumn(column));

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return lines;
    return lines.filter((line) =>
      [...columns, ...beforeFactor, ...afterFactor]
        .map((column) => String(line[column.key] ?? ""))
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [lines, query, columns, beforeFactor, afterFactor]);

  function currentRow(line: ExcelLine) {
    const id = identity(line, keys);
    return rows.find((row) => identity(row, keys) === id);
  }

  function merged(line: ExcelLine) {
    const id = identity(line, keys);
    return { ...line, ...overrides[id], ...currentRow(line) };
  }

  function patch(line: ExcelLine, key: string, value: string) {
    const id = identity(line, keys);
    const nextRow: ExcelLine = { ...merged(line), [key]: value };
    if (monthlyInputs && isMonthKey(key)) {
      nextRow[annualKey] = String(sumMonthlyValues(nextRow));
    }
    if (monthlyInputs && key === annualKey) {
      for (const month of MONTH_KEYS) nextRow[month] = "";
    }
    setOverrides((current) => ({ ...current, [id]: { ...current[id], ...nextRow } }));
    const next = rows.filter((row) => identity(row, keys) !== id);
    const filled =
      amounts.some((amount) => String(nextRow[amount.key] ?? "").trim() !== "") || hasMonthlyValues(nextRow);
    if (filled) next.push(nextRow);
    onChange(next);
  }

  if (loading) {
    return <div className="h-40 animate-pulse bg-[#e2efda]" aria-busy="true" />;
  }

  if (error) {
    return (
      <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
        Could not load the Excel table. Check that the calculator server is running. {error}
      </p>
    );
  }

  if (!lines.length) {
    return (
      <p className="border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        No Excel rows were found for this sheet.
      </p>
    );
  }

  return (
    <div className="excel-wrap">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-3xl text-sm text-slate-700">{displayHint}</p>
        {lines.length > 20 ? (
          <input
            className="excel-input max-w-xs"
            placeholder={searchPlaceholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        ) : null}
      </div>
      <div className="max-h-[44rem] overflow-auto border border-[#8fbc8f] bg-white">
        <table className="excel-table">
          <thead className="sticky top-0 z-10">
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
              {selects.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
              {beforeFactor.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
              {factorVisible ? <th>{factorLabel}</th> : null}
              {afterFactor.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
              {amountColumns.map((amount) => (
                <th key={amount.key}>{amount.label}</th>
              ))}
              {showMonthColumns ? <th>Year total</th> : null}
              {showKg ? <th>{kgLabel}</th> : null}
              {extraKg.map((column) => (
                <th key={column.label}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((line, index) => {
              const saved = merged(line);
              const filled =
                amounts.some((amount) => String(saved[amount.key] ?? "").trim() !== "") ||
                hasMonthlyValues(saved);
              const factorValue = factorFor?.(saved, saved) ?? saved.factor ?? line.factor;
              const lineWithFactor = { ...saved, factor: factorValue };
              const kg = (computeKg ?? ((item, current) => defaultKg(item, current, amounts)))(
                lineWithFactor,
                saved,
              );
              return (
                <tr key={`${identity(line, keys)}-${index}`} className={filled ? "excel-filled" : undefined}>
                  {columns.map((column) => (
                    <td key={column.key}>{String(line[column.key] ?? "")}</td>
                  ))}
                  {selects.map((column) => (
                    <td key={column.key}>
                      <select
                        className="excel-select"
                        value={String(saved[column.key] ?? line[column.key] ?? "")}
                        onChange={(event) => patch(line, column.key, event.target.value)}
                      >
                        {column.optionsFor(line).map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                  ))}
                  {beforeFactor.map((column) => (
                    <td key={column.key}>{formatExcelNumber(saved[column.key] ?? line[column.key])}</td>
                  ))}
                  {factorVisible ? <td>{formatExcelNumber(factorValue)}</td> : null}
                  {afterFactor.map((column) => (
                    <td key={column.key}>{formatExcelNumber(saved[column.key] ?? line[column.key])}</td>
                  ))}
                  {amountColumns.map((amount) => (
                    <td key={amount.key}>
                      <input
                        type="number"
                        min={0}
                        step="any"
                        inputMode="decimal"
                        value={String(saved[amount.key] ?? "")}
                        onChange={(event) => patch(line, amount.key, event.target.value)}
                        className={showMonthColumns ? "excel-input excel-input-month" : "excel-input"}
                      />
                    </td>
                  ))}
                  {showMonthColumns ? (
                    <td>{filled ? formatExcelNumber(activityAmount(saved, annualKey)) : "0"}</td>
                  ) : null}
                  {showKg ? <td>{filled ? kg.toFixed(2) : "0.00"}</td> : null}
                  {extraKg.map((column) => (
                    <td key={column.label}>{filled ? column.compute(lineWithFactor, saved).toFixed(2) : "0.00"}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
