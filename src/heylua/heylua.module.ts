import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { heyluaConfig } from './heylua.config';
import { HeyluaService } from './heylua.service';

@Module({
  imports: [ConfigModule.forFeature(heyluaConfig)],
  providers: [HeyluaService],
  exports: [HeyluaService],
})
export class HeyluaModule {}
