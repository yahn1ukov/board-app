import { API_ENDPOINT, GetOnlineUserResponseDto } from "@board/shared";
import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { UserService } from "./user.service";

@UseGuards(JwtAuthGuard)
@Controller(API_ENDPOINT.USER.INDEX)
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get(API_ENDPOINT.USER.ONLINE)
  async getAllOnline(): Promise<GetOnlineUserResponseDto[]> {
    return this.service.getAllOnline();
  }
}
