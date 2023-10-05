import OpenAI from 'openai';

let openAIInstance: OpenAI | null = null;
export const getOpenAIInstance = () => {
  if (openAIInstance) return openAIInstance;

  openAIInstance = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!
  });

  return openAIInstance;
};

export const prompts = {
  chatMessages: [
    {
      role: 'system',
      content: 'Use the following pieces of context (or previous conversation if needed) to answer the users question in markdown format.'
    },
    {
      role: 'user',
      content: `Use the following pieces of context (or previous conversation if needed) to answer the users question in markdown format. \n` + `If you don't know the answer, just say that you don't know, don't try to make up an answer.\n` + `\n----------------\n\n` + `PREVIOUS CONVERSATION:\n` + `XXX-PREVIOUS-CONVERSATION-XXX\n` + `\n----------------\n\n` + `CONTEXT:\n` + `XXX-CONTEXT-XXX\n\n` + `USER INPUT: XXX-MESSAGE-XXX\n`
    }
  ]
};
