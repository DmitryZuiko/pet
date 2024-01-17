import { ErrorVariable } from '@app/enum/error.enum';
import { UserService } from '@app/user/user.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

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
}
