export type DataMode = "snapshot" | "live" | "fallback";

export interface ProvenanceMetadata {
  mode: DataMode;
  source: string;
  sourceLabel: string;
  sourceUrl: string;
  fetchedAt: string;
  snapshotVersion?: string;
  dataHash?: string;
  stale?: boolean;
  notice?: string;
  fallbackReason?: string;
}

export interface WebLabRequestPolicy {
  allowlist: string[];
  timeoutMs: number;
  maxBodySizeBytes: number;
  cacheTtlSeconds: number;
}

export interface NormalizedErrorResponse {
  error: true;
  code: string;
  message: string;
  statusCode: number;
  timestamp: string;
  provenance?: ProvenanceMetadata;
}
