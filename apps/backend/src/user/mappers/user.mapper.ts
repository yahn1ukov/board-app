import { GetOnlineUserResponseDto, GetUserResponseDto } from "@board/shared";
import { UserEntity } from "../entities/user.entity";
import { OnlineUser } from "../types/user.type";

export class UserMapper {
  static toDto(user: OnlineUser | UserEntity): GetUserResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
    };
  }

  static toOnlineDto(obj: UserEntity | string): GetOnlineUserResponseDto {
    const user: OnlineUser | UserEntity = typeof obj === "string" ? JSON.parse(obj) : obj;

    return this.toDto(user);
  }
}
