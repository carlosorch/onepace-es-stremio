// scratch/test-http-meta.ts
import http from 'http';

// Configure a temporary port
const PORT = 7085;
process.env.PORT = PORT.toString();

// Helper to make HTTP GET requests
async function getJson(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse JSON: ${data.slice(0, 100)}`));
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('Starting addon server dynamically...');
  // Import index.ts which starts the express server on process.env.PORT
  require('../src/index');

  // Wait a moment for server to start
  await new Promise((r) => setTimeout(r, 1000));

  try {
    console.log('\n[HTTP Test] Querying meta ID: /meta/series/onepace-es-v4.json');
    const cleanUrl = `http://localhost:${PORT}/meta/series/onepace-es-v4.json`;
    const resClean = await getJson(cleanUrl);
    
    if (!resClean || !resClean.meta) {
      throw new Error(`Invalid response for ID: ${JSON.stringify(resClean)}`);
    }
    console.log(`✓ HTTP meta.id: "${resClean.meta.id}"`);
    console.log(`✓ HTTP videos: ${resClean.meta.videos.length} items`);
    console.log(`✓ HTTP first video ID: "${resClean.meta.videos[0].id}"`);

    console.log('\n✓ HTTP Verification successful!');
    process.exit(0);
  } catch (err: any) {
    console.error('\n✗ HTTP Verification failed:', err.message);
    process.exit(1);
  }
}

main();
