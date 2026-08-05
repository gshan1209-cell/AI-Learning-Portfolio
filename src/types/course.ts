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

export interface CourseAssetLink {
  fileId: string;
  name: string;
  url: string;
  mimeType: string;
}

export interface CourseAssets {
  driveFolderUrl: string;
  summaryCard: CourseAssetLink;
  presentation: CourseAssetLink;
  notebookLmPrompt: CourseAssetLink;
  videoDesign: CourseAssetLink;
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
  assets?: CourseAssets;
  sections: CourseSection[];
  quiz?: CourseQuiz;
  updatedAt: string;
}
