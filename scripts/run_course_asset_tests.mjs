import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (!condition) {
    failed += 1;
    throw new Error(`FAIL: ${message}`);
  }
  passed += 1;
  console.log(`PASS: ${message}`);
}

const slugs = [
  'linear-regression-for-beginners',
  'svm-kernel-trick-3d',
  'cwa-open-data-first-api',
  'ml-top-10-algorithms',
  'crisp-dm-regression',
  'startup-profit-prediction',
  'stock-manim-animation',
  'boston-feature-selection',
  'cosmos-text-to-image',
  'movie-scraper-nextjs',
  'agri-weather-dashboard',
  'django-blog-basics',
  'ensemble-income-predictor',
  'ai-visual-story',
];

try {
  const registryPath = path.join(root, 'course_asset_registry', 'asset_registry.json');
  assert(fs.existsSync(registryPath), 'course asset registry exists');

  const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
  assert(Object.keys(registry).length === 14, 'registry contains 14 courses');
  assert(slugs.every((slug) => registry[slug]), 'registry covers every required course slug');

  const fileIds = new Set();
  for (const slug of slugs) {
    const assets = registry[slug];
    assert(assets.driveFolderUrl.includes('/drive/folders/'), `${slug} has a Drive folder URL`);
    for (const key of ['summaryCard', 'presentation', 'notebookLmPrompt', 'videoDesign']) {
      const asset = assets[key];
      assert(Boolean(asset?.fileId), `${slug} ${key} has a file ID`);
      assert(Boolean(asset?.name), `${slug} ${key} has a name`);
      assert(/^https:\/\/(drive|docs)\.google\.com\//.test(asset?.url ?? ''), `${slug} ${key} has a Google URL`);
      assert(!fileIds.has(asset.fileId), `${slug} ${key} file ID is unique`);
      fileIds.add(asset.fileId);
    }

    assert(
      assets.presentation.mimeType === 'application/vnd.google-apps.presentation',
      `${slug} presentation is native Google Slides`,
    );
    assert(
      assets.presentation.url.includes('/presentation/d/'),
      `${slug} presentation uses a Google Slides URL`,
    );
    assert(
      !/\.pptx$/i.test(assets.presentation.name),
      `${slug} presentation name has no legacy PPTX extension`,
    );
    assert(
      assets.videoDesign.mimeType === 'application/vnd.google-apps.document',
      `${slug} video design is native Google Docs`,
    );
    assert(
      assets.videoDesign.url.includes('/document/d/'),
      `${slug} video design uses a Google Docs URL`,
    );
    assert(
      !/\.html$/i.test(assets.videoDesign.name),
      `${slug} video design name has no legacy HTML extension`,
    );
  }
  assert(fileIds.size === 56, 'registry contains 56 unique core assets');

  const typeSource = fs.readFileSync(path.join(root, 'src/types/course.ts'), 'utf8');
  assert(typeSource.includes('export interface CourseAssets'), 'course type defines asset metadata');
  assert(typeSource.includes('assets?: CourseAssets'), 'course type exposes optional assets');

  const repositorySource = fs.readFileSync(path.join(root, 'src/lib/course-repository.ts'), 'utf8');
  assert(repositorySource.includes('readAssetRegistry'), 'course repository reads asset registry');
  assert(repositorySource.includes('assets: assetRegistry[course.slug] ?? course.assets'), 'course repository merges assets by slug');

  const panelSource = fs.readFileSync(path.join(root, 'src/components/course-assets-panel.tsx'), 'utf8');
  for (const label of ['重點圖卡', '課程簡報', 'NotebookLM 提示語', '64 秒影片設計']) {
    assert(panelSource.includes(label), `asset panel contains ${label}`);
  }
  assert(panelSource.includes('Drive 課程資料夾'), 'asset panel links to the course Drive folder');

  const pageSource = fs.readFileSync(path.join(root, 'src/app/courses/[slug]/page.tsx'), 'utf8');
  assert(pageSource.includes('CourseAssetsPanel'), 'course page imports the asset panel');
  assert(pageSource.includes('<CourseAssetsPanel'), 'course page renders the asset panel');

  const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  assert(packageJson.scripts.test.includes('run_course_asset_tests.mjs'), 'default test command includes asset tests');

  console.log(`\n=== Test Summary: ${passed} Passed, ${failed} Failed ===`);
} catch (error) {
  console.error(error.message);
  console.error(`\n=== Test Summary: ${passed} Passed, ${failed} Failed ===`);
  process.exit(1);
}
