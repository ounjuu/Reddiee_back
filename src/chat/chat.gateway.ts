import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { ChatRoom } from './entities/chat-room.entity'; // 정확한 경로로 수정
import { User } from '../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000', // Next.js 주소
    credentials: true,
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private server: Server;

  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepo: Repository<ChatRoom>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly chatService: ChatService,
  ) {}

  afterInit(server: Server) {
    this.server = server;
    console.log('✅ WebSocket Initialized');
  }

  handleConnection(client: Socket) {
    console.log(`📡 Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ Client disconnected: ${client.id}`);
  }
  @SubscribeMessage('createChatRoom')
  async createChatRoom(
    @MessageBody() dto: CreateRoomDto,
    @ConnectedSocket() client: Socket,
  ): Promise<number> {
    const { userIds } = dto;

    if (!userIds || userIds.length < 2) {
      throw new Error('최소 2명 이상의 유저가 필요합니다.');
    }

    // 유저 목록 불러오기
    const users = await this.userRepo.findByIds(userIds);
    if (users.length !== userIds.length) {
      throw new Error('일부 유저를 찾을 수 없습니다.');
    }

    // 기존 방이 있는지 확인 (모든 유저가 정확히 포함된 방)
    const existingRoom = await this.chatRoomRepo
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.users', 'user')
      .where('user.id IN (:...ids)', { ids: userIds })
      .groupBy('room.id')
      .having('COUNT(DISTINCT user.id) = :count', { count: userIds.length })
      .getOne();

    if (existingRoom) {
      client.emit('chatRoomCreated', existingRoom.id);
      return existingRoom.id;
    }

    // 새로운 채팅방 생성
    const chatRoom = this.chatRoomRepo.create({ users });
    await this.chatRoomRepo.save(chatRoom);

    client.emit('chatRoomCreated', chatRoom.id);
    return chatRoom.id;
  }

  /**
   * 클라이언트가 보낸 메시지를 저장하고, 전체에 전송
   */
  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody()
    data: { chatRoomId: number; senderId: number; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { chatRoomId, senderId, message } = data;

    // 메시지 저장 로직
    const savedMessage = await this.chatService.sendMessage({
      chatRoomId,
      senderId,
      content: message,
    });

    // 모든 클라이언트에게 메시지 전송
    this.server.emit('message', savedMessage);

    return savedMessage;
  }
}
