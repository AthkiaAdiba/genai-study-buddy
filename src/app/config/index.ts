import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(process.cwd(), '.env'),
});

export default {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  openaiApiKey: process.env.OPENAI_API_KEY,
  openRouterApiKey: process.env.OPENROUTER_API_KEY,
};
