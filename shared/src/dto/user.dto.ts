export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string | null;
  avatarUrl: string | null;
}

export type GetOnlineUserResponseDto = User;
