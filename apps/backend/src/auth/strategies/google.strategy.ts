import { PROVIDER_TYPE } from "@board/shared";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback, type Profile } from "passport-google-oauth20";
import { ConfigService } from "../../config/config.service";
import { AuthService } from "../auth.service";
import { JwtPayload } from "../types/auth.type";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(
    config: ConfigService,
    private readonly service: AuthService,
  ) {
    super({
      clientID: config.oauth.google.clientId,
      clientSecret: config.oauth.google.clientSecret,
      callbackURL: config.oauth.google.callbackUrl,
      scope: ["email", "profile"],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) {
    const { emails, name, id, photos } = profile;

    const user = await this.service.validateUser({
      email: emails![0].value,
      firstName: name!.givenName,
      lastName: name?.familyName,
      avatarUrl: photos?.[0]?.value,
      accountId: id,
      type: PROVIDER_TYPE.GOOGLE,
    });

    const payload: JwtPayload = { id: user.id };

    done(null, payload);
  }
}
