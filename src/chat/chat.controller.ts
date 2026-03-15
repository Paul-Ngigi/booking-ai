import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRequestDto } from './chat-request.dto';
import { ChatResponseDto } from './chat-response.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async chat(@Body() dto: ChatRequestDto): Promise<ChatResponseDto> {
    return this.chatService.chat(dto);
  }
}
