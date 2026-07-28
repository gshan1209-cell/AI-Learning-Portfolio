@echo off
:: 切換到批次檔所在的目錄
cd /d "%~dp0"

echo [1/3] 正在啟用虛擬環境並檢查資料庫遷移 (Database Migration)...
if exist ".venv\Scripts\python.exe" (
    ".venv\Scripts\python.exe" manage.py migrate
) else (
    echo [錯誤] 找不到虛擬環境 (.venv)。請先執行 build_venv.bat。
    pause
    exit /b 1
)

echo.
echo [2/3] 正在開啟瀏覽器前往首頁...
:: 延遲 3 秒後開啟網頁，確保伺服器有時間啟動
start "" http://127.0.0.1:8000/

echo.
echo [3/3] 正在啟動 Django 開發伺服器...
".venv\Scripts\python.exe" manage.py runserver
pause
