import {
  BadGatewayException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import axios, { AxiosInstance, AxiosError } from 'axios';
import { heyluaConfig } from './heylua.config';

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
  private readonly http: AxiosInstance;

  constructor(
    @Inject(heyluaConfig.KEY)
    private readonly config: ConfigType<typeof heyluaConfig>,
  ) {
    this.http = axios.create({
      baseURL: this.config.baseUrl,
      timeout: 30_000,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`,
      },
    });
  }

  async sendMessage(params: SendMessageParams): Promise<SendMessageResult> {
    const { message, sessionId } = params;

    this.logger.debug(
      `Sending message to agent ${this.config.agentId}` +
        (sessionId ? ` (session: ${sessionId})` : ' (new session)'),
    );

    try {
      const { data } = await this.http.post<SendMessageResult>(
        `/v1/agents/${this.config.agentId}/chat`,
        { message, sessionId },
      );

      this.logger.debug(`Received reply for session ${data.sessionId}`);
      return data;
    } catch (error) {
      throw this.mapError(error as AxiosError);
    }
  }

  private mapError(error: AxiosError): BadGatewayException {
    const upstream = error.response?.data as
      | Record<string, unknown>
      | undefined;
    const detail =
      (upstream?.message as string) ??
      (upstream?.error as string) ??
      error.message ??
      'Unknown upstream error';

    this.logger.error(
      `HeyLua API error [${error.response?.status ?? 'network'}]: ${detail}`,
    );

    return new BadGatewayException(
      `The AI assistant is temporarily unavailable: ${detail}`,
    );
  }
}
