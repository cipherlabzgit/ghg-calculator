import { useEffect, useState } from "react";
import { fetchCountries } from "../services/api";
import type { CountryRecord } from "../types";

export function useCountries() {
  const [countries, setCountries] = useState<CountryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCountries()
      .then(setCountries)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { countries, loading, error };
}
