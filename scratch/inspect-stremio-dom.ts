// scratch/inspect-stremio-dom.ts
import puppeteer from 'puppeteer';
import http from 'http';

// 1. Start the addon server dynamically on port 7000
console.log('Starting addon server...');
const PORT = 7000;
process.env.PORT = PORT.toString();
require('../src/index');

async function main() {
  await new Promise((r) => setTimeout(r, 2000)); // wait for server to start

  console.log('Launching headless browser...');
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Listen for console logs inside the page
    page.on('console', (msg) => console.log('[Browser Console]', msg.text()));

    console.log('Navigating to Stremio Web install URL...');
    const installUrl = `https://web.stremio.com/#/addons?addon=http%3A%2F%2F127.0.0.1%3A7000%2Fmanifest.json`;
    await page.goto(installUrl, { waitUntil: 'networkidle2' });

    console.log('Waiting 5 seconds for page rendering...');
    await new Promise((r) => setTimeout(r, 5000));

    // Get all buttons on the page
    const buttons = await page.evaluate(() => {
      const list: any[] = [];
      document.querySelectorAll('button, a, div[role="button"]').forEach((el: any) => {
        list.push({
          tagName: el.tagName,
          text: el.innerText || el.textContent,
          className: el.className,
          id: el.id
        });
      });
      return list;
    });

    console.log('\n--- FOUND INTERACTIVE ELEMENTS ---');
    console.log(JSON.stringify(buttons, null, 2));

    // Capture screen to log
    const screenshotPath = '/home/carlosorch/.gemini/antigravity-cli/brain/b86f4912-226e-4567-910a-e5900a57c8e2/inspect_install.png';
    await page.screenshot({ path: screenshotPath });
    console.log(`Captured screenshot to ${screenshotPath}`);

  } catch (err: any) {
    console.error('Error during DOM inspection:', err.message);
  } finally {
    console.log('Closing browser...');
    await browser.close();
    console.log('Exiting...');
    process.exit(0);
  }
}

main();
