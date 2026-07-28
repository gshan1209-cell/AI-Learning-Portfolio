import crypto from "node:crypto";
import type { DataMode, ProvenanceMetadata } from "./types";

export function computeDataHash(data: unknown): string {
  const json = JSON.stringify(data);
  return crypto.createHash("sha256").update(json).digest("hex");
}

export function createProvenanceMetadata(params: {
  mode: DataMode;
  source: string;
  sourceLabel: string;
  sourceUrl: string;
  dataHash?: string;
  snapshotVersion?: string;
  notice?: string;
  fallbackReason?: string;
}): ProvenanceMetadata {
  return {
    mode: params.mode,
    source: params.source,
    sourceLabel: params.sourceLabel,
    sourceUrl: params.sourceUrl,
    fetchedAt: new Date().toISOString(),
    snapshotVersion: params.snapshotVersion,
    dataHash: params.dataHash,
    stale: false,
    notice: params.notice,
    fallbackReason: params.fallbackReason,
  };
}
