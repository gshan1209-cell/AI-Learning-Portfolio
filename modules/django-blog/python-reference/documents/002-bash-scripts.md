# 專案 Linux 部署與腳本執行步驟規劃

本文件規劃了將 `2026-DjangoBlog` 專案部署至遠端 Linux 伺服器並執行相關 Bash 腳本的完整步驟。此規劃可用於引導部署流程，確保環境建置與資料庫載入無誤。

---

## 階段一：遠端 Linux 伺服器環境準備

### 1. 安裝系統依賴套件
在 Linux 伺服器上，需確認已安裝 Python 3、pip、venv、Git 以及下載工具（curl 或 wget）。
* **Ubuntu / Debian 指令**：
  ```bash
  sudo apt update
  sudo apt install -y python3 python3-pip python3-venv git curl
  ```
* **CentOS / RHEL 指令**：
  ```bash
  sudo yum update -y
  sudo yum install -y python3 git curl
  ```

### 2. 複製專案至 Linux 伺服器
使用 Git 或 SCP 將專案檔案傳送至遠端伺服器，並進入專案根目錄：
```bash
git clone <repository_url> 2026-DjangoBlog
cd 2026-DjangoBlog
```

---

## 階段二：部署與初始化步驟

### 3. 設定腳本執行權限
剛複製至 Linux 的 Bash 腳本預設可能沒有執行權限，需手動賦予：
```bash
chmod +x config.sh build_venv.sh download_db.sh
```

### 4. 檢查並編輯環境變數 (`config.sh`)
確認設定參數是否正確（例如 Google Drive 的 `FILE_ID` 或下載目標檔名）。
* **編輯指令**（若有需要）：
  ```bash
  nano config.sh
  ```
* **設定檔內容說明**：
  * `FILE_ID`：下載資料庫用的 Google Drive 檔案 ID。
  * `DB_PATH`：資料庫儲存絕對路徑，預設與 `config.sh` 同目錄。
  * `GIT_USER_NAME` / `GIT_USER_EMAIL`：Git 的本機使用者配置。

### 5. 建立虛擬環境與安裝相依套件 (`build_venv.sh`)
執行虛擬環境建置腳本：
```bash
./build_venv.sh
```
* **內部自動執行步驟**：
  1. 偵測系統的 `python3` 或 `python` 命令。
  2. 建立 `.venv` 虛擬環境目錄。
  3. 升級虛擬環境內部的 `pip` 套件管理器。
  4. 依據 `requirement.txt` 安裝 Django 等相關相依性套件。

### 6. 從遠端下載資料庫 (`download_db.sh`)
執行資料庫下載腳本，以取得正式的 SQLite 資料庫：
```bash
./download_db.sh
```
* **內部自動執行步驟**：
  1. 載入 `config.sh` 中的變數。
  2. 檢查 `curl` 存在性，若有則直接下載；若無則自動改用 `wget` 下載。
  3. 下載完成後自動驗證檔案是否存在與大小。

---

## 階段三：啟動與伺服器運作 (後續規劃)

### 7. 啟動 Django 開發伺服器
虛擬環境與資料庫配置完成後，可以手動啟動伺服器進行驗證：
```bash
# 1. 啟用虛擬環境
source .venv/bin/activate

# 2. 進行資料庫遷移 (確保 schema 最新)
python manage.py migrate

# 3. 啟動伺服器 (允許外部 IP 連線)
python manage.py runserver 0.0.0.0:8000
```

---

## 階段四：自動化與維護規劃

* **設定排程下載 (Cron Job)**：
  若資料庫需要定期更新，可以將 `download_db.sh` 設定為 Linux `cron` 定期任務。例如，每天凌晨 3 點自動下載最新資料庫：
  ```bash
  0 3 * * * /path/to/2026-DjangoBlog/download_db.sh > /dev/null 2>&1
  ```
