import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/user.entity';
import { Message } from './message.entity';

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user1: User;

  @ManyToOne(() => User)
  user2: User;

  @Column({ default: false })
  user1Exited: boolean;

  @Column({ default: false })
  user2Exited: boolean;

  @OneToMany(() => Message, (msg) => msg.chatRoom)
  messages: Message[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
