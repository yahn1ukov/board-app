import { PROVIDER_TYPE } from "../constants/provider.constant";

export type ProviderType = (typeof PROVIDER_TYPE)[keyof typeof PROVIDER_TYPE];
