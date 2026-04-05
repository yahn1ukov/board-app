import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CacheModule } from "../cache/cache.module";
import { UserProviderEntity } from "./entities/user-provider.entity";
import { UserEntity } from "./entities/user.entity";
import { UserProviderRepository } from "./repositories/user-provider.repository";
import { UserRepository } from "./repositories/user.repository";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [CacheModule, TypeOrmModule.forFeature([UserEntity, UserProviderEntity])],
  controllers: [UserController],
  providers: [UserService, UserRepository, UserProviderRepository],
  exports: [UserService, UserRepository, UserProviderRepository],
})
export class UserModule {}
