import { renderHook, act } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { ReactNode } from "react";
import { FACTORS_UNLOCK_STORAGE_KEY } from "../config/features";
import { ShowFactorsProvider, useShowFactors } from "./useShowFactors";

function wrapper(pin: string) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <ShowFactorsProvider pin={pin}>{children}</ShowFactorsProvider>;
  };
}

describe("useShowFactors", () => {
  afterEach(() => {
    localStorage.removeItem(FACTORS_UNLOCK_STORAGE_KEY);
  });

  it("stays hidden by default and with a wrong PIN", () => {
    const { result } = renderHook(() => useShowFactors(), { wrapper: wrapper("secret") });
    expect(result.current.showFactors).toBe(false);
    act(() => {
      expect(result.current.unlock("nope")).toBe(false);
    });
    expect(result.current.showFactors).toBe(false);
  });

  it("unlocks with the operator PIN and can lock again", () => {
    const { result } = renderHook(() => useShowFactors(), { wrapper: wrapper("secret") });
    act(() => {
      expect(result.current.unlock("secret")).toBe(true);
    });
    expect(result.current.showFactors).toBe(true);
    expect(localStorage.getItem(FACTORS_UNLOCK_STORAGE_KEY)).toBe("1");
    act(() => {
      result.current.lock();
    });
    expect(result.current.showFactors).toBe(false);
    expect(localStorage.getItem(FACTORS_UNLOCK_STORAGE_KEY)).toBeNull();
  });

  it("cannot unlock when no PIN is configured", () => {
    localStorage.setItem(FACTORS_UNLOCK_STORAGE_KEY, "1");
    const { result } = renderHook(() => useShowFactors(), { wrapper: wrapper("") });
    expect(result.current.showFactors).toBe(false);
    act(() => {
      expect(result.current.unlock("secret")).toBe(false);
    });
    expect(result.current.showFactors).toBe(false);
  });
});
