// src/handlers/stream.ts
import * as fs from 'fs';
import * as path from 'path';
import https from 'https';
import { StremioStream } from '../types';
import { getStreamUrl } from '../lib/proxy';

const dataPath = path.join(__dirname, '../data/data.json');

// Read and parse ladyisatis data.json
let dataBase: any = null;
try {
  const rawData = fs.readFileSync(dataPath, 'utf8');
  dataBase = JSON.parse(rawData);
  console.log('[Stream Handler] Loaded data.json successfully.');
} catch (e: any) {
  console.error('[Stream Handler] Error loading data.json:', e.message);
}

// Caching structure for PixelDrain lists
interface PixelDrainFile {
  id: string;
  name: string;
  size: number;
}

interface CachedList {
  files: PixelDrainFile[];
  fetchedAt: number;
}

const listCache: Record<string, CachedList> = {};
const CACHE_DURATION_MS = 12 * 60 * 60 * 1000; // 12 hours cache

async function fetchPixelDrainList(listId: string): Promise<PixelDrainFile[]> {
  const now = Date.now();
  if (listCache[listId] && (now - listCache[listId].fetchedAt) < CACHE_DURATION_MS) {
    return listCache[listId].files;
  }

  console.log(`[Stream Handler] Fetching PixelDrain list ${listId} from API...`);
  return new Promise<PixelDrainFile[]>((resolve, reject) => {
    https.get(`https://pixeldrain.net/api/list/${listId}`, {
      headers: {
        'User-Agent': 'OnePaceES-Stremio/1.0',
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.success && Array.isArray(parsed.files)) {
            const files = parsed.files.map((f: any) => ({
              id: f.id,
              name: f.name,
              size: f.size,
            }));
            listCache[listId] = { files, fetchedAt: now };
            resolve(files);
          } else {
            console.warn(`[Stream Handler] PixelDrain list fetch returned success=false or missing files.`, parsed);
            resolve(listCache[listId]?.files || []); // Fallback to stale cache if available
          }
        } catch (e) {
          console.error('[Stream Handler] Error parsing PixelDrain list JSON:', e);
          resolve(listCache[listId]?.files || []);
        }
      });
    }).on('error', (err) => {
      console.error(`[Stream Handler] HTTPS error fetching list ${listId}:`, err.message);
      resolve(listCache[listId]?.files || []);
    });
  });
}

function parseAnimeEpisodes(str: string): number[] {
  if (!str) return [];
  if (str.includes('-')) {
    const [start, end] = str.split('-').map(Number);
    const eps = [];
    for (let i = start; i <= end; i++) {
      eps.push(i);
    }
    return eps;
  }
  return [Number(str)];
}

function parseFileNameEpisodes(fileName: string): number[] {
  let cleaned = fileName.replace(/\[\d+-\d+\]/g, '');
  const numRegex = /(\d+)(?:\+(\d+)|-(\d+))?/g;
  let match;
  const eps: number[] = [];
  
  while ((match = numRegex.exec(cleaned)) !== null) {
    const base = Number(match[1]);
    eps.push(base);
    
    if (match[2]) {
      const secondPartStr = match[2];
      const baseStr = match[1];
      let secondNum = Number(secondPartStr);
      if (secondPartStr.length < baseStr.length) {
        const prefix = baseStr.slice(0, baseStr.length - secondPartStr.length);
        secondNum = Number(prefix + secondPartStr);
      }
      eps.push(secondNum);
    } else if (match[3]) {
      const secondPartStr = match[3];
      const baseStr = match[1];
      let secondNum = Number(secondPartStr);
      if (secondPartStr.length < baseStr.length) {
        const prefix = baseStr.slice(0, baseStr.length - secondPartStr.length);
        secondNum = Number(prefix + secondPartStr);
      }
      for (let i = base + 1; i <= secondNum; i++) {
        eps.push(i);
      }
    }
  }
  return eps;
}

export async function handleStream(type: string, id: string): Promise<{ streams: StremioStream[] }> {
  const decodedId = decodeURIComponent(id);
  
  if (type !== 'series' || !decodedId.startsWith('onepace-es-')) {
    return { streams: [] };
  }

  if (!dataBase) {
    return { streams: [] };
  }

  const parts = decodedId.split(':');
  let season = 0;
  let episodeNum = 0;
  let bingeGroupPrefix = 'onepace-es';

  if (parts.length === 3) {
    // Format: onepace-es-vX:season:episode
    season = parseInt(parts[1], 10);
    episodeNum = parseInt(parts[2], 10);
    bingeGroupPrefix = parts[0];
  } else if (parts.length === 4) {
    // Format: onepace-es-vX:onepace:season:episode
    season = parseInt(parts[2], 10);
    episodeNum = parseInt(parts[3], 10);
    bingeGroupPrefix = parts[0];
  } else {
    return { streams: [] };
  }

  if (isNaN(season) || isNaN(episodeNum)) {
    return { streams: [] };
  }

  const streams: StremioStream[] = [];

  // 1. Add official torrent stream if available
  const arc = dataBase.arcs.en.find((a: any) => a.part === season);
  if (arc) {
    const epObj = arc.episodes.find((e: any) => parseInt(e.episode, 10) === episodeNum);
    if (epObj) {
      const crcKey = epObj.standard;
      const richEp = dataBase.episodes[crcKey];
      if (richEp && richEp.file && richEp.file.hash) {
        const fileHash = richEp.file.hash;
        const fileIdx = richEp.file.index ?? 0;
        const fileName = richEp.file.name || `Episode ${episodeNum}.mkv`;
        const fileSize = richEp.file.size || 'N/A';

        // Stremio supports torrents natively!
        streams.push({
          infoHash: fileHash,
          fileIdx: fileIdx,
          title: `🧲 Torrent • 1080p • Multi Audio (Subs ES)\n${fileName} (${fileSize})`,
          name: 'One Pace Torrent',
          sources: [
            'tracker:udp://tracker.opentrackr.org:1337/announce',
            'tracker:udp://open.stealth.si:80/announce',
            'tracker:udp://tracker.torrent.eu.org:451/announce',
            'tracker:udp://exodus.desync.com:6969/announce',
            'tracker:udp://tracker.coppersurfer.tk:6969/announce'
          ],
          behaviorHints: {
            bingeGroup: `${bingeGroupPrefix}-${season}`,
          }
        });
      }
    }
  }

  // 2. Add community PixelDrain streams
  // Enies Lobby (Season 19)
  if (season === 19) {
    try {
      const pdFiles = await fetchPixelDrainList('2tgKfjLs'); // Sanji993 Enies Lobby List
      const matchingFiles = pdFiles.filter((f) => {
        const match = f.name.match(/Enies Lobby\s+(\d+)/i);
        if (match) {
          return parseInt(match[1], 10) === episodeNum;
        }
        return false;
      });

      for (const file of matchingFiles) {
        const proxyUrl = getStreamUrl(file.id);
        const sizeMiB = (file.size / 1024 / 1024).toFixed(1);
        streams.push({
          url: proxyUrl,
          title: `📺 Direct Stream • Español Hardsub\n${file.name} (${sizeMiB} MiB)`,
          name: 'PixelDrain (Proxy)',
          behaviorHints: {
            notWebReady: true,
            bingeGroup: `${bingeGroupPrefix}-${season}`,
          }
        });
      }
    } catch (err: any) {
      console.error('[Stream Handler] Error adding Enies Lobby PixelDrain streams:', err.message);
    }
  }

  // Egghead (Season 36) - custom shaved egghead episodes (21 onwards)
  if (season === 36 && episodeNum >= 21) {
    try {
      const pdFiles = await fetchPixelDrainList('twEX2aRz'); // ZamuSkl Exclusives
      const shavedEgghead = dataBase.other_edits?.shaved_egghead;
      
      // Look up episode by episode number in shaved_egghead
      const epKey = Object.keys(shavedEgghead || {}).find(
        (key) => shavedEgghead[key].episode === episodeNum
      );
      
      if (epKey) {
        const richEp = shavedEgghead[epKey];
        const animeEps = parseAnimeEpisodes(richEp.anime_episodes);

        const matchingFiles = pdFiles.filter((f) => {
          if (f.name.endsWith('.zip')) return false;
          const fileEps = parseFileNameEpisodes(f.name);
          return fileEps.some((fe) => animeEps.includes(fe));
        });

        for (const file of matchingFiles) {
          const proxyUrl = getStreamUrl(file.id);
          const sizeMiB = (file.size / 1024 / 1024).toFixed(1);
          
          let title = `📺 Direct Stream • Shaved Egghead ES\n${file.name} (${sizeMiB} MiB)`;
          if (file.name.toLowerCase().includes('extended')) {
            title = `📺 Direct Stream (Versión Extendida) • Shaved Egghead ES\n${file.name} (${sizeMiB} MiB)`;
          }

          streams.push({
            url: proxyUrl,
            title,
            name: 'PixelDrain (Proxy)',
            behaviorHints: {
              notWebReady: true,
              bingeGroup: `${bingeGroupPrefix}-${season}`,
            }
          });
        }
      }
    } catch (err: any) {
      console.error('[Stream Handler] Error adding Egghead PixelDrain streams:', err.message);
    }
  }

  return { streams };
}
