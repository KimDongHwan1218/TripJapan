import { useState, useCallback } from "react";

export function useAsyncState<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (task: () => Promise<T>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await task();
      setData(result);
      return result;
    } catch (e: any) {
      setError(e.message ?? "unknown error");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, run };
}