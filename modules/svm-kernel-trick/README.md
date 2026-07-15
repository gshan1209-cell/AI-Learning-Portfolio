# SVM Kernel Trick Module｜SVM 核函數移植模組

## 中文摘要

- 本模組接管原 `gshan1209-cell/L13_SVM` 的三階段教學內容。
- Phase 1：Manim 2D→3D 幾何動畫。
- Phase 2：RBF SVM 2D 決策邊界與 3D 決策函數曲面。
- Phase 3：Streamlit + Plotly 互動式參數教學。
- 目前狀態為 `importing`；iframe 仍只是功能比對，不代表完成。

## 來源

```text
Repository: gshan1209-cell/L13_SVM
Branch: main
Demo: https://seanlinesvm.streamlit.app/
```

## 已移入

```text
modules/svm-kernel-trick/python-reference/
├─ requirements.txt
├─ phase1_manim_kernel_trick.py
├─ phase2_rbf_decision_surface.py
└─ utils/
   ├─ data_generator.py
   └─ svm_utils.py
```

## 待移入／重構

- `phase3_streamlit_app.py` 完整來源程式
- 來源圖片與必要教學素材
- Native 2D 同心圓視覺化
- Native `z=x²+y²` 3D 幾何示意
- Native kernel、C、gamma、degree、noise、資料量控制
- 支持向量與準確率指標
- 動態過擬合／Soft Margin 教學提示
- Phase 1 影片資產或可重建腳本驗收

## 數學界線

`z=x²+y²` 只用來建立高維可分的幾何直覺；真實 RBF Kernel 對應無限維特徵空間。站內 3D 圖若顯示 `f(x,y)`，必須明確標示為決策函數曲面，不能宣稱是真實 RBF 特徵空間。

## 退役條件

1. 三階段必要程式與素材已進 Monorepo。
2. Native 版完成核心互動功能。
3. Manim 與 Python 參考版完成最低必要驗收。
4. 舊 Streamlit Demo 停止或轉向新平台。
5. 舊 Repo README 加入搬遷公告。
6. 使用者核准後 Archived／唯讀。
