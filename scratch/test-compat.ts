// scratch/test-compat.ts
import { handleCatalog } from '../src/handlers/catalog';
import { handleMeta } from '../src/handlers/meta';
import { handleStream } from '../src/handlers/stream';

async function test() {
  console.log('--- COMPATIBILITY SUITE TEST ---\n');

  // Test 1: v3 Catalog
  console.log('1. Testing handleCatalog with "onepace-es-v3"...');
  const catV3 = await handleCatalog('series', 'onepace-es-v3', {});
  console.log(`✓ v3 Catalog metas length: ${catV3.metas.length}`);
  console.log(`✓ v3 Catalog item ID: "${catV3.metas[0]?.id}"`);
  if (catV3.metas[0]?.id !== 'onepace-es-v3:onepace') {
    throw new Error('Expected v3 catalog item ID to be "onepace-es-v3:onepace"');
  }

  // Test 2: v4 Catalog
  console.log('\n2. Testing handleCatalog with "onepace-es-v4"...');
  const catV4 = await handleCatalog('series', 'onepace-es-v4', {});
  console.log(`✓ v4 Catalog metas length: ${catV4.metas.length}`);
  console.log(`✓ v4 Catalog item ID: "${catV4.metas[0]?.id}"`);
  if (catV4.metas[0]?.id !== 'onepace-es-v4') {
    throw new Error('Expected v4 catalog item ID to be "onepace-es-v4"');
  }

  // Test 3: v3 Meta
  console.log('\n3. Testing handleMeta with "onepace-es-v3:onepace"...');
  const metaV3 = await handleMeta('series', 'onepace-es-v3:onepace');
  console.log(`✓ v3 Meta ID returned: "${metaV3.meta?.id}"`);
  console.log(`✓ v3 Meta videos: ${metaV3.meta?.videos?.length} items`);
  console.log(`✓ v3 Meta first video ID: "${metaV3.meta?.videos?.[0]?.id}"`);
  if (metaV3.meta?.id !== 'onepace-es-v3:onepace') {
    throw new Error('Expected v3 meta ID to match exactly');
  }

  // Test 4: v4 Meta
  console.log('\n4. Testing handleMeta with "onepace-es-v4"...');
  const metaV4 = await handleMeta('series', 'onepace-es-v4');
  console.log(`✓ v4 Meta ID returned: "${metaV4.meta?.id}"`);
  console.log(`✓ v4 Meta videos: ${metaV4.meta?.videos?.length} items`);
  console.log(`✓ v4 Meta first video ID: "${metaV4.meta?.videos?.[0]?.id}"`);
  if (metaV4.meta?.id !== 'onepace-es-v4') {
    throw new Error('Expected v4 meta ID to match exactly');
  }

  // Test 5: v3 Stream
  console.log('\n5. Testing handleStream with "onepace-es-v3:onepace:1:1"...');
  const streamV3 = await handleStream('series', 'onepace-es-v3:onepace:1:1');
  console.log(`✓ v3 Streams count: ${streamV3.streams.length}`);
  console.log(`✓ v3 Stream title: "${streamV3.streams[0]?.title?.split('\n')[0]}"`);
  console.log(`✓ v3 Stream bingeGroup: "${streamV3.streams[0]?.behaviorHints?.bingeGroup}"`);

  // Test 6: v4 Stream
  console.log('\n6. Testing handleStream with "onepace-es-v4:1:1"...');
  const streamV4 = await handleStream('series', 'onepace-es-v4:1:1');
  console.log(`✓ v4 Streams count: ${streamV4.streams.length}`);
  console.log(`✓ v4 Stream title: "${streamV4.streams[0]?.title?.split('\n')[0]}"`);
  console.log(`✓ v4 Stream bingeGroup: "${streamV4.streams[0]?.behaviorHints?.bingeGroup}"`);

  // Test 7: v2 Stream
  console.log('\n7. Testing handleStream with "onepace-es-v2:onepace:1:1"...');
  const streamV2 = await handleStream('series', 'onepace-es-v2:onepace:1:1');
  console.log(`✓ v2 Streams count: ${streamV2.streams.length}`);
  console.log(`✓ v2 Stream title: "${streamV2.streams[0]?.title?.split('\n')[0]}"`);
  console.log(`✓ v2 Stream bingeGroup: "${streamV2.streams[0]?.behaviorHints?.bingeGroup}"`);

  console.log('\n🌟 ALL COMPATIBILITY TESTS PASSED SUCCESSFULLY! 🌟');
}

test().catch(e => {
  console.error('\n✗ Test suite failed with error:', e.message);
  process.exit(1);
});
