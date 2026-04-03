import type { ProviderType } from "@board/shared";

export interface JwtPayload {
  id: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface OAuthUser {
  email: string;
  firstName: string;
  lastName?: string;
  avatarUrl?: string;
  accountId: string;
  type: ProviderType;
}
