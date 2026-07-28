import { parseScrapeCenterHtml, parseAtMoviesNewHtml } from "../movie-scraper/parsers";
import { loadMovieSnapshot } from "../movie-scraper/snapshots";
import { isUrlAllowed } from "../request-policy";

describe("Movie Scraper Unit Tests", () => {
  test("parseScrapeCenterHtml parses valid fixture HTML correctly", () => {
    const fixtureHtml = `
      <div class="el-card item m-t is-hover-shadow">
        <a href="/detail/99"><img src="https://p0.meituan.net/movie/v99.jpg" class="cover" /></a>
        <h2 class="m-b-sm">測試電影</h2>
        <div class="categories"><span>科幻</span><span>冒險</span></div>
        <div class="m-v-sm info">台灣 / 120 分鐘</div>
        <div class="m-v-sm info">2026-07-28 上映</div>
        <p class="score">8.9</p>
      </div>
    `;

    const movies = parseScrapeCenterHtml(fixtureHtml);
    expect(movies).toHaveLength(1);
    expect(movies[0].title).toBe("測試電影");
    expect(movies[0].id).toBe("99");
    expect(movies[0].score).toBe("8.9");
    expect(movies[0].categories).toEqual(["科幻", "冒險"]);
  });

  test("parseAtMoviesNewHtml parses atmovies fixture correctly", () => {
    const fixtureHtml = `
      <article class="filmList">
        <div class="filmTitle"><a href="/film/faen99999999/">測試開眼電影</a></div>
        <img src="/film/poster/faen99999999.jpg" class="filmListPoster" />
        <div class="runtime">片長：115分 上映日期：2026/07/28</div>
        <div id="avg">★9.0</div>
      </article>
    `;

    const movies = parseAtMoviesNewHtml(fixtureHtml);
    expect(movies).toHaveLength(1);
    expect(movies[0].title).toBe("測試開眼電影");
    expect(movies[0].duration).toBe("115分");
    expect(movies[0].score).toBe("9.0");
  });

  test("loadMovieSnapshot returns snapshot provenance metadata", () => {
    const snapshot = loadMovieSnapshot("scrape-center", 1, 10);
    expect(snapshot.provenance.mode).toBe("snapshot");
    expect(snapshot.provenance.source).toBe("scrape-center");
    expect(snapshot.movies.length).toBeGreaterThan(0);
  });

  test("isUrlAllowed enforces host allowlist", () => {
    expect(isUrlAllowed("https://ssr1.scrape.center")).toBe(true);
    expect(isUrlAllowed("https://www.atmovies.com.tw/movie/new/")).toBe(true);
    expect(isUrlAllowed("https://malicious-website.com/api")).toBe(false);
  });
});
