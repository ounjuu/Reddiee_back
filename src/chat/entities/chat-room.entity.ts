import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/user.entity';
import { Message } from './message.entity';

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => User, { eager: true })
  @JoinTable() // 반드시 JoinTable 필요
  users: User[];

  @OneToMany(() => Message, (msg) => msg.chatRoom)
  messages: Message[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
