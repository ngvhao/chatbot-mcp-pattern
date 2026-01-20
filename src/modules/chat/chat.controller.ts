import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async chat(
    @Body('question') question: string,
    @Body('provider') provider: 'gemini' | 'openai',
  ) {
    const response = await this.chatService.chat(question, provider);
    return { answer: response };
  }
}
