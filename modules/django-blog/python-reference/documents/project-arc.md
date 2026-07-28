# DjangoBlog 專案結構分析報告

本報告針對 `2026-DjangoBlog` 專案進行靜態結構分析，為後續將專案部署至 Linux 遠端伺服器（包含 Windows `.bat` 腳本轉 Linux `.sh` 腳本）做準備。

---

## 1. 專案目錄結構概覽

以下為專案根目錄之主要檔案與目錄：

```text
2026-DjangoBlog/
├── .git/                  # Git 版本控制目錄
├── .gitignore             # Git 忽略檔案清單
├── .vscode/               # VS Code 編輯器設定
├── DjangoBlog/            # Django 專案核心設定目錄
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py        # 專案主要設定檔（時區、語系、資料庫等）
│   ├── urls.py            # 全域 URL 路由設定
│   └── wsgi.py            # WSGI Web 伺服器進入點
├── article/               # 主要的 Django App (文章/部落格功能)
│   ├── admin.py           # Django Admin 後台註冊
│   ├── apps.py            # App 宣告
│   ├── migrations/        # 資料庫遷移檔目錄
│   ├── models.py          # 定義 Post 資料模型
│   ├── tests.py           # 測試案例
│   └── views.py           # 視圖邏輯 (負責讀取資料並渲染)
├── templates/             # 模板目錄
│   └── index.html         # 部落格首頁 HTML 模板
├── db.sqlite3             # 本地預設 SQLite 資料庫 (Django settings.py 預設指向此檔案)
├── blog_db.sqlite3        # 外部下載的 SQLite 資料庫 (config.bat/download_db.bat 下載目標)
├── requirement.txt        # Python 相依套件清單 (目前為空)
├── build_venv.bat         # Windows：建立 Python 虛擬環境並安裝套件
├── config.bat             # Windows：設定 Google Drive 資料庫下載與 Git 設定之變數
├── download_db.bat        # Windows：下載 Google Drive 的 SQLite 檔案
├── setup_git.bat          # Windows：配置本地 Git 使用者名稱與信箱
└── start.bat              # Windows：啟動 Django 開發伺服器與自動開啟瀏覽器
```

---

## 2. Django 專案核心元件分析

### 2.1 Django 專案設定 (`DjangoBlog/settings.py`)
- **Django 版本**：6.0 (依據註解標示)。
- **語系與時區**：
  - `LANGUAGE_CODE = 'zh-hant'` (繁體中文)
  - `TIME_ZONE = 'Asia/Taipei'` (台北時區)
- **資料庫**：
  - 指向 `BASE_DIR / 'db.sqlite3'`。
  - *注意*：`config.bat` 內設定下載的資料庫檔案名稱為 `blog_db.sqlite3`。若專案實際運作需要使用該下載庫，可能需要在 settings 中調整或是透過腳本將其覆蓋/重新命名為 `db.sqlite3`。
- **安裝的 App**：
  - 除了 Django 內建 App，還有自訂的 `'article'`。

### 2.2 文章 App (`article/`)
- **資料模型 (`article/models.py`)**：
  - `Post`：部落格文章，欄位包含 `title` (標題), `slug` (路徑別名), `content` (內容), `pub_date` (發布時間，自動新增)。
- **路由與視圖 (`article/views.py` 與 `DjangoBlog/urls.py`)**：
  - `urls.py` 將首頁路徑 `''` 導向 `article.views.index`。
  - `views.py` 中的 `index` 視圖會從資料庫取出所有 `Post` 物件，並將其傳遞給 `templates/index.html` 進行渲染。

---

## 3. 現有 Windows 批次檔 (.bat) 功能解析

使用者需要將以下三個檔案轉換為 Linux 專用的腳本。以下是現有 Windows 批次檔的運作邏輯分析：

### 3.1 `build_venv.bat`
- **目的**：建立與配置 Python 虛擬環境。
- **關鍵流程**：
  1. 檢查系統中是否有 `python` 命令。若無，輸出錯誤並結束。
  2. 檢查是否存在 `.venv` 資料夾，若不存在則執行 `python -m venv .venv` 建立。
  3. 升級 pip，執行路徑為 Windows 格式：`.venv\Scripts\python.exe -m pip install --upgrade pip`。
  4. 檢查是否存在 `requirement.txt`，若有則執行 `.venv\Scripts\python.exe -m pip install -r requirement.txt` 安裝相依套件。

### 3.2 `config.bat`
- **目的**：宣告下載資料庫與 Git 配置所需的環境變數。
- **關鍵變數**：
  - `FILE_ID`：Google Drive 檔案的 ID (`1vvGmS9X8u4r8URJJ7ZF6qQCvXM_xYUHL`)。
  - `DB_PATH`：目標儲存路徑，使用 `%~dp0blog_db.sqlite3`（即腳本所在的當前目錄）。
  - `DOWNLOAD_URL`：建構出來的 Google Drive 直載網址。
  - `GIT_USER_NAME` / `GIT_USER_EMAIL`：Git 的本機使用者資訊。

### 3.3 `download_db.bat`
- **目的**：下載 SQLite 資料庫。
- **關鍵流程**：
  1. 讀取並執行同目錄底下的 `config.bat` 以取得變數。
  2. 檢查系統中是否有 `curl.exe`。
  3. 若有，執行 `curl.exe -L "!DOWNLOAD_URL!" -o "!DB_PATH!"` 下載。
  4. 若無，回退使用 PowerShell `Invoke-WebRequest` 進行下載。
  5. 驗證 `DB_PATH` 檔案是否存在且下載過程中無錯誤。

---

## 4. Linux 部署之轉換考量 (Linux shell script)

為了將這些功能轉換成 Linux 專用 (例如 `Bash` 腳本 `.sh`)，需要注意以下差異：

1. **Python 虛擬環境路徑**：
   - Windows 使用 `.venv\Scripts\python.exe` 執行 Python。
   - Linux 使用 `.venv/bin/python` 執行 Python，且啟用虛擬環境是透過 `source .venv/bin/activate`。
2. **Python 執行命令**：
   - Linux 系統上常將 Python 3 命名為 `python3`。檢查時應優先檢查 `python3`。
3. **目錄路徑獲取**：
   - Windows 使用 `%~dp0` 代表腳本所在目錄。
   - Linux Bash 可使用 `$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)` 獲取腳本所在絕對路徑。
4. **環境變數引用與載入**：
   - Windows 使用 `call config.bat` 與 `!DB_PATH!` / `%DB_PATH%`。
   - Linux 使用 `source ./config.sh` 載入，並使用 `$DB_PATH` 引用。
5. **下載工具**：
   - Linux 通常內建 `curl` 或 `wget`，無需使用 PowerShell 作為備用手段。
6. **換行字元 (Line Endings)**：
   - 輸出的 Shell 腳本必須使用 LF (`\n`) 作為換行符號，而非 Windows 的 CRLF (`\r\n`)，否則在 Linux 上執行會報語法錯誤。
