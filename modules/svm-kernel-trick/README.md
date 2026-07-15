# SVM Kernel Trick Module｜SVM 核函數移植模組

## 中文摘要

- 本模組接管原 `gshan1209-cell/L13_SVM` 的三階段教學內容。
- Phase 1：Manim 2D→3D 幾何動畫。
- Phase 2：RBF SVM 2D 決策邊界與 3D 決策函數曲面。
- Phase 3：Streamlit + Plotly 互動式參數教學。
- 三階段 Python 原始碼已全部進入 Monorepo。
- 課程主要展示已從 iframe 改為 Native SVM Playground。
- 目前狀態為 `refactoring`；精確 Python Runtime 與素材仍待驗收。

## 來源

```text
Repository: gshan1209-cell/L13_SVM
Branch: main
Legacy Demo: https://seanlinesvm.streamlit.app/
```

## 已移入

```text
modules/svm-kernel-trick/python-reference/
├─ requirements.txt
├─ phase1_manim_kernel_trick.py
├─ phase2_rbf_decision_surface.py
├─ phase3_streamlit_app.py
└─ utils/
   ├─ data_generator.py
   └─ svm_utils.py
```

## Native 接管

```text
src/components/native-demos/svm-kernel-playground.tsx
course_demo_registry/demo_registry.json
src/components/demo-adapter.tsx
```

目前站內版包含：

- Kernel：RBF、Linear、Polynomial、Sigmoid
- C、Gamma、Degree
- Noise、Point Count、Seed
- 同心圓資料生成
- 2D 決策邊界教學圖
- 近似支持向量標記
- 分類率與支持向量數量
- `z=x²+y²` 高維提升直覺示意
- Gamma、C、Linear Kernel 動態教學提示

## 重要實作界線

Native Playground 是瀏覽器端教學模型，用來接管操作流程與核心概念；它不假裝等同 scikit-learn 的完整 SVC 訓練器。

精確模型仍由已移入的 Python 參考版負責：

```bash
cd modules/svm-kernel-trick/python-reference
pip install -r requirements.txt
streamlit run phase3_streamlit_app.py
```

後續若需要在正式網站提供精確 SVC 結果，應新增由本 Monorepo 管理的 Python API／Worker，不得再依賴舊 Repo 的 Streamlit 部署。

## 待處理

- 盤點並移入必要來源圖片
- 產製或移入 Phase 1 Manim 影片資產
- Python Phase 1、2、3 Runtime 驗收
- 比對 Native 教學模型與精確 SVC 的觀念／操作差異
- 決定是否新增 Python SVM API
- 瀏覽器與 RWD 操作驗收
- 舊 Streamlit Demo 停止或轉向

## 數學界線

`z=x²+y²` 只用來建立高維可分的幾何直覺；真實 RBF Kernel 對應無限維特徵空間。站內圖若顯示 `f(x,y)`，必須標示為決策函數曲面，不能宣稱是真實 RBF 特徵空間。

## 退役條件

1. 三階段必要程式與素材已進 Monorepo。
2. Native 版完成核心互動功能。
3. Manim 與 Python 參考版完成最低必要驗收。
4. 精確 SVC 的正式 Runtime 策略已確認。
5. 舊 Streamlit Demo 停止或轉向新平台。
6. 舊 Repo README 加入搬遷公告。
7. 使用者核准後 Archived／唯讀。
