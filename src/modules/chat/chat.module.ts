import { forwardRef, Module } from '@nestjs/common';
import { LLMModule } from '../llm/llm.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ToolExecutor } from './tool-executor';

@Module({
  imports: [forwardRef(() => LLMModule)],
  controllers: [ChatController],
  providers: [ChatService, ToolExecutor],
  exports: [ToolExecutor],
})
export class ChatModule {}
