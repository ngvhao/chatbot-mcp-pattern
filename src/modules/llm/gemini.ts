import { GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';
import { adaptToGeminiTools } from 'src/shared/adapters';
import { LLMTool } from 'src/shared/types';
import instruction from 'src/shared/utils/instruction';
import { ToolExecutor } from '../chat/tool-executor';
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
        systemInstruction: instruction.decisionInstruction,
      },
    });

    const candidate = decision.candidates?.[0];
    const part = candidate?.content?.parts?.find((p) => 'functionCall' in p);
    console.log('Decision candidate:', candidate);

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

    console.log('Tool result:', toolResult);
    console.log('prompt:', prompt);
    console.log('part:', part);

    const finalResponse = await this.gemini.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
        {
          role: 'model',
          parts: [part],
        },
        {
          role: 'model',
          parts: [
            {
              functionResponse: {
                name: part.functionCall.name,
                response: toolResult,
              },
            },
          ],
        },
      ],
      config: {
        systemInstruction: instruction.responseInstruction,
      },
    });
    console.log('Final response:', finalResponse);

    return (
      finalResponse.candidates?.[0]?.content?.parts
        ?.map((p) => ('text' in p ? p.text : ''))
        .join('') ?? ''
    );
  }
}
