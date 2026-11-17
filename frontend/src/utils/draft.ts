import type { WizardDraft } from "../types";

export const DRAFT_KEY = "ghg-calculator-draft";
export const REPORT_KEY = "ghg-calculator-report";

export function emptyDraft(): WizardDraft {
  return {
    organisation: { name: "", country: "", city: "", period: "", employees: "" },
    skippedCategories: [],
    scope1: { fuels: [], bioenergy: [], refrigerants: [], ownedVehicles: [] },
    scope2: { electricity: [], heatSteam: [], districtCoolingTons: "" },
    scope3: {
      wttFuels: [],
      water: [],
      materialUse: [],
      waste: [],
      flights: [],
      hotels: [],
      businessTravel: [],
      freight: [],
      commuting: [],
      food: [],
      homeOffice: [],
    },
  };
}

export function loadDraft(): WizardDraft {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return emptyDraft();
    return { ...emptyDraft(), ...JSON.parse(raw) };
  } catch {
    return emptyDraft();
  }
}

export function saveDraft(draft: WizardDraft) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
  localStorage.removeItem(REPORT_KEY);
}

export function hasEnteredData(draft: WizardDraft): boolean {
  const org = draft.organisation;
  if (org.name || org.country || org.city || org.period || org.employees) return true;
  if (draft.skippedCategories.length > 0) return true;
  if (draft.scope1.fuels.length || draft.scope1.bioenergy.length || draft.scope1.refrigerants.length || draft.scope1.ownedVehicles.length) {
    return true;
  }
  if (draft.scope2.electricity.length || draft.scope2.heatSteam.length || draft.scope2.districtCoolingTons) {
    return true;
  }
  return Object.values(draft.scope3).some((value) => Array.isArray(value) && value.length > 0);
}
