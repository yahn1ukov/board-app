export interface UserBase {
  email: string;
  firstName: string;
  lastName: string | null;
  avatarUrl: string | null;
}

interface User extends UserBase {
  id: string;
}

export type GetOnlineUserResponseDto = User;
