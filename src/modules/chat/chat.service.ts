import { Injectable } from '@nestjs/common';
import { tools } from 'src/shared/utils/tools';
import { LLMFactory } from '../llm/llm.factory';
@Injectable()
export class ChatService {
  constructor(private readonly llmFactory: LLMFactory) {}

  async chat(question: string, provider: 'gemini' | 'openai') {
    const llm = this.llmFactory.get(provider);
    return llm.generateResponse(question, tools);
  }
}
