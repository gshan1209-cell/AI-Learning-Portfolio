#!/bin/bash
# =====================================================================
# Configuration Parameters for Database Download (Linux Version)
# =====================================================================

# Get the directory of the current script
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Google Drive File ID of db.sqlite3
# https://drive.google.com/file/d/1vvGmS9X8u4r8URJJ7ZF6qQCvXM_xYUHL/view?usp=drive_link
FILE_ID="1vvGmS9X8u4r8URJJ7ZF6qQCvXM_xYUHL"

# Local path where the database will be saved
DB_PATH="${DIR}/blog_db.sqlite3"

# Direct download link constructed from FILE_ID
DOWNLOAD_URL="https://drive.google.com/uc?export=download&id=${FILE_ID}"

GIT_USER_NAME="gshan1209-cell"
GIT_USER_EMAIL="gshan1209@gmail.com"
