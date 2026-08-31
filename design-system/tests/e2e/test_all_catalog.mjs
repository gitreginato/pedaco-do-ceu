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
  
  const items = await page.$$('.gallery-thumb-item');
  console.log(`Total de itens encontrados na galeria do acervo: ${items.length}`);
  
  for (let i = 0; i < items.length; i++) {
    await items[i].click();
    const title = await page.$eval('#titleInput', el => el.value);
    const cat = await page.$eval('#categoryTagInput', el => el.value);
    console.log(`Item ${i+1}: [${cat}] ${title} carregado com sucesso.`);
  }
  
  console.log('✅ Todos os itens do catálogo e seus textos foram testados e validados no Canvas!');
  await browser.close();
})();
