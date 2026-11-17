import { Link } from "react-router-dom";
import { OperatorControl } from "./OperatorControl";

type Props = {
  compact?: boolean;
};

const SOURCES = [
  "DEFRA 2021 conversion factors",
  "IFI grid emission factors",
  "Cornell hotel benchmarking",
  "ICAO flight calculator",
];

export function Footer({ compact = false }: Props) {
  if (compact) {
    return (
      <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-emerald-100 bg-white px-4 py-2 text-[11px] leading-snug text-slate-500">
        <p>For awareness only — not a certificate. Factors follow UNFCCC calculator v02.6.</p>
        <OperatorControl />
      </footer>
    );
  }

  return (
    <footer className="flex flex-1 flex-col bg-[#013226] text-emerald-50">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-10 sm:grid-cols-2 lg:grid-cols-3">
        <p className="max-w-sm text-sm leading-relaxed text-emerald-100/85">
          A simple estimate of greenhouse gas emissions, using the same factors as the UNFCCC
          calculator v02.6.
        </p>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-200">
            Data sources
          </h2>
          <ul className="mt-3 space-y-1.5 text-sm text-emerald-100/85">
            {SOURCES.map((source) => (
              <li key={source}>{source}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-200">About</h2>
          <p className="mt-3 text-sm leading-relaxed text-emerald-100/85">
            For awareness and climate action only — not a formal certificate or certified inventory.
          </p>
          <Link
            to="/organisation"
            className="mt-4 inline-flex text-sm font-semibold text-white underline-offset-4 hover:underline"
          >
            Start a calculation
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-4 text-xs text-emerald-200/70">
          <p>Factors follow UNFCCC GHG Emissions Calculator v02.6 (September 2022).</p>
          <OperatorControl tone="dark" />
        </div>
      </div>
    </footer>
  );
}
