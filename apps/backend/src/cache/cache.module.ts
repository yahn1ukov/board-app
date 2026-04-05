import { Module } from "@nestjs/common";
import { createClient } from "redis";
import { ConfigService } from "../config/config.service";

export const REDIS_TOKEN = "redis";

@Module({
  providers: [
    {
      provide: REDIS_TOKEN,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const client = createClient(config.redis);

        await client.connect();

        return client;
      },
    },
  ],
  exports: [REDIS_TOKEN],
})
export class CacheModule {}
