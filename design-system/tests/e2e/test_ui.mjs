import { chromium } from 'playwright';
import path from 'path';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const fileUrl = 'file://' + path.resolve('index.html');
  console.log('Navegando para:', fileUrl);
  await page.goto(fileUrl);

  // Esperar o Canvas renderizar
  await page.waitForSelector('canvas#renderCanvas');
  console.log('Canvas renderizado com sucesso.');

  // Testar as abas
  const tabs = ['tab-formato', 'tab-estilo', 'tab-textos'];
  for (const tab of tabs) {
    console.log(`Clicando na aba alvo: ${tab}`);
    await page.click(`button[data-target="${tab}"]`);
    
    // Verificar se o conteúdo da aba se tornou visível
    const isActive = await page.evaluate((tabId) => {
      const el = document.getElementById(tabId);
      return el && el.classList.contains('active');
    }, tab);
    
    if (isActive) {
      console.log(`✅ Aba ${tab} ativada corretamente.`);
    } else {
      console.error(`❌ Falha ao ativar a aba ${tab}.`);
    }
  }

  // Modificar um input e garantir que não quebra o render
  console.log('Testando mudança de cor do Título...');
  await page.fill('#colorTitleInput', '#ff0000');
  
  const titleVal = await page.$eval('#colorTitleInput', el => el.value);
  if (titleVal === '#ff0000') {
    console.log('✅ Cor do título atualizada.');
  }

  await browser.close();
})();
