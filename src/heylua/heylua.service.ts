import { Injectable, Logger } from '@nestjs/common';
import { AI } from 'lua-cli';

export interface SendMessageParams {
  message: string;
  sessionId?: string;
}

export interface SendMessageResult {
  reply: string;
  sessionId: string;
}

@Injectable()
export class HeyluaService {
  private readonly logger = new Logger(HeyluaService.name);

  async sendMessage(params: SendMessageParams): Promise<SendMessageResult> {
    const { message, sessionId } = params;

    this.logger.debug(
      `Sending message${sessionId ? ` (session: ${sessionId})` : ' (new session)'}`,
    );

    try {
      const reply = await AI.generate(
        'You are a helpful booking assistant.', // your agent persona
        [{ type: 'text', text: message }],
      );

      const newSessionId = sessionId ?? crypto.randomUUID();

      this.logger.debug(`Received reply for session ${newSessionId}`);
      return { reply, sessionId: newSessionId };
    } catch (error) {
      this.logger.error(`Lua AI error: ${(error as Error).message}`);
      throw new Error('The AI assistant is temporarily unavailable');
    }
  }
}
