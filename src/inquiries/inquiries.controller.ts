import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { InquiriesService } from './inquiries.service';
import { Inquiry } from './inquiry.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';

@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  // 로그인한 유저만 문의 작성 가능
  @UseGuards(JwtAuthGuard)
  @Post()
  async createInquiry(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('category') category: string,
    @Body('message') message: string,
    @Req() req: any, // req.user 접근
  ) {
    const user = req.user; // JwtStrategy validate() 리턴값
    console.log(user.id, user.email);

    return this.inquiriesService.createInquiry(
      name,
      email,
      category,
      message,
      user,
    );
  }

  // 관리자만 전체 문의 조회 가능
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  async getAllInquiries(): Promise<Inquiry[]> {
    return this.inquiriesService.getAllInquiries();
  }

  // 관리자만 상태 변경 가능
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id/done')
  async markDone(@Param('id') id: number) {
    return this.inquiriesService.updateStatus(id, 'done');
  }

  // 관리자만 삭제 가능
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  async deleteInquiry(@Param('id') id: number) {
    return this.inquiriesService.deleteInquiry(id);
  }
}
