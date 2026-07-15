import type { RepositoryMetadata } from "@/types/repository";

export type MigrationStatus =
  | "planned"
  | "inventory"
  | "importing"
  | "refactoring"
  | "verifying"
  | "ready_to_retire"
  | "retired"
  | "blocked";

export interface MigrationRecord {
  sourceRepository: string;
  sourceBranch: string;
  courseSlug: string;
  modulePath: string;
  status: MigrationStatus;
  targetDemoMode: "native" | "video" | "snapshot" | "iframe" | "external";
  sourceRuntime: string;
  retirementPolicy: "archive-after-verification";
  retirementReady: boolean;
  sourceReadmeRedirected: boolean;
  legacyDeploymentRetired: boolean;
  notes?: string;
}

export interface MigrationWithRepository extends MigrationRecord {
  repository?: RepositoryMetadata;
}
