export interface MlQuizQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface MlAlgorithm {
  id: number;
  slug: string;
  name_zh: string;
  name_en: string;
  category: string;
  difficulty: string;
  one_liner: string;
  analogy: string;
  description: string;
  how_it_works: string[];
  use_cases: string[];
  pros: string[];
  cons: string[];
  common_mistakes: string[];
  visual_type: string;
  editorial_note?: string;
  quiz: MlQuizQuestion[];
}

export interface MlAlgorithmQuery {
  query?: string;
  category?: string;
  difficulty?: string;
}
