import { Module } from '@nestjs/common';
import { ToolExecutor } from '../chat/tool-executor';
import { GeminiService } from './gemini';
import { OpenAIService } from './openai';

@Module({
  providers: [GeminiService, OpenAIService, ToolExecutor],
})
export class LLMModule {}
