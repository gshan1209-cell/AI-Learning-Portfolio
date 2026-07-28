import { NextRequest } from "next/server";
import { runMovieScraperUnitTests } from "../src/lib/web-lab/__tests__/movie-scraper.test";
import { runAgriWeatherUnitTests } from "../src/lib/web-lab/__tests__/agri-weather.test";
import { runDjangoBlogUnitTests } from "../src/lib/web-lab/__tests__/django-blog.test";
import { GET as movieGet } from "../src/app/api/web-lab/movies/route";
import { GET as weeklyGet } from "../src/app/api/web-lab/weather/weekly/route";
import { GET as stationsGet } from "../src/app/api/web-lab/weather/stations/route";
import { GET as advisoryGet } from "../src/app/api/web-lab/weather/advisory/route";
import { GET as djangoPostsGet } from "../src/app/api/web-lab/django-blog/posts/route";
import { GET as djangoPostGet } from "../src/app/api/web-lab/django-blog/posts/[slug]/route";
import { GET as djangoSchemaGet } from "../src/app/api/web-lab/django-blog/schema/route";

let passed = 0;

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(`FAIL: ${message}`);
  console.log(`PASS: ${message}`);
  passed += 1;
}

async function json(response: Response): Promise<Record<string, unknown>> {
  return await response.json() as Record<string, unknown>;
}

async function run() {
  console.log("=== Applied Web Systems Test Suite (Wave 003) ===\n");
  runMovieScraperUnitTests(assert);
  runAgriWeatherUnitTests(assert);
  runDjangoBlogUnitTests(assert);

  const movieSnapshotResponse = await movieGet(new NextRequest("http://localhost/api/web-lab/movies?source=scrape-center&mode=snapshot&page=1"));
  const movieSnapshot = await json(movieSnapshotResponse);
  assert(movieSnapshotResponse.status === 200, "Movie snapshot API returns 200");
  assert((movieSnapshot.provenance as Record<string, unknown>).mode === "snapshot", "Movie snapshot API exposes provenance");

  const invalidMovieSource = await movieGet(new NextRequest("http://localhost/api/web-lab/movies?source=http://169.254.169.254&mode=live"));
  assert(invalidMovieSource.status === 400, "Movie API rejects arbitrary source and SSRF input");

  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () => { throw new Error("offline test"); }) as typeof fetch;
  try {
    const movieFallbackResponse = await movieGet(new NextRequest("http://localhost/api/web-lab/movies?source=atmovies&mode=live"));
    const movieFallback = await json(movieFallbackResponse);
    assert((movieFallback.provenance as Record<string, unknown>).mode === "fallback", "Movie live failure returns fallback metadata");
  } finally {
    globalThis.fetch = originalFetch;
  }

  const weeklySnapshotResponse = await weeklyGet(new NextRequest("http://localhost/api/web-lab/weather/weekly?city=%E8%87%BA%E4%B8%AD%E5%B8%82&district=%E8%A5%BF%E5%B1%AF%E5%8D%80&mode=snapshot"));
  const weeklySnapshot = await json(weeklySnapshotResponse);
  assert(weeklySnapshotResponse.status === 200, "Weekly snapshot API returns 200");
  assert((weeklySnapshot.provenance as Record<string, unknown>).mode === "snapshot", "Weekly snapshot API declares snapshot mode");

  const savedKey = process.env.CWA_API_KEY;
  delete process.env.CWA_API_KEY;
  try {
    const weeklyFallbackResponse = await weeklyGet(new NextRequest("http://localhost/api/web-lab/weather/weekly?city=%E8%87%BA%E4%B8%AD%E5%B8%82&district=%E8%A5%BF%E5%B1%AF%E5%8D%80&mode=live"));
    const weeklyFallback = await json(weeklyFallbackResponse);
    assert(weeklyFallbackResponse.status === 200, "Weekly live without key remains available");
    assert((weeklyFallback.provenance as Record<string, unknown>).mode === "fallback", "Weekly live without key declares fallback");

    const stationsFallbackResponse = await stationsGet(new NextRequest("http://localhost/api/web-lab/weather/stations?city=%E8%87%BA%E4%B8%AD%E5%B8%82&mode=live"));
    const stationsFallback = await json(stationsFallbackResponse);
    assert((stationsFallback.provenance as Record<string, unknown>).mode === "fallback", "Stations live without key declares fallback");
  } finally {
    if (savedKey === undefined) delete process.env.CWA_API_KEY;
    else process.env.CWA_API_KEY = savedKey;
  }

  const invalidPairResponse = await weeklyGet(new NextRequest("http://localhost/api/web-lab/weather/weekly?city=%E8%87%BA%E5%8C%97%E5%B8%82&district=%E8%A5%BF%E5%B1%AF%E5%8D%80"));
  assert(invalidPairResponse.status === 400, "Weather API rejects invalid city/district pair");

  const invalidCropResponse = await advisoryGet(new NextRequest("http://localhost/api/web-lab/weather/advisory?city=%E8%87%BA%E4%B8%AD%E5%B8%82&district=%E8%A5%BF%E5%B1%AF%E5%8D%80&crop=unknown"));
  assert(invalidCropResponse.status === 400, "Advisory API rejects unknown crop");

  const advisoryResponse = await advisoryGet(new NextRequest("http://localhost/api/web-lab/weather/advisory?city=%E8%87%BA%E4%B8%AD%E5%B8%82&district=%E8%A5%BF%E5%B1%AF%E5%8D%80&crop=rice&mode=snapshot"));
  assert(advisoryResponse.status === 200, "Advisory snapshot API returns 200");

  const postsResponse = await djangoPostsGet();
  const posts = await json(postsResponse);
  assert(postsResponse.status === 200 && Number(posts.total) > 0, "Django mirror posts API returns fixtures");

  const detailResponse = await djangoPostGet(
    new NextRequest("http://localhost/api/web-lab/django-blog/posts/django-mvt-architecture-guide"),
    { params: { slug: "django-mvt-architecture-guide" } },
  );
  assert(detailResponse.status === 200, "Django mirror detail API returns known slug");

  const missingDetailResponse = await djangoPostGet(
    new NextRequest("http://localhost/api/web-lab/django-blog/posts/missing"),
    { params: { slug: "missing" } },
  );
  assert(missingDetailResponse.status === 404, "Django mirror detail API returns 404 for missing slug");

  const schemaResponse = await djangoSchemaGet();
  const schema = await json(schemaResponse);
  assert(schemaResponse.status === 200 && Boolean(schema.schema), "Django schema API returns exported artifacts");

  console.log(`\n=== Wave 003 Test Summary: ${passed} Passed ===`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
