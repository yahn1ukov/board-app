import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { CacheModule } from "../cache/cache.module";
import { ConfigService } from "../config/config.service";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { GoogleAuthGuard } from "./guards/google.guard";
import { JwtRefreshAuthGuard } from "./guards/jwt-refresh.guard";
import { JwtAuthGuard } from "./guards/jwt.guard";
import { CookieHelper } from "./helpers/cookie.helper";
import { HashHelper } from "./helpers/hash.helper";
import { TokenHelper } from "./helpers/token.helper";
import { GoogleStrategy } from "./strategies/google.strategy";
import { JwtRefreshStrategy } from "./strategies/jwt-refresh.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
  imports: [
    CacheModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.jwt.access.secret,
        signOptions: {
          expiresIn: config.jwt.access.expiresIn,
        },
      }),
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    HashHelper,
    TokenHelper,
    CookieHelper,
    GoogleStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    GoogleAuthGuard,
    JwtAuthGuard,
    JwtRefreshAuthGuard,
  ],
  exports: [JwtModule, JwtAuthGuard],
})
export class AuthModule {}
