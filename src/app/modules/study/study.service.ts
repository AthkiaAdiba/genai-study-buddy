import {
  TGenerateStudyRequest,
  TGenerateStudyResponse,
} from './study.interface';

const generateStudyResponse = async (
  payload: TGenerateStudyRequest,
): Promise<TGenerateStudyResponse> => {
  const level = payload.level ?? 'beginner';

  const result: TGenerateStudyResponse = {
    topic: payload.topic,
    level,
    explanation: `Temporary response: You asked to study "${payload.topic}" at ${level} level.`,
  };

  return result;
};

export const StudyServices = {
  generateStudyResponse,
};
