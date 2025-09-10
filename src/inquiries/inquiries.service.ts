import { Injectable } from '@nestjs/common';
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
}
