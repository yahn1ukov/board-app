import apiFetch from "@/utils/http/api-fetch";
import { API_ENDPOINT } from "@board/shared";

export const AuthService = {
  async logout() {
    await apiFetch<void>(`${API_ENDPOINT.AUTH.INDEX}/${API_ENDPOINT.AUTH.LOGOUT}`, {
      method: "POST",
    });
  },
};
