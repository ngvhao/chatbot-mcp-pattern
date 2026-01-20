import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { adaptToOpenAITools } from 'src/shared/adapters';
import { LLMTool } from 'src/shared/types';
import { ToolExecutor } from '../chat/tool-executor';
import { LLMInterface } from '../llm/llm-interface';

@Injectable()
export class OpenAIService implements LLMInterface {
  private readonly openai: OpenAI;
  constructor(private readonly toolExecutor: ToolExecutor) {
    this.openai = new OpenAI({
      apiKey: process.env['OPENAI_API_KEY'],
    });
  }
  async generateResponse(
    prompt: string,
    tools?: Array<LLMTool>,
  ): Promise<string> {
    const decision = await this.openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: 'Bạn là trợ lý sinh viên. Chỉ dùng tool khi cần dữ liệu.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      tools: tools && adaptToOpenAITools(tools),
      tool_choice: 'auto',
    });
    const message = decision.choices[0].message;

    if (!message.tool_calls) {
      return message.content;
    }

    const toolMessages = [];
    for (const call of message.tool_calls) {
      if (call.type == 'function') {
        let fnArgs: Record<string, unknown> = {};
        if (typeof call.function.arguments === 'string') {
          try {
            fnArgs = JSON.parse(call.function.arguments);
          } catch {
            fnArgs = {};
          }
        } else if (
          call.function.arguments &&
          typeof call.function.arguments === 'object'
        ) {
          fnArgs = call.function.arguments as Record<string, unknown>;
        }

        const result = await this.toolExecutor.execute(call.function.name, {
          ...fnArgs,
        });

        toolMessages.push({
          role: 'tool',
          tool_name: call.function.name,
          content: JSON.stringify(result),
        });
      }
    }

    const final = await this.openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [decision.choices[0].message.content, ...toolMessages],
    });

    return final.choices[0].message.content;
  }
}
