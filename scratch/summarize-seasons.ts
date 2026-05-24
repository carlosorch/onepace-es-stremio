// scratch/summarize-seasons.ts
import * as fs from 'fs';
import * as path from 'path';

const dataPath = path.join(__dirname, '../src/data/data.json');
const rawData = fs.readFileSync(dataPath, 'utf8');
const dataBase = JSON.parse(rawData);

function main() {
  const seasonsMap: Record<number, number[]> = {};
  
  for (const arc of dataBase.arcs.en) {
    const season = arc.part; // part number maps directly to season number
    if (!seasonsMap[season]) {
      seasonsMap[season] = [];
    }

    for (const ep of arc.episodes || []) {
      const episodeNum = parseInt(ep.episode, 10);
      if (isNaN(episodeNum)) continue;
      seasonsMap[season].push(episodeNum);
    }
  }

  // 2. Append ZamuSkl's custom "Shaved Egghead" episodes (21 onwards)
  if (dataBase.other_edits?.shaved_egghead) {
    const shavedList = Object.values(dataBase.other_edits.shaved_egghead) as any[];
    shavedList.sort((a, b) => a.episode - b.episode);

    for (const ep of shavedList) {
      const season = 36; // Egghead is season 36
      const episodeNum = ep.episode;
      if (!seasonsMap[season]) {
        seasonsMap[season] = [];
      }
      if (!seasonsMap[season].includes(episodeNum)) {
        seasonsMap[season].push(episodeNum);
      }
    }
  }

  const sortedSeasons = Object.keys(seasonsMap).map(Number).sort((a, b) => a - b);
  console.log(`Unique seasons count: ${sortedSeasons.length}`);
  console.log(`Min season: ${sortedSeasons[0]}, Max season: ${sortedSeasons[sortedSeasons.length - 1]}`);
  
  // Check for gaps in seasons
  const gaps = [];
  for (let s = sortedSeasons[0]; s <= sortedSeasons[sortedSeasons.length - 1]; s++) {
    if (!seasonsMap[s]) {
      gaps.push(s);
    }
  }
  console.log(`Gaps in seasons: ${gaps.length > 0 ? gaps.join(', ') : 'None'}`);

  console.log('\nSeason details:');
  for (const s of sortedSeasons) {
    const eps = seasonsMap[s].sort((a, b) => a - b);
    console.log(`Season ${s.toString().padStart(2)}: ${eps.length.toString().padStart(3)} episodes (from ${eps[0]} to ${eps[eps.length - 1]})`);
  }
}

main();
