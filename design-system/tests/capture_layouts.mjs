import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const baseDir = '/home/mat77/Projetos/Pedaço do ceu /design-system';
const screenshotsDir = path.join(baseDir, 'tests/screenshots');
const fileUrl = 'file://' + path.join(baseDir, 'index.html');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto(fileUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Aba Layout
  await page.click('button[data-target="tab-formato"]');
  await page.waitForTimeout(100);

  const layouts = ['right', 'bottom', 'top', 'center'];
  for (const l of layouts) {
    await page.click(`[data-layout="${l}"]`);
    await page.waitForTimeout(250);
    const canvas = await page.$('#renderCanvas');
    if (canvas) {
      await canvas.screenshot({ path: path.join(screenshotsDir, `calibrated_layout_${l}.png`) });
      console.log(`📸 Screenshot capturado: calibrated_layout_${l}.png`);
    }
  }

  // Stories (9:16)
  await page.click('[data-format="9:16-story"]');
  await page.click('[data-layout="bottom"]');
  await page.waitForTimeout(250);
  const canvasStory = await page.$('#renderCanvas');
  if (canvasStory) {
    await canvasStory.screenshot({ path: path.join(screenshotsDir, 'calibrated_layout_bottom_story9x16.png') });
    console.log('📸 Screenshot capturado: calibrated_layout_bottom_story9x16.png');
  }

  await browser.close();
})();
