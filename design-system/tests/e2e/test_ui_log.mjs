import { chromium } from 'playwright';
import path from 'path';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  const fileUrl = 'file://' + path.resolve('index.html');
  console.log('Navegando para:', fileUrl);
  await page.goto(fileUrl, { waitUntil: 'networkidle' });
  console.log('Página carregada com app.js limpo.');
  
  const canvasRendered = await page.evaluate(() => {
    return document.getElementById('renderCanvas') !== null;
  });
  console.log('Canvas existe?', canvasRendered);
  
  await browser.close();
})();
