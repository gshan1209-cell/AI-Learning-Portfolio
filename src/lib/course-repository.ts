import fs from "node:fs";
import path from "node:path";
import type { Course, CourseLevel, CourseStatus } from "@/types/course";

const COURSE_DIRECTORIES = ["course_chunks", "course_chunks_archive"];

function isCourse(value: unknown): value is Course {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<Course>;
  return Boolean(candidate.id && candidate.slug && candidate.title && candidate.source);
}

function readDirectory(directory: string): Course[] {
  const absoluteDirectory = path.join(process.cwd(), directory);
  if (!fs.existsSync(absoluteDirectory)) return [];

  return fs
    .readdirSync(absoluteDirectory)
    .filter((fileName) => fileName.endsWith(".json"))
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

export interface CourseFilters {
  query?: string;
  category?: string;
  level?: CourseLevel;
  status?: CourseStatus;
}

export function getAllCourses(filters: CourseFilters = {}): Course[] {
  const courseMap = new Map<string, Course>();

  for (const directory of COURSE_DIRECTORIES) {
    for (const course of readDirectory(directory)) {
      courseMap.set(course.slug, course);
    }
  }

  const query = filters.query?.trim().toLowerCase();

  return [...courseMap.values()]
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
  return [...new Set(getAllCourses().map((course) => course.category))].sort();
}
