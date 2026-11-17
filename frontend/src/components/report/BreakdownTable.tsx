import type { CategoryResult } from "../../types";
import { formatKg, formatTonnes } from "../../utils/format";

type Props = {
  categories: CategoryResult[];
};

export function BreakdownTable({ categories }: Props) {
  const visible = categories.filter((item) => !item.skipped);
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-emerald-50 text-slate-700">
          <tr>
            <th className="px-3 py-2 font-medium">Group</th>
            <th className="px-3 py-2 font-medium">What you entered</th>
            <th className="px-3 py-2 font-medium">Tonnes</th>
            <th className="px-3 py-2 font-medium">More detail</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((item) => (
            <tr key={item.id} className="border-t border-slate-200 align-top">
              <td className="px-3 py-2">{item.scope}</td>
              <td className="px-3 py-2">{item.label}</td>
              <td className="px-3 py-2 font-medium">{formatTonnes(item.tCO2e)}</td>
              <td className="px-3 py-2 text-slate-600">
                {item.rows.length === 0 ? (
                  <span>No activity</span>
                ) : (
                  <ul className="space-y-1">
                    {item.rows.map((row, index) => (
                      <li key={`${item.id}-${index}`}>
                        {row.description}: {formatKg(row.kgCO2e)} kg ({row.source}
                        {row.vintage ? ` ${row.vintage}` : ""})
                      </li>
                    ))}
                  </ul>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
