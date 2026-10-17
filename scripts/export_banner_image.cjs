const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function exportBanner() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  if (!fs.existsSync(edgePath)) {
    console.error('Edge not found at:', edgePath);
    process.exit(1);
  }

  console.log('Launching browser via Edge...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 }); // Scale 2x for ultra-sharp crispness!

  const htmlPath = path.resolve(__dirname, '../public/banners/banner-pure-1080x1080.html');
  console.log('Loading HTML:', htmlPath);
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'networkidle0' });

  // Wait a moment for web fonts to fully render
  await new Promise(r => setTimeout(r, 1500));

  const outPath = path.resolve(__dirname, '../public/banners/banner-about-1080x1080.png');
  await page.screenshot({
    path: outPath,
    clip: { x: 0, y: 0, width: 1080, height: 1080 }
  });

  console.log('Exported banner PNG successfully to:', outPath);
  await browser.close();
}

exportBanner().catch(err => {
  console.error('Export error:', err);
  process.exit(1);
});
