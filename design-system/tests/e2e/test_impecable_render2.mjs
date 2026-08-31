import { chromium } from 'playwright';
import path from 'path';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  const fileUrl = 'file://' + path.resolve('index.html');
  await page.goto(fileUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  const canvas = await page.$('canvas#renderCanvas');
  if (canvas) {
    await canvas.screenshot({ path: '/home/mat77/.gemini/antigravity/brain/d459f963-d5ba-40ac-b0b9-09272f2dad13/canvas_tighter_text_preview.png' });
    console.log('✅ Screenshot de validação do texto apertado gerado com sucesso!');
  }

  await browser.close();
})();
