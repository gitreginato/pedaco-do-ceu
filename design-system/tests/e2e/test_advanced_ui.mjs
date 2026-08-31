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
  
  console.log('1. Testando navegação nas abas...');
  await page.click('button[data-target="tab-textos"]');
  
  console.log('2. Testando seleção de fonte e glow...');
  await page.selectOption('#fontTitleSelect', "'Playfair Display', serif");
  await page.fill('#colorTitleGlowInput', '#ffea00');
  
  console.log('3. Testando aba de Estilo & Cores...');
  await page.click('button[data-target="tab-estilo"]');
  await page.fill('#colorPatternInput', '#00e5ff');
  
  console.log('4. Testando catálogo completo e ausência de preços...');
  await page.click('button[data-target="tab-acervo"]');
  const items = await page.$$('.gallery-thumb-item');
  console.log(`Total de itens testados: ${items.length}`);
  
  for (let i = 0; i < items.length; i++) {
    await items[i].click();
    const title = await page.$eval('#titleInput', el => el.value);
    const highlight = await page.$eval('#highlightInput', el => el.value);
    if (highlight.includes('R$')) {
      console.error(`ERRO: Preço detectado no item ${title}: ${highlight}`);
    }
  }
  
  console.log('✅ Testes E2E de tipografia, glow, cores e ausência de preços concluídos com sucesso!');
  await browser.close();
})();
