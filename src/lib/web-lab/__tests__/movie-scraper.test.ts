import { parseScrapeCenterHtml, parseAtMoviesNewHtml } from "../movie-scraper/parsers";
import { loadMovieSnapshot } from "../movie-scraper/snapshots";
import { isUrlAllowed } from "../request-policy";

export type AssertFn = (condition: boolean, message: string) => void;

export function runMovieScraperUnitTests(assert: AssertFn) {
  const scrapeCenterFixture = `
    <div class="el-card item m-t is-hover-shadow">
      <a href="/detail/99"><img src="https://p0.meituan.net/movie/v99.jpg" class="cover" /></a>
      <h2 class="m-b-sm">測試電影</h2>
      <div class="categories"><span>科幻</span><span>冒險</span></div>
      <div class="m-v-sm info">台灣 / 120 分鐘</div>
      <div class="m-v-sm info">2026-07-28 上映</div>
      <p class="score">8.9</p>
    </div>
  `;
  const scrapeCenterMovies = parseScrapeCenterHtml(scrapeCenterFixture);
  assert(scrapeCenterMovies.length === 1, "Scrape Center parser returns one item");
  assert(scrapeCenterMovies[0].title === "測試電影", "Scrape Center parser reads title");
  assert(scrapeCenterMovies[0].id === "99", "Scrape Center parser reads id");
  assert(scrapeCenterMovies[0].score === "8.9", "Scrape Center parser reads score");
  assert(scrapeCenterMovies[0].categories.join(",") === "科幻,冒險", "Scrape Center parser reads categories");

  const atMoviesFixture = `
    <article class="filmList">
      <div class="filmTitle"><a href="/film/faen99999999/">測試開眼電影</a></div>
      <img src="/film/poster/faen99999999.jpg" class="filmListPoster" />
      <div class="runtime">片長：115分 上映日期：2026/07/28</div>
      <div id="avg">★9.0</div>
    </article>
  `;
  const atMovies = parseAtMoviesNewHtml(atMoviesFixture);
  assert(atMovies.length === 1, "@movies parser returns one item");
  assert(atMovies[0].title === "測試開眼電影", "@movies parser reads title");
  assert(atMovies[0].duration === "115分", "@movies parser reads duration");
  assert(atMovies[0].score === "9.0", "@movies parser reads score");

  const snapshot = loadMovieSnapshot("scrape-center", 1, 10);
  assert(snapshot.provenance.mode === "snapshot", "Movie snapshot declares snapshot mode");
  assert(snapshot.provenance.source === "scrape-center", "Movie snapshot records source");
  assert(snapshot.movies.length > 0, "Movie snapshot contains records");

  assert(isUrlAllowed("https://ssr1.scrape.center"), "Scrape Center host is allowlisted");
  assert(isUrlAllowed("https://www.atmovies.com.tw/movie/new/"), "@movies host is allowlisted");
  assert(!isUrlAllowed("https://malicious-website.com/api"), "Unknown host is rejected");
}
