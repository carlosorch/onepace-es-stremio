// src/types.ts
// Type definitions for the One Pace GraphQL API and addon data

export interface OnePaceImage {
  src: string;
}

export interface OnePaceStream {
  url: string;
}

export interface OnePaceEpisode {
  id: string;
  title: string;
  part: number;
  manga_chapters: string;
  invariant_title: string;
  released_at: string | null;
  images: OnePaceImage[];
  streams: OnePaceStream[];
}

export interface OnePaceArc {
  id: string;
  title: string;
  part: number;
  manga_chapters: string;
  invariant_title: string;
  images: OnePaceImage[];
  episodes: OnePaceEpisode[];
}

export interface GraphQLResponse {
  data: {
    arcs: OnePaceArc[];
  };
}

// Stremio SDK types (minimal, since @types aren't available)
export interface StremioMeta {
  id: string;
  type: string;
  name: string;
  poster?: string;
  posterShape?: 'poster' | 'square' | 'landscape';
  background?: string;
  description?: string;
  releaseInfo?: string;
  genres?: string[];
  videos?: StremioVideo[];
  logo?: string;
}

export interface StremioVideo {
  id: string;
  title: string;
  season: number;
  episode: number;
  released?: string;
  overview?: string;
  thumbnail?: string;
}

export interface StremioStream {
  url?: string;
  infoHash?: string;
  fileIdx?: number;
  title?: string;
  name?: string;
  description?: string;
  sources?: string[];
  subtitles?: StremioSubtitle[];
  behaviorHints?: {
    notWebReady?: boolean;
    bingeGroup?: string;
    proxyHeaders?: {
      request?: Record<string, string>;
    };
  };
}

export interface StremioSubtitle {
  id: string;
  url: string;
  lang: string;
}

export interface CachedData {
  arcs: OnePaceArc[];
  fetchedAt: number;
}
