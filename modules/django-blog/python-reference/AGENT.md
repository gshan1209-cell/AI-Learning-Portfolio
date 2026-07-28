# Agent 專案接手指南 (AGENT.md)

本文件旨在提供接手此專案的 AI 代理人 (Agent) 快速掌握目前的專案上下文、已完成的工作、目前的狀態以及接下來的待辦任務。

---

## 1. 專案簡介 (Project Overview)
* **專案名稱**：`2026-DjangoBlog`
* **專案類型**：基於 Django 6.0 的部落格應用程式。
* **主要 App**：`article` (處理文章模型 `Post` 與首頁渲染)。
* **資料庫**：SQLite3 (`db.sqlite3` 與從 Google Drive 下載的 `blog_db.sqlite3`)。

---

## 2. 目前專案狀態與工作進度 (Current Status)

### 2.1 已完成工作 (Completed)
- [x] **專案結構分析**：分析結果已記錄於 [documents/project-arc.md](file:///d:/SeanLin/2026-DjangoBlog/documents/project-arc.md)。
- [x] **Linux 部署規劃**：步驟化部署方案已記錄於 [documents/002-bash-scripts.md](file:///d:/SeanLin/2026-DjangoBlog/documents/002-bash-scripts.md)。
- [x] **批次檔轉換 (Linux 版)**：已成功建立對應的 Linux 專用 Bash 腳本（保留 Windows 版腳本以維持相容性）：
  - [config.sh](file:///d:/SeanLin/2026-DjangoBlog/config.sh) (環境變數設定)
  - [build_venv.sh](file:///d:/SeanLin/2026-DjangoBlog/build_venv.sh) (Python 虛擬環境配置與 pip 套件安裝)
  - [download_db.sh](file:///d:/SeanLin/2026-DjangoBlog/download_db.sh) (資料庫 Google Drive 下載與驗證)

---

## 3. 接手任務與待辦清單 (Backlog)

當您接手本專案時，請優先考慮以下任務：

- [ ] **建立 `start.sh` 腳本**：
  * **目的**：作為 Windows 上 `start.bat` 的 Linux 替代方案。
  * **需求**：啟用 `.venv/bin/activate`，執行 `python manage.py migrate`，並啟動 `python manage.py runserver`。
- [ ] **建立 `setup_git.sh` 腳本**：
  * **目的**：作為 Windows 上 `setup_git.bat` 的 Linux 替代方案。
  * **需求**：讀取 `config.sh` 並執行 `git config` 設定本地使用者資訊。
- [ ] **更新 `requirement.txt`**：
  * **目的**：目前此檔案為空。應加入 `Django>=6.0` 等相依套件以利 `build_venv.sh` 順利安裝。
- [ ] **進行 Linux 部署端對端驗證**：
  * **目的**：於 Linux 模擬環境下執行整個初始化流程（`build_venv.sh` -> `download_db.sh` -> `start.sh`），確保無語法或執行期錯誤。

---

## 4. 常用開發指令與參考路徑

### 4.1 虛擬環境
* **Windows**：`.venv\Scripts\python.exe`
* **Linux**：使用 `.venv/bin/python`，或透過 `source .venv/bin/activate` 啟用虛擬環境。

### 4.2 啟動伺服器 (Linux)
```bash
source .venv/bin/activate
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```
