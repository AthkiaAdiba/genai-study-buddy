import {
  TGenerateStudyRequest,
  TGenerateStudyResponse,
} from './study.interface';
import openRouterClient from '../../ai/clients/openRouter.client';

const generateStudyResponse = async (
  payload: TGenerateStudyRequest,
): Promise<TGenerateStudyResponse> => {
  const level = payload.level ?? 'beginner';

  const prompt = `
  You are a helpful study tutor.

  Explain the following topic to a ${level} learner.

  Topic: ${payload.topic}

  Use clear language and include one practical example.

  Return only the final explanation.
  Do not include your planning, analysis, or reasoning process.
  `;

  const explanationResponse = await openRouterClient.responses.create({
    model: 'poolside/laguna-xs-2.1:free',
    input: prompt,
    reasoning: {
      effort: 'low',
    },
    temperature: 0.2,
    max_output_tokens: 1000,
  });

  if (explanationResponse.status !== 'completed') {
    throw new Error('Failed to generate the study explanation.');
  }

  const explanation = explanationResponse.output_text;

  const quizPrompt = `
    Based on the following study explanation, create 3 short quiz questions.

    Explanation: ${explanation}

    Return only the quiz questions.
  `;

  const quizResponse = await openRouterClient.responses.create({
    model: 'poolside/laguna-xs-2.1:free',
    input: quizPrompt,
    reasoning: {
      effort: 'low',
    },
    temperature: 0.2,
    max_output_tokens: 500,
  });

  if (quizResponse.status !== 'completed') {
    throw new Error('Failed to generate the study quiz.');
  }

  const quiz = quizResponse.output_text;

  // console.dir(response, { depth: null });

  // const result: TGenerateStudyResponse = {
  //   topic: payload.topic,
  //   level,
  //   explanation: response.output_text,
  // };

  // return result;

  return {
    topic: payload.topic,
    level,
    explanation,
    quiz,
  };
};

export const StudyServices = {
  generateStudyResponse,
};
