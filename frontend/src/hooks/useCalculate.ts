import { useState } from "react";
import { calculate } from "../services/api";
import type { CalculateResponse, WizardDraft } from "../types";
import { REPORT_KEY } from "../utils/draft";

export function useCalculate() {
  const [report, setReport] = useState<CalculateResponse | null>(() => {
    try {
      const raw = localStorage.getItem(REPORT_KEY);
      return raw ? (JSON.parse(raw) as CalculateResponse) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(draft: WizardDraft) {
    setLoading(true);
    setError(null);
    try {
      const result = await calculate(draft);
      setReport(result);
      localStorage.setItem(REPORT_KEY, JSON.stringify(result));
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Calculation failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { report, loading, error, run };
}
