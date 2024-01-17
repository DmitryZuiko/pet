import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto) {
    try {
      const existUser = await this.userRepository.findOne({
        where: { email: user.email },
      });
      if (existUser) throw new BadRequestException('This email already exist');
      return await this.userRepository.save({
        ...user,
        password: await argon2.hash(user.password),
      });
    } catch (error) {
      console.log('error', error);
      throw new BadRequestException(error);
    }
  }

  async findAll() {
    return await this.userRepository.find();
  }
}
