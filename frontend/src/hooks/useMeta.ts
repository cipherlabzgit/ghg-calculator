import { useEffect, useState } from "react";
import { fetchMeta } from "../services/api";
import type { MetaResponse } from "../types";

export function useMeta() {
  const [meta, setMeta] = useState<MetaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMeta()
      .then(setMeta)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { meta, loading, error };
}
