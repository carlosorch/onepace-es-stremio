// scratch/test-ui.ts
import puppeteer from 'puppeteer';
import http from 'http';

// 1. Start the addon server dynamically on port 7000
console.log('Starting local addon server on port 7000...');
const PORT = 7000;
process.env.PORT = PORT.toString();
require('../src/index');

async function main() {
  await new Promise((r) => setTimeout(r, 2000)); // wait for server to start

  console.log('Launching headless browser with disabled security and Private Network Access checks...');
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--allow-running-insecure-content',
      '--disable-features=BlockInsecurePrivateNetworkRequests'
    ]
  });

  try {
    const page = await browser.newPage();
    
    // Set viewport to high resolution
    await page.setViewport({ width: 1280, height: 800 });

    // Track console messages from browser
    page.on('console', (msg) => {
      const txt = msg.text();
      if (txt.includes('ERROR') || txt.includes('failed') || txt.includes('mismatch')) {
        console.log('[Browser Console]', txt);
      }
    });

    console.log('1. Navigating to HTTP Stremio Web addon install page...');
    const installUrl = `http://web.stremio.com/#/addons?addon=http%3A%2F%2F127.0.0.1%3A7000%2Fmanifest.json`;
    await page.goto(installUrl, { waitUntil: 'networkidle2' });

    console.log('Waiting 6 seconds for installation prompt to appear...');
    await new Promise((r) => setTimeout(r, 6000));

    // Capture screen before install
    await page.screenshot({ path: '/home/carlosorch/.gemini/antigravity-cli/brain/b86f4912-226e-4567-910a-e5900a57c8e2/inspect_install.png' });

    // Look for the Install button in the DOM and click it
    console.log('2. Locating and clicking the "Install" button...');
    const clicked = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*')) as HTMLElement[];
      // Find the deepest element (leaf node) containing exactly the text 'install'
      const installBtn = elements.find(el => {
        const text = (el.innerText || el.textContent || '').trim().toLowerCase();
        return text === 'install' && el.children.length === 0;
      });
      if (installBtn) {
        installBtn.click();
        return true;
      }
      return false;
    });

    if (clicked) {
      console.log('✓ Successfully clicked "Install" button!');
    } else {
      console.log('⚠ "Install" button not found or already installed.');
    }

    console.log('Waiting 4 seconds for installation to register...');
    await new Promise((r) => setTimeout(r, 4000));

    console.log('3. Navigating directly to the TV Series Card (onepace-es-v4)...');
    const seriesUrl = `http://web.stremio.com/#/detail/series/onepace-es-v4`;
    await page.goto(seriesUrl, { waitUntil: 'networkidle2' });

    console.log('4. Waiting 8 seconds to verify UI remains active and stable...');
    await new Promise((r) => setTimeout(r, 8000));

    // Capture the final screen state
    const screenshotPath = '/home/carlosorch/.gemini/antigravity-cli/brain/b86f4912-226e-4567-910a-e5900a57c8e2/stremio_success.png';
    await page.screenshot({ path: screenshotPath });
    console.log(`✓ Headless UI Test complete! Screenshot saved to: ${screenshotPath}`);

  } catch (err: any) {
    console.error('✗ Headless UI Test failed:', err.message);
  } finally {
    console.log('Closing browser...');
    await browser.close();
    console.log('Exiting...');
    process.exit(0);
  }
}

main();
