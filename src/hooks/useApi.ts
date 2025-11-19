import { useState, useCallback } from "react";
import { showError } from "../utils/toast";

type ApiFunction<T> = (...args: any[]) => Promise<T>;

export const useApi = <T>(apiFunc: ApiFunction<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const callApi = useCallback(
    async (...args: any[]): Promise<T> => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiFunc(...args);
        setData(res);
        return res;
      } catch (err: any) {
        setError(err);
        showError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunc]
  );

  return { data, loading, error, callApi };
};
