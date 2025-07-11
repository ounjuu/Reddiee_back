import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// 엔티티
import { User } from './users/user.entity';

// 모듈
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

import { ChatGateway } from './chat/chat.gateway';

import * as crypto from 'crypto';
(global as any).crypto = crypto;

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // .env 파일 전역 적용
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT'), 10) || 3306,
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User],
        synchronize: true,
      }),
    }),
    AuthModule,
    UsersModule, // 여기 추가
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
