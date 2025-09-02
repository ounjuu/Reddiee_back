import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';

import { Provider, Gender } from './dto/enum';
import { ChatRoom } from '../chat/entities/chat-room.entity';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  BLACKLIST = 'blacklist',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  email: string;

  @Column({ name: 'nickname', length: 20 })
  nickName: string;

  @Column({ length: 15 })
  phone: string;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ length: 255 })
  password: string;

  @Column({ name: 'refresh_token', length: 255, nullable: true })
  refreshToken: string | null;

  @Column({ type: 'enum', enum: Provider, default: Provider.Local })
  provider: Provider;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @CreateDateColumn({ type: 'datetime', precision: 6 })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime', precision: 6 })
  updated_at: Date;
  // ✅ ChatRoom 과 다대다 관계 추가
  @ManyToMany(() => ChatRoom, (room) => room.users)
  chatRooms: ChatRoom[];
}
