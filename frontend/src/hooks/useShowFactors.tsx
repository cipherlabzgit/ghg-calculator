import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { FACTORS_UNLOCK_STORAGE_KEY, getOperatorPin } from "../config/features";

type ShowFactorsValue = {
  showFactors: boolean;
  unlock: (pin: string) => boolean;
  lock: () => void;
};

const ShowFactorsContext = createContext<ShowFactorsValue | null>(null);

function readUnlocked(pin: string) {
  if (!pin) return false;
  try {
    return localStorage.getItem(FACTORS_UNLOCK_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function writeUnlocked(unlocked: boolean) {
  try {
    if (unlocked) localStorage.setItem(FACTORS_UNLOCK_STORAGE_KEY, "1");
    else localStorage.removeItem(FACTORS_UNLOCK_STORAGE_KEY);
  } catch {
    // Ignore private-mode storage failures; UI state still updates.
  }
}

export function ShowFactorsProvider({ children, pin }: { children: ReactNode; pin?: string }) {
  const operatorPin = getOperatorPin(pin);
  const [unlocked, setUnlocked] = useState(() => readUnlocked(operatorPin));

  const unlock = useCallback(
    (candidate: string) => {
      if (!operatorPin || candidate !== operatorPin) return false;
      writeUnlocked(true);
      setUnlocked(true);
      return true;
    },
    [operatorPin],
  );

  const lock = useCallback(() => {
    writeUnlocked(false);
    setUnlocked(false);
  }, []);

  const value = useMemo(
    () => ({
      showFactors: Boolean(operatorPin) && unlocked,
      unlock,
      lock,
    }),
    [operatorPin, unlocked, unlock, lock],
  );

  return <ShowFactorsContext.Provider value={value}>{children}</ShowFactorsContext.Provider>;
}

export function useShowFactors() {
  const value = useContext(ShowFactorsContext);
  if (!value) {
    return {
      showFactors: false,
      unlock: () => false,
      lock: () => undefined,
    };
  }
  return value;
}
