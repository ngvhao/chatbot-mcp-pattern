import { Body, Controller, Post } from '@nestjs/common';
import { GeminiService } from '../llm/gemini';
import { ChatService } from './chat.service';
import type { ToolExecutor } from './tool-executor';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly toolExecutor: ToolExecutor,
  ) {
    const LLMService = new GeminiService(this.toolExecutor);
    chatService = new ChatService(LLMService);
  }

  @Post()
  async chat(@Body('question') question: string) {
    const response = await this.chatService.chat(question);
    return { answer: response };
  }
}
