import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvVariable } from '@app/enum/env-variable.enum';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>(EnvVariable.CLIENT_ID),
      clientSecret: configService.get<string>(EnvVariable.CLIENT_SECRET),
      callbackURL: configService.get<string>(EnvVariable.CALLBACK_URL),
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    return this.authService.validateGoogleUser({
      email: profile.emails[0].value,
      firstName: profile.name.familyName,
      lastName: profile.name.givenName,
    });
  }
}
