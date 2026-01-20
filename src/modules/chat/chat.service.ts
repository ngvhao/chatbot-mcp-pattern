import { Injectable } from '@nestjs/common';
import { tools } from 'src/shared/utils/tools';
import type { LLMInterface } from '../llm/llm-interface';
@Injectable()
export class ChatService {
  constructor(private readonly LLMService: LLMInterface) {}

  async chat(question: string) {
    const response = await this.LLMService.generateResponse(question, tools);
    return response;
  }
}
