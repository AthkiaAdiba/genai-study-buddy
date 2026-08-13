import OpenAI from 'openai';
import config from '../../config';

if (!config.openRouterApiKey) {
  throw new Error('OPENROUTER_API_KEY is not configured');
}

const openRouterClient = new OpenAI({
  apiKey: config.openRouterApiKey,
  baseURL: 'https://openrouter.ai/api/v1',
});

export default openRouterClient;
