import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { ChatRoom } from './chat-room.entity';
import { User } from '../../users/user.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ChatRoom, (room) => room.messages, { onDelete: 'CASCADE' })
  chatRoom: ChatRoom;

  @ManyToOne(() => User)
  sender: User;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
