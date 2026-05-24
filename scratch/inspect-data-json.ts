// scratch/inspect-data-json.ts
import * as fs from 'fs';
import * as path from 'path';

const dataPath = path.join(__dirname, '../src/data/data.json');

function main() {
  console.log('Loading data.json...');
  const rawData = fs.readFileSync(dataPath, 'utf8');
  const data = JSON.parse(rawData);

  console.log('Top-level keys in data.json:', Object.keys(data));

  console.log('Type of arcs:', typeof data.arcs);
  if (data.arcs) {
    const arcKeys = Object.keys(data.arcs);
    console.log(`Arcs keys count: ${arcKeys.length}`);
    console.log(`Sample Arc keys:`, arcKeys.slice(0, 10));
    const firstArcKey = arcKeys[0];
    console.log(`Sample Arc "${firstArcKey}":`, JSON.stringify(data.arcs[firstArcKey], null, 2));
  }

  console.log('Type of episodes:', typeof data.episodes);
  if (data.episodes) {
    const epKeys = Object.keys(data.episodes);
    console.log(`Episodes keys count: ${epKeys.length}`);
    console.log(`Sample Episode keys:`, epKeys.slice(0, 10));
    const firstEpKey = epKeys[0];
    console.log(`Sample Episode "${firstEpKey}":`, JSON.stringify(data.episodes[firstEpKey], null, 2));
  }

  console.log('Type of descriptions:', typeof data.descriptions);
  if (data.descriptions) {
    console.log('descriptions keys:', Object.keys(data.descriptions));
  }

  console.log('Type of other_edits:', typeof data.other_edits);
  if (data.other_edits) {
    console.log('other_edits keys:', Object.keys(data.other_edits));
    for (const key of Object.keys(data.other_edits)) {
      const edit = data.other_edits[key];
      console.log(`Other Edit "${key}":`, typeof edit, Array.isArray(edit) ? `array of ${edit.length}` : 'object');
      if (Array.isArray(edit) && edit.length > 0) {
        console.log(`Sample item from other_edits["${key}"]:`, JSON.stringify(edit[0], null, 2));
      }
    }
  }
}

main();
