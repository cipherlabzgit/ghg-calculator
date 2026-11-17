type Props = {
  light?: boolean;
  compact?: boolean;
};

export function Logo({ light = false, compact = false }: Props) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${
          light ? "bg-white text-emerald-800" : "bg-emerald-700 text-white"
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
          <path d="M12 2c4.8 3.2 7 6.8 7 11.2C19 17.8 16 21 12 21S5 17.8 5 13.2C5 8.8 7.2 5.2 12 2Zm0 5.2c-2.4 2-3.5 4.1-3.5 6.3 0 2.4 1.6 4.2 3.5 4.2s3.5-1.8 3.5-4.2c0-2.2-1.1-4.3-3.5-6.3Z" />
        </svg>
      </span>
      {compact ? (
        <span className={`text-base font-semibold ${light ? "text-white" : "text-brand-950"}`}>
          Emissions
        </span>
      ) : (
        <span className={light ? "text-white" : "text-brand-950"}>
          <span className="block text-[15px] font-semibold leading-tight">Emissions calculator</span>
          <span className={`block text-xs ${light ? "text-emerald-100" : "text-slate-500"}`}>
            Simple carbon estimate
          </span>
        </span>
      )}
    </span>
  );
}
