import { useAuthStore } from "@/stores/auth";
import apiFetch from "@/utils/http/api-fetch";
import { API_ENDPOINT, type AuthUserResponseDto } from "@board/shared";

export const AuthService = {
  async getMe() {
    const user = await apiFetch<AuthUserResponseDto>(`${API_ENDPOINT.AUTH.INDEX}/${API_ENDPOINT.AUTH.ME}`, {
      method: "GET",
    });

    useAuthStore.getState().setCurrentUser(user);
  },
  async logout() {
    await apiFetch<void>(`${API_ENDPOINT.AUTH.INDEX}/${API_ENDPOINT.AUTH.LOGOUT}`, {
      method: "POST",
    });
  },
};
