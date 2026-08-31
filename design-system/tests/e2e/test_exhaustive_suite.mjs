import { chromium } from 'playwright';
import path from 'path';

(async () => {
  console.log('====================================================');
  console.log('🚀 INICIANDO SUÍTE EXAUSTIVA DE TESTES E2E NO STUDIO');
  console.log('====================================================');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const errors = [];
  const warnings = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('🔴 BROWSER CONSOLE ERROR:', msg.text());
      errors.push(msg.text());
    } else if (msg.type() === 'warning') {
      warnings.push(msg.text());
    }
  });

  page.on('pageerror', error => {
    console.error('🔥 BROWSER PAGE CRASH / UNCAUGHT EXCEPTION:', error.message);
    errors.push(error.message);
  });

  const fileUrl = 'file://' + path.resolve('index.html');
  console.log(`📍 Navegando para: ${fileUrl}`);
  await page.goto(fileUrl, { waitUntil: 'networkidle' });

  // TESTE 1: Estrutura Base e Viewport Fixa
  console.log('\n--- TESTE 1: Estrutura Base e Estabilidade do Viewport ---');
  const canvasExists = await page.$eval('#renderCanvas', el => el !== null);
  console.log('Canvas existe na DOM:', canvasExists);

  const initialTop = await page.$eval('.studio-viewport', el => el.getBoundingClientRect().top);
  await page.evaluate(() => {
    const container = document.querySelector('.tabs-container');
    if (container) container.scrollTop = 500;
  });
  const scrolledTop = await page.$eval('.studio-viewport', el => el.getBoundingClientRect().top);
  if (initialTop === scrolledTop) {
    console.log('✅ Viewport e Canvas 100% fixos durante rolagem da sidebar.');
  } else {
    errors.push(`Viewport se moveu de ${initialTop} para ${scrolledTop}`);
  }

  // TESTE 2: Navegação e Interação na Aba [Acervo & Fotos]
  console.log('\n--- TESTE 2: Navegação na Aba [Acervo & Fotos] ---');
  await page.click('button[data-target="tab-acervo"]');
  const thumbs = await page.$$('.gallery-thumb-item');
  console.log(`Total de miniaturas no catálogo: ${thumbs.length}`);

  for (let i = 0; i < Math.min(thumbs.length, 5); i++) {
    await thumbs[i].click();
    await page.waitForTimeout(50);
  }
  console.log('✅ Clicadas miniaturas do catálogo com sucesso.');

  // Testar estilos de enquadramento
  await page.click('div[data-fit="portal"]');
  await page.waitForTimeout(50);
  await page.click('div[data-fit="fusion"]');
  await page.waitForTimeout(50);
  await page.click('div[data-fit="cover"]');
  await page.waitForTimeout(50);
  await page.click('div[data-fit="portal"]');
  console.log('✅ Modos de enquadramento testados (Portal, Fusão, Cover).');

  // TESTE 3: Aba [Textos & Tipografia]
  console.log('\n--- TESTE 3: Aba [Textos & Tipografia] ---');
  await page.click('button[data-target="tab-textos"]');
  await page.waitForTimeout(100);

  // Alinhamento
  await page.click('div[data-align="left"]');
  await page.click('div[data-align="right"]');
  await page.click('div[data-align="center"]');

  // Input de textos e fontes
  await page.fill('#titleInput', 'PEDAÇO DO CÉU ARTES');
  await page.selectOption('#fontTitleSelect', "'Playfair Display', serif");
  await page.selectOption('#weightTitleSelect', '900');
  await page.fill('#colorTitleInput', '#ffffff');
  await page.fill('#colorTitleGlowInput', '#ffd700');
  
  await page.fill('#subtitleInput', 'Santuário de Sabedoria Ancestral');
  await page.selectOption('#fontSubtitleSelect', "'Cormorant Garamond', serif");

  await page.fill('#descriptionInput', 'Purifique sua alma e renove as energias do seu lar com peças forjadas no fogo sagrado da fé e tradição.');
  await page.fill('#highlightInput', '✦ Frequência 432Hz • Proteção da Chama Azul • Equilíbrio Sagrado');

  console.log('✅ Textos, fontes e seletores tipográficos alterados.');

  // TESTE 4: Aba [Cores & Grafismos]
  console.log('\n--- TESTE 4: Aba [Cores & Grafismos] ---');
  await page.click('button[data-target="tab-estilo"]');
  await page.waitForTimeout(100);

  await page.fill('#gradientPrimaryInput', '#002914');
  await page.fill('#gradientSecondaryInput', '#00572b');
  await page.fill('#gradientDarknessInput', '#030805');
  await page.selectOption('#sacredPatternSelect', 'metatronCube');
  await page.fill('#colorPatternInput', '#f5d77f');
  await page.fill('#colorCornersInput', '#f5d77f');
  await page.fill('#colorDividersInput', '#f5d77f');
  console.log('✅ Paleta de cores e grafismos sagrados aplicados.');

  // TESTE 5: Aba [Formato & Layout]
  console.log('\n--- TESTE 5: Aba [Formato & Layout] ---');
  await page.click('button[data-target="tab-formato"]');
  await page.waitForTimeout(100);

  // Formatos
  const formats = ['1:1', '4:5', '9:16-story', '9:16-tiktok'];
  for (const fmt of formats) {
    await page.click(`div[data-format="${fmt}"]`);
    await page.waitForTimeout(100);
  }
  await page.click('div[data-format="1:1"]');

  // Layouts
  const layouts = ['bottom', 'top', 'center', 'right'];
  for (const l of layouts) {
    await page.click(`div[data-layout="${l}"]`);
    await page.waitForTimeout(100);
    const canvas = await page.$('canvas#renderCanvas');
    if (canvas) {
      await canvas.screenshot({ path: `/home/mat77/.gemini/antigravity/brain/d459f963-d5ba-40ac-b0b9-09272f2dad13/canvas_layout_${l}.png` });
    }
  }
  console.log('✅ Todos os formatos e layouts renderizados e capturados.');

  // Capturar estado final completo da página
  await page.screenshot({ path: '/home/mat77/.gemini/antigravity/brain/d459f963-d5ba-40ac-b0b9-09272f2dad13/page_full_studio_test.png', fullPage: true });

  await browser.close();

  console.log('\n====================================================');
  if (errors.length === 0) {
    console.log('🎉 TODOS OS COMPONENTES E GATES PASSARAM COM ZERO ERROS!');
  } else {
    console.error(`❌ FALHA: ${errors.length} erro(s) encontrado(s):`, errors);
  }
  console.log('====================================================');
})();
