import type { AuthResponseDto } from "@board/shared";
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Response } from "express";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ConfigService } from "../../config/config.service";
import { CookieHelper } from "../helpers/cookie.helper";
import type { Tokens } from "../types/auth.type";

@Injectable()
export class CookieInterceptor implements NestInterceptor<Tokens, AuthResponseDto> {
  constructor(
    private readonly config: ConfigService,
    private readonly cookieHelper: CookieHelper,
  ) {}

  intercept(ctx: ExecutionContext, next: CallHandler<Tokens>): Observable<AuthResponseDto> {
    return next.handle().pipe(
      map((tokens) => {
        const res = ctx.switchToHttp().getResponse<Response>();

        this.cookieHelper.set(res, tokens.refreshToken);

        return {
          tokenType: this.config.jwt.type,
          accessToken: tokens.accessToken,
          expiresIn: this.config.jwt.access.expiresIn,
        };
      }),
    );
  }
}
