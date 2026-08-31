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
  
  console.log('1. Testando renderização com Portal de Ouro...');
  await page.waitForTimeout(500);
  
  console.log('2. Alternando para Fusão Imersiva...');
  await page.click('div[data-fit="fusion"]');
  await page.waitForTimeout(300);

  console.log('3. Alternando de volta para Portal de Ouro...');
  await page.click('div[data-fit="portal"]');
  await page.waitForTimeout(300);

  // Capturar screenshot do canvas para validação
  const canvas = await page.$('canvas#renderCanvas');
  if (canvas) {
    await canvas.screenshot({ path: '/home/mat77/.gemini/antigravity/brain/d459f963-d5ba-40ac-b0b9-09272f2dad13/canvas_impecable_preview.png' });
    console.log('✅ Screenshot de validação gerado com sucesso!');
  }

  await browser.close();
})();
