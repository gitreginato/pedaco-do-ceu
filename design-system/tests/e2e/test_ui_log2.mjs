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
  
  console.log('Clicando na Aba de Formato...');
  await page.click('button[data-target="tab-formato"]');
  
  console.log('Testando mudança de layout para bottom...');
  await page.click('div[data-layout="bottom"]');

  console.log('Testando preset...');
  await page.click('button[data-target="tab-acervo"]');
  await page.click('button[data-preset="arcanjo"]');

  console.log('Tudo executado sem crash na UI.');
  await browser.close();
})();
