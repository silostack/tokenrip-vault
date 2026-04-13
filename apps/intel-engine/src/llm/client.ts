import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';

export interface LLMClient {
  complete<T>(params: {
    system: string;
    user: string;
    schema: z.ZodType<T>;
    maxTokens?: number;
  }): Promise<T>;
}

function stripJsonFencing(text: string): string {
  const fenced = text.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
  return fenced ? fenced[1].trim() : text.trim();
}

export function createLLMClient(apiKey: string, model: string): LLMClient {
  const client = new Anthropic({ apiKey });

  return {
    async complete<T>(params: {
      system: string;
      user: string;
      schema: z.ZodType<T>;
      maxTokens?: number;
    }): Promise<T> {
      const response = await client.messages.create({
        model,
        max_tokens: params.maxTokens ?? 4096,
        system: params.system,
        messages: [{ role: 'user', content: params.user }],
      });

      const text =
        response.content[0].type === 'text' ? response.content[0].text : '';

      const cleaned = stripJsonFencing(text);
      const parsed = JSON.parse(cleaned);
      return params.schema.parse(parsed);
    },
  };
}
