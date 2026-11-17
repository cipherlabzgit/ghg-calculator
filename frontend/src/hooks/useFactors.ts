import { useEffect, useState } from "react";
import { fetchFactors, type FactorCatalogRow } from "../services/api";

export function useFactors(category: string) {
  const [tree, setTree] = useState<Array<Record<string, string | number>>>([]);
  const [factors, setFactors] = useState<FactorCatalogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchFactors(category)
      .then((data) => {
        if (!cancelled) {
          const raw = data.tree;
          if (Array.isArray(raw) && raw.every((item) => typeof item === "string")) {
            setTree((raw as string[]).map((country) => ({ country })));
          } else {
            const rows = Array.isArray(raw) ? (raw as Array<Record<string, string | number>>) : [];
            setTree(
              rows.map((row) => {
                const type = row.type ?? row.protocol;
                const emission = row.emission ?? row.gas;
                return {
                  ...row,
                  ...(type != null ? { type } : {}),
                  ...(emission != null ? { emission } : {}),
                };
              }),
            );
          }
          setFactors(Array.isArray(data.factors) ? data.factors : []);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [category]);

  return { tree, factors, loading, error };
}
