import { Inject, Injectable } from "@nestjs/common";
import type { RedisClientType } from "redis";
import { REDIS_TOKEN } from "../cache/cache.module";
import { AppConfigService } from "../config/config.service";
import { UserEntity } from "../user/entities/user.entity";
import { UserProviderRepository } from "../user/repositories/user-provider.repository";
import { UserRepository } from "../user/repositories/user.repository";
import { HashHelper } from "./helpers/hash.helper";
import { TokenHelper } from "./helpers/token.helper";
import { JwtPayload, OAuthUser, Tokens } from "./types/auth.type";

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userProviderRepository: UserProviderRepository,
    private readonly config: AppConfigService,
    @Inject(REDIS_TOKEN) private readonly redis: RedisClientType,
    private readonly hashHelper: HashHelper,
    private readonly tokenHelper: TokenHelper,
  ) {}

  async validateUser(oauth: OAuthUser): Promise<UserEntity> {
    const provider = await this.userProviderRepository.findByAccountId(oauth.accountId);
    if (provider) {
      return provider.user;
    }

    let user = await this.userRepository.findByEmail(oauth.email);
    if (!user) {
      user = await this.userRepository.create({
        email: oauth.email,
        firstName: oauth.firstName,
        lastName: oauth.lastName,
        avatarUrl: oauth.avatarUrl,
      });
    }

    await this.userProviderRepository.create(user.id, {
      accountId: oauth.accountId,
      type: oauth.type,
    });

    return user;
  }

  async validateRefreshToken(userId: string, refreshToken: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      return null;
    }

    const sessionKey = `auth:session:${user.id}`;

    const refreshTokenHash = await this.redis.get(sessionKey);
    if (!refreshTokenHash) {
      return null;
    }

    const isMatch = await this.hashHelper.verify(refreshTokenHash, refreshToken);
    if (!isMatch) {
      await this.redis.del(sessionKey);

      return null;
    }

    return user;
  }

  async auth(payload: JwtPayload): Promise<Tokens> {
    return this.issueTokens(payload);
  }

  async refresh(payload: JwtPayload): Promise<Tokens> {
    return this.issueTokens(payload);
  }

  async logout(userId: string): Promise<void> {
    await this.redis.del(`auth:session:${userId}`);
  }

  private async issueTokens(payload: JwtPayload): Promise<Tokens> {
    const sessionKey = `auth:session:${payload.id}`;

    const tokens = await this.tokenHelper.generate(payload);

    const refreshTokenHash = await this.hashHelper.hash(tokens.refreshToken);
    await this.redis.set(sessionKey, refreshTokenHash, {
      expiration: {
        type: "EX",
        value: this.config.jwt.refresh.expiresIn,
      },
    });

    return tokens;
  }
}
