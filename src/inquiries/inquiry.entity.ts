import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity'; // 상대 경로 확인

@Entity('inquiries')
export class Inquiry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 50 })
  email: string;

  @Column({ length: 50 })
  category: string; // 상품/주문/결제/배송/교환/회원/기타

  @Column('text')
  message: string;

  // ManyToOne 관계 (Inquiry : User = N : 1)
  @ManyToOne(() => User, { eager: true }) // User 엔티티에 역참조 필드 필요 없음
  user: User;

  @CreateDateColumn({ type: 'datetime', precision: 6 })
  created_at: Date;
}
