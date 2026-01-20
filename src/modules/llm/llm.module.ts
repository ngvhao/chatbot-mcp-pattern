import { forwardRef, Module } from '@nestjs/common';
import { ChatModule } from '../chat/chat.module';
import { ToolExecutor } from '../chat/tool-executor';
import { GeminiService } from './gemini';
import { LLMFactory } from './llm.factory';
import { OpenAIService } from './openai';

@Module({
  imports: [forwardRef(() => ChatModule)],
  providers: [GeminiService, OpenAIService, ToolExecutor, LLMFactory],
  exports: [GeminiService, OpenAIService, LLMFactory],
})
export class LLMModule {}
