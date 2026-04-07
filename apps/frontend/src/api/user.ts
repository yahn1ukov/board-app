import { useBoardStore } from "@/stores/board";
import apiFetch from "@/utils/http/api-fetch";
import { API_ENDPOINT, type GetOnlineUserResponseDto } from "@board/shared";

export const UserService = {
  async getOnlineUsers() {
    const users = await apiFetch<GetOnlineUserResponseDto[]>(`${API_ENDPOINT.USER.INDEX}/${API_ENDPOINT.USER.ONLINE}`);
    useBoardStore.getState().setOnlineUsers(users);
  },
};
