import { loadDjangoFullSchema } from "../django-blog/schema";
import { loadDjangoPostsFixture } from "../django-blog/fixtures";
import type { AssertFn } from "./movie-scraper.test";

export function runDjangoBlogUnitTests(assert: AssertFn) {
  const fullSchema = loadDjangoFullSchema();
  assert(fullSchema.schema.modelName === "Post", "Django schema exposes Post model");
  assert(fullSchema.urlMap.routes.length > 0, "Django URL map contains routes");
  assert(fullSchema.templateMap.templates.length > 0, "Django template map contains templates");
  assert(fullSchema.provenance.mode === "snapshot", "Django artifacts declare snapshot mode");

  const fixtures = loadDjangoPostsFixture();
  assert(fixtures.total > 0, "Django fixtures contain posts");
  assert(Boolean(fixtures.posts?.[0].title), "Django fixture post has title");

  const single = loadDjangoPostsFixture("django-mvt-architecture-guide");
  assert(Boolean(single.post), "Django fixture loads post by slug");
  assert(single.post?.slug === "django-mvt-architecture-guide", "Django fixture returns requested slug");
}
