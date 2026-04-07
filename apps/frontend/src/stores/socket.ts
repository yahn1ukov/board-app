import {
  WS_EVENT,
  type CreateTaskRequestDto,
  type CreateTaskResponseDto,
  type GetOnlineUserResponseDto,
} from "@board/shared";
import { io, type Socket } from "socket.io-client";
import { create } from "zustand";
import { useAuthStore } from "./auth";

export interface SocketHandlers {
  onTaskCreated(task: CreateTaskResponseDto): void;
  onTaskUpdated(task: any): void;
  onTaskDeleted(taskId: string): void;
  onJoined(user: GetOnlineUserResponseDto): void;
  onLogout(): void;
}

interface State {
  socket: Socket | null;
}

interface Actions {
  connect(handlers: SocketHandlers): void;
  disconnect(): void;
  createTask(dto: CreateTaskRequestDto): void;
}

type Store = State & Actions;

export const useSocketStore = create<Store>((set, get) => ({
  socket: null,
  connect(handlers) {
    const { accessToken } = useAuthStore.getState();

    if (get().socket?.connected) {
      return;
    }

    const socket = io(import.meta.env.VITE_BASE_WS_URL, {
      extraHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });

    socket.on(WS_EVENT.TASK.CREATED, handlers.onTaskCreated);
    socket.on(WS_EVENT.TASK.UPDATED, handlers.onTaskUpdated);
    socket.on(WS_EVENT.TASK.DELETED, handlers.onTaskDeleted);
    socket.on(WS_EVENT.SYSTEM.JOINED, handlers.onJoined);
    socket.on(WS_EVENT.SYSTEM.LOGOUT, handlers.onLogout);

    set({ socket });
  },
  disconnect() {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
  createTask(dto) {
    const { socket } = get();
    socket?.emit(WS_EVENT.TASK.CREATED, dto);
  },
}));
