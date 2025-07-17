import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoom } from './entities/chat-room.entity';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepo: Repository<ChatRoom>,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async sendMessage(dto: SendMessageDto) {
    const { chatRoomId, senderId, content } = dto;
    const room = await this.chatRoomRepo.findOne({ where: { id: chatRoomId } });
    const sender = await this.userRepo.findOne({ where: { id: senderId } });

    const message = this.messageRepo.create({
      chatRoom: room,
      sender,
      content,
    });
    return this.messageRepo.save(message);
  }

  // async getAllChatRooms(): Promise<ChatRoom[]> {
  //   return this.chatRoomRepo.find({
  //     relations: ['user1', 'user2'],
  //   });
  // }
  async getAllChatRooms(): Promise<any[]> {
    const chatRooms = await this.chatRoomRepo.find({
      relations: ['user1', 'user2'],
    });

    const result = await Promise.all(
      chatRooms.map(async (room) => {
        const lastMessage = await this.messageRepo.findOne({
          where: { chatRoom: { id: room.id } },
          order: { createdAt: 'DESC' },
        });

        return {
          ...room,
          lastMessage: lastMessage?.content || null,
        };
      }),
    );

    return result;
  }

  async getMessagesByRoom(roomId: number) {
    return this.messageRepo.find({
      where: { chatRoom: { id: roomId } },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
    });
  }

  async exitRoom(roomId: number) {
    // 이 로직은 유저 ID 확인 후 user1/user2Exited 처리를 해야 합니다.
    const room = await this.chatRoomRepo.findOne({ where: { id: roomId } });
    if (!room) throw new NotFoundException('채팅방이 존재하지 않습니다.');

    // exit 처리 예시: room.user1Exited = true;
    // 둘 다 나갔는지 확인 후 삭제

    return room;
  }

  async createOrFindRoom(user1Id: number, user2Id: number) {
    const existing = await this.chatRoomRepo.findOne({
      where: [
        { user1: { id: user1Id }, user2: { id: user2Id } },
        { user1: { id: user2Id }, user2: { id: user1Id } },
      ],
    });

    if (existing) return existing;

    const user1 = await this.userRepo.findOne({ where: { id: user1Id } });
    const user2 = await this.userRepo.findOne({ where: { id: user2Id } });

    const newRoom = this.chatRoomRepo.create({ user1, user2 });
    return this.chatRoomRepo.save(newRoom);
  }
}
