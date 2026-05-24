import * as fs from 'fs';
import * as path from 'path';
import https from 'https';

const dataPath = path.join(__dirname, '../src/data/data.json');
const rawData = fs.readFileSync(dataPath, 'utf8');
const dataBase = JSON.parse(rawData);

async function fetchJson(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function parseAnimeEpisodes(str: string): number[] {
  // e.g. "1127", "1128-1129", "1137-1138"
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
  // Matches patterns like "1127+8", "1129", "1141+2", "1145-6", "375-376", "[375-430]"
  // We want to extract the episode numbers mentioned in the filename.
  // Let's clean up bracketed ranges like [375-430] first so they don't confuse us
  let cleaned = fileName.replace(/\[\d+-\d+\]/g, '');
  
  // Find patterns like "1127+8" or "1127+28" or "1127-1128" or "1127-28" or "1127-8"
  // Let's do a regex search for numbers
  const numRegex = /(\d+)(?:\+(\d+)|-(\d+))?/g;
  let match;
  const eps: number[] = [];
  
  while ((match = numRegex.exec(cleaned)) !== null) {
    const base = Number(match[1]);
    eps.push(base);
    
    if (match[2]) {
      // e.g. "1127+8" -> 1127 and 1128 (last digit replacement) or 1127 and 1128?
      // Wait, let's see. "1127+8" is 1127 and 1128. "1137+8" is 1137 and 1138.
      // "1139+40" is 1139 and 1140.
      // If the second part is shorter than the base, it might be replacing the last N digits.
      const secondPartStr = match[2];
      const baseStr = match[1];
      let secondNum = Number(secondPartStr);
      if (secondPartStr.length < baseStr.length) {
        const prefix = baseStr.slice(0, baseStr.length - secondPartStr.length);
        secondNum = Number(prefix + secondPartStr);
      }
      eps.push(secondNum);
    } else if (match[3]) {
      // e.g. "1145-6" -> 1145 and 1146, or "375-376" -> 375 and 376
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

async function main() {
  console.log('Fetching Enies Lobby list...');
  const elList = await fetchJson('https://pixeldrain.net/api/list/2tgKfjLs');
  console.log('Fetching Egghead list...');
  const egList = await fetchJson('https://pixeldrain.net/api/list/twEX2aRz');

  console.log('\n--- ENIES LOBBY MATCHING ---');
  // Enies Lobby (season 19)
  const elArc = dataBase.arcs.en.find((a: any) => a.part === 19);
  const elEps = elArc ? elArc.episodes : [];
  console.log(`Official Enies Lobby episodes count: ${elEps.length}`);

  for (const ep of elEps) {
    const episodeNum = parseInt(ep.episode, 10);
    const standardCrc = ep.standard;
    const richEp = dataBase.episodes[standardCrc];
    const epTitle = richEp ? richEp.title : `Episode ${episodeNum}`;
    
    // Find matching files in elList
    // Filename pattern: "[One Pace][375-376] Enies Lobby 01 [1080p][Es Sub]..."
    const matchingFiles = elList.files.filter((f: any) => {
      const match = f.name.match(/Enies Lobby\s+(\d+)/i);
      if (match) {
        return parseInt(match[1], 10) === episodeNum;
      }
      return false;
    });

    console.log(`Ep ${episodeNum} ("${epTitle}"):`);
    if (matchingFiles.length > 0) {
      matchingFiles.forEach((f: any) => {
        console.log(`  -> Match: [${f.id}] "${f.name}" (${(f.size/1024/1024).toFixed(1)} MiB)`);
      });
    } else {
      console.log('  -> NO MATCH FOUND');
    }
  }

  console.log('\n--- EGGHEAD MATCHING ---');
  // Egghead (season 36)
  const shavedList = Object.values(dataBase.other_edits.shaved_egghead) as any[];
  shavedList.sort((a, b) => a.episode - b.episode);
  console.log(`Shaved Egghead episodes count in data.json: ${shavedList.length}`);

  for (const ep of shavedList) {
    const episodeNum = ep.episode;
    const animeEps = parseAnimeEpisodes(ep.anime_episodes);
    
    // Find matching files in egList by matching anime episodes
    const matchingFiles = egList.files.filter((f: any) => {
      if (f.name.endsWith('.zip')) return false;
      const fileEps = parseFileNameEpisodes(f.name);
      // Check intersection
      return fileEps.some((fe: number) => animeEps.includes(fe));
    });

    console.log(`Ep ${episodeNum} (Anime: ${ep.anime_episodes} - "${ep.title}"):`);
    if (matchingFiles.length > 0) {
      matchingFiles.forEach((f: any) => {
        console.log(`  -> Match: [${f.id}] "${f.name}" (${(f.size/1024/1024).toFixed(1)} MiB)`);
      });
    } else {
      console.log('  -> NO MATCH FOUND');
    }
  }
}

main();
