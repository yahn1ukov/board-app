import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  accessToken: string | null;
}

interface Actions {
  setAccessToken(token: string): void;
  logout(): void;
}

type Store = State & Actions;

export const useAuthStore = create<Store>()(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken(token) {
        set({ accessToken: token });
      },
      logout() {
        set({ accessToken: null });
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
