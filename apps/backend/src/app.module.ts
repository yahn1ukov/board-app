import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { CacheModule } from "./cache/cache.module";
import { AppConfigModule } from "./config/config.module";
import { DatabaseModule } from "./database/database.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [AppConfigModule, DatabaseModule, CacheModule, UserModule, AuthModule],
})
export class AppModule {}
