import { Module } from "@nestjs/common";
import { createClient } from "redis";
import { AppConfigService } from "../config/config.service";

export const REDIS_TOKEN = "redis";

@Module({
  providers: [
    {
      provide: REDIS_TOKEN,
      inject: [AppConfigService],
      useFactory: async (config: AppConfigService) => {
        const client = createClient(config.redis);

        await client.connect();

        return client;
      },
    },
  ],
  exports: [REDIS_TOKEN],
})
export class CacheModule {}
