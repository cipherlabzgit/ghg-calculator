import { useEffect } from "react";
import { Link } from "react-router-dom";
import { WizardLayout } from "../components/layout/WizardLayout";
import { ExcelReportTable } from "../components/report/ExcelReportTable";
import { DisclaimerPanel, InfoAndSourcesPanel } from "../components/report/ReportReferencePanels";
import { useShowFactors } from "../hooks/useShowFactors";
import { useWizardDraft } from "../hooks/useWizardDraft";
import { useCalculate } from "../hooks/useCalculate";
import type { CalculateResponse } from "../types";
import { exportCsv } from "../utils/exportCsv";
import { exportExcel } from "../utils/exportExcel";
import { exportPdf } from "../utils/exportPdf";

const EMPTY_REPORT: CalculateResponse = {
  organisation: { name: "Your organisation", country: "—", period: "—" },
  title: "Your organisation - GHG emissions report",
  categories: [],
  scope1tCO2e: 0,
  scope2tCO2e: 0,
  scope3tCO2e: 0,
  totaltCO2e: 0,
};

export function ReportPage() {
  const { draft } = useWizardDraft();
  const { showFactors } = useShowFactors();
  const { report, loading, error, run } = useCalculate();

  useEffect(() => {
    if (!draft.organisation.name || !draft.organisation.country || !draft.organisation.period) {
      return;
    }
    run(draft).catch(() => undefined);
    // Recalculate when the report page is opened with the latest draft.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasOrg = Boolean(draft.organisation.name);
  const displayReport = report ?? EMPTY_REPORT;

  return (
    <WizardLayout
      currentPath="/report"
      title="GHG emissions report"
      intro="Totals are in t CO2e, using the same layout as the UNFCCC calculator Report sheet."
    >
      {!hasOrg ? (
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Fill in your organisation details to populate the Report values.{" "}
          <Link to="/organisation" className="font-semibold underline">
            Go to step 1
          </Link>
          .
        </div>
      ) : null}

      {loading ? <p className="text-slate-700">Adding up your answers…</p> : null}
      {error ? (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
          {report ? <p className="mt-1">Showing the last successful calculation stored in this browser.</p> : null}
        </div>
      ) : null}

      <div className="space-y-6">
        <ExcelReportTable report={displayReport} />
        <DisclaimerPanel />
        <InfoAndSourcesPanel />
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="btn-primary"
            onClick={() => void exportExcel(displayReport, { showFactors })}
          >
            Download Excel
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => exportPdf(displayReport)}
            disabled={!report}
          >
            Download PDF
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => exportCsv(displayReport, showFactors)}
            disabled={!report}
          >
            Download CSV
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => run(draft)}
            disabled={!hasOrg}
          >
            Update results
          </button>
        </div>
      </div>

      <div className="mt-8">
        <Link to="/sheet/water" className="btn-secondary">
          Back
        </Link>
      </div>
    </WizardLayout>
  );
}
