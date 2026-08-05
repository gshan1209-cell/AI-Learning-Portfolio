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

const presentationOverrideSlugs = [
  'svm-kernel-trick-3d',
  'cwa-open-data-first-api',
  'ml-top-10-algorithms',
  'crisp-dm-regression',
  'stock-manim-animation',
  'boston-feature-selection',
  'cosmos-text-to-image',
  'movie-scraper-nextjs',
  'agri-weather-dashboard',
  'django-blog-basics',
  'ensemble-income-predictor',
  'ai-visual-story',
];

function compareCourseChunkNames(left, right) {
  if (left === 'course_0001.json') return -1;
  if (right === 'course_0001.json') return 1;
  return left.localeCompare(right);
}

function isCourse(value) {
  return Boolean(
    value &&
      typeof value === 'object' &&
      value.id &&
      value.slug &&
      value.title &&
      value.source,
  );
}

function readCourseDirectory(directory) {
  const directoryPath = path.join(root, directory);
  if (!fs.existsSync(directoryPath)) return [];

  return fs
    .readdirSync(directoryPath)
    .filter((fileName) => fileName.endsWith('.json'))
    .sort(compareCourseChunkNames)
    .flatMap((fileName) => {
      const parsed = JSON.parse(fs.readFileSync(path.join(directoryPath, fileName), 'utf8'));
      const records = Array.isArray(parsed) ? parsed : [parsed];
      return records.filter(isCourse);
    });
}

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
      `${slug} baseline presentation is native Google Slides`,
    );
    assert(
      assets.presentation.url.includes('/presentation/d/'),
      `${slug} baseline presentation uses a Google Slides URL`,
    );
    assert(
      assets.videoDesign.mimeType === 'application/vnd.google-apps.document',
      `${slug} video design is native Google Docs`,
    );
    assert(
      assets.videoDesign.url.includes('/document/d/'),
      `${slug} video design uses a Google Docs URL`,
    );
  }
  assert(fileIds.size === 56, 'registry contains 56 unique core assets');

  const presentationRegistryPath = path.join(
    root,
    'course_presentation_registry',
    'presentation_registry.json',
  );
  assert(fs.existsSync(presentationRegistryPath), 'course presentation override registry exists');
  const presentationRegistry = JSON.parse(
    fs.readFileSync(presentationRegistryPath, 'utf8'),
  );
  assert(
    Object.keys(presentationRegistry).length === 12,
    'presentation override registry contains 12 newly assigned decks',
  );
  assert(
    presentationOverrideSlugs.every((slug) => presentationRegistry[slug]),
    'presentation override registry covers all newly assigned course decks',
  );
  assert(
    !presentationRegistry['linear-regression-for-beginners'],
    'linear regression keeps its existing native presentation',
  );
  assert(
    !presentationRegistry['startup-profit-prediction'],
    'startup profit keeps its existing native presentation',
  );
  for (const slug of presentationOverrideSlugs) {
    const presentation = presentationRegistry[slug];
    assert(Boolean(presentation.fileId), `${slug} override has a file ID`);
    assert(/\.pptx$/i.test(presentation.name), `${slug} override identifies the PPTX file`);
    assert(
      presentation.mimeType ===
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      `${slug} override uses the PowerPoint MIME type`,
    );
    assert(
      presentation.url.includes('/presentation/d/'),
      `${slug} override opens through Google Presentations`,
    );
  }

  const typeSource = fs.readFileSync(path.join(root, 'src/types/course.ts'), 'utf8');
  assert(typeSource.includes('export interface CourseAssets'), 'course type defines asset metadata');
  assert(typeSource.includes('assets?: CourseAssets'), 'course type exposes optional assets');

  const repositorySource = fs.readFileSync(path.join(root, 'src/lib/course-repository.ts'), 'utf8');
  assert(repositorySource.includes('readAssetRegistry'), 'course repository reads asset registry');
  assert(
    repositorySource.includes('readPresentationRegistry'),
    'course repository reads presentation override registry',
  );
  assert(
    repositorySource.includes('resolveCourseAssets'),
    'course repository merges presentation overrides into course assets',
  );
  assert(
    repositorySource.includes('presentation ? { ...assets, presentation } : assets'),
    'course repository replaces only the presentation asset',
  );
  assert(
    repositorySource.includes('compareCourseChunkNames'),
    'course repository uses deterministic baseline-first chunk precedence',
  );

  const demoRegistryPath = path.join(root, 'course_demo_registry', 'demo_registry.json');
  const demoRegistry = JSON.parse(fs.readFileSync(demoRegistryPath, 'utf8'));
  const courseMap = new Map();
  for (const directory of ['course_chunks', 'course_chunks_archive']) {
    for (const course of readCourseDirectory(directory)) {
      courseMap.set(course.slug, course);
    }
  }

  assert(courseMap.size === 14, 'course registry resolves exactly 14 courses');
  for (const slug of slugs) {
    const course = courseMap.get(slug);
    assert(Boolean(course), `${slug} resolves to a course record`);
    assert(course.status === 'published', `${slug} is published`);
    assert(course.learningObjectives.length >= 3, `${slug} has at least three learning objectives`);
    assert(course.sections.length >= 5, `${slug} has at least five teaching sections`);
    assert(Boolean(course.quiz), `${slug} has a quiz`);
    assert(course.quiz.options.length >= 4, `${slug} quiz has at least four options`);
    assert(
      Number.isInteger(course.quiz.answerIndex) &&
        course.quiz.answerIndex >= 0 &&
        course.quiz.answerIndex < course.quiz.options.length,
      `${slug} quiz answer index is valid`,
    );
    assert(
      Boolean(demoRegistry[slug] || course.source.demoUrl),
      `${slug} has a registered or source demo`,
    );
  }

  const panelSource = fs.readFileSync(path.join(root, 'src/components/course-assets-panel.tsx'), 'utf8');
  assert(panelSource.includes('重點圖卡'), 'asset panel contains the public summary card');
  assert(panelSource.includes('課程簡報'), 'asset panel contains the public presentation');
  assert(panelSource.includes('assets.presentation.url'), 'asset panel links the registered presentation');
  assert(panelSource.includes('assets.presentation.name'), 'asset panel displays the presentation filename');
  for (const hiddenLabel of ['NotebookLM 提示語', '64 秒影片設計', '開啟 Drive 課程資料夾']) {
    assert(!panelSource.includes(hiddenLabel), `asset panel hides ${hiddenLabel}`);
  }
  assert(
    panelSource.includes('公開課程頁提供重點圖卡與課程簡報'),
    'asset panel describes only the public summary card and presentation',
  );

  const pageSource = fs.readFileSync(path.join(root, 'src/app/courses/[slug]/page.tsx'), 'utf8');
  assert(pageSource.includes('CourseAssetsPanel'), 'course page imports the asset panel');
  assert(pageSource.includes('<CourseAssetsPanel'), 'course page renders the asset panel');
  assert(
    pageSource.includes('return getAllCourses().map((course) => ({ slug: course.slug }))'),
    'course detail static params include every course status',
  );
  assert(
    pageSource.includes('if (!course) notFound();'),
    'course detail returns 404 only when the course is missing',
  );

  const courseCardSource = fs.readFileSync(path.join(root, 'src/components/course-card.tsx'), 'utf8');
  assert(
    courseCardSource.includes('查看課程內容'),
    'course card links to the course content page',
  );
  assert(
    !courseCardSource.includes('查看課程資產'),
    'course card no longer exposes public asset wording',
  );

  const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  assert(packageJson.scripts.test.includes('run_course_asset_tests.mjs'), 'default test command includes asset tests');

  console.log(`\n=== Test Summary: ${passed} Passed, ${failed} Failed ===`);
} catch (error) {
  console.error(error.message);
  console.error(`\n=== Test Summary: ${passed} Passed, ${failed} Failed ===`);
  process.exit(1);
}
