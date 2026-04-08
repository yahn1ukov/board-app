import { User } from "@board/shared";

export interface CreateUserPayload {
  email: string;
  firstName: string;
  lastName?: string;
  avatarUrl?: string;
}

export type OnlineUser = User;
