import { useMemo } from "react";
import { withMonthlyTotal } from "../../config/annualise";
import type { FuelRow } from "../../types";
import { useFactors } from "../../hooks/useFactors";
import { ExcelCatalogTable } from "./ExcelCatalogTable";

type Props = {
  category: string;
  rows: FuelRow[];
  source: string;
  vintage: number;
  factorLabel?: string;
  hint?: string;
  onChange: (rows: FuelRow[]) => void;
};

export function FuelEditor({
  category,
  rows,
  factorLabel = "Factor",
  hint = "Please enter the amount for each applicable fuels",
  onChange,
}: Props) {
  const { tree, factors, loading, error } = useFactors(category);

  const unitsByFuel = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const item of factors) {
      const key = `${item.level2}|${item.level3}`;
      const list = map.get(key) ?? [];
      if (item.unit && !list.includes(item.unit)) list.push(item.unit);
      map.set(key, list);
    }
    return map;
  }, [factors]);

  return (
    <ExcelCatalogTable
      lines={tree}
      columns={[
        { key: "type", label: "Type" },
        { key: "fuel", label: "Fuel" },
      ]}
      selects={[
        {
          key: "unit",
          label: "Unit",
          optionsFor: (line) => {
            const fromDb = unitsByFuel.get(`${line.type}|${line.fuel}`) ?? [];
            const current = String(line.unit ?? "");
            return fromDb.length ? fromDb : current ? [current] : [];
          },
        },
      ]}
      identityKeys={["type", "fuel"]}
      amounts={[{ key: "amount", label: "Amount" }]}
      monthlyInputs
      factorLabel={factorLabel}
      factorFor={(line) =>
        factors.find((item) => item.level2 === line.type && item.level3 === line.fuel && item.unit === line.unit)
          ?.factor ?? Number(line.factor ?? 0)
      }
      rows={rows}
      loading={loading}
      error={error}
      hint={hint}
      searchPlaceholder="Search fuels…"
      onChange={(next) =>
        onChange(
          next.map((row) => ({
            type: String(row.type ?? ""),
            fuel: String(row.fuel ?? ""),
            unit: String(row.unit ?? ""),
            ...withMonthlyTotal(row, "amount"),
          })),
        )
      }
    />
  );
}
