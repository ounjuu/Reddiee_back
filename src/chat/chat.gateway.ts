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

  constructor(private readonly chatService: ChatService) {}

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

  /**
   * 클라이언트가 보낸 메시지를 저장하고, 전체에 전송
   */
  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody()
    data: {
      chatRoomId: number;
      senderId: number;
      message: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const { chatRoomId, senderId, message } = data;

    const savedMessage = await this.chatService.sendMessage({
      chatRoomId,
      senderId,
      content: message,
    });

    // 모든 클라이언트에게 전송
    this.server.emit('message', savedMessage);

    return savedMessage;
  }
}
