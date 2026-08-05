# Four Real Runtime Engineering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete verifiable Manim rendering, Cosmos provider integration, Ensemble training/inference/fairness, and a native AI visual story player.

**Architecture:** Keep each Runtime isolated behind a small contract. GitHub Actions performs heavy or reproducible work; Vercel handles short server requests and UI; external GPU inference is explicitly configured through environment variables and never simulated.

**Tech Stack:** Next.js 14, TypeScript 5, React 18, Python 3.12, Manim Community, FFmpeg/ffprobe, scikit-learn, joblib, GitHub Actions, Vercel Functions.

## Global Constraints

- Repository and project name must remain exactly `AI-Learning-Portfolio`.
- Use Traditional Chinese UI copy.
- Never claim a render, model prediction, image generation, deployment, or validation without tool evidence.
- Cosmos Token must remain server-side; no Mock Mode or hidden fallback model.
- Ensemble is education-only and must not be positioned for hiring, credit, salary, or other high-risk decisions.
- Stock content is educational and not investment advice.
- Complete work on a branch, run TypeScript, lint, tests, build, Runtime checks, then merge the PR.

---

### Task 1: Manim strict renderer and CI artifact

**Files:**
- Modify: `modules/stock-manim-animation/python-manim/render_all.py`
- Modify: `modules/stock-manim-animation/python-manim/shared/text_components.py`
- Create: `modules/stock-manim-animation/python-manim/tests/test_render_all.py`
- Create: `.github/workflows/manim-runtime.yml`
- Modify: `src/app/learning-labs/[slug]/page.tsx`

**Interfaces:**
- Produces: `render_all(quality: str, media_dir: Path, strict: bool) -> list[RenderResult]`
- Produces: `render-manifest.json` containing scene, path, bytes, duration, width, height and sha256.

- [ ] Write tests that require nine commands, no preview flag, strict non-zero failure, cross-platform font fallback and a deterministic manifest.
- [ ] Run tests and confirm the current renderer fails because it uses `-pql`, ignores exit codes and has no manifest.
- [ ] Implement strict rendering and font fallback using `Noto Sans CJK TC`, `Noto Sans TC`, then `Microsoft JhengHei`.
- [ ] Add a dedicated GitHub Actions job that installs FFmpeg, Pango, Cairo and Noto CJK fonts, renders nine scenes at low quality, validates them with ffprobe and uploads the videos plus manifest.
- [ ] Update the learning lab to show the verified workflow contract without claiming success before CI finishes.
- [ ] Commit the task.

### Task 2: Cosmos real provider adapter

**Files:**
- Create: `src/lib/cosmos-runtime.ts`
- Create: `src/app/api/cosmos/status/route.ts`
- Create: `src/app/api/cosmos/generate/route.ts`
- Create: `src/components/cosmos-runtime-lab.tsx`
- Modify: `src/app/learning-labs/[slug]/page.tsx`
- Create: `scripts/run_runtime_tests.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: `HF_TOKEN`, `COSMOS_MODEL_ID`, optional `COSMOS_PROVIDER`.
- Produces: `GET /api/cosmos/status` and `POST /api/cosmos/generate`.

- [ ] Add tests for request validation, size mapping, missing Secret, exact model disclosure and error normalization.
- [ ] Run the tests and confirm missing modules/routes fail.
- [ ] Implement server-only provider calls with AbortController timeout and raw image response.
- [ ] Implement a client lab that renders returned bytes only after a real HTTP 200 response and displays model/provider/time headers.
- [ ] Remove text claiming the form never sends data, and remove all mock/fallback image behavior.
- [ ] Commit the task.

### Task 3: Ensemble reproducible model Runtime

**Files:**
- Create: `modules/ensemble-income-predictor/data/adult.csv`
- Create: `modules/ensemble-income-predictor/scripts/train_model.py`
- Create: `modules/ensemble-income-predictor/models/model.joblib`
- Create: `modules/ensemble-income-predictor/models/model_meta.json`
- Create: `modules/ensemble-income-predictor/models/metrics.json`
- Create: `modules/ensemble-income-predictor/models/fairness.json`
- Create: `api/ensemble-predict.py`
- Create: `src/components/ensemble-runtime-lab.tsx`
- Modify: `src/app/learning-labs/[slug]/page.tsx`
- Modify: `.github/workflows/ci.yml`
- Modify: `scripts/verify_artifacts_reproducible.py`

**Interfaces:**
- Produces: deterministic sklearn Pipeline Artifact and `POST /api/ensemble-predict`.
- Response: prediction, probability, classProbabilities, modelVersion, generatedAt and disclaimer.

- [ ] Add a failing reproducibility check and inference contract tests.
- [ ] Import the source CSV and training logic from `gshan1209-cell/L20-Ensemble-Model` with source commit recorded.
- [ ] Train Logistic Regression, Decision Tree, Random Forest, Gradient Boosting and Voting Classifier under one fixed split; select the model by validation F1 and record every model metric.
- [ ] Compute per-sex and per-race sample count, recall, false-positive rate and selection rate on the held-out set.
- [ ] Export the chosen Pipeline and verify a clean retrain produces matching metadata and predictions for fixed fixtures.
- [ ] Add the Python Function and React form, without database logging of sensitive inputs.
- [ ] Commit the task.

### Task 4: Native AI visual story player

**Files:**
- Create: `modules/ai-visual-story/default_novel.json`
- Create: `modules/ai-visual-story/source-manifest.json`
- Create: `src/components/visual-story-player.tsx`
- Modify: `src/app/learning-labs/[slug]/page.tsx`
- Modify: `course_chunks/zz-published-course-overrides.json`
- Modify: `course_demo_registry/demo_registry.json`
- Modify: `scripts/run_runtime_tests.ts`

**Interfaces:**
- Produces: native route `/learning-labs/ai-visual-story` with twelve slides.

- [ ] Add tests requiring twelve scenes, no iframe mode, valid image URLs, playback controls and source provenance.
- [ ] Import the exact twelve scene texts, durations and transitions from source commit `07c40f377f2e7fdee8d3ce9b69c9dade26792699` / `HW1/default_novel.json`.
- [ ] Build the React player with start, previous, next, pause/play, progress, keyboard navigation and reduced-motion support.
- [ ] Update the course and Demo registries from iframe to native route.
- [ ] Commit the task.

### Task 5: Full verification, PR, deploy and production smoke test

**Files:**
- Modify as required only when verification reveals defects.

- [ ] Run Python Artifact reproducibility checks.
- [ ] Run Manim Runtime workflow and verify nine MP4 files with ffprobe.
- [ ] Run ESLint, TypeScript, Runtime tests, all existing tests and Next.js production build.
- [ ] Open PR with Red/Green evidence and exact external Cosmos configuration state.
- [ ] Merge only after required checks pass.
- [ ] Verify Vercel Production status, `/courses`, all four Runtime routes and both Runtime APIs.
- [ ] Report any external credential/GPU endpoint blocker separately; do not represent an unconfigured Cosmos provider as complete.
