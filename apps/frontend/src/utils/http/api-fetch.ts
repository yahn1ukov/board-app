import { useAuthStore } from "@/stores/auth";
import { API_ENDPOINT, type AuthResponseDto } from "@board/shared";
import { FetchError, ofetch, type FetchOptions } from "ofetch";
import { ROUTE } from "../constants/route.constant";

const api = ofetch.create({
  baseURL: import.meta.env.VITE_BASE_HTTP_URL,
  onRequest({ options }) {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      options.headers = new Headers(options.headers);
      options.headers.set("Authorization", `Bearer ${accessToken}`);
    }

    options.credentials = "include";
  },
});

export default async function apiFetch<T>(endpoint: string, options?: FetchOptions<"json">): Promise<T> {
  const { setAccessToken, logout } = useAuthStore.getState();

  try {
    return await api<T>(endpoint, options);
  } catch (error: unknown) {
    if (error instanceof FetchError && error.response?.status === 401) {
      try {
        const refreshResponse = await ofetch<AuthResponseDto>(
          `/${API_ENDPOINT.AUTH.INDEX}/${API_ENDPOINT.AUTH.REFRESH}`,
          {
            baseURL: import.meta.env.VITE_BASE_HTTP_URL,
            method: "POST",
            credentials: "include",
          },
        );

        setAccessToken(refreshResponse.accessToken);

        return await api<T>(endpoint, options);
      } catch (refreshError: unknown) {
        logout();
        window.location.href = ROUTE.AUTH;

        throw refreshError;
      }
    }

    throw error;
  }
}
