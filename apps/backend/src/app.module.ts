import { Module } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { AuthModule } from "./auth/auth.module";
import { BoardModule } from "./board/board.module";
import { CacheModule } from "./cache/cache.module";
import { ConfigModule } from "./config/config.module";
import { DatabaseModule } from "./database/database.module";
import { TaskModule } from "./task/task.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    CacheModule,
    EventEmitterModule.forRoot(),
    UserModule,
    AuthModule,
    TaskModule,
    BoardModule,
  ],
})
export class AppModule {}
