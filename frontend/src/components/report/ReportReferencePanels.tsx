import { DEFINITIONS, DISCLAIMER, INFO_SOURCES } from "../../utils/reportReference";

type SectionProps = {
  id: string;
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

function Section({ id, title, defaultOpen = false, children }: SectionProps) {
  return (
    <details id={id} open={defaultOpen} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <summary className="cursor-pointer list-none px-5 py-4 text-left text-base font-semibold text-slate-900 marker:hidden">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className="text-brand-700">
            ▸
          </span>
          {title}
        </span>
      </summary>
      <div className="border-t border-slate-100 px-5 py-4 text-sm leading-relaxed text-slate-700">{children}</div>
    </details>
  );
}

export function DisclaimerPanel() {
  return (
    <Section id="report-disclaimer" title="Disclaimer">
      <p className="mb-3 whitespace-pre-line font-semibold text-slate-800">{DISCLAIMER.header}</p>
      <div className="space-y-3">
        {DISCLAIMER.body.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </Section>
  );
}

export function InfoAndSourcesPanel() {
  return (
    <Section id="report-info-sources" title="Info and sources">
      <p className="mb-4 text-slate-600">
        Where each number comes from: the emission factors and assumptions used in the calculator, by sheet.
      </p>
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-emerald-50 text-slate-700">
            <tr>
              <th className="px-3 py-2 font-semibold">Scope</th>
              <th className="px-3 py-2 font-semibold">Tab</th>
              <th className="px-3 py-2 font-semibold">Activity</th>
              <th className="px-3 py-2 font-semibold">Source</th>
              <th className="px-3 py-2 font-semibold">Assumptions</th>
            </tr>
          </thead>
          <tbody>
            {INFO_SOURCES.map((row, index) => (
              <tr key={`${row.tab}-${index}`} className="border-t border-slate-100 align-top">
                <td className="px-3 py-2 whitespace-nowrap">{row.scope}</td>
                <td className="px-3 py-2">{row.tab}</td>
                <td className="px-3 py-2">{row.activity}</td>
                <td className="px-3 py-2">{row.source}</td>
                <td className="px-3 py-2 whitespace-pre-line text-slate-600">{row.assumptions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h4 className="mt-6 text-sm font-semibold text-slate-800">Definitions</h4>
      <div className="mt-2 grid gap-3 md:grid-cols-3">
        {DEFINITIONS.map((def) => (
          <div key={def.title} className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-sm font-semibold text-slate-800">{def.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">{def.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
