import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { CategoryResult } from "../../types";

const COLORS = ["#047857", "#0ea5e9", "#d97706"];

type Props = {
  scope1: number;
  scope2: number;
  scope3: number;
  categories: CategoryResult[];
};

export function EmissionsCharts({ scope1, scope2, scope3, categories }: Props) {
  const pieData = [
    { name: "On your site", value: scope1 },
    { name: "Energy you buy", value: scope2 },
    { name: "Everything else", value: scope3 },
  ].filter((item) => item.value > 0);

  const barData = categories
    .filter((item) => !item.skipped && item.tCO2e > 0)
    .map((item) => ({ name: item.label, value: Number(item.tCO2e.toFixed(3)) }));

  if (!pieData.length) {
    return <p className="text-sm text-slate-600">No emissions to chart yet.</p>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="card">
        <h3 className="mb-3 font-semibold text-slate-900">By group</h3>
        <div className="h-72">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} label>
                {pieData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value.toFixed(3)} t CO2e`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="card">
        <h3 className="mb-3 font-semibold text-slate-900">By what you entered</h3>
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={barData} margin={{ left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" hide />
              <YAxis />
              <Tooltip formatter={(value: number) => `${value} t CO2e`} />
              <Bar dataKey="value" fill="#047857" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
