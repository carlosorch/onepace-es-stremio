import * as fs from 'fs';
import * as path from 'path';
import { StremioMeta, StremioVideo } from '../types';
import { getArcThumbnail } from '../data/arc-images';

const dataPath = path.join(__dirname, '../data/data.json');

// Read and parse ladyisatis data.json
let dataBase: any = null;
try {
  const rawData = fs.readFileSync(dataPath, 'utf8');
  dataBase = JSON.parse(rawData);
  console.log('[Meta Handler] Loaded data.json successfully.');
} catch (e: any) {
  console.error('[Meta Handler] Error loading data.json:', e.message);
}

export async function handleMeta(type: string, id: string): Promise<{ meta: StremioMeta | null }> {
  console.log(`[Meta Handler] Received ID: "${id}"`);
  const decodedId = decodeURIComponent(id);
  console.log(`[Meta Handler] Decoded ID: "${decodedId}"`);
  if (type !== 'series' || !decodedId.startsWith('onepace-es-')) {
    return { meta: null };
  }

  if (!dataBase) {
    return { meta: null };
  }

  const videos: StremioVideo[] = [];

  // 1. Map standard official arcs
  for (const arc of dataBase.arcs.en) {
    const season = arc.part; // part number maps directly to season number
    const arcTitle = arc.title;

    for (const ep of arc.episodes || []) {
      const episodeNum = parseInt(ep.episode, 10);
      if (isNaN(episodeNum)) continue;

      const crcKey = ep.standard;
      const richEp = dataBase.episodes[crcKey];

      let title = `${arcTitle} - Episodio ${episodeNum}`;
      let overview = `Cubre los capítulos del manga: ${ep.manga_chapters || 'N/A'}`;
      let released = undefined;

      if (richEp) {
        title = richEp.title ? `${arcTitle} ${episodeNum}: ${richEp.title}` : title;
        overview = richEp.description || `Cubre los episodios del anime: ${richEp.anime_episodes || 'N/A'}. Manga: ${richEp.manga_chapters || 'N/A'}.`;
        if (richEp.released) {
          try {
            const parsedDate = new Date(richEp.released);
            if (!isNaN(parsedDate.getTime())) {
              released = parsedDate.toISOString();
            }
          } catch (e) {
            console.warn(`[Meta Handler] Failed to parse date: ${richEp.released}`);
          }
        }
      }

      // Format unique video ID matching the requested series ID exactly
      const videoId = `${id}:${season}:${episodeNum}`;

      videos.push({
        id: videoId,
        title,
        season,
        episode: episodeNum,
        overview,
        released,
        thumbnail: getArcThumbnail(season),
      });
    }
  }

  // 2. Append ZamuSkl's custom "Shaved Egghead" episodes (21 onwards)
  if (dataBase.other_edits?.shaved_egghead) {
    const shavedList = Object.values(dataBase.other_edits.shaved_egghead) as any[];
    // Sort by episode number
    shavedList.sort((a, b) => a.episode - b.episode);

    for (const ep of shavedList) {
      const season = 36; // Egghead is season 36
      const episodeNum = ep.episode;

      const videoId = `${id}:${season}:${episodeNum}`;
      
      // If we haven't already included this episode in the official list
      if (!videos.some(v => v.id === videoId)) {
        let title = `Egghead ${episodeNum}: ${ep.title}`;
        let overview = ep.description || `Edición fan-edit "Shaved Egghead / Kuma Cut" en español por ZamuSkl. Cubre los episodios del anime: ${ep.anime_episodes || 'N/A'}. Manga: ${ep.manga_chapters || 'N/A'}.`;
        let released: string | undefined = undefined;
        if (ep.released) {
          try {
            const parsedDate = new Date(ep.released);
            if (!isNaN(parsedDate.getTime())) {
              released = parsedDate.toISOString();
            }
          } catch (e) {
            console.warn(`[Meta Handler] Failed to parse date for shaved episode: ${ep.released}`);
          }
        }

        videos.push({
          id: videoId,
          title,
          season,
          episode: episodeNum,
          overview,
          released,
          thumbnail: getArcThumbnail(season),
        });
      }
    }
  }

  // Sort all videos in the TV show by season then episode number
  videos.sort((a, b) => {
    if (a.season !== b.season) return a.season - b.season;
    return a.episode - b.episode;
  });

  // Determine the base URL for self-hosted assets (logo, etc.)
  const baseUrl = process.env.BASE_URL || 'http://localhost:7000';

  const meta: StremioMeta = {
    id,
    type: 'series',
    name: 'One Pace en Español',
    posterShape: 'poster',
    poster: 'https://image.tmdb.org/t/p/w500/dB4EDhre2dsC2kxYDavyKWqLQwi.jpg',
    background: 'https://image.tmdb.org/t/p/original/4Mt7WHox67uJ1yErwTBFcV8KWgG.jpg',
    logo: `${baseUrl}/public/logo.png`,
    description: 'One Pace es un proyecto hecho por fans que recorta el anime One Piece para alinearlo con el ritmo del manga original de Eiichiro Oda, eliminando el relleno. Esta versión en español unifica el catálogo oficial (con subtítulos y audio en español integrados) y las ediciones fan-made de "Spanish Pace" (ediciones exclusivas en español para arcos no cubiertos oficialmente, como Wano 45+ y Egghead).',
    genres: ['Animación', 'Fantasía', 'Aventura', 'Acción', 'Anime'],
    releaseInfo: '1999-',
    videos,
  };

  return { meta };
}
