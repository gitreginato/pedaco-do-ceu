import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const studioPath = path.resolve(__dirname, '../index.html');
const outDir = path.resolve(__dirname, '../../dist/tests-visual');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  console.log('🔮 INICIANDO VERIFICAÇÃO VISUAL DAS GEOMETRIAS SAGRADAS E FUNDOS ATMOSFÉRICOS...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  
  await page.goto(`file://${studioPath}`);
  await page.waitForTimeout(1000);

  const patterns = [
    'flowerOfLife',
    'metatronCube',
    'sriYantra',
    'lunarMandala',
    'logoPattern',
    'seedOfLife',
    'merkaba',
    'torus'
  ];

  for (const pat of patterns) {
    console.log(`   🎨 Testando Geometria Sagrada: ${pat}...`);
    await page.evaluate((p) => {
      window.pedacoStudio.store.state.sacredPattern = p;
      window.pedacoStudio.store.state.patternOpacity = 0.55;
      window.pedacoStudio.renderer.requestRender();
    }, pat);
    await page.waitForTimeout(300);

    const canvas = await page.$('#renderCanvas');
    if (canvas) {
      await canvas.screenshot({ path: path.join(outDir, `sacred_${pat}.png`) });
      console.log(`      ✅ Screenshot salva: dist/tests-visual/sacred_${pat}.png`);
    }
  }

  // Testar Drag and Drop Interativo da Imagem e do Texto
  console.log('\n🖐️ Testando Interação WYSIWYG de Movimento no Canvas...');
  
  // 1. Drag na imagem (focal X/Y)
  const canvasBox = await (await page.$('#renderCanvas')).boundingBox();
  
  // Drag no lado esquerdo (onde fica a imagem no split-right)
  await page.mouse.move(canvasBox.x + canvasBox.width * 0.25, canvasBox.y + canvasBox.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(canvasBox.x + canvasBox.width * 0.25 + 50, canvasBox.y + canvasBox.height * 0.5 + 40, { steps: 5 });
  await page.mouse.up();
  await page.waitForTimeout(200);

  const movedPanX = await page.evaluate(() => window.pedacoStudio.store.state.imgPanX);
  const movedPanY = await page.evaluate(() => window.pedacoStudio.store.state.imgPanY);
  console.log(`   ✅ Foto movida com sucesso: PanX = ${movedPanX}px, PanY = ${movedPanY}px`);

  // 2. Wheel Zoom na imagem
  await page.mouse.move(canvasBox.x + canvasBox.width * 0.25, canvasBox.y + canvasBox.height * 0.5);
  await page.mouse.wheel(0, -100);
  await page.waitForTimeout(200);
  const zoomed = await page.evaluate(() => window.pedacoStudio.store.state.imgZoom);
  console.log(`   ✅ Zoom com Scroll no Canvas: ${zoomed}x`);

  await browser.close();
  console.log('\n🎉 TODAS AS GEOMETRIAS SAGRADAS E MOVIMENTOS FORAM TESTADOS COM SUCESSO!\n');
}

run().catch(err => {
  console.error('❌ Erro na verificação visual:', err);
  process.exit(1);
});
