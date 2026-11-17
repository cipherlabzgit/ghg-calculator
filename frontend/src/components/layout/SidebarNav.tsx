import { Link } from "react-router-dom";
import { CALC_SHEETS, getSheetByPath, type CalcSheet } from "../../config/sheets";

type Props = {
  currentPath: string;
};

type StepId = "organisation" | "scope1" | "scope2" | "scope3" | "report";

const STEPS: Array<{
  id: StepId;
  number: number;
  label: string;
  blurb: string;
  match: (sheet: CalcSheet) => boolean;
}> = [
  { id: "organisation", number: 1, label: "Your details", blurb: "Who are you?", match: (sheet) => sheet.id === "organisation" },
  { id: "scope1", number: 2, label: "On your site", blurb: "Fuel, cars, air-con", match: (sheet) => sheet.scope === 1 },
  { id: "scope2", number: 3, label: "Energy bills", blurb: "Electricity you buy", match: (sheet) => sheet.scope === 2 },
  { id: "scope3", number: 4, label: "Everything else", blurb: "Travel, waste, food", match: (sheet) => sheet.scope === 3 },
  { id: "report", number: 5, label: "Results", blurb: "See your total", match: (sheet) => sheet.id === "report" },
];

function stepIdFor(sheet: CalcSheet | undefined): StepId {
  if (!sheet) return "organisation";
  return STEPS.find((step) => step.match(sheet))?.id ?? "organisation";
}

export function SidebarNav({ currentPath }: Props) {
  const current = getSheetByPath(currentPath);
  const activeStep = stepIdFor(current);
  const activeIndex = STEPS.findIndex((step) => step.id === activeStep);

  return (
    <nav aria-label="Calculator steps" className="h-full">
      <p className="px-1 pb-4 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100">
        Follow these 5 steps
      </p>
      <ol className="space-y-2">
        {STEPS.map((step, index) => {
          const first = CALC_SHEETS.find(step.match);
          const children = CALC_SHEETS.filter(step.match);
          const active = step.id === activeStep;
          const done = index < activeIndex;
          const showChildren = active && children.length > 1;

          return (
            <li key={step.id}>
              <Link
                to={first?.path ?? "/organisation"}
                aria-current={active && !showChildren ? "step" : undefined}
                className={`flex items-start gap-3 rounded-xl px-3 py-2.5 ${
                  active ? "bg-white/20" : "hover:bg-white/10"
                }`}
              >
                <span
                  className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                    active
                      ? "bg-white text-emerald-800"
                      : done
                        ? "bg-emerald-300 text-emerald-950"
                        : "bg-emerald-800 text-white"
                  }`}
                >
                  {done ? "✓" : step.number}
                </span>
                <span>
                  <span className="block font-semibold text-white">{step.label}</span>
                  <span className="block text-xs text-emerald-100">{step.blurb}</span>
                </span>
              </Link>

              {showChildren ? (
                <ul className="mt-1 ml-6 space-y-0.5 border-l border-emerald-300/40 pl-3">
                  {children.map((sheet) => {
                    const selected = sheet.path === currentPath;
                    return (
                      <li key={sheet.id}>
                        <Link
                          to={sheet.path}
                          aria-current={selected ? "page" : undefined}
                          className={`block rounded-lg px-2.5 py-1.5 text-sm ${
                            selected ? "app-sidebar-link-active" : "app-sidebar-link hover:bg-white/10"
                          }`}
                        >
                          {sheet.tabLabel}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
