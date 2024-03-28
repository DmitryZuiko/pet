import { User } from '@app/user/entities/user.entity';
import { UserService } from '@app/user/user.service';
import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }

  serializeUser(user: User, done: any) {
    done(null, user);
  }

  async deserializeUser(payload: any, done: any) {
    const user = await this.userService.findById(payload.id);
    user ? done(null, user) : done(null, null);
  }
}
