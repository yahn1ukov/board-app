import type { GetOnlineUserResponseDto, GetUserResponseDto } from "@board/shared";
import { Inject, Injectable } from "@nestjs/common";
import type { RedisClientType } from "redis";
import { REDIS_TOKEN } from "../cache/cache.module";
import { UserMapper } from "./mappers/user.mapper";
import { UserRepository } from "./repositories/user.repository";

export const ONLINE_USERS_KEY = "online_users";

@Injectable()
export class UserService {
  constructor(
    @Inject(REDIS_TOKEN) private readonly redis: RedisClientType,
    private readonly repository: UserRepository,
  ) {}

  async getAll(): Promise<GetUserResponseDto[]> {
    const users = await this.repository.getAll();

    return users.map((user) => UserMapper.toDto(user));
  }

  async addOnline(id: string): Promise<{ onlineUser: GetOnlineUserResponseDto; isNew: boolean } | null> {
    const cachedUser = await this.redis.hGet(ONLINE_USERS_KEY, id);
    if (cachedUser) {
      return {
        onlineUser: UserMapper.toOnlineDto(cachedUser),
        isNew: false,
      };
    }

    const user = await this.repository.findById(id);
    if (!user) {
      return null;
    }

    const onlineUser = UserMapper.toOnlineDto(user);
    await this.redis.hSet(ONLINE_USERS_KEY, id, JSON.stringify(onlineUser));

    return { onlineUser, isNew: true };
  }

  async getAllOnline(): Promise<GetOnlineUserResponseDto[]> {
    const cachedUsers = await this.redis.hVals(ONLINE_USERS_KEY);

    return cachedUsers.map((cachedUser) => UserMapper.toOnlineDto(cachedUser));
  }

  async removeOnline(id: string): Promise<void> {
    const deletedCount = await this.redis.hDel(ONLINE_USERS_KEY, id);
    if (!deletedCount) {
      return;
    }
  }
}
