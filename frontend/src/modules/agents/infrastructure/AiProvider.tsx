import { createAI } from 'ai/rsc';
import { ReactNode } from 'react';
import { submitUserMessage } from './AiActions';

// Define the state of the AI
export type AIState = {
  chatId: string;
  messages: Array<{
    id: number;
    role: 'user' | 'assistant';
    content: string;
  }>;
};

export type UIState = Array<{
  id: number;
  display: ReactNode;
}>;

// Create the AI Provider
export const AI = createAI({
  actions: {
    submitUserMessage,
  },
  initialUIState: [] as UIState,
  initialAIState: { chatId: 'new', messages: [] } as AIState,
});
