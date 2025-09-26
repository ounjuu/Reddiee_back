import {
  Controller,
  Post,
  Delete,
  UseGuards,
  Req,
  Param,
  Get,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('likes')
@UseGuards(JwtAuthGuard) // 👉 로그인한 유저만 접근 가능
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  // 좋아요 추가
  @Post(':productId')
  async addLike(@Req() req, @Param('productId') productId: number) {
    const userId = req.user.id; // JwtStrategy에서 리턴된 user
    return this.likesService.addLike(userId, productId);
  }

  // 좋아요 취소
  @Delete(':productId')
  async removeLike(@Req() req, @Param('productId') productId: number) {
    const userId = req.user.id;
    return this.likesService.removeLike(userId, productId);
  }

  // 특정 상품 좋아요 수
  @Get(':productId/count')
  async countLikes(@Param('productId') productId: number) {
    return this.likesService.countLikes(productId);
  }

  // 내가 좋아요 누른 상품들
  @Get('me')
  async myLikes(@Req() req) {
    const userId = req.user.id;
    return this.likesService.getUserLikes(userId);
  }
}
