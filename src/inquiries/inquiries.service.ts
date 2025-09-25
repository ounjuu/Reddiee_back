import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inquiry } from './inquiry.entity';
import { User } from '../users/user.entity';

@Injectable()
export class InquiriesService {
  constructor(
    @InjectRepository(Inquiry)
    private readonly inquiryRepo: Repository<Inquiry>,
  ) {}

  async createInquiry(
    name: string,
    email: string,
    category: string,
    message: string,
    user: User,
  ): Promise<Inquiry> {
    const inquiry = this.inquiryRepo.create({
      name,
      email,
      category,
      message,
      user,
    });
    return this.inquiryRepo.save(inquiry);
  }

  async getAllInquiries(): Promise<Inquiry[]> {
    return this.inquiryRepo.find({
      order: { created_at: 'DESC' },
    });
  }

  // 문의글 완료
  async updateStatus(id: number, status: 'pending' | 'done'): Promise<Inquiry> {
    const inquiry = await this.inquiryRepo.findOne({ where: { id } });
    if (!inquiry) {
      throw new NotFoundException(`Inquiry with id ${id} not found`);
    }

    inquiry.status = status;
    return this.inquiryRepo.save(inquiry);
  }

  // 문의글 삭제
  async deleteInquiry(id: number): Promise<{ message: string }> {
    const inquiry = await this.inquiryRepo.findOne({ where: { id } });
    if (!inquiry) {
      throw new NotFoundException(`Inquiry with id ${id} not found`);
    }

    await this.inquiryRepo.remove(inquiry);
    return { message: '문의글이 삭제되었습니다.' };
  }
}
