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
- [x] 模組 README 與 `migration.json`
- [x] Migration Registry 改為 `importing`

## 待完成

- [ ] 完整移入 `phase3_streamlit_app.py`
- [ ] 盤點並移入必要圖片、影片與輸出素材
- [ ] 建立 Native SVM Playground
- [ ] Native 同心圓資料生成
- [ ] Native 2D 邊界與支持向量顯示
- [ ] Native 3D 幾何／決策曲面視覺化
- [ ] kernel、C、gamma、degree、noise、point count 控制
- [ ] 準確率與支持向量指標
- [ ] 動態教學提示
- [ ] 將 iframe 模式改為 native
- [ ] Runtime 最低必要驗收
- [ ] 舊 Repo 搬遷公告與部署處理
- [ ] 人工核准後 Archived

## 數學驗收

- `z=x²+y²` 必須標示為幾何直覺示意。
- 真實 RBF Kernel 不得描述成顯式 3D 特徵映射。
- 3D `f(x,y)` 圖必須標示為決策函數曲面。
- linear kernel 在同心圓資料上應呈現明顯限制。
- 高 gamma 應說明局部邊界與過擬合風險。
- 低 C／高 C 應說明 Soft Margin／Hard Margin 差異。
