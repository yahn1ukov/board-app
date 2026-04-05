import { Injectable } from "@nestjs/common";
import { ConfigService as NestConfigService } from "@nestjs/config";

@Injectable()
export class ConfigService {
  constructor(private readonly config: NestConfigService) {}

  get app() {
    return {
      isProd: this.config.get("NODE_ENV") === "production",
      port: +this.config.get("PORT", "3000"),
      frontendUrl: this.config.get("FRONTEND_URL", "http://localhost:5173"),
    };
  }

  get database() {
    return {
      host: this.config.get("DB_HOST", "localhost"),
      port: +this.config.get("DB_PORT", "5432"),
      username: this.config.get("DB_USERNAME", "postgres"),
      password: this.config.get("DB_PASSWORD", "postgres"),
      database: this.config.get("DB_NAME", "board-db"),
    };
  }

  get redis() {
    return {
      socket: {
        host: this.config.get("REDIS_HOST", "localhost"),
        port: +this.config.get("REDIS_PORT", "6379"),
      },
      password: this.config.get("REDIS_PASSWORD", "redis"),
    };
  }

  get oauth() {
    return {
      google: {
        clientId: this.config.get("OAUTH_GOOGLE_CLIENT_ID", "your-google-client-id"),
        clientSecret: this.config.get("OAUTH_GOOGLE_CLIENT_SECRET", "your-google-client-secret"),
        callbackUrl: this.config.get("OAUTH_GOOGLE_CALLBACK_URL", "your-google-callback-url"),
      },
    };
  }

  get jwt() {
    return {
      type: this.config.get("JWT_TOKEN_TYPE", "Bearer"),
      access: {
        secret: this.config.get("JWT_ACCESS_SECRET_KEY", "your-access-secret-key"),
        expiresIn: +this.config.get("JWT_ACCESS_EXPIRES_IN", "900"),
      },
      refresh: {
        secret: this.config.get("JWT_REFRESH_SECRET_KEY", "your-refresh-secret-key"),
        expiresIn: +this.config.get("JWT_REFRESH_EXPIRES_IN", "86400"),
      },
    };
  }

  get cookie() {
    return {
      name: this.config.get("COOKIE_NAME", "refreshToken"),
      httpOnly: this.config.get("COOKIE_HTTP_ONLY", "true") === "true",
      secure: this.app.isProd,
      maxAge: this.jwt.refresh.expiresIn * 1000,
      path: this.config.get("COOKIE_PATH", "/"),
      sameSite: this.config.get("COOKIE_SAME_SITE", "lax") as "lax" | "strict" | "none",
    };
  }
}
