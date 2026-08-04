export type CourseStatus = "published" | "draft" | "planned";
export type CourseLevel = "beginner" | "intermediate" | "advanced";
export type DemoMode = "external" | "iframe" | "video" | "snapshot" | "native";

export interface CourseSource {
  repository: string;
  repositoryUrl: string;
  demoUrl?: string;
  originalPath?: string;
}

export interface CourseDemo {
  mode: DemoMode;
  title?: string;
  description?: string;
  url?: string;
  fallbackUrl?: string;
  posterUrl?: string;
  nativeKey?: string;
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
  coverImage?: string;
  tags: string[];
  learningObjectives: string[];
  source: CourseSource;
  demo?: CourseDemo;
  sections: CourseSection[];
  quiz?: CourseQuiz;
  updatedAt: string;
}
