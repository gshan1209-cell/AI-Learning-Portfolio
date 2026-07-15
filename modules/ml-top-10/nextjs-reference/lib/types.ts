export type Algorithm = {
  id: number;
  slug: string;
  name_zh: string;
  name_en: string;
  category: string;
  difficulty: string;
  one_liner: string;
  analogy?: string;
  description?: string;
  how_it_works?: string[];
  use_cases?: string[];
  pros?: string[];
  cons?: string[];
  common_mistakes?: string[];
  visual_type?: string;
  quiz?: QuizQuestion[];
};

export type QuizQuestion = {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

export type DisplayAlgorithm = Algorithm & {
  displayName: string;
  displayCategory: string;
  displayDifficulty: string;
  summary: string;
  cleanDescription: string;
  cleanAnalogy: string;
  cleanHowItWorks: string[];
  cleanUseCases: string[];
  cleanPros: string[];
  cleanCons: string[];
  cleanMistakes: string[];
};
