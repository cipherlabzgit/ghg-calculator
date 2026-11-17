export type OptionRow = Record<string, string>;

export function uniqueField(rows: OptionRow[], field: string, filters: OptionRow = {}): string[] {
  const values = new Set<string>();
  for (const row of rows) {
    const matches = Object.entries(filters).every(([key, value]) => (row[key] ?? "") === value);
    if (matches) values.add(row[field] ?? "");
  }
  return [...values];
}

export function findMatchingRow(rows: OptionRow[], filters: OptionRow): OptionRow | undefined {
  return rows.find((row) => Object.entries(filters).every(([key, value]) => (row[key] ?? "") === value));
}
