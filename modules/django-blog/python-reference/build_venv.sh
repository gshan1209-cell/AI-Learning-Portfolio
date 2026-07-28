#!/bin/bash
# =====================================================================
# Setting up Python Virtual Environment (Linux Version)
# =====================================================================

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

printf "${GREEN}==========================================${NC}\n"
printf "${GREEN}Setting up Python Virtual Environment...${NC}\n"
printf "${GREEN}==========================================${NC}\n"

# Check if Python 3 is installed
PYTHON_CMD=""
if command -v python3 >/dev/null 2>&1; then
    PYTHON_CMD="python3"
elif command -v python >/dev/null 2>&1; then
    PYTHON_CMD="python"
fi

if [ -z "$PYTHON_CMD" ]; then
    printf "${RED}[ERROR] Python is not installed or not in PATH.${NC}\n"
    printf "Please install Python 3 and try again.\n"
    exit 1
fi

PYTHON_VER=$($PYTHON_CMD --version 2>&1)
printf "Using Python command: ${GREEN}%s${NC} (%s)\n" "$PYTHON_CMD" "$PYTHON_VER"

# Validate existing virtual environment
VENV_VALID=0
if [ -d ".venv" ] && [ -f ".venv/bin/python" ]; then
    .venv/bin/python -m pip --version >/dev/null 2>&1
    if [ $? -eq 0 ]; then
        VENV_VALID=1
    fi
fi

# Create virtual environment if not exists or invalid
if [ $VENV_VALID -ne 1 ]; then
    if [ -d ".venv" ]; then
        printf "${YELLOW}Existing .venv is incomplete or invalid. Recreating...${NC}\n"
        rm -rf .venv
    fi
    
    printf "Creating virtual environment in .venv...\n"
    $PYTHON_CMD -m venv .venv
    if [ $? -ne 0 ]; then
        printf "${RED}[ERROR] Failed to create virtual environment.${NC}\n\n"
        printf "${YELLOW}💡 Hint for Debian/Ubuntu users:${NC}\n"
        printf "The error often occurs because the python3-venv package is not installed.\n"
        printf "Please run the following commands to install it:\n\n"
        printf "  sudo apt update\n"
        printf "  sudo apt install %s-venv\n\n" "$PYTHON_CMD"
        printf "After installing, please run this script again.\n"
        exit 1
    fi
    printf "${GREEN}Virtual environment created successfully.${NC}\n"
else
    printf ".venv already exists and is valid. Skipping creation.\n"
fi

# Upgrade pip
printf "Upgrading pip...\n"
if [ -f ".venv/bin/python" ]; then
    .venv/bin/python -m pip install --upgrade pip
else
    printf "${RED}[ERROR] Virtual environment Python binary not found at .venv/bin/python.${NC}\n"
    exit 1
fi

# Install dependencies
if [ -f "requirement.txt" ]; then
    printf "Installing dependencies from requirement.txt...\n"
    .venv/bin/python -m pip install -r requirement.txt
    if [ $? -ne 0 ]; then
        printf "${RED}[ERROR] Failed to install dependencies.${NC}\n"
        exit 1
    fi
else
    printf "${YELLOW}[WARNING] requirement.txt not found. Skipping installation.${NC}\n"
fi

printf "${GREEN}==========================================${NC}\n"
printf "${GREEN}Setup completed successfully!${NC}\n"
printf "${GREEN}==========================================${NC}\n"
