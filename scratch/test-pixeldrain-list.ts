// scratch/test-pixeldrain-list.ts
import http from 'http';
import https from 'https';

async function fetchJson(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  const lists = [
    { name: 'ZamuSkl Exclusives', id: 'twEX2aRz' },
    { name: 'Sanji993 Enies Lobby', id: '2tgKfjLs' }
  ];

  for (const list of lists) {
    console.log(`\nFetching list "${list.name}" (${list.id})...`);
    try {
      const data = await fetchJson(`https://pixeldrain.net/api/list/${list.id}`);
      console.log(`List status: ${data.success ? 'Success' : 'Failed'}`);
      console.log(`Title: ${data.title}`);
      console.log(`Files count: ${data.files ? data.files.length : 0}`);
      if (data.files && data.files.length > 0) {
        console.log('Files list:');
        data.files.forEach((f: any, idx: number) => {
          console.log(`  [${idx + 1}] ID: ${f.id} | Size: ${(f.size / 1024 / 1024).toFixed(1)} MiB | Name: "${f.name}"`);
        });
      }
    } catch (e: any) {
      console.error(`Error fetching list ${list.id}:`, e.message);
    }
  }
}

main();
