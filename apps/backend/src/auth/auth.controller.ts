import { API_ENDPOINT } from "@board/shared";
import { Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards, UseInterceptors } from "@nestjs/common";
import type { Response } from "express";
import { ConfigService } from "../config/config.service";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators/current-user.decorator";
import { GoogleAuthGuard } from "./guards/google.guard";
import { JwtRefreshAuthGuard } from "./guards/jwt-refresh.guard";
import { JwtAuthGuard } from "./guards/jwt.guard";
import { CookieHelper } from "./helpers/cookie.helper";
import { CookieInterceptor } from "./interceptors/cookie.interceptor";
import type { JwtPayload, Tokens } from "./types/auth.type";

@Controller(API_ENDPOINT.AUTH.INDEX)
export class AuthController {
  constructor(
    private readonly config: ConfigService,
    private readonly service: AuthService,
    private readonly cookieHelper: CookieHelper,
  ) {}

  @UseGuards(GoogleAuthGuard)
  @Get(API_ENDPOINT.AUTH.GOOGLE)
  async authGoogleRedirect(
    @CurrentUser() payload: JwtPayload,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const tokens = await this.service.auth(payload);

    this.cookieHelper.set(res, tokens.refreshToken);

    return res.redirect(`${this.config.app.frontendUrl}/oauth-success?token=${tokens.accessToken}`);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @UseInterceptors(CookieInterceptor)
  @Post(API_ENDPOINT.AUTH.REFRESH)
  @HttpCode(HttpStatus.OK)
  async refresh(@CurrentUser() payload: JwtPayload): Promise<Tokens> {
    return this.service.refresh(payload);
  }

  @UseGuards(JwtAuthGuard)
  @Post(API_ENDPOINT.AUTH.LOGOUT)
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser("id") userId: string, @Res({ passthrough: true }) res: Response): Promise<void> {
    this.cookieHelper.clear(res);

    return this.service.logout(userId);
  }
}
