#!/bin/bash
# =====================================================================
# Downloading Database from Google Drive (Linux Version)
# =====================================================================

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

printf "${GREEN}==========================================${NC}\n"
printf "${GREEN}Downloading Database from Google Drive...${NC}\n"
printf "${GREEN}==========================================${NC}\n"

# Load parameters from config.sh
CONFIG_FILE="$(dirname "${BASH_SOURCE[0]}")/config.sh"
if [ -f "$CONFIG_FILE" ]; then
    source "$CONFIG_FILE"
else
    printf "${RED}[ERROR] config.sh not found.${NC}\n"
    exit 1
fi

printf "Target DB Path: %s\n" "$DB_PATH"

DOWNLOAD_SUCCESS=1

if command -v curl >/dev/null 2>&1; then
    printf "Using curl to download...\n"
    curl -L "$DOWNLOAD_URL" -o "$DB_PATH"
    DOWNLOAD_SUCCESS=$?
elif command -v wget >/dev/null 2>&1; then
    printf "curl not found. Falling back to wget...\n"
    wget -O "$DB_PATH" "$DOWNLOAD_URL"
    DOWNLOAD_SUCCESS=$?
else
    printf "${RED}[ERROR] Neither curl nor wget was found on the system.${NC}\n"
    printf "Please install curl or wget and try again.\n"
    exit 1
fi

if [ $DOWNLOAD_SUCCESS -ne 0 ]; then
    printf "\n"
    printf "${RED}[ERROR] Failed to download the database file.${NC}\n"
    exit $DOWNLOAD_SUCCESS
fi

if [ ! -f "$DB_PATH" ]; then
    printf "\n"
    printf "${RED}[ERROR] Database file was not created successfully.${NC}\n"
    exit 1
fi

printf "\n"
printf "${GREEN}==========================================${NC}\n"
printf "${GREEN}Database downloaded successfully!${NC}\n"
printf "Saved as: %s\n" "$DB_PATH"
printf "${GREEN}==========================================${NC}\n"
