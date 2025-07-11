// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const userData: Partial<User> = {
      email: createUserDto.email,
      nickName: createUserDto.nickName,
      phone: createUserDto.phone,
      gender: createUserDto.gender,
      provider: createUserDto.provider,
      password: hashedPassword,
    };

    const user = this.userRepository.create(userData);
    const savedUser = await this.userRepository.save(user);
    console.log('Saved user:', savedUser);
    return savedUser;
  }
}
