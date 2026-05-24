// scratch/analyze-local-metadata.ts
import * as fs from 'fs';
import * as path from 'path';

const arcsPath = path.join(__dirname, '../src/data/arcs.json');
const episodesPath = path.join(__dirname, '../src/data/episodes.json');

function main() {
  console.log('Loading local metadata files...');
  const arcs = JSON.parse(fs.readFileSync(arcsPath, 'utf8'));
  const episodesDict = JSON.parse(fs.readFileSync(episodesPath, 'utf8'));

  console.log(`Loaded ${arcs.length} arcs.`);
  console.log(`Loaded ${Object.keys(episodesDict).length} episode files in episodes.json dictionary.`);

  // Let's see some sample mappings
  let mappedCount = 0;
  let unmappedCount = 0;
  let infoHashCount = 0;
  let nyaaViewCount = 0;

  // Let's build a lookup map: arcId_episodeNumber -> episodeFile
  const episodeLookup: Record<string, any[]> = {};
  for (const [crc, epFile] of Object.entries(episodesDict)) {
    const key = `${(epFile as any).arc}_${(epFile as any).episode}`;
    if (!episodeLookup[key]) {
      episodeLookup[key] = [];
    }
    episodeLookup[key].push({ crc, ...(epFile as any) });
  }

  // Iterate over arcs and their episodes
  for (const arc of arcs) {
    const arcNum = arc.arc;
    const arcTitle = arc.title;
    
    for (const ep of arc.episodes) {
      const epNum = ep.episode;
      const key = `${arcNum}_${epNum}`;
      const matchingFiles = episodeLookup[key] || [];

      if (matchingFiles.length > 0) {
        mappedCount++;
        for (const file of matchingFiles) {
          const url = file.file?.url || '';
          if (url.includes('?q=')) {
            infoHashCount++;
          } else if (url.includes('nyaa.si/view/')) {
            nyaaViewCount++;
          }
        }
      } else {
        unmappedCount++;
      }
    }
  }

  console.log(`Total episodes in arcs.json: ${arcs.reduce((acc: number, a: any) => acc + a.episodes.length, 0)}`);
  console.log(`Mapped episodes: ${mappedCount}`);
  console.log(`Unmapped episodes: ${unmappedCount}`);
  console.log(`Files with infohash query (?q=): ${infoHashCount}`);
  console.log(`Files with nyaa.si view URL: ${nyaaViewCount}`);

  // Let's print a few examples of unmapped and mapped
  console.log('\n--- Sample Arc 1 (Romance Dawn) ---');
  const romanceDawn = arcs.find((a: any) => a.arc === 1);
  if (romanceDawn) {
    for (const ep of romanceDawn.episodes.slice(0, 3)) {
      const key = `1_${ep.episode}`;
      console.log(`RD Ep ${ep.episode}: "${ep.title}" -> Files:`, JSON.stringify(episodeLookup[key], null, 2));
    }
  }

  // Let's find an arc that has unmapped episodes
  console.log('\n--- Sample of Arcs with Unmapped Episodes ---');
  for (const arc of arcs) {
    const unmapped = [];
    for (const ep of arc.episodes) {
      const key = `${arc.arc}_${ep.episode}`;
      if (!episodeLookup[key]) {
        unmapped.push(ep.episode);
      }
    }
    if (unmapped.length > 0) {
      console.log(`Arc ${arc.arc}: "${arc.title}" has ${unmapped.length} unmapped episodes:`, unmapped.slice(0, 10));
    }
  }
}

main();
