import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { WizardDraft } from "../types";
import { clearDraft, emptyDraft, loadDraft, saveDraft } from "../utils/draft";

function useWizardDraftState() {
  const [draft, setDraft] = useState<WizardDraft>(() => loadDraft());
  const [resetCount, setResetCount] = useState(0);

  useEffect(() => {
    saveDraft(draft);
  }, [draft]);

  const update = useCallback((updater: (current: WizardDraft) => WizardDraft) => {
    setDraft((current) => updater(current));
  }, []);

  const toggleSkip = useCallback((categoryId: string) => {
    setDraft((current) => {
      const skipped = current.skippedCategories.includes(categoryId);
      return {
        ...current,
        skippedCategories: skipped
          ? current.skippedCategories.filter((id) => id !== categoryId)
          : [...current.skippedCategories, categoryId],
      };
    });
  }, []);

  const reset = useCallback(() => {
    clearDraft();
    setDraft(emptyDraft());
    setResetCount((count) => count + 1);
  }, []);

  return useMemo(
    () => ({ draft, setDraft, update, toggleSkip, reset, resetCount }),
    [draft, update, toggleSkip, reset, resetCount],
  );
}

type WizardDraftValue = ReturnType<typeof useWizardDraftState>;

const WizardDraftContext = createContext<WizardDraftValue | null>(null);

export function WizardDraftProvider({ children }: { children: ReactNode }) {
  const value = useWizardDraftState();
  return <WizardDraftContext.Provider value={value}>{children}</WizardDraftContext.Provider>;
}

export function useWizardDraft() {
  const value = useContext(WizardDraftContext);
  if (!value) {
    throw new Error("useWizardDraft must be used inside WizardDraftProvider");
  }
  return value;
}
