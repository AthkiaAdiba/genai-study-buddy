export type TStudentLevel = 'beginner' | 'intermediate' | 'advanced';

export type TGenerateStudyRequest = {
  topic: string;
  level?: TStudentLevel;
};

export type TGenerateStudyResponse = {
  topic: string;
  level: TStudentLevel;
  explanation: string;
  quiz: string;
};
