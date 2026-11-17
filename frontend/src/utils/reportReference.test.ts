import { describe, expect, it } from "vitest";
import { DEFINITIONS, DISCLAIMER, INFO_SOURCES } from "./reportReference";

describe("report reference content", () => {
  it("includes the UNFCCC document version in the disclaimer header", () => {
    expect(DISCLAIMER.header).toContain("02.6");
    expect(DISCLAIMER.body.length).toBeGreaterThan(5);
  });

  it("covers every UNFCCC input sheet in the sources table", () => {
    const tabs = INFO_SOURCES.map((row) => row.tab);
    for (const tab of ["Fuels", "Bioenergy", "Refrigerants", "Owned vehicles", "Food", "Home office"]) {
      expect(tabs).toContain(tab);
    }
  });

  it("provides definitions for all three scopes", () => {
    expect(DEFINITIONS.map((d) => d.title)).toEqual([
      "Scope 1 — direct emissions",
      "Scope 2 — energy indirect",
      "Scope 3 — other indirect",
    ]);
  });
});
