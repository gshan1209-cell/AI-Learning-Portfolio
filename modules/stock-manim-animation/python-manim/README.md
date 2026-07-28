# 台股實戰教學 Manim 動畫模組

## 專案簡介

本模組使用 Manim 製作台股技術分析教學動畫，適合新手理解 K 線、均線、成交量、支撐壓力、技術指標與回測風險。

## 安裝

```bash
pip install -r requirements.txt
```

## 執行單一動畫

```bash
manim -pql scenes/scene_02_candlestick_basics.py CandlestickBasics
```

## 高畫質輸出

```bash
manim -pqh scenes/scene_02_candlestick_basics.py CandlestickBasics
```

## 批次輸出

```bash
python render_all.py
```

## 場景列表

| 場景 | 說明 |
|---|---|
| TitleIntro | 標題開場與課程地圖 |
| MarketRulesIntro | 台股市場基本規則 |
| CandlestickBasics | K 線基礎（紅漲綠跌） |
| MovingAverageIntro | 均線 MA5 / MA20 / MA60 |
| VolumePriceIntro | 成交量與價量關係 |
| SupportResistanceIntro | 支撐線與壓力線 |
| TrendBreakoutIntro | 趨勢線、突破與假突破 |
| IndicatorsIntro | RSI / MACD / 布林通道入門 |
| BacktestingRiskIntro | 回測績效與風險控管 |

## 重要聲明

本專案僅供教學與程式實作練習，不構成任何投資建議。技術分析與回測結果不能保證未來績效。
