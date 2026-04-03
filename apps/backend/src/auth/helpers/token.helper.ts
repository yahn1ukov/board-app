import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AppConfigService } from "../../config/config.service";
import { JwtPayload, Tokens } from "../types/auth.type";

@Injectable()
export class TokenHelper {
  constructor(
    private readonly config: AppConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async generate(payload: JwtPayload): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.config.jwt.refresh.secret,
        expiresIn: this.config.jwt.refresh.expiresIn,
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
