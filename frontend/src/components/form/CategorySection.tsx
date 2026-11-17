import type { ReactNode } from "react";
import { Tooltip } from "../ui/Tooltip";

type Props = {
  id: string;
  title: string;
  tooltip: string;
  skipped: boolean;
  onToggleSkip: () => void;
  children: ReactNode;
  hideTitle?: boolean;
  plain?: boolean;
};

export function CategorySection({ id, title, tooltip, skipped, onToggleSkip, children, hideTitle, plain }: Props) {
  return (
    <section className={`${plain ? "mb-8" : "card mb-6"}`} aria-labelledby={id}>
      <div className={`mb-4 flex flex-wrap items-start justify-between gap-3 ${hideTitle ? "justify-end" : ""}`}>
        {hideTitle ? (
          <p id={id} className="sr-only">
            {title}
          </p>
        ) : (
          <h2 id={id} className="text-lg font-semibold text-slate-900">
            {title}
            <Tooltip text={tooltip} />
          </h2>
        )}
        <label
          className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition ${
            skipped
              ? "bg-emerald-100 text-brand-900 ring-1 ring-emerald-200"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <input type="checkbox" checked={skipped} onChange={onToggleSkip} className="accent-brand-700" />
          We don’t have this
        </label>
      </div>
      {skipped ? (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-brand-900">
          Skipped. This will be counted as zero. That is fine — press Continue.
        </p>
      ) : (
        children
      )}
    </section>
  );
}
