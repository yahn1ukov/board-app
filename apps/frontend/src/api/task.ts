import { useBoardStore } from "@/stores/board";
import apiFetch from "@/utils/http/api-fetch";
import {
  API_ENDPOINT,
  type GetTaskDetailResponseDto,
  type GetTaskPreviewResponseDto,
  type UpdateTaskRequestDto,
} from "@board/shared";

export const TaskService = {
  async getTasks() {
    const tasks = await apiFetch<GetTaskPreviewResponseDto[]>(`${API_ENDPOINT.TASK.INDEX}`, {
      method: "GET",
    });

    useBoardStore.getState().setTasks(tasks);
  },
  async getTask(id: string) {
    const task = await apiFetch<GetTaskDetailResponseDto>(`${API_ENDPOINT.TASK.INDEX}/${id}`, {
      method: "GET",
    });

    useBoardStore.getState().setTask(task);
  },
  async updateTask(id: string, dto: UpdateTaskRequestDto) {
    await apiFetch<void>(`${API_ENDPOINT.TASK.INDEX}/${id}`, {
      method: "PATCH",
      body: dto,
    });
  },
  async deleteTask(id: string) {
    await apiFetch<void>(`${API_ENDPOINT.TASK.INDEX}/${id}`, {
      method: "DELETE",
    });
  },
};
