// scratch/test-real-meta.ts
import { handleMeta } from '../src/handlers/meta';

async function test() {
  console.log('Testing handleMeta with clean ID onepace-es-v4...');
  const resClean = await handleMeta('series', 'onepace-es-v4');
  if (!resClean.meta) {
    throw new Error('Clean ID returned null meta!');
  }
  console.log(`Clean ID meta.id: "${resClean.meta.id}"`);
  console.log(`Clean ID videos count: ${resClean.meta.videos?.length}`);
  if (resClean.meta.videos && resClean.meta.videos.length > 0) {
    console.log(`Clean ID first video id: "${resClean.meta.videos[0].id}"`);
    console.log(`Clean ID last video id: "${resClean.meta.videos[resClean.meta.videos.length - 1].id}"`);
  }

  console.log('\nTesting complete! All cases resolved successfully.');
}

test().catch(e => {
  console.error('Test failed:', e);
  process.exit(1);
});
