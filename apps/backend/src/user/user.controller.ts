import { GetOnlineUserResponseDto } from "@board/shared";
import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { UserService } from "./user.service";

@UseGuards(JwtAuthGuard)
@Controller("users")
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get("online")
  async getAllOnline(): Promise<GetOnlineUserResponseDto[]> {
    return this.service.getAllOnline();
  }
}
