import { formatTonnes } from "../../utils/format";

type Props = {
  scope1: number;
  scope2: number;
  scope3: number;
  total: number;
};

export function ScopeCards({ scope1, scope2, scope3, total }: Props) {
  const cards = [
    { label: "On your site", hint: "Fuel, cars, air-con", value: scope1 },
    { label: "Energy you buy", hint: "Electricity and heat", value: scope2 },
    { label: "Everything else", hint: "Travel, waste, food", value: scope3 },
    { label: "Your total", hint: "All of the above", value: total, emphasis: true },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`rounded-2xl border p-4 shadow-sm ${
            card.emphasis ? "border-brand-600 bg-brand-700 text-white" : "border-slate-200/80 bg-white"
          }`}
        >
          <p className={`text-sm font-semibold ${card.emphasis ? "text-white" : "text-slate-800"}`}>{card.label}</p>
          <p className={`text-xs ${card.emphasis ? "text-emerald-100" : "text-slate-500"}`}>{card.hint}</p>
          <p className={`mt-3 text-2xl font-semibold ${card.emphasis ? "text-white" : "text-slate-900"}`}>
            {formatTonnes(card.value)} <span className="text-sm font-normal opacity-80">tonnes</span>
          </p>
        </div>
      ))}
    </div>
  );
}
