// scratch/test-range-headers.ts
import https from 'https';

const fileId = 'aMhqVA74'; // Enies Lobby Ep 1 ID
const url = `https://pixeldrain.net/api/file/${fileId}`;

console.log(`Sending Range request GET to ${url}...`);
https.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0',
    'Range': 'bytes=10000000-'
  }
}, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log('Headers:', JSON.stringify(res.headers, null, 2));
  process.exit(0);
}).on('error', (e) => {
  console.error('Error:', e.message);
  process.exit(1);
});
