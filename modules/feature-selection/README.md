# Boston Housing Feature Selection (ALP-MIG-008)

## Overview

This module imports `gshan1209-cell/hw07` into AI Learning Portfolio, taking ownership of the 9 feature selection methods comparison, k=1..13 evaluation, and dataset ethics governance.

## Source Details

- **Source Repository**: `gshan1209-cell/hw07`
- **Branch**: `main`
- **Source Commit**: `91618e5e83812cb9fd0af3ded059dfd2731e821f`
- **Original Entry Point**: `scripts/generate_feature_selection_chart.py`
- **Target Demo Path**: `/regression-lab/feature-selection`

## Key Capabilities

1. **9 Feature Selection Methods**: Pearson, Spearman, F-test, Mutual Info, RFE, SFS, SBS, Lasso L1, Random Forest Importance.
2. **Ethical Mode (Default)**: Excludes controversial column `B` and warns about socio-economic proxy `LSTAT`.
3. **Historical Mode**: Requires explicit opt-in for historical algorithm reproduction.
4. **TypeScript Live Engine & Pre-computed Baseline**: Computes live Pearson & F-test while serving pre-computed scikit-learn baseline results JSON.
5. **API Endpoint**: `GET /api/ml-lab/feature-selection/results`.
