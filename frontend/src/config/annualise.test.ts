import { describe, expect, it } from "vitest";
import { activityAmount, hasMonthlyValues, sumMonthlyValues, withMonthlyTotal } from "./annualise";

describe("monthly amounts", () => {
  it("sums filled months and treats blanks as zero", () => {
    expect(sumMonthlyValues({ m1: "10", m3: "5", m12: "2.5" })).toBe(17.5);
    expect(hasMonthlyValues({ amount: "100" })).toBe(false);
    expect(hasMonthlyValues({ m1: "0" })).toBe(true);
  });

  it("uses the month sum when any month is filled, otherwise the annual field", () => {
    expect(activityAmount({ amount: "100", m1: "10", m2: "20" }, "amount")).toBe(30);
    expect(activityAmount({ amount: "100" }, "amount")).toBe(100);
  });

  it("writes the year total back onto the annual amount field", () => {
    expect(withMonthlyTotal({ m1: "10", m2: "5", amount: "999" }, "amount")).toEqual({
      m1: "10",
      m2: "5",
      amount: "15",
    });
  });
});
