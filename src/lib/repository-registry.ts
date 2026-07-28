import fs from "node:fs";
import path from "node:path";
import type { RepositoryConversionStatus, RepositoryMetadata } from "@/types/repository";

const REGISTRY_PATH = "repository_registry/repositories.json";

export interface RepositoryFilters {
  query?: string;
  status?: RepositoryConversionStatus;
}

function readRegistry(): RepositoryMetadata[] {
  const filePath = path.join(process.cwd(), REGISTRY_PATH);
  if (!fs.existsSync(filePath)) return [];

  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, "utf8")) as unknown;
    return Array.isArray(parsed) ? (parsed as RepositoryMetadata[]) : [];
  } catch (error) {
    console.error(`Unable to read repository registry: ${filePath}`, error);
    return [];
  }
}

export function getRepositories(filters: RepositoryFilters = {}): RepositoryMetadata[] {
  const query = filters.query?.trim().toLowerCase();
  const statusOrder: Record<RepositoryConversionStatus, number> = {
    published: 0,
    in_progress: 1,
    planned: 2,
    excluded: 3,
  };

  return readRegistry()
    .filter((repository) => {
      if (filters.status && repository.conversionStatus !== filters.status) return false;
      if (!query) return true;

      const searchable = [
        repository.name,
        repository.fullName,
        repository.summary,
        repository.courseSlug,
        ...repository.techTags,
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    })
    .sort((a, b) => {
      const statusDifference = statusOrder[a.conversionStatus] - statusOrder[b.conversionStatus];
      if (statusDifference !== 0) return statusDifference;
      return a.name.localeCompare(b.name, "en");
    });
}

export function getRepositoryByCourseSlug(courseSlug: string): RepositoryMetadata | undefined {
  return readRegistry().find((repository) => repository.courseSlug === courseSlug);
}
