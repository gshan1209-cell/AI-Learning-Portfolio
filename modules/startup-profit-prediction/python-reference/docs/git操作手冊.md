本機專案連接 Git 與 GitHub 完整操作手冊
步驟一：設定您的 Git 身份 (解決 Author identity unknown)
請先告訴 Git 您的名稱與電子郵件。這只需要設定一次即可。

# 1. 設定名稱 (建議用英文，例如您的 GitHub 帳號名稱)
git config --global user.name "您的名字或帳號"

# 2. 設定 Email (請填寫您註冊 GitHub 的 Email)
git config --global user.email "您的email@example.com"
步驟二：將檔案加入追蹤 (Staging)
把目前資料夾內的所有檔案加入到 Git 的暫存區中。

git add .
(註：您看到的 warning: LF will be replaced by CRLF 是 Windows 系統常見的換行字元警告，不會影響程式運作，請放心忽略。)

步驟三：建立第一次提交 (解決 src refspec main does not match any)
將剛剛加入的檔案正式「存檔」進本地的 Git 紀錄中。有了這筆紀錄，我們才有東西可以推送到 GitHub。

git commit -m "Initial commit: 專案初始設定"
步驟四：確認分支名稱為 main
確保您目前的分支名稱是 main（GitHub 預設的主要分支名稱）。

git branch -M main
步驟五：連接遠端 GitHub 儲存庫
將您的本地資料夾跟您在 GitHub 上的 Repository 接上線。

# 新增遠端位址
git remote add origin https://github.com/gshan1209-cell/machinelearningHw6-2.git
(註：如果出現 fatal: remote origin already exists 的錯誤，代表您之前已經成功連接過，可以略過這步。)

步驟六：推送到 GitHub
最後，把本地的程式碼推送到 GitHub 上！

git push -u origin main
只要照著這 6 個步驟依序執行，您的專案應該就能順利推送到 GitHub 上了！如果有遇到要登入驗證的視窗，請選擇透過瀏覽器 (Browser) 登入授權即可。有遇到其他錯誤的話，隨時可以把訊息貼上來討論！