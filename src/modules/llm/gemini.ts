import { GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';
import { adaptToGeminiTools } from 'src/shared/adapters';
import type { LLMTool } from 'src/shared/types';
import type { ToolExecutor } from '../chat/tool-executor';
import { LLMInterface } from '../llm/llm-interface';

@Injectable()
export class GeminiService implements LLMInterface {
  private readonly gemini: GoogleGenAI;

  constructor(private readonly toolExecutor: ToolExecutor) {
    this.gemini = new GoogleGenAI({
      apiKey: process.env['GEMINI_API_KEY'],
    });
  }

  async generateResponse(prompt: string, tools?: LLMTool[]): Promise<string> {
    const decision = await this.gemini.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      config: {
        tools: tools && adaptToGeminiTools(tools),
      },
    });

    const candidate = decision.candidates?.[0];
    const part = candidate?.content?.parts?.find((p) => 'functionCall' in p);

    if (!part || !('functionCall' in part)) {
      return (
        candidate?.content?.parts
          ?.map((p) => ('text' in p ? p.text : ''))
          .join('') ?? ''
      );
    }

    const functionCall = part.functionCall;

    const toolResult = await this.toolExecutor.execute(
      functionCall.name,
      functionCall.args ?? {},
    );

    const finalResponse = await this.gemini.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
        {
          role: 'model',
          parts: [part, { text: toolResult }],
        },
      ],
    });

    return (
      finalResponse.candidates?.[0]?.content?.parts
        ?.map((p) => ('text' in p ? p.text : ''))
        .join('') ?? ''
    );
  }
}
