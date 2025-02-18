import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

async function generateBrandAssets() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          margin: 0;
          padding: 0;
          background: transparent;
          font-family: system-ui, -apple-system, sans-serif;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .brand {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          padding: 2rem;
          transform: scale(4);
        }
        .logo {
          height: 3.5rem;
          width: 3.5rem;
        }
        .name {
          font-weight: 600;
          font-size: 2.25rem;
          line-height: 1;
          color: rgb(49 46 129);
        }
        .symbol-only {
          transform: scale(8);
        }
        .symbol-only .name {
          display: none;
        }
      </style>
    </head>
    <body>
      <div class="brand">
        <img src="file://${path.resolve(__dirname, '../public/favicon.svg')}" class="logo" />
        <span class="name">Sparkier</span>
      </div>
    </body>
    </html>
  `;

  // Write HTML to a temporary file
  const tempHtmlPath = path.join(__dirname, 'temp.html');
  fs.writeFileSync(tempHtmlPath, html);

  // Generate full logo
  await page.goto(`file://${tempHtmlPath}`);
  await page.setViewport({ width: 1280, height: 528 });
  await page.screenshot({
    path: path.join(__dirname, '../public/images/brand-logo.png'),
    omitBackground: true
  });

  // Generate symbol
  const symbolHtml = html.replace('class="brand"', 'class="brand symbol-only"');
  fs.writeFileSync(tempHtmlPath, symbolHtml);
  await page.goto(`file://${tempHtmlPath}`);
  await page.setViewport({ width: 512, height: 512 });
  await page.screenshot({
    path: path.join(__dirname, '../public/images/brand-symbol.png'),
    omitBackground: true
  });

  // Cleanup
  fs.unlinkSync(tempHtmlPath);
  await browser.close();
}

generateBrandAssets().catch(console.error); 