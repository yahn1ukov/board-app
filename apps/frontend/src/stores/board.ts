import type { CreateTaskRequestDto, GetOnlineUserResponseDto, GetTaskPreviewResponseDto } from "@board/shared";
import { create } from "zustand";
import { useSocketStore } from "./socket";

interface State {
  tasks: GetTaskPreviewResponseDto[];
  onlineUsers: GetOnlineUserResponseDto[];
}

interface Actions {
  setTasks(tasks: GetTaskPreviewResponseDto[]): void;
  setOnlineUsers(users: GetOnlineUserResponseDto[]): void;
  connect(): void;
  disconnect(): void;
  createTask(dto: CreateTaskRequestDto): void;
}

type Store = State & Actions;

export const useBoardStore = create<Store>((set, get) => ({
  tasks: [],
  onlineUsers: [],
  setTasks(tasks) {
    set({ tasks });
  },
  setOnlineUsers(users) {
    set({ onlineUsers: users });
  },
  connect() {
    useSocketStore.getState().connect({
      onTaskCreated(task) {
        set((state) => ({ tasks: [task, ...state.tasks] }));
      },
      onTaskUpdated(updatedTask) {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === updatedTask.id ? { ...t, ...updatedTask } : t)),
        }));
      },
      onTaskDeleted(taskId) {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== taskId),
        }));
      },
      onJoined(user) {
        set((state) => ({
          onlineUsers: state.onlineUsers.some((u) => u.id === user.id)
            ? state.onlineUsers
            : [...state.onlineUsers, user],
        }));
      },
      onLogout() {
        get().disconnect();
      },
    });
  },
  disconnect() {
    useSocketStore.getState().disconnect();
    set({ tasks: [], onlineUsers: [] });
  },
  createTask(dto) {
    useSocketStore.getState().createTask(dto);
  },
}));
