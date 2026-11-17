import { afterEach, describe, expect, it } from "vitest";
import { clearDraft, emptyDraft, hasEnteredData, loadDraft, saveDraft } from "../utils/draft";

describe("wizard draft localStorage", () => {
  afterEach(() => {
    clearDraft();
  });

  it("round-trips a draft and can skip a category", () => {
    const draft = emptyDraft();
    draft.organisation.name = "Acme";
    draft.skippedCategories = ["fuels"];
    saveDraft(draft);
    const loaded = loadDraft();
    expect(loaded.organisation.name).toBe("Acme");
    expect(loaded.skippedCategories).toContain("fuels");
  });

  it("clears the stored draft", () => {
    saveDraft(emptyDraft());
    clearDraft();
    expect(loadDraft().organisation.name).toBe("");
  });

  it("knows when a draft has user data", () => {
    expect(hasEnteredData(emptyDraft())).toBe(false);
    const draft = emptyDraft();
    draft.organisation.name = "Acme";
    expect(hasEnteredData(draft)).toBe(true);
  });
});
