# ALP-MIG-003｜L13 SVM Kernel Trick 完整移植

## 任務目標

將 `gshan1209-cell/L13_SVM` 的 Manim、RBF 決策曲面、Streamlit／Plotly 互動功能與教學素材完整接管到 AI-Learning-Portfolio，完成驗收後才允許舊 Repo 退役。

## 三階段來源

1. `phase1_manim_kernel_trick.py`：2D 同心圓提升到 3D 拋物面。
2. `phase2_rbf_decision_surface.py`：真實 RBF SVM 2D 邊界與 3D 決策函數曲面。
3. `phase3_streamlit_app.py`：kernel、C、gamma、degree、noise、資料量互動控制。

## 已完成

- [x] README 與 requirements 盤點
- [x] 保存 Phase 1／2／3 與 utils 來源 SHA
- [x] requirements 移入 Monorepo
- [x] `utils/data_generator.py` 移入
- [x] `utils/svm_utils.py` 移入
- [x] Phase 1 Manim 程式移入
- [x] Phase 2 RBF 決策曲面程式移入
- [x] 完整移入 `phase3_streamlit_app.py`
- [x] 模組 README 與 `migration.json`
- [x] Native SVM Playground
- [x] Native 同心圓資料生成
- [x] Native 2D 邊界與近似支持向量顯示
- [x] Native `z=x²+y²` 高維提升示意
- [x] Kernel、C、Gamma、Degree、Noise、Point Count、Seed 控制
- [x] 教學分類率與支持向量指標
- [x] 動態 Gamma／C／Linear Kernel 教學提示
- [x] Demo Adapter 註冊 Native 元件
- [x] 課程 Demo 從 iframe 改為 native
- [x] Migration Registry 推進至 `refactoring`

## 待完成

- [ ] 盤點並移入必要圖片、影片與輸出素材
- [ ] 產製或移入 Phase 1 Manim 影片
- [ ] Runtime 最低必要驗收
- [ ] Python Phase 1 Manim 執行驗收
- [ ] Python Phase 2 圖表輸出驗收
- [ ] Python Phase 3 Streamlit 啟動驗收
- [ ] 瀏覽器／RWD 驗收 Native Playground
- [ ] 記錄 Native 教學模型與精確 scikit-learn SVC 的差異
- [ ] 決定是否新增 Monorepo 管理的 Python SVM API
- [ ] 舊 Repo 搬遷公告與部署處理
- [ ] 人工核准後 Archived

## 實作界線

目前 Native Playground 是教學與操作流程接管，不宣稱為完整 scikit-learn SVC 的瀏覽器重寫。精確模型原始碼已經移入 Monorepo；若正式網站需要精確結果，下一階段應增加 Python API／Worker。

## 數學驗收

- `z=x²+y²` 必須標示為幾何直覺示意。
- 真實 RBF Kernel 不得描述成顯式 3D 特徵映射。
- 3D `f(x,y)` 圖必須標示為決策函數曲面。
- linear kernel 在同心圓資料上應呈現明顯限制。
- 高 gamma 應說明局部邊界與過擬合風險。
- 低 C／高 C 應說明 Soft Margin／Hard Margin 差異。

## 退役門檻

- 三階段原始碼完整進入 Monorepo
- 必要素材與影片處理完成
- Native 教學流程完成驗收
- 精確 Python Runtime 策略確認
- 舊 Streamlit 停止或導向新平台
- 舊 Repo README 搬遷公告
- 使用者人工核准
