import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "../config/config.service";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        ...config.database,
        autoLoadEntities: true,
        migrationsRun: true,
        migrations: [__dirname + "/migrations/*{.ts,.js}"],
      }),
    }),
  ],
})
export class DatabaseModule {}
