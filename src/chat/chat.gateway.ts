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
  /** 채팅방 생성 */
  @SubscribeMessage('createChatRoom')
  async createChatRoom(
    @MessageBody() data: { userIds: number[] },
    @ConnectedSocket() client: Socket,
  ): Promise<number> {
    const { userIds } = data;

    if (!userIds || userIds.length < 2) {
      throw new Error('최소 2명 이상의 유저가 필요합니다.');
    }

    // 유저 조회
    const users = await this.userRepo.findByIds(userIds);
    if (users.length !== userIds.length) {
      throw new Error('일부 유저를 찾을 수 없습니다.');
    }

    // 이미 존재하는 방 확인 (정확히 같은 유저 포함)
    const rooms = await this.chatRoomRepo.find({ relations: ['users'] });

    const existingRoom = rooms.find((room) => {
      const roomUserIds = room.users
        .map((u) => u.id)
        .sort()
        .join(',');
      const targetIds = userIds.slice().sort().join(',');
      return roomUserIds === targetIds;
    });

    if (existingRoom) {
      client.emit('chatRoomCreated', existingRoom.id);
      return existingRoom.id;
    }

    // 새 채팅방 생성
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
    data: { chatRoomId: number; senderId: number; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { chatRoomId, senderId, content } = data; // content로 추출

    const savedMessage = await this.chatService.sendMessage({
      chatRoomId,
      senderId,
      content,
    });

    // 모든 클라이언트에게 메시지 전송
    this.server.emit('message', savedMessage);

    return savedMessage;
  }
}
