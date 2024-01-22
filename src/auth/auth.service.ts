import { ErrorVariable } from '@app/enum/error.enum';
import { IUser } from '@app/user/interfaces/user.interface';
import { UserService } from '@app/user/user.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new BadRequestException(ErrorVariable.WrongLogin);
    }

    const isAuthenticate = await argon2.verify(user.password, password);
    if (isAuthenticate) {
      return user;
    }

    throw new UnauthorizedException(ErrorVariable.WrongPass);
  }

  async login(user: IUser) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return {
      result,
      token: this.jwtService.sign({ id: user.id, email: user.email }),
    };
  }
}
