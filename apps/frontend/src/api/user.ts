import { useBoardStore } from "@/stores/board";
import apiFetch from "@/utils/http/api-fetch";
import { API_ENDPOINT, type GetOnlineUserResponseDto, type GetUserResponseDto } from "@board/shared";

export const UserService = {
  async getAll() {
    return apiFetch<GetUserResponseDto[]>(`${API_ENDPOINT.USER.INDEX}`, {
      method: "GET",
    });
  },
  async getOnlineUsers() {
    const users = await apiFetch<GetOnlineUserResponseDto[]>(`${API_ENDPOINT.USER.INDEX}/${API_ENDPOINT.USER.ONLINE}`, {
      method: "GET",
    });

    useBoardStore.getState().setOnlineUsers(users);
  },
};
