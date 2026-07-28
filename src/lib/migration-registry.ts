import fs from "node:fs";
import path from "node:path";
import { getRepositories } from "@/lib/repository-registry";
import type { MigrationRecord, MigrationStatus, MigrationWithRepository } from "@/types/migration";

const MIGRATION_REGISTRY_PATH = "migration_registry/migrations.json";

export interface MigrationFilters {
  query?: string;
  status?: MigrationStatus;
}

function readMigrationRegistry(): MigrationRecord[] {
  const filePath = path.join(process.cwd(), MIGRATION_REGISTRY_PATH);
  if (!fs.existsSync(filePath)) return [];

  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, "utf8")) as unknown;
    return Array.isArray(parsed) ? (parsed as MigrationRecord[]) : [];
  } catch (error) {
    console.error(`Unable to read migration registry: ${filePath}`, error);
    return [];
  }
}

export function getMigrations(filters: MigrationFilters = {}): MigrationWithRepository[] {
  const repositoryMap = new Map(
    getRepositories().map((repository) => [repository.fullName, repository]),
  );
  const query = filters.query?.trim().toLowerCase();
  const statusOrder: Record<MigrationStatus, number> = {
    importing: 0,
    refactoring: 1,
    verifying: 2,
    inventory: 3,
    planned: 4,
    blocked: 5,
    ready_to_retire: 6,
    retired: 7,
  };

  return readMigrationRegistry()
    .map((migration) => ({
      ...migration,
      repository: repositoryMap.get(migration.sourceRepository),
    }))
    .filter((migration) => {
      if (filters.status && migration.status !== filters.status) return false;
      if (!query) return true;

      const searchable = [
        migration.sourceRepository,
        migration.courseSlug,
        migration.modulePath,
        migration.sourceRuntime,
        migration.notes || "",
        migration.repository?.summary || "",
        ...(migration.repository?.techTags || []),
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    })
    .sort((a, b) => {
      const statusDifference = statusOrder[a.status] - statusOrder[b.status];
      if (statusDifference !== 0) return statusDifference;
      return a.sourceRepository.localeCompare(b.sourceRepository, "en");
    });
}

export function getMigrationByRepository(sourceRepository: string): MigrationWithRepository | undefined {
  return getMigrations().find((migration) => migration.sourceRepository === sourceRepository);
}

export function getMigrationCounts(): Record<MigrationStatus, number> {
  const counts: Record<MigrationStatus, number> = {
    planned: 0,
    inventory: 0,
    importing: 0,
    refactoring: 0,
    verifying: 0,
    ready_to_retire: 0,
    retired: 0,
    blocked: 0,
  };

  for (const migration of getMigrations()) counts[migration.status] += 1;
  return counts;
}
