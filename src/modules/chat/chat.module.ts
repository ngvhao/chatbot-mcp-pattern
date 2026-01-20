import { Module } from '@nestjs/common';
import { LLMModule } from '../llm/llm.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [LLMModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
