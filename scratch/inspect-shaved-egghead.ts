import * as fs from 'fs';
import * as path from 'path';

const dataPath = path.join(__dirname, '../src/data/data.json');
const rawData = fs.readFileSync(dataPath, 'utf8');
const data = JSON.parse(rawData);

const shavedList = Object.values(data.other_edits.shaved_egghead) as any[];
shavedList.sort((a, b) => a.episode - b.episode);

console.log('Shaved Egghead Episodes:');
for (const ep of shavedList) {
  console.log(`Episode: ${ep.episode} | Title: "${ep.title}" | Anime: ${ep.anime_episodes} | Manga: ${ep.manga_chapters}`);
}
