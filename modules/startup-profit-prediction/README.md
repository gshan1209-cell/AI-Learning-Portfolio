# Startup Profit Prediction (ALP-MIG-007)

## Overview

This module imports `gshan1209-cell/machinelearningHw6-2` into AI Learning Portfolio, taking ownership of the 50 Startups dataset, Random Forest Regression pipeline, and profit prediction form.

## Source Details

- **Source Repository**: `gshan1209-cell/machinelearningHw6-2`
- **Branch**: `main`
- **Source Commit**: `cd4b4ae549ab9cecb83123447260b0b135a8d70e`
- **Original Entry Point**: `app/streamlit_app.py`, `app/fastapi_app.py`
- **Target Demo Path**: `/regression-lab/startup-profit`

## Key Capabilities

1. **Pure TypeScript Random Forest Engine**: Executes actual tree traversals against exported versioned tree model JSON (`startup_rf_model.json`).
2. **Interactive Form**: Prediction form for R&D Spend, Administration, Marketing Spend, and State.
3. **Golden Samples Verification**: Verified prediction consistency between Python scikit-learn and TypeScript engine.
4. **API Endpoint**: `POST /api/ml-lab/startup-profit/predict`.
