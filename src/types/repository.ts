export type RepositoryVisibility = "public" | "private";
export type RepositoryConversionStatus = "published" | "in_progress" | "planned" | "excluded";

export interface RepositoryMetadata {
  id: string;
  name: string;
  fullName: string;
  url: string;
  defaultBranch: string;
  visibility: RepositoryVisibility;
  archived: boolean;
  sizeKb: number;
  courseSlug: string;
  conversionStatus: RepositoryConversionStatus;
  demoUrl?: string;
  summary: string;
  techTags: string[];
  lastSyncedAt: string;
  syncSource: "github_connector" | "manual" | "github_api";
}
