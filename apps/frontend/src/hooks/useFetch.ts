import { useCallback, useState } from "react";

interface RequestState {
  isLoading: boolean;
  error: Error | null;
}

export function useFetch<T>() {
  const [state, setState] = useState<RequestState>({
    isLoading: false,
    error: null,
  });

  const request = useCallback(async (fn: () => Promise<T>) => {
    setState({ isLoading: true, error: null });
    try {
      return await fn();
    } catch (error: unknown) {
      const fetchError = error instanceof Error ? error : new Error("Something went wrong");

      setState((prev) => ({ ...prev, error: fetchError }));

      return null;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  return { ...state, request };
}
