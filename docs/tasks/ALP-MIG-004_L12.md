# ALP-MIG-004｜L12 台股實戰教學 Manim 動畫完整移植

## 任務目標

將 `gshan1209-cell/L12` 的 9 個台股技術分析 Manim 教學場景、共用視覺元件、範例資料、批次渲染流程與必要媒體資產完整接管到 AI-Learning-Portfolio。完成渲染驗收與搬遷程序後，才允許舊 Repo 退役。

## 來源資訊

```text
Repository: gshan1209-cell/L12
Branch: main
Source commit: cc8902757a2f4e240710f8c9dbe14fd53bf7f280
Source root: manim-animations/
```

## 已完成

- [x] 取得真實來源根目錄，不以 Repo 根目錄 README 猜測
- [x] README、requirements、pyproject、main、render_all 盤點
- [x] 保存來源 commit、場景與 shared blob SHA
- [x] Python 專案骨架移入 `modules/stock-manim-animation/python-manim/`
- [x] 批次渲染器移入
- [x] 9 個教學場景全部移入
- [x] `theme.py` 移入
- [x] `text_components.py` 移入
- [x] `layout_components.py` 移入
- [x] `animation_utils.py` 移入
- [x] `chart_components.py` 移入
- [x] `data_samples.py` 移入
- [x] 建立 scenes／shared Python package
- [x] 模組 README
- [x] `migration.json`
- [x] 投資教育免責與渲染風險文件化

## 已接管場景

| 編號 | Scene | 教學內容 |
|---|---|---|
| 00 | TitleIntro | 課程地圖與開場 |
| 01 | MarketRulesIntro | 台股市場規則 |
| 02 | CandlestickBasics | OHLC 與紅漲綠跌 |
| 03 | MovingAverageIntro | MA5／MA20／MA60 |
| 04 | VolumePriceIntro | 成交量與價量關係 |
| 05 | SupportResistanceIntro | 支撐與壓力區域 |
| 06 | TrendBreakoutIntro | 趨勢、突破與假突破 |
| 07 | IndicatorsIntro | RSI／MACD／布林通道 |
| 08 | BacktestingRiskIntro | 回測、回撤與風控 |

## 待完成

- [ ] 盤點來源 `tests/` 的實際檔案
- [ ] 移入 `assets/images/project_banner.png` 或建立新的合法替代素材
- [ ] 判斷是否需要搬移來源已渲染影片
- [ ] 建立新專案正式輸出目錄與媒體命名規則
- [ ] 安裝與驗證 Manim 0.18+
- [ ] 驗證 FFmpeg／Cairo／Pango 等系統相依
- [ ] 驗證 Windows 與 Linux 繁體中文字體
- [ ] 逐一低畫質渲染 9 個場景
- [ ] 驗證 `render_all.py`
- [ ] 檢查成交量柱狀圖縮放是否超出畫布
- [ ] 產出正式 MP4／Poster／章節 Metadata
- [ ] 建立課程頁影片播放與章節導覽
- [ ] 更新 Demo Registry 的影片網址
- [ ] 舊 L12 README 搬遷公告
- [ ] 使用者核准後 Archived

## 驗收標準

1. 9 個場景皆能從本 Monorepo 執行。
2. 任一場景不需要讀取舊 Repo 的程式。
3. `render_all.py` 可以依序找到所有場景。
4. 中文文字不出現方框、缺字或字體授權問題。
5. K 線、成交量、均線與指標圖不超出畫布。
6. 深色主題至少完成一次全場景渲染。
7. 影片頁持續顯示「不構成投資建議」。
8. 技術指標與回測不使用保證獲利敘述。
9. 必要影片與圖片由新專案或指定資產儲存層管理。

## 風險與限制

- Manim 不只是 Python 套件，還有系統層相依。
- 原字體 `Microsoft JhengHei` 在 Linux 環境不一定存在。
- 字體檔不得直接提交或提供下載。
- 原始影片可能體積較大，應依媒體資產策略決定是否存 Git LFS、Release、物件儲存或 Google Drive。
- 原始碼已移入不等於渲染成功，也不等於舊 Repo 可退役。

## 退役門檻

- 原始碼與必要素材完整接管
- 9 個場景最低渲染驗收
- 正式影片資產可由新平台取得
- 舊 Repo README 搬遷公告
- 舊展示入口停止或導向新平台
- 使用者人工核准
