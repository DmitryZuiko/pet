import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from '@app/user/interfaces/user.interface';
import { EnvVariable } from '@app/enum/env-variable.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(EnvVariable.JWT_SECRET),
    });
  }

  async validate(payload: IUser) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = payload;
    return user;
  }
}
