@echo off
:: =====================================================================
:: Configuration Parameters for Database Download
:: =====================================================================

:: Google Drive File ID of db.sqlite3
:: https://drive.google.com/file/d/1vvGmS9X8u4r8URJJ7ZF6qQCvXM_xYUHL/view?usp=drive_link

:: Google Drive File ID for db.sqlite3
set "FILE_ID=1vvGmS9X8u4r8URJJ7ZF6qQCvXM_xYUHL"

:: Local path where the database will be saved
set "DB_PATH=%~dp0blog_db.sqlite3"

:: Direct download link constructed from FILE_ID
set "DOWNLOAD_URL=https://drive.google.com/uc?export=download&id=%FILE_ID%"

set "GIT_USER_NAME=gshan1209-cell"
set "GIT_USER_EMAIL=gshan1209@gmail.com"
