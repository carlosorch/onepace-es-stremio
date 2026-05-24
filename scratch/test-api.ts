// scratch/test-api.ts
import { fetchArcs } from '../src/lib/onepace-api';

async function main() {
  console.log('Testing One Pace GraphQL API...');
  try {
    const arcs = await fetchArcs();
    console.log(`Successfully fetched ${arcs.length} arcs!`);
    
    // Print a sample arc
    if (arcs.length > 0) {
      const sampleArc = arcs[0];
      console.log('Sample Arc:', {
        id: sampleArc.id,
        title: sampleArc.title,
        invariant_title: sampleArc.invariant_title,
        part: sampleArc.part,
        episodesCount: sampleArc.episodes.length,
      });
      
      if (sampleArc.episodes.length > 0) {
        const sampleEp = sampleArc.episodes[0];
        console.log('Sample Episode:', {
          id: sampleEp.id,
          title: sampleEp.title,
          part: sampleEp.part,
          streams: sampleEp.streams,
        });
      }
    }
    
    // Check how many have Spanish subtitles or Spanish language streams
    // Let's also check if any Spanish streams exist or if they are just PixelDrain links
    let totalEpisodes = 0;
    let totalStreams = 0;
    let pixeldrainStreams = 0;
    for (const arc of arcs) {
      for (const ep of arc.episodes) {
        totalEpisodes++;
        totalStreams += ep.streams.length;
        for (const s of ep.streams) {
          if (s.url.includes('pixeldrain')) {
            pixeldrainStreams++;
          }
        }
      }
    }
    console.log(`Total episodes: ${totalEpisodes}, total streams: ${totalStreams}, pixeldrain streams: ${pixeldrainStreams}`);
  } catch (err) {
    console.error('Error fetching arcs:', err);
  }
}

main();
