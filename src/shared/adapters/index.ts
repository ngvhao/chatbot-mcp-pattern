import type { ChatCompletionTool } from 'openai/resources/chat/completions';

import type { FunctionDeclaration } from '@google/genai';
import type { LLMTool } from '../types';

export function adaptToOpenAITools(tools: LLMTool[]): ChatCompletionTool[] {
  return tools.map((tool) => ({
    type: 'function',
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.inputSchema,
    },
  }));
}

export function adaptToGeminiTools(
  tools: LLMTool[],
): { functionDeclarations: FunctionDeclaration[] }[] {
  if (!tools?.length) return [];

  return [
    {
      functionDeclarations: tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        parameters: tool.inputSchema,
      })),
    },
  ];
}
