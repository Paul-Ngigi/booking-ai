import { registerAs } from '@nestjs/config';

export interface HeyluaConfig {
  agentId: string;
  apiKey: string;
  baseUrl: string;
}

export const heyluaConfig = registerAs(
  'heylua',
  (): HeyluaConfig => ({
    agentId: process.env.HEYLUA_AGENT_ID ?? '',
    apiKey: process.env.HEYLUA_API_KEY ?? '',
    baseUrl: process.env.HEYLUA_BASE_URL ?? 'https://api.heylua.ai',
  }),
);
