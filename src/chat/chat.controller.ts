import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AdminGuard } from '../common/guards/admin.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AdminGuard)
  @Get('rooms')
  findAllChatRooms() {
    return this.chatService.getAllChatRooms();
  }

  @UseGuards(JwtAuthGuard)
  @Get('messages/:roomId')
  getMessages(@Param('roomId') roomId: number) {
    return this.chatService.getMessagesByRoom(roomId);
  }

  @Delete('room/:roomId/exit')
  exitRoom(@Param('roomId') roomId: number) {
    return this.chatService.exitRoom(roomId); // 임시
  }
}
