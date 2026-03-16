import { registerAs } from '@nestjs/config';

export interface HeyluaConfig {
  agentId: string;
  apiKey: string;
  baseUrl: string;
}

export const heyluaConfig = registerAs(
  'heylua',
  (): HeyluaConfig => ({
    agentId: process.env.HEYLUA_AGENT_ID ?? 'baseAgent_agent_1773589447623_z7arc3k6k',
    apiKey: process.env.HEYLUA_API_KEY ?? 'api_1260e3ab08de4db9bba0a63c2a275bd6',
    baseUrl: process.env.HEYLUA_BASE_URL ?? 'https://api.heylua.ai',
  }),
);
