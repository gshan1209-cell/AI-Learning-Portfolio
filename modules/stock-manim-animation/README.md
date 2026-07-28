# Stock Manim Animation Module｜台股實戰教學動畫移植模組

## 中文摘要

- 本模組接管原 `gshan1209-cell/L12` 中 `manim-animations/` 的台股教學動畫程式。
- 9 個教學場景、批次渲染器、主題、圖表元件、版面元件、動畫工具與範例資料已進入 Monorepo。
- 本模組以「可重建動畫」為正式接管目標，不只保存一支輸出影片。
- 目前狀態為 `refactoring`；Manim、FFmpeg、中文字體、測試與影片資產尚未執行驗收。
- 舊 L12 Repo 尚未達退役標準。

## 來源

```text
Repository: gshan1209-cell/L12
Branch: main
Source root: manim-animations/
Source commit: cc8902757a2f4e240710f8c9dbe14fd53bf7f280
```

## 新專案位置

```text
modules/stock-manim-animation/
├─ README.md
├─ migration.json
└─ python-manim/
   ├─ README.md
   ├─ requirements.txt
   ├─ pyproject.toml
   ├─ main.py
   ├─ render_all.py
   ├─ scenes/
   │  ├─ scene_00_title_intro.py
   │  ├─ scene_01_market_rules.py
   │  ├─ scene_02_candlestick_basics.py
   │  ├─ scene_03_moving_average.py
   │  ├─ scene_04_volume_price.py
   │  ├─ scene_05_support_resistance.py
   │  ├─ scene_06_trend_breakout.py
   │  ├─ scene_07_indicators_intro.py
   │  └─ scene_08_backtesting_risk.py
   └─ shared/
      ├─ theme.py
      ├─ text_components.py
      ├─ layout_components.py
      ├─ animation_utils.py
      ├─ chart_components.py
      └─ data_samples.py
```

## 已接管教學內容

1. 課程開場與學習地圖
2. 台股市場基本規則
3. K 線 OHLC 與紅漲綠跌
4. MA5／MA20／MA60 均線
5. 成交量與價量關係
6. 支撐與壓力區域
7. 趨勢、突破與假突破
8. RSI／MACD／布林通道
9. 回測、最大回撤與風險控管

## 啟動方式

```bash
cd modules/stock-manim-animation/python-manim
python -m venv .venv
pip install -r requirements.txt

# 單一場景低畫質預覽
manim -pql scenes/scene_02_candlestick_basics.py CandlestickBasics

# 批次渲染
python render_all.py
```

## 系統相依

除了 Python 套件外，Manim 通常還需要：

- FFmpeg
- Cairo／Pango 等 Manim 系統相依
- 可顯示繁體中文的字體
- 原專案預設 `Microsoft JhengHei`

字體檔不得直接提交或分享；部署環境應安裝可合法使用的中文字體，並允許透過環境設定覆寫字體名稱。

## 尚未移入或驗收

- `assets/images/project_banner.png`
- 來源 `tests/` 內容與測試結果
- 已渲染 MP4／圖片輸出
- Manim／FFmpeg 實際執行
- 深色與淺色主題完整渲染比對
- Linux／Windows 中文字體相容性
- 影片在課程頁的正式播放與章節導覽

## 重要風險

- 此模組涉及投資教育，必須持續顯示「不構成投資建議」。
- 技術指標與回測不得描述為獲利保證。
- 來源 `create_volume_bars()` 的縮放方式需在渲染驗收時確認是否造成柱狀圖超出畫布；未驗證前保留來源行為並列入修正候選。
- 不得因已有 Python 原始碼，就將舊 Repo 標記為可退役。

## 退役條件

1. 9 個場景與所有必要共用程式完整進入 Monorepo。
2. 必要圖片與影片資產已移入或可由新專案重建。
3. Manim、FFmpeg 與中文字體環境完成最低必要驗收。
4. 9 個場景至少完成低畫質渲染檢查。
5. 批次渲染器完成驗收。
6. 新平台能播放或導覽正式影片成果。
7. 舊 Repo README 加入搬遷公告。
8. 使用者核准後才將舊 Repo 設為 Archived／唯讀。
