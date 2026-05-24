// scratch/check-duplicates.ts
import * as fs from 'fs';
import * as path from 'path';

const dataPath = path.join(__dirname, '../src/data/data.json');
const rawData = fs.readFileSync(dataPath, 'utf8');
const dataBase = JSON.parse(rawData);

function main() {
  const videos: any[] = [];
  
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
          released = `${richEp.released}T00:00:00.000Z`;
        }
      }

      const videoId = `onepace-es-v3:onepace:${season}:${episodeNum}`;
      videos.push({
        id: videoId,
        title,
        season,
        episode: episodeNum,
        overview,
        released,
      });
    }
  }

  // 2. Append ZamuSkl's custom "Shaved Egghead" episodes (21 onwards)
  if (dataBase.other_edits?.shaved_egghead) {
    const shavedList = Object.values(dataBase.other_edits.shaved_egghead) as any[];
    shavedList.sort((a, b) => a.episode - b.episode);

    for (const ep of shavedList) {
      const season = 36; // Egghead is season 36
      const episodeNum = ep.episode;
      const videoId = `onepace-es-v3:onepace:${season}:${episodeNum}`;
      
      if (!videos.some(v => v.id === videoId)) {
        let title = `Egghead ${episodeNum}: ${ep.title}`;
        let overview = ep.description || `Edición fan-edit "Shaved Egghead / Kuma Cut" en español por ZamuSkl. Cubre los episodios del anime: ${ep.anime_episodes || 'N/A'}. Manga: ${ep.manga_chapters || 'N/A'}.`;
        let released = ep.released ? `${ep.released}T00:00:00.000Z` : undefined;

        videos.push({
          id: videoId,
          title,
          season,
          episode: episodeNum,
          overview,
          released,
        });
      }
    }
  }

  // Sort all videos
  videos.sort((a, b) => {
    if (a.season !== b.season) return a.season - b.season;
    return a.episode - b.episode;
  });

  // Check for duplicates
  const seen = new Set<string>();
  let duplicates = 0;
  for (const v of videos) {
    const key = `${v.season}:${v.episode}`;
    if (seen.has(key)) {
      console.log(`Duplicate found for season:episode -> ${key}`, v);
      duplicates++;
    }
    seen.add(key);
  }

  console.log(`\nChecked ${videos.length} videos.`);
  console.log(`Total duplicate season:episode combinations: ${duplicates}`);
}

main();
