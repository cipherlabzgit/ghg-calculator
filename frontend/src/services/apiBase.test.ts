import { describe, expect, it } from "vitest";
import { apiBaseUrl } from "./api";

describe("apiBaseUrl", () => {
  it("falls back to the Vite proxy path when unset", () => {
    expect(apiBaseUrl(undefined)).toBe("/api");
    expect(apiBaseUrl("")).toBe("/api");
    expect(apiBaseUrl("   ")).toBe("/api");
  });

  it("uses the configured base including /api and strips trailing slashes", () => {
    expect(apiBaseUrl("https://api.example.com/api")).toBe("https://api.example.com/api");
    expect(apiBaseUrl("https://api.example.com/api/")).toBe("https://api.example.com/api");
    expect(apiBaseUrl("https://api.example.com/api///")).toBe("https://api.example.com/api");
  });
});
