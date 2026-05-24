// src/lib/onepace-api.ts
// Client for the One Pace GraphQL API (onepace.net/api/graphql)
// This is the primary data source - provides arcs, episodes, and PixelDrain stream URLs

import { OnePaceArc, CachedData, GraphQLResponse } from '../types';

const GRAPHQL_ENDPOINT = 'https://onepace.net/api/graphql';

// Cache TTL: 1 hour (API data doesn't change frequently)
const CACHE_TTL_MS = 60 * 60 * 1000;

let cache: CachedData | null = null;

const ARCS_QUERY = `
  query {
    arcs {
      id
      title
      part
      manga_chapters
      invariant_title
      images {
        src
      }
      episodes {
        id
        title
        part
        manga_chapters
        invariant_title
        released_at
        images {
          src
        }
        streams {
          url
        }
      }
    }
  }
`;

// We also try the localized query for Spanish titles
const ARCS_QUERY_ES = `
  query {
    arcs(locale: "es") {
      id
      title
      part
      manga_chapters
      invariant_title
      images {
        src
      }
      episodes {
        id
        title
        part
        manga_chapters
        invariant_title
        released_at
        images {
          src
        }
        streams {
          url
        }
      }
    }
  }
`;

async function fetchGraphQL(query: string): Promise<GraphQLResponse> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'OnePaceES-Stremio/1.0',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<GraphQLResponse>;
}

export async function fetchArcs(): Promise<OnePaceArc[]> {
  // Check cache
  if (cache && (Date.now() - cache.fetchedAt) < CACHE_TTL_MS) {
    return cache.arcs;
  }

  console.log('[OnePace API] Fetching arcs from GraphQL API...');

  try {
    // Try Spanish locale first
    const esResponse = await fetchGraphQL(ARCS_QUERY_ES);
    if (esResponse.data?.arcs?.length > 0) {
      console.log(`[OnePace API] Got ${esResponse.data.arcs.length} arcs (ES locale)`);
      cache = { arcs: esResponse.data.arcs, fetchedAt: Date.now() };
      return cache.arcs;
    }
  } catch (err) {
    console.warn('[OnePace API] Spanish locale query failed, falling back to default:', err);
  }

  // Fallback to default locale
  const response = await fetchGraphQL(ARCS_QUERY);
  if (!response.data?.arcs) {
    throw new Error('No arcs data in GraphQL response');
  }

  console.log(`[OnePace API] Got ${response.data.arcs.length} arcs (default locale)`);
  cache = { arcs: response.data.arcs, fetchedAt: Date.now() };
  return cache.arcs;
}

export function findArc(arcs: OnePaceArc[], arcId: string): OnePaceArc | undefined {
  return arcs.find(a => a.id === arcId || a.invariant_title === arcId);
}

export function findEpisode(arc: OnePaceArc, episodeId: string): OnePaceArc['episodes'][0] | undefined {
  return arc.episodes.find(e => e.id === episodeId);
}

export function clearCache(): void {
  cache = null;
}

// Extract PixelDrain file ID from a stream URL
// Input: "https://pixeldrain.com/api/file/XXXXX" or "https://pixeldrain.com/u/XXXXX"
export function extractPixelDrainId(url: string): string | null {
  const apiMatch = url.match(/pixeldrain\.com\/api\/file\/([a-zA-Z0-9]+)/);
  if (apiMatch) return apiMatch[1];

  const uMatch = url.match(/pixeldrain\.com\/u\/([a-zA-Z0-9]+)/);
  if (uMatch) return uMatch[1];

  const netMatch = url.match(/pixeldrain\.net\/(?:u|api\/file)\/([a-zA-Z0-9]+)/);
  if (netMatch) return netMatch[1];

  return null;
}

// Get the direct PixelDrain stream URL with optional auth
export function getPixelDrainStreamUrl(fileId: string, apiKey?: string): string {
  if (apiKey) {
    // Authenticated URL - enables hotlinking
    return `https://${apiKey}:@pixeldrain.com/api/file/${fileId}`;
  }
  // Unauthenticated - will be blocked by hotlink detection if accessed directly
  return `https://pixeldrain.com/api/file/${fileId}`;
}
