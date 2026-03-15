import { Injectable } from '@nestjs/common';
import { HeyluaService } from '../heylua/heylua.service';
import { ChatRequestDto } from './chat-request.dto';
import { ChatResponseDto } from './chat-response.dto';

@Injectable()
export class ChatService {
  constructor(private readonly heyluaService: HeyluaService) {}

  async chat(dto: ChatRequestDto): Promise<ChatResponseDto> {
    const { reply, sessionId } = await this.heyluaService.sendMessage({
      message: dto.message,
      sessionId: dto.sessionId,
    });

    return {
      reply,
      sessionId,
      timestamp: new Date().toISOString(),
    };
  }
}
