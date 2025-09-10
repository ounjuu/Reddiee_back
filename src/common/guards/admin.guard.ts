// common/guards/admin.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('로그인 정보가 없습니다.');
    }

    if (user.role !== 'admin') {
      throw new ForbiddenException('관리자만 접근 가능합니다.');
    }

    return true;
  }
}
