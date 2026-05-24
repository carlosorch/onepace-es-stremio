// scratch/test-real-stream.ts
import { handleStream } from '../src/handlers/stream';

async function test() {
  console.log('Testing handleStream with Romance Dawn S1E1: onepace-es-v4:1:1...');
  try {
    const res = await handleStream('series', 'onepace-es-v4:1:1');
    console.log('✓ handleStream executed successfully!');
    console.log(`Streams returned: ${res.streams.length}`);
    if (res.streams.length > 0) {
      console.log('Sample Stream:', JSON.stringify(res.streams[0], null, 2));
    }
    console.log('\n✓ Test complete! All streams resolved correctly without exceptions.');
  } catch (e: any) {
    console.error('✗ Test failed with error:', e.message);
    process.exit(1);
  }
}

test();
