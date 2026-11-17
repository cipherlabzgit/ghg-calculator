export const MONTH_KEYS = [
  "m1",
  "m2",
  "m3",
  "m4",
  "m5",
  "m6",
  "m7",
  "m8",
  "m9",
  "m10",
  "m11",
  "m12",
] as const;

export type MonthKey = (typeof MONTH_KEYS)[number];
export type MonthlyAmounts = Partial<Record<MonthKey, string>>;

export const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const MONTH_AMOUNT_COLUMNS = MONTH_KEYS.map((key, index) => ({
  key,
  label: MONTH_LABELS[index],
}));

export const MONTHLY_AMOUNT_HINT =
  "Enter the amount for each month. Blank months count as zero. The year total is the sum of all 12 months.";

export function isMonthKey(key: string): key is MonthKey {
  return (MONTH_KEYS as readonly string[]).includes(key);
}

export function asAmountNumber(value: unknown): number {
  if (value === "" || value == null || typeof value === "boolean") return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function hasMonthlyValues(row: Record<string, unknown> | undefined): boolean {
  if (!row) return false;
  return MONTH_KEYS.some((key) => String(row[key] ?? "").trim() !== "");
}

export function sumMonthlyValues(row: Record<string, unknown> | undefined): number {
  if (!row) return 0;
  return MONTH_KEYS.reduce((total, key) => total + asAmountNumber(row[key]), 0);
}

export function activityAmount(row: Record<string, unknown> | undefined, annualKey: string): number {
  if (!row) return 0;
  return hasMonthlyValues(row) ? sumMonthlyValues(row) : asAmountNumber(row[annualKey]);
}

export function pickMonthly(row: Record<string, unknown> | undefined): MonthlyAmounts {
  const monthly: MonthlyAmounts = {};
  if (!row) return monthly;
  for (const key of MONTH_KEYS) {
    const value = row[key];
    if (value != null && String(value).trim() !== "") monthly[key] = String(value);
  }
  return monthly;
}

export function withMonthlyTotal<K extends string>(
  row: Record<string, unknown> | undefined,
  annualKey: K,
): MonthlyAmounts & Record<K, string> {
  const monthly = pickMonthly(row);
  const total = hasMonthlyValues(row) ? String(sumMonthlyValues(row)) : String(row?.[annualKey] ?? "");
  return { ...monthly, [annualKey]: total } as MonthlyAmounts & Record<K, string>;
}
