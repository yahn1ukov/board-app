import apiFetch from "@/utils/http/api-fetch";
import type { FetchOptions } from "ofetch";
import { useCallback, useState } from "react";

interface RequestState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

export function useFetch<T>() {
  const [state, setState] = useState<RequestState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const request = useCallback(async (endpoint: string, options?: FetchOptions<"json">) => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      const response = await apiFetch<T>(endpoint, options);

      setState({
        data: response,
        isLoading: false,
        error: null,
      });

      return response;
    } catch (error: unknown) {
      const fetchError = error instanceof Error ? error : new Error("Something went wrong");

      setState({
        data: null,
        isLoading: false,
        error: fetchError,
      });

      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      error: null,
    });
  }, []);

  return { ...state, request, reset };
}
