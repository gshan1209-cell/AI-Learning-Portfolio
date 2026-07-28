import type { DataMode, ProvenanceMetadata } from "../types";

export type MovieSource = "scrape-center" | "atmovies";
export type AtMoviesView = "new" | "now" | "next";

export interface MovieItem {
  id: string;
  title: string;
  originalTitle?: string;
  cover?: string;
  categories: string[];
  region?: string;
  duration?: string;
  releaseDate?: string;
  score?: string;
  theaters?: string;
  detailUrl: string;
  source: MovieSource;
  sourceLabel: string;
  dataMode?: DataMode;
}

export interface MovieResult {
  source: MovieSource;
  sourceLabel: string;
  sourceUrl: string;
  page: number;
  pageSize: number;
  total: number;
  movies: MovieItem[];
  categories: string[];
  atmoviesView?: AtMoviesView;
  filteredBy?: string;
  provenance: ProvenanceMetadata;
}
