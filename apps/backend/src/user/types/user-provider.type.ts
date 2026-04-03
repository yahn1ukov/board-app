import type { ProviderType } from "@board/shared";

export interface CreateUserProviderPayload {
  accountId: string;
  type: ProviderType;
}
