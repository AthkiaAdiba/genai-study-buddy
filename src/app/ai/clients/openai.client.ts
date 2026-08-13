import OpenAI from 'openai';

const createOpenAIClient = (apiKey: string) => {
  return new OpenAI({
    apiKey,
  });
};

export default createOpenAIClient;
