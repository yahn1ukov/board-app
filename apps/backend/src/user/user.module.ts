import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserProviderEntity } from "./entities/user-provider.entity";
import { UserEntity } from "./entities/user.entity";
import { UserProviderRepository } from "./repositories/user-provider.repository";
import { UserRepository } from "./repositories/user.repository";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserProviderEntity])],
  providers: [UserRepository, UserProviderRepository],
  exports: [UserRepository, UserProviderRepository],
})
export class UserModule {}
