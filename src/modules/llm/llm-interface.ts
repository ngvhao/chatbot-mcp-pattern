import { Array } from 'openai/internal/builtin-types';
import { LLMTool } from 'src/shared/types';

export interface LLMInterface {
  generateResponse(prompt: string, tools?: Array<LLMTool>): Promise<string>;
}
