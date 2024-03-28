import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { CreateGoogleUserDto } from './dto/create-google-user.dto';
import { IGoogleUser } from './interfaces/google-user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto): Promise<User> {
    try {
      return await this.userRepository.save({
        ...user,
        password: await argon2.hash(user.password),
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async createGoogleUser(user: CreateGoogleUserDto): Promise<IGoogleUser> {
    try {
      return await this.userRepository.save(user);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | undefined> {
    return await this.userRepository.findOneBy({ id });
  }
}
