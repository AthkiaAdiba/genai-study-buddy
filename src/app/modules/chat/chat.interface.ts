export type TChatRole = 'user' | 'assistant';

export type TChatMessage = {
  role: TChatRole;
  content: string;
};

export type TChatRequest = {
  messages: TChatMessage[];
};

export type TChatResponse = {
  message: string;
};
