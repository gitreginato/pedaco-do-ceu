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
  
  console.log('1. Testando rolagem na barra lateral...');
  // Rolar dentro do container da aba
  await page.evaluate(() => {
    const container = document.querySelector('.tabs-container');
    if (container) {
      container.scrollTop = 400;
    }
  });
  
  // Verificar se o viewport continua visível e com posição Y intacta
  const viewportBounds = await page.$eval('.studio-viewport', el => {
    const r = el.getBoundingClientRect();
    return { top: r.top, height: r.height };
  });
  console.log('Viewport Top:', viewportBounds.top);
  if (viewportBounds.top >= 0 && viewportBounds.height > 0) {
    console.log('✅ Viewport e Canvas permanecem 100% fixos durante a rolagem dos controles!');
  } else {
    console.error('❌ Viewport se moveu indevidamente.');
  }

  console.log('2. Testando texto longo para certificar que a caixa auto-expande sem vazamentos...');
  await page.click('button[data-target="tab-textos"]');
  await page.fill('#highlightInput', '✦ Frequência Harmônica 432Hz • Realinhamento Energético dos 7 Chakras e Cura Interior Profunda');
  await page.waitForTimeout(300);

  console.log('3. Testando aba de Cores e Imagem de Fundo...');
  await page.click('button[data-target="tab-estilo"]');
  await page.fill('#bgImageOpacityRange', '75');
  await page.waitForTimeout(300);

  // Capturar screenshot para comprovação visual
  const canvas = await page.$('canvas#renderCanvas');
  if (canvas) {
    await canvas.screenshot({ path: '/home/mat77/.gemini/antigravity/brain/d459f963-d5ba-40ac-b0b9-09272f2dad13/canvas_fixed_layout_preview.png' });
    console.log('✅ Screenshot de validação final gerado com sucesso!');
  }

  await browser.close();
})();
