/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorVariable } from '@app/enum/error.enum';
import { CreateUserDto } from '@app/user/dto/create-user.dto';
import { IUser } from '@app/user/interfaces/user.interface';
import { UserService } from '@app/user/user.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { AuthErrors } from './enum/authError.enum';
import { ConfigService } from '@nestjs/config';
import { EnvVariable } from '@app/enum/env-variable.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new BadRequestException(ErrorVariable.WrongLogin);
    }

    const isAuthenticate = await argon2.verify(user.password, password);
    if (isAuthenticate) return user;

    throw new UnauthorizedException(ErrorVariable.WrongPass);
  }

  async registration(user: CreateUserDto) {
    const existUser = await this.userService.findOne(user.email);
    if (existUser) throw new BadRequestException(AuthErrors.Exist);
    const { password, ...result } = await this.userService.create(user);
    return result;
  }

  async login(user: IUser) {
    const { password, ...result } = user;
    const payload = { id: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>(EnvVariable.REFRESH_EXPIRES_IN),
    });

    return { result, accessToken, refreshToken };
  }

  async refreshToken(user: IUser) {
    const payload = { id: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
