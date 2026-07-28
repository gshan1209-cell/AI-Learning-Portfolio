---
name: github-readme-generator
description: 掃描當前專案目錄並自動生成符合 Github 最佳實踐的 Readme.md。當使用者要求「生成 Readme」、「更新 README」、「寫專案說明書」時觸發。
---

# Github Readme 生成工具

## 概述

這個 SKILL 引導 Agent 如何使用本地端程式碼，掃描專案結構與技術堆疊，自動生成一份精美的 `Readme.md`，這份 `Readme.md` 是提供給 Github Repository 的首頁呈現使用，且必須包含 AI 自動產生的免責聲明與功能宣告。

## 執行步驟

1. **步驟1 : 掃描專案內的技術堆疊**
   使用 Antigravity 內建的終端機，執行本地端程式碼取得專案的特徵:

   ```bash
   python scripts/analye_project.py
   ```

   - 讀取程式碼回傳的 `stdout`，取得專案使用的主要語言、安裝指令、以及前幾個重要的相依套件。

2. **步驟2: 載入 Readme 結構範本**
   讀取參考文件 `references/readme_templates.json`。
   - 提取各個區塊預設的 Markdown 結構 (如: `header`, `badge_section`, `agent_generation_notice` 等)。

3. **步驟3: 組合與撰寫 Readme 內容**
   在當前專案根目錄下，準備寫入或覆蓋 `README.md`。撰寫時必須遵循以下排版順序：

- **專案標題與徽章 (Header & Badges)**：從 `readme_templates.json` 中套用。
- **🤖 Agent 產生宣告**：**必須在 Badges 下方、Table of Contents 上方**，插入 `agent_generation_notice` 中的文字。明確說明「本 README.md 是由 Antigravity IDE AI Agent 自動生成並維護，專門用作 GitHub 門面展示使用」。
- **目錄與簡介 (TOC & About)**。
- **快速開始 (Getting Started)**：填入步驟一分析出來的「主要程式語言」、「安裝命令」與「依賴套件」。
- **專案結構與文件樹**：請自動掃描專案根目錄，列出前兩層的檔案目錄樹（例如使用 `tree` 模擬文字呈現），方便讀者理解專案架構。
