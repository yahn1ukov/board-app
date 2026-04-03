import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import type { Request } from "express";
import { Strategy } from "passport-jwt";
import { AppConfigService } from "../../config/config.service";
import { AuthService } from "../auth.service";
import { JwtPayload } from "../types/auth.type";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor(
    private readonly config: AppConfigService,
    private readonly service: AuthService,
  ) {
    super({
      jwtFromRequest: (req: Request) => req.cookies[config.cookie.name] as string,
      ignoreExpiration: false,
      secretOrKey: config.jwt.refresh.secret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<JwtPayload> {
    const refreshToken = req.cookies[this.config.cookie.name] as string;
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const user = await this.service.validateRefreshToken(payload.id, refreshToken);
    if (!user) {
      throw new UnauthorizedException();
    }

    return { id: user.id };
  }
}
