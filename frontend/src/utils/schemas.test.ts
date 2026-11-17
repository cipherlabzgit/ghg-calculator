import { describe, expect, it } from "vitest";
import { organisationSchema, percentSchema } from "./schemas";

describe("organisationSchema", () => {
  it("requires name, country and period", () => {
    const result = organisationSchema.safeParse({ name: "", country: "", period: "" });
    expect(result.success).toBe(false);
  });

  it("accepts a complete organisation", () => {
    const result = organisationSchema.safeParse({
      name: "Acme",
      country: "Sri Lanka",
      period: "2024",
      city: "Colombo",
      employees: "12",
    });
    expect(result.success).toBe(true);
  });
});

describe("percentSchema", () => {
  it("rejects values outside 0-100", () => {
    expect(percentSchema.safeParse("120").success).toBe(false);
    expect(percentSchema.safeParse("50").success).toBe(true);
  });
});
