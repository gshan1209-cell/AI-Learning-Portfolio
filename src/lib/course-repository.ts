import fs from "node:fs";
import path from "node:path";
import type {
  Course,
  CourseAssets,
  CourseDemo,
  CourseLevel,
  CourseStatus,
} from "@/types/course";

const COURSE_DIRECTORIES = ["course_chunks", "course_chunks_archive"];
const DEMO_REGISTRY_PATH = "course_demo_registry/demo_registry.json";
const COURSE_ASSET_REGISTRY_PATH = "course_asset_registry/asset_registry.json";

function isCourse(value: unknown): value is Course {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<Course>;
  return Boolean(candidate.id && candidate.slug && candidate.title && candidate.source);
}

function compareCourseChunkNames(left: string, right: string): number {
  if (left === "course_0001.json") return -1;
  if (right === "course_0001.json") return 1;
  return left.localeCompare(right);
}

function readDirectory(directory: string): Course[] {
  const absoluteDirectory = path.join(process.cwd(), directory);
  if (!fs.existsSync(absoluteDirectory)) return [];

  return fs
    .readdirSync(absoluteDirectory)
    .filter((fileName) => fileName.endsWith(".json"))
    .sort(compareCourseChunkNames)
    .flatMap((fileName) => {
      const filePath = path.join(absoluteDirectory, fileName);
      try {
        const parsed = JSON.parse(fs.readFileSync(filePath, "utf8")) as unknown;
        const records = Array.isArray(parsed) ? parsed : [parsed];
        return records.filter(isCourse);
      } catch (error) {
        console.error(`Unable to read course chunk: ${filePath}`, error);
        return [];
      }
    });
}

function readDemoRegistry(): Record<string, CourseDemo> {
  const registryPath = path.join(process.cwd(), DEMO_REGISTRY_PATH);
  if (!fs.existsSync(registryPath)) return {};

  try {
    const parsed = JSON.parse(fs.readFileSync(registryPath, "utf8")) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed as Record<string, CourseDemo>;
  } catch (error) {
    console.error(`Unable to read demo registry: ${registryPath}`, error);
    return {};
  }
}

function readAssetRegistry(): Record<string, CourseAssets> {
  const registryPath = path.join(process.cwd(), COURSE_ASSET_REGISTRY_PATH);
  if (!fs.existsSync(registryPath)) return {};

  try {
    const parsed = JSON.parse(fs.readFileSync(registryPath, "utf8")) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed as Record<string, CourseAssets>;
  } catch (error) {
    console.error(`Unable to read course asset registry: ${registryPath}`, error);
    return {};
  }
}

export interface CourseFilters {
  query?: string;
  category?: string;
  level?: CourseLevel;
  status?: CourseStatus;
}

export function getAllCourses(filters: CourseFilters = {}): Course[] {
  const courseMap = new Map<string, Course>();
  const demoRegistry = readDemoRegistry();
  const assetRegistry = readAssetRegistry();

  for (const directory of COURSE_DIRECTORIES) {
    for (const course of readDirectory(directory)) {
      courseMap.set(course.slug, {
        ...course,
        demo: demoRegistry[course.slug] ?? course.demo,
        assets: assetRegistry[course.slug] ?? course.assets,
      });
    }
  }

  const query = filters.query?.trim().toLowerCase();

  return Array.from(courseMap.values())
    .filter((course) => {
      if (filters.category && course.category !== filters.category) return false;
      if (filters.level && course.level !== filters.level) return false;
      if (filters.status && course.status !== filters.status) return false;
      if (!query) return true;

      const searchable = [
        course.title,
        course.subtitle,
        course.summary,
        course.category,
        course.source.repository,
        ...course.tags,
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    })
    .sort((a, b) => {
      if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1;
      return a.title.localeCompare(b.title, "zh-Hant");
    });
}

export function getCourseBySlug(slug: string): Course | undefined {
  return getAllCourses().find((course) => course.slug === slug);
}

export function getCourseCategories(): string[] {
  return Array.from(new Set(getAllCourses().map((course) => course.category))).sort();
}
