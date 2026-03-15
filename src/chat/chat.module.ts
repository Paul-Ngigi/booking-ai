import { Module } from '@nestjs/common';
import { HeyluaModule } from '../heylua/heylua.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [HeyluaModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
