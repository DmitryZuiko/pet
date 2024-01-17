import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto) {
    try {
      const existUser = await this.userRepository.findOne({
        where: { email: user.email },
      });
      if (existUser) throw new BadRequestException('This email already exist');
      await this.userRepository.save(user);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  findAll() {
    return `This action returns all users`;
  }
}
