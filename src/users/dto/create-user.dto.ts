import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

import { Gender } from './enum';
import { Provider } from './enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(1, 20)
  nickName: string;

  @IsOptional()
  @IsString()
  @Length(0, 15)
  phone?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsEnum(Provider)
  provider?: Provider;

  @IsString()
  password: string;

  // 필요하면 role도 추가 가능
  // @IsOptional()
  // @IsEnum(['user', 'admin', 'blacklist'])
  // role?: 'user' | 'admin' | 'blacklist';
}
