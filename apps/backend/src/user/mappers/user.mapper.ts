import { GetOnlineUserResponseDto } from "@board/shared";
import { UserEntity } from "../entities/user.entity";

export class UserMapper {
  static toDto(obj: UserEntity | string): GetOnlineUserResponseDto {
    const user = typeof obj === "string" ? JSON.parse(obj) : obj;

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
    };
  }
}
