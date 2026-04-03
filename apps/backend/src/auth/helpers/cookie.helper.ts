import { Injectable } from "@nestjs/common";
import type { Response } from "express";
import { AppConfigService } from "../../config/config.service";

@Injectable()
export class CookieHelper {
  constructor(private readonly config: AppConfigService) {}

  set(res: Response, refreshToken: string): void {
    res.cookie(this.config.cookie.name, refreshToken, {
      ...this.options,
      maxAge: this.config.cookie.maxAge,
    });
  }

  clear(res: Response): void {
    res.clearCookie(this.config.cookie.name, this.options);
  }

  private get options() {
    return {
      httpOnly: this.config.cookie.httpOnly,
      secure: this.config.cookie.secure,
      sameSite: this.config.cookie.sameSite,
    };
  }
}
