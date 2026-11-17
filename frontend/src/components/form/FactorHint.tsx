type Props = {
  source?: string;
  vintage?: number | null;
  unit?: string;
};

export function FactorHint({ source, vintage, unit }: Props) {
  if (!source && !unit) return null;
  return (
    <p className="rounded-lg bg-white px-2.5 py-1.5 text-xs text-slate-500">
      {unit ? <span className="mr-2">Unit: {unit}</span> : null}
      {source ? (
        <span>
          Source: {source}
          {vintage ? ` ${vintage}` : ""}
        </span>
      ) : null}
    </p>
  );
}
