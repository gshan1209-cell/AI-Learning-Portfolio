import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { TSMC_STOCK_SNAPSHOT } from "@/lib/ml-lab/datasets/tsmc-stock";
import rfModelArtifact from "../../../../../../modules/startup-profit-prediction/artifacts/startup_rf_model.json";
import featureArtifact from "../../../../../../modules/feature-selection/artifacts/feature_selection_results.json";

export const dynamic = "force-dynamic";

interface DatasetMetadata {
  datasetKey: string;
  title: string;
  description: string;
  version: string;
  sha256: string;
  rowCount: number;
  schema: Array<{ name: string; type: string; description: string }>;
  sampleRecords: unknown[];
  metadata: Record<string, unknown>;
}

const ALLOWED_DATASETS = new Set(["tsmc-stock", "startup-50", "boston-housing"]);

function computeSha256(content: string): string {
  return crypto.createHash("sha256").update(content).digest("hex");
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { dataset: string } },
) {
  const datasetKey = (params.dataset || "").toLowerCase().trim();

  if (!ALLOWED_DATASETS.has(datasetKey)) {
    return NextResponse.json(
      {
        error: "Dataset not found in whitelist.",
        allowedDatasets: Array.from(ALLOWED_DATASETS),
      },
      {
        status: 404,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }

  let result: DatasetMetadata;

  if (datasetKey === "tsmc-stock") {
    const rawData = JSON.stringify(TSMC_STOCK_SNAPSHOT);
    result = {
      datasetKey: "tsmc-stock",
      title: "台積電 (2330.TW) 歷史股價與移動平均快照",
      description: "包含 2024 年 1 月份台積電股價、5 日／20 日移動平均與成交量快照。",
      version: "v1.0.0-snapshot",
      sha256: computeSha256(rawData),
      rowCount: TSMC_STOCK_SNAPSHOT.length,
      schema: [
        { name: "date", type: "string", description: "交易日期 (YYYY-MM-DD)" },
        { name: "open", type: "number", description: "開盤價 (TWD)" },
        { name: "high", type: "number", description: "最高價 (TWD)" },
        { name: "low", type: "number", description: "最低價 (TWD)" },
        { name: "close", type: "number", description: "當日收盤價 (TWD)" },
        { name: "volume", type: "number", description: "成交股數" },
        { name: "ma5", type: "number", description: "5 日移動平均線" },
        { name: "ma20", type: "number", description: "20 日移動平均線" },
      ],
      sampleRecords: TSMC_STOCK_SNAPSHOT,
      metadata: {
        ticker: "2330.TW",
        source: "Regression Lab Snapshot Data",
        splitMethod: "Forward Time-Series Split (No Leakage)",
      },
    };
  } else if (datasetKey === "startup-50") {
    const rfMeta = (rfModelArtifact as { metadata: Record<string, unknown> }).metadata;
    const rowCount = Number(rfMeta.datasetRows || 0);
    result = {
      datasetKey: "startup-50",
      title: "50 Startups 教學資料｜新創公司營運支出與利潤",
      description: `來源檔沿用 50 Startups 名稱，本次實際移植資料為 ${rowCount} 筆。`,
      version: `v1.0.0-legacy-${rowCount}rows`,
      sha256: String(rfMeta.datasetHash || ""),
      rowCount,
      schema: [
        { name: "R&D Spend", type: "number", description: "研發支出 (USD)" },
        { name: "Administration", type: "number", description: "行政管理支出 (USD)" },
        { name: "Marketing Spend", type: "number", description: "行銷推廣支出 (USD)" },
        { name: "State", type: "string", description: "企業註冊州別 (New York, California, Florida)" },
        { name: "Profit", type: "number", description: "企業淨利潤 (USD)" },
      ],
      sampleRecords: (rfModelArtifact as { goldenSamples: unknown[] }).goldenSamples,
      metadata: {
        sourceRepository: rfMeta.sourceRepository,
        sourceCommit: rfMeta.sourceCommit,
        datasetNote: `來源檔 50_Startups.csv 實際包含 ${rowCount} 筆紀錄`,
        categoricalEncoding: rfMeta.categoricalEncoding,
      },
    };
  } else {
    const featureMetadata = (featureArtifact as { metadata: Record<string, unknown> }).metadata;
    result = {
      datasetKey: "boston-housing",
      title: "Boston Housing 房屋定價與社會人口變數資料集",
      description: "包含 506 筆波士頓郊區房屋特徵與房價中位數 (MEDV)。",
      version: "v1.0.0",
      sha256: String(featureMetadata.datasetHash || ""),
      rowCount: Number(featureMetadata.totalRows || 506),
      schema: [
        { name: "CRIM", type: "number", description: "城鎮人均犯罪率" },
        { name: "ZN", type: "number", description: "住宅用地比例 (超過 25,000 sq.ft)" },
        { name: "INDUS", type: "number", description: "非零售商業用地比例" },
        { name: "CHAS", type: "number", description: "查爾斯河虛擬變數 (1 臨河；0 否)" },
        { name: "NOX", type: "number", description: "一氧化氮濃度" },
        { name: "RM", type: "number", description: "每戶平均房間數" },
        { name: "AGE", type: "number", description: "1940 年前建成的業主自佔房屋比例" },
        { name: "DIS", type: "number", description: "加權距離至 5 個波士頓就業中心" },
        { name: "RAD", type: "number", description: "輻射狀公路可達性指數" },
        { name: "TAX", type: "number", description: "每萬美元的全額物業稅率" },
        { name: "PTRATIO", type: "number", description: "城鎮師生比例" },
        { name: "B", type: "number", description: "具爭議的歷史人口變數（Ethical Mode 預設排除）" },
        { name: "LSTAT", type: "number", description: "低社經地位人口百分比" },
        { name: "MEDV", type: "number", description: "業主自佔房屋價格中位數（千美元，目標變數）" },
      ],
      sampleRecords: [],
      metadata: {
        ethicalGovernance: "Ethical Mode (Default) excludes column B before model selection.",
        ethicalFeaturesCount: featureMetadata.ethicalFeaturesCount,
        historicalFeaturesCount: featureMetadata.historicalFeaturesCount,
      },
    };
  }

  return NextResponse.json(result, {
    headers: { "Cache-Control": "no-store" },
  });
}
