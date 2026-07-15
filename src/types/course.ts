export type CourseStatus = "published" | "draft" | "planned";
export type CourseLevel = "beginner" | "intermediate" | "advanced";

export interface CourseSource {
  repository: string;
  repositoryUrl: string;
  demoUrl?: string;
  originalPath?: string;
}

export interface CourseSection {
  id: string;
  title: string;
  summary: string;
  bullets?: string[];
  code?: string;
}

export interface CourseQuiz {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  category: string;
  level: CourseLevel;
  durationMinutes: number;
  status: CourseStatus;
  featured?: boolean;
  tags: string[];
  learningObjectives: string[];
  source: CourseSource;
  sections: CourseSection[];
  quiz?: CourseQuiz;
  updatedAt: string;
}
