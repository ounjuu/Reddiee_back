import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoom } from './entities/chat-room.entity';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { SendMessageDto } from './dto/send-message.dto';
import { In } from 'typeorm';

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
      relations: ['messages', 'messages.sender'], // sender 포함
      order: { createdAt: 'DESC' },
    });

    return chatRooms.map((room) => {
      const lastMsg = room.messages?.[room.messages.length - 1];
      return {
        ...room,
        lastMessage: lastMsg?.content || null,
        lastSenderNick: lastMsg?.sender?.nickName || null, // 마지막 메시지 보낸 사람 닉네임
      };
    });
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

  async createOrFindRoom(userIds: number[]) {
    const users = await this.userRepo.find({
      where: { id: In(userIds) },
    });

    const existing = await this.chatRoomRepo
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.users', 'user')
      .where('user.id IN (:...userIds)', { userIds })
      .getOne();

    if (existing) return existing;

    const newRoom = this.chatRoomRepo.create({ users });
    return this.chatRoomRepo.save(newRoom);
  }
}
