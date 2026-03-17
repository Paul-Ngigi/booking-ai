import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HeyluaConfig } from './heylua.config';

export interface SendMessageParams {
  message: string;
  sessionId?: string;
}

export interface SendMessageResult {
  reply: string;
  sessionId: string;
}

interface HeyluaMessage {
  type: 'text';
  text: string;
}

interface HeyluaRequestBody {
  messages: HeyluaMessage[];
  runtimeContext?: string;
}

interface HeyluaSuccessResponse {
  text: string;
  toolCalls: unknown[];
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

interface HeyluaErrorResponse {
  type: 'error';
  message: string;
  statusCode: number;
}

@Injectable()
export class HeyluaService {
  private readonly logger = new Logger(HeyluaService.name);
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly agentId: string;

  constructor(private readonly configService: ConfigService) {
    const config = this.configService.get<HeyluaConfig>('heylua')!;
    this.baseUrl = config.baseUrl;
    this.apiKey = config.apiKey;
    this.agentId = config.agentId;
  }

  async sendMessage(params: SendMessageParams): Promise<SendMessageResult> {
    const { message, sessionId } = params;
    const resolvedSessionId = sessionId ?? crypto.randomUUID();

    this.logger.debug(`Sending message (session: ${resolvedSessionId})`);

    const body: HeyluaRequestBody = {
      messages: [{ type: 'text', text: message }],
      // Pass sessionId as runtime context so the agent maintains conversation memory
      runtimeContext: `Session ID: ${resolvedSessionId}`,
    };

    const response = await fetch(
      `${this.baseUrl}/chat/generate/${this.agentId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      const error = (await response.json()) as HeyluaErrorResponse;
      this.logger.error(
        `Heylua API error [${error.statusCode}]: ${error.message}`,
      );
      throw new Error('The AI assistant is temporarily unavailable');
    }

    const result = (await response.json()) as HeyluaSuccessResponse;

    this.logger.debug(
      `Received reply for session ${resolvedSessionId} ` +
        `(tokens used: ${result.usage.totalTokens})`,
    );

    return {
      reply: result.text,
      sessionId: resolvedSessionId,
    };
  }
}
