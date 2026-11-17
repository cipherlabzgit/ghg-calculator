type Props = {
  text: string;
};

export function Tooltip({ text }: Props) {
  return (
    <span className="group relative ml-1 inline-flex align-middle">
      <button
        type="button"
        className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600"
        aria-label={text}
      >
        i
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-6 top-0 z-20 hidden w-64 rounded-md bg-slate-900 px-3 py-2 text-left text-xs leading-relaxed text-white shadow-lg group-hover:block group-focus-within:block"
      >
        {text}
      </span>
    </span>
  );
}
