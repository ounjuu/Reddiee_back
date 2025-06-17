// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userData: Partial<User> = {
      email: createUserDto.email,
      nickName: createUserDto.nickName,
      phone: createUserDto.phone,
      gender: createUserDto.gender,
      provider: createUserDto.provider,
      password: createUserDto.password,
    };

    const user = this.userRepository.create(userData);
    const savedUser = await this.userRepository.save(user);
    console.log('Saved user:', savedUser);
    return savedUser;
  }
}
