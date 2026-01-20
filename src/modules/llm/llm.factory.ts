import { Injectable } from '@nestjs/common';
import type { GeminiService } from './gemini';
import type { OpenAIService } from './openai';

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
