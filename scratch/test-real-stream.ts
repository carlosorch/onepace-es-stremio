// scratch/test-real-stream.ts
import { handleStream } from '../src/handlers/stream';

async function test() {
  console.log('--- TESTING REAL RESOLUTION SUITE ---\n');

  // Test 1: Romance Dawn S1E1
  console.log('1. Testing handleStream with Romance Dawn S1E1 (onepace-es-v4:1:1)...');
  try {
    const res = await handleStream('series', 'onepace-es-v4:1:1');
    console.log(`✓ Streams returned: ${res.streams.length}`);
    res.streams.forEach((stream, i) => {
      console.log(`  Stream [${i + 1}]: Name: "${stream.name}", Title: "${stream.title.split('\n')[0]}", URL: "${stream.url || '(Torrent InfoHash)'}"`);
    });
  } catch (e: any) {
    console.error('✗ Test 1 failed:', e.message);
  }

  // Test 2: Post-Enies Lobby S20E1
  console.log('\n2. Testing handleStream with Post-Enies Lobby S20E1 (onepace-es-v4:20:1)...');
  try {
    const res = await handleStream('series', 'onepace-es-v4:20:1');
    console.log(`✓ Streams returned: ${res.streams.length}`);
    res.streams.forEach((stream, i) => {
      console.log(`  Stream [${i + 1}]: Name: "${stream.name}", Title: "${stream.title.split('\n')[0]}", URL: "${stream.url || '(Torrent InfoHash)'}"`);
    });
    
    // Verify that the direct stream is indeed present and prioritised first
    if (res.streams.length > 0 && res.streams[0].name === 'PixelDrain (Proxy)') {
      console.log('\n🌟 SUCCESS: PixelDrain direct stream was found and prioritised at index 0!');
    } else {
      console.warn('\n⚠️ WARNING: PixelDrain direct stream was not prioritised or found at index 0.');
    }
  } catch (e: any) {
    console.error('✗ Test 2 failed:', e.message);
  }

  console.log('\n--- TESTS COMPLETE ---');
}

test();
