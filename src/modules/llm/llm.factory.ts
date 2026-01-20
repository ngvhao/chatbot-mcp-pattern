import { Injectable } from '@nestjs/common';
import { GeminiService } from './gemini';
import { OpenAIService } from './openai';

@Injectable()
export class LLMFactory {
  constructor(
    private readonly gemini: GeminiService,
    private readonly openai: OpenAIService,
  ) {}

  get(provider: 'gemini' | 'openai') {
    return provider === 'gemini' ? this.gemini : this.openai;
  }
}
