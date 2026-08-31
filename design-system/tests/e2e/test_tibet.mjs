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
  
  console.log('Verificando se o card de homenagem ao Tibete existe...');
  const tibetItem = await page.$('.gallery-thumb-item[data-id="tib3"]');
  if (tibetItem) {
    console.log('Card de homenagem encontrado. Clicando...');
    await tibetItem.click();
    
    // Validar título preenchido
    const titleVal = await page.$eval('#titleInput', el => el.value);
    console.log('Título carregado:', titleVal);
    if (titleVal === 'ORAÇÃO PELO TIBETE & NEPAL') {
      console.log('✅ Homenagem ao Tibete carregada com sucesso no estúdio!');
    }
  } else {
    console.error('❌ Card do Tibete não encontrado na galeria.');
  }

  await browser.close();
})();
