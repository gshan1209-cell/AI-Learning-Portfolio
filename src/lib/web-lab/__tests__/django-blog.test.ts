import { loadDjangoFullSchema } from "../django-blog/schema";
import { loadDjangoPostsFixture } from "../django-blog/fixtures";

describe("Django Blog Native Artifact Unit Tests", () => {
  test("loadDjangoFullSchema loads exported schema and url maps correctly", () => {
    const fullSchema = loadDjangoFullSchema();
    expect(fullSchema.schema.modelName).toBe("Post");
    expect(fullSchema.urlMap.routes.length).toBeGreaterThan(0);
    expect(fullSchema.templateMap.templates.length).toBeGreaterThan(0);
    expect(fullSchema.provenance.mode).toBe("snapshot");
  });

  test("loadDjangoPostsFixture loads all fixture posts", () => {
    const fixtures = loadDjangoPostsFixture();
    expect(fixtures.total).toBeGreaterThan(0);
    expect(fixtures.posts?.[0].title).toBeDefined();
  });

  test("loadDjangoPostsFixture loads single post by slug", () => {
    const single = loadDjangoPostsFixture("django-mvt-architecture-guide");
    expect(single.post).toBeDefined();
    expect(single.post?.slug).toBe("django-mvt-architecture-guide");
  });
});
