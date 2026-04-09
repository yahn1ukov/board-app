import type { AuthUserResponseDto } from "@board/shared";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  accessToken: string | null;
  currentUser: AuthUserResponseDto | null;
}

interface Actions {
  setAccessToken(token: string): void;
  setCurrentUser(user: AuthUserResponseDto): void;
  logout(): void;
}

type Store = State & Actions;

export const useAuthStore = create<Store>()(
  persist(
    (set) => ({
      accessToken: null,
      currentUser: null,
      setAccessToken(token) {
        set({ accessToken: token });
      },
      setCurrentUser(user) {
        set({ currentUser: user });
      },
      logout() {
        set({
          accessToken: null,
          currentUser: null,
        });
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
