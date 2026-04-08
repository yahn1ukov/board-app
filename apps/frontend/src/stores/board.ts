import type {
  CreateTaskRequestDto,
  GetOnlineUserResponseDto,
  GetTaskDetailResponseDto,
  GetTaskPreviewResponseDto,
} from "@board/shared";
import { create } from "zustand";
import { useSocketStore } from "./socket";

interface State {
  task: GetTaskDetailResponseDto | null;
  tasks: GetTaskPreviewResponseDto[];
  onlineUsers: GetOnlineUserResponseDto[];
}

interface Actions {
  setTask(task: GetTaskDetailResponseDto): void;
  setTasks(tasks: GetTaskPreviewResponseDto[]): void;
  setOnlineUsers(users: GetOnlineUserResponseDto[]): void;
  connect(): void;
  disconnect(): void;
  createTask(dto: CreateTaskRequestDto): void;
}

type Store = State & Actions;

export const useBoardStore = create<Store>((set, get) => ({
  task: null,
  tasks: [],
  onlineUsers: [],
  setTask(task) {
    set({ task });
  },
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
          tasks: state.tasks.map((task) => (task.id === updatedTask.id ? { ...task, ...updatedTask } : task)),
        }));
      },
      onTaskDeleted(taskId) {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
        }));
      },
      onJoined(joinedUser) {
        set((state) => ({
          onlineUsers: state.onlineUsers.some((user) => user.id === joinedUser.id)
            ? state.onlineUsers
            : [...state.onlineUsers, joinedUser],
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
