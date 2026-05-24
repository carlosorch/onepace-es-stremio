// scratch/test-pixeldrain-headers.ts
import https from 'https';

const fileId = 'aMhqVA74'; // Enies Lobby Ep 1 ID
const url = `https://pixeldrain.net/api/file/${fileId}`;

console.log(`Sending GET to ${url}...`);
https.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0'
  }
}, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log('Headers:', JSON.stringify(res.headers, null, 2));
  
  if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400) {
    console.log(`✓ REDIRECT DETECTED! Redirect location: ${res.headers.location}`);
  } else {
    console.log('No redirect detected.');
  }
  process.exit(0);
}).on('error', (e) => {
  console.error('Error:', e.message);
  process.exit(1);
});
