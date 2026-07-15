# CWA Open Data Module｜中央氣象署開放資料移植模組

## 中文摘要

- 本模組接管原 `gshan1209-cell/cwa_scraper` 的 Python CLI、API 參數邏輯與教學內容。
- `python-cli/` 保存來源功能基準。
- Next.js 站內版由 Server Route Handler 代管 API Key，瀏覽器端不接觸金鑰。
- 目前狀態為重構中，舊 Repo 尚未達退役標準。

## 來源

```text
Repository: gshan1209-cell/cwa_scraper
Branch: main
Main Entry: cwa_scraper.py
Dataset: F-A0010-001
```

## 模組結構

```text
modules/cwa-open-data/
├─ README.md
├─ migration.json
└─ python-cli/
   ├─ cwa_scraper.py
   └─ requirements.txt
```

## 原始功能

- 從 `.env`、CLI 參數或互動輸入取得 `CWA_API_KEY`
- 指定 Dataset ID
- JSON／XML 格式切換
- 輸出目錄與 Pretty JSON 控制
- HTTP 401、404 與 RequestException 處理
- 下載檔案與時間戳記檔名
- JSON／XML 預覽

## 新平台目標

| 功能 | 新平台位置 | 狀態 |
|---|---|---|
| Dataset／Format 控制 | Native CWA Playground | 已實作 |
| API Key 保護 | Server Route Handler | 已實作 |
| 即時下載 | `/api/modules/cwa-open-data` | 已實作，待環境驗證 |
| 模擬回應 | Native CWA Playground | 已實作 |
| JSON 預覽 | Native CWA Playground | 已實作 |
| XML 回應 | Server Route Handler | 已實作，待環境驗證 |
| 檔案下載 | 瀏覽器下載 | 待補 |
| Python CLI | `python-cli/cwa_scraper.py` | 已移入，未執行驗證 |

## 安全規則

- 真實 `CWA_API_KEY` 只能放在本機 `.env` 或部署 Secret。
- 前端不可接收、保存或顯示 API Key。
- Route Handler 必須驗證 Dataset ID 與 Format。
- API 回傳錯誤不可包含 Secret。

## Python CLI 啟動方式

```bash
cd modules/cwa-open-data/python-cli
python -m venv .venv
pip install -r requirements.txt
CWA_API_KEY=你的授權碼 python cwa_scraper.py
```

## 退役條件

1. 原始 CLI 與相依已移入。
2. 站內版可使用模擬資料，並可在有 Secret 時呼叫即時 API。
3. JSON／XML、Dataset 與錯誤處理完成最低必要驗收。
4. 舊 Repo README 加入搬遷公告。
5. 舊 Repo 設為 Archived／唯讀。
