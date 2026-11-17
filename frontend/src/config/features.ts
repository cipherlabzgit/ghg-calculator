/** localStorage flag set after the reseller unlocks with VITE_OPERATOR_PIN. */
export const FACTORS_UNLOCK_STORAGE_KEY = "ghg-operator-factors";

export function getOperatorPin(override?: string) {
  const pin = (override ?? import.meta.env.VITE_OPERATOR_PIN ?? "").trim();
  return pin;
}

export function isFactorColumn(column: { key: string; label: string }) {
  return /factor/i.test(column.label) || /factor/i.test(column.key);
}
