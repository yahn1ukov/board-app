export interface UserBase {
  email: string;
  firstName: string;
  lastName: string | null;
  avatarUrl: string | null;
}

export interface User extends UserBase {
  id: string;
}

export type GetUserResponseDto = User;

export type GetOnlineUserResponseDto = User;
