import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Footer } from "./Footer";
import { SheetTabs } from "./SheetTabs";
import { SidebarNav } from "./SidebarNav";
import { getSheetByPath } from "../../config/sheets";
import { useWizardDraft } from "../../hooks/useWizardDraft";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { Logo } from "../ui/Logo";

type Props = {
  currentPath: string;
  title: string;
  intro?: string;
  children: ReactNode;
};

const STEP_META: Record<string, { label: string; index: number }> = {
  organisation: { label: "Your details", index: 1 },
  1: { label: "On your site", index: 2 },
  2: { label: "Energy bills", index: 3 },
  3: { label: "Everything else", index: 4 },
  report: { label: "Results", index: 5 },
};

export function WizardLayout({ currentPath, title, intro, children }: Props) {
  const navigate = useNavigate();
  const { reset } = useWizardDraft();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const sheet = getSheetByPath(currentPath);

  useEffect(() => {
    setMobileOpen(false);
  }, [currentPath]);

  function confirmStartOver() {
    reset();
    setConfirmOpen(false);
    navigate("/organisation", { state: { startedOver: true } });
  }

  const stepKey =
    sheet?.id === "report"
      ? "report"
      : sheet?.id === "organisation"
        ? "organisation"
        : String(sheet?.scope ?? "organisation");
  const step = STEP_META[stepKey] ?? STEP_META.organisation;

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-emerald-50/40">
      <aside className="app-sidebar hidden w-80 shrink-0 lg:flex lg:flex-col">
        <div className="flex h-full min-h-0 flex-col px-6 py-7">
          <Link to="/" className="mb-8">
            <Logo light />
          </Link>
          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            <SidebarNav currentPath={currentPath} />
          </div>
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="shrink-0 border-b border-emerald-100/80 bg-white/90 backdrop-blur">
          <div className="flex items-center justify-between gap-3 px-4 py-3 lg:px-10">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <button type="button" className="btn-secondary shrink-0 px-3 py-2 lg:hidden" onClick={() => setMobileOpen((open) => !open)}>
                {mobileOpen ? "Hide menu" : "Menu"}
              </button>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-700">
                  Step {step.index} of 5
                  <span className="hidden sm:inline"> · {step.label}</span>
                </p>
                <div className="mt-1.5 flex gap-1.5" aria-hidden>
                  {[1, 2, 3, 4, 5].map((dot) => (
                    <span
                      key={dot}
                      className={`h-1.5 w-7 rounded-full ${dot <= step.index ? "bg-brand-600" : "bg-slate-200"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <button type="button" onClick={() => setConfirmOpen(true)} className="btn-secondary shrink-0 px-3 py-2">
              <span className="sm:hidden">Reset</span>
              <span className="hidden sm:inline">Start over</span>
            </button>
          </div>
          {mobileOpen ? (
            <div className="app-sidebar px-4 py-5 lg:hidden">
              <SidebarNav currentPath={currentPath} />
            </div>
          ) : null}
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-4 py-8 lg:px-10">
          <div className={`mx-auto pb-2 ${currentPath === "/report" ? "max-w-none" : "max-w-[88rem]"}`}>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
            {intro ? <p className="mt-2 whitespace-pre-line text-base leading-relaxed text-slate-600">{intro}</p> : null}
            {sheet?.help ? (
              <div className="mt-6 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-brand-800">What should I do here?</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-700">{sheet.help}</p>
                {sheet.skipId || sheet.id === "flight-accommodation" ? (
                  <p className="mt-2 text-sm text-slate-500">
                    You can come back and change this later. Nothing is sent until you open Results.
                  </p>
                ) : null}
              </div>
            ) : null}
            <div className="mt-6">{children}</div>
          </div>
        </main>
        <SheetTabs currentPath={currentPath} />
        <Footer compact />
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Start a new calculation?"
        description="This clears everything you typed on this device. You cannot undo this."
        cancelLabel="Keep my answers"
        confirmLabel="Yes, start again"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmStartOver}
      />
    </div>
  );
}
