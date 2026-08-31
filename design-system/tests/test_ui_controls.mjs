import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FILE_URL = `file://${path.resolve(__dirname, '../index.html')}`;

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto(FILE_URL, { waitUntil: 'networkidle' });
  await page.waitForFunction('window.pedacoStudio && window.pedacoStudio.store');
  // Wait until a preset has fully loaded
  await page.waitForFunction('window.pedacoStudio.store.state.title && window.pedacoStudio.store.state.title.includes("CRISTAIS")');
  await page.waitForTimeout(500);

  // Helper to test an input
  async function testInput(selector, newValue, stateKey, isNumeric = false) {
    await page.$eval(selector, (el, val) => el.value = val, newValue);
    // trigger input event explicitly
    await page.$eval(selector, el => {
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
    const domVal = await page.$eval(selector, el => el.value);
    const stateVal = await page.evaluate(`window.pedacoStudio.store.state.${stateKey}`);
    const expected = isNumeric ? parseFloat(newValue) : newValue;
    if (stateVal !== expected) {
      console.error(`❌ [ERROR] ${stateKey} - Expected ${expected}, got state=${stateVal}, dom=${domVal}`);
      return false;
    }
    console.log(`✅ [OK] ${stateKey} -> ${stateVal}`);
    return true;
  }

  async function testCheckbox(selector, newValue, stateKey) {
    const isChecked = await page.$eval(selector, el => el.checked);
    if (isChecked !== newValue) {
      await page.$eval(selector, (el, val) => {
        el.checked = val;
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }, newValue);
    }
    const stateVal = await page.evaluate(`window.pedacoStudio.store.state.${stateKey}`);
    if (stateVal !== newValue) {
      console.error(`❌ [ERROR] ${stateKey} - Expected ${newValue}, got ${stateVal}`);
      return false;
    }
    console.log(`✅ [OK] ${stateKey} -> ${stateVal}`);
    return true;
  }

  async function testSelect(selector, newValue, stateKey) {
    await page.selectOption(selector, newValue, { force: true });
    const stateVal = await page.evaluate(`window.pedacoStudio.store.state.${stateKey}`);
    if (stateVal !== newValue) {
      console.error(`❌ [ERROR] ${stateKey} - Expected ${newValue}, got ${stateVal}`);
      return false;
    }
    console.log(`✅ [OK] ${stateKey} -> ${stateVal}`);
    return true;
  }

  let failed = 0;
  
  console.log('\n--- TEXT INPUTS ---');
  if (!await testInput('#titleInput', 'Novo Titulo', 'title')) failed++;
  if (!await testInput('#subtitleInput', 'Novo Sub', 'subtitle')) failed++;
  if (!await testInput('#descriptionInput', 'Nova desc', 'description')) failed++;
  if (!await testInput('#highlightInput', 'Novo highlight', 'highlightText')) failed++;
  if (!await testInput('#categoryTagInput', 'Nova Tag', 'categoryTag')) failed++;
  if (!await testInput('#ctaInput', 'Novo CTA', 'ctaText')) failed++;
  if (!await testInput('#badgeInput', 'Novo Badge', 'badgeText')) failed++;

  console.log('\n--- COLOR INPUTS ---');
  if (!await testInput('#colorTitleInput', '#123456', 'colorTitle')) failed++;
  if (!await testInput('#colorTitleGlowInput', '#654321', 'colorTitleGlow')) failed++;
  if (!await testInput('#colorSubtitleInput', '#111111', 'colorSubtitle')) failed++;
  if (!await testInput('#colorDescInput', '#222222', 'colorDesc')) failed++;
  if (!await testInput('#colorHighlightInput', '#333333', 'colorHighlight')) failed++;
  if (!await testInput('#colorHighlightBorderInput', '#444444', 'colorHighlightBorder')) failed++;
  if (!await testInput('#colorTagInput', '#555555', 'colorTag')) failed++;
  if (!await testInput('#colorBadgeInput', '#666666', 'colorBadge')) failed++;
  if (!await testInput('#colorCtaInput', '#777777', 'colorCta')) failed++;
  if (!await testInput('#colorPatternInput', '#888888', 'colorPattern')) failed++;
  if (!await testInput('#colorCornersInput', '#999999', 'colorCorners')) failed++;
  if (!await testInput('#colorDividersInput', '#aaaaaa', 'colorDividers')) failed++;
  if (!await testInput('#gradientPrimaryInput', '#bbbbbb', 'gradientPrimary')) failed++;
  if (!await testInput('#gradientSecondaryInput', '#cccccc', 'gradientSecondary')) failed++;
  if (!await testInput('#gradientDarknessInput', '#dddddd', 'gradientDarkness')) failed++;

  console.log('\n--- RANGE SLIDERS (DIRECT NUMBERS) ---');
  if (!await testInput('#sizeTitleRange', '50', 'sizeTitle', true)) failed++;
  if (!await testInput('#spacingTitleRange', '5', 'spacingTitle', true)) failed++;
  if (!await testInput('#glowTitleRange', '15', 'glowTitle', true)) failed++;
  if (!await testInput('#sizeSubtitleRange', '20', 'sizeSubtitle', true)) failed++;
  if (!await testInput('#sizeDescRange', '25', 'sizeDesc', true)) failed++;
  if (!await testInput('#sizeHighlightRange', '16', 'sizeHighlight', true)) failed++;
  if (!await testInput('#sizeCtaRange', '18', 'sizeCta', true)) failed++;
  if (!await testInput('#spacingCtaRange', '3', 'spacingCta', true)) failed++;
  if (!await testInput('#paddingTopRange', '30', 'paddingTop', true)) failed++;
  if (!await testInput('#blockGapRange', '35', 'blockGap', true)) failed++;
  if (!await testInput('#paddingSideRange', '40', 'paddingSide', true)) failed++;
  if (!await testInput('#globalLineGapRange', '30', 'globalLineGap', true)) failed++;

  console.log('\n--- RANGE SLIDERS (WITH TRANSFORM) ---');
  // imgZoom is divided by 100
  await page.$eval('#imgZoomRange', el => el.value = '150');
  await page.evaluate(() => document.querySelector('#imgZoomRange').dispatchEvent(new Event('input')));
  let v = await page.evaluate(`window.pedacoStudio.store.state.imgZoom`);
  if (v !== 1.5) { console.error(`❌ [ERROR] imgZoom - Expected 1.5, got ${v}`); failed++; }
  else { console.log(`✅ [OK] imgZoom -> ${v}`); }

  await page.$eval('#patternOpacityRange', el => el.value = '50');
  await page.evaluate(() => document.querySelector('#patternOpacityRange').dispatchEvent(new Event('input')));
  v = await page.evaluate(`window.pedacoStudio.store.state.patternOpacity`);
  if (v !== 0.5) { console.error(`❌ [ERROR] patternOpacity - Expected 0.5, got ${v}`); failed++; }
  else { console.log(`✅ [OK] patternOpacity -> ${v}`); }

  await page.$eval('#boxOpacityRange', el => el.value = '60');
  await page.evaluate(() => document.querySelector('#boxOpacityRange').dispatchEvent(new Event('input')));
  v = await page.evaluate(`window.pedacoStudio.store.state.boxOpacity`);
  if (v !== 0.6) { console.error(`❌ [ERROR] boxOpacity - Expected 0.6, got ${v}`); failed++; }
  else { console.log(`✅ [OK] boxOpacity -> ${v}`); }

  await page.$eval('#gradientIntensityRange', el => el.value = '70');
  await page.evaluate(() => document.querySelector('#gradientIntensityRange').dispatchEvent(new Event('input')));
  v = await page.evaluate(`window.pedacoStudio.store.state.gradientIntensity`);
  if (v !== 0.7) { console.error(`❌ [ERROR] gradientIntensity - Expected 0.7, got ${v}`); failed++; }
  else { console.log(`✅ [OK] gradientIntensity -> ${v}`); }

  await page.$eval('#bgImageOpacityRange', el => el.value = '80');
  await page.evaluate(() => document.querySelector('#bgImageOpacityRange').dispatchEvent(new Event('input')));
  v = await page.evaluate(`window.pedacoStudio.store.state.bgImageOpacity`);
  if (v !== 0.8) { console.error(`❌ [ERROR] bgImageOpacity - Expected 0.8, got ${v}`); failed++; }
  else { console.log(`✅ [OK] bgImageOpacity -> ${v}`); }

  await page.$eval('#lineHeightDescRange', el => el.value = '16');
  await page.evaluate(() => document.querySelector('#lineHeightDescRange').dispatchEvent(new Event('input')));
  v = await page.evaluate(`window.pedacoStudio.store.state.lineHeightDesc`);
  if (v !== 1.6) { console.error(`❌ [ERROR] lineHeightDesc - Expected 1.6, got ${v}`); failed++; }
  else { console.log(`✅ [OK] lineHeightDesc -> ${v}`); }

  console.log('\n--- SELECTS ---');
  if (!await testSelect('#fontTitleSelect', "'Cinzel', serif", 'fontTitle')) failed++;
  if (!await testSelect('#weightTitleSelect', '700', 'weightTitle')) failed++;
  if (!await testSelect('#fontSubtitleSelect', "'Cormorant Garamond', serif", 'fontSubtitle')) failed++;
  if (!await testSelect('#styleSubtitleSelect', 'normal 400', 'styleSubtitle')) failed++;
  if (!await testSelect('#fontDescSelect', "'Montserrat', sans-serif", 'fontDesc')) failed++;
  if (!await testSelect('#fontHighlightSelect', "'Montserrat', sans-serif", 'fontHighlight')) failed++;
  if (!await testSelect('#fontCtaSelect', "'Cinzel', serif", 'fontCta')) failed++;
  if (!await testSelect('#weightCtaSelect', '600', 'weightCta')) failed++;
  if (!await testSelect('#sacredPatternSelect', 'flowerOfLife', 'sacredPattern')) failed++;

  console.log('\n--- CHECKBOXES ---');
  if (!await testCheckbox('#showBadgeCheck', false, 'showBadge')) failed++;
  if (!await testCheckbox('#showBadgeCheck', true, 'showBadge')) failed++;
  if (!await testCheckbox('#showCornersCheck', false, 'showBaroqueCorners')) failed++;
  if (!await testCheckbox('#showCornersCheck', true, 'showBaroqueCorners')) failed++;
  if (!await testCheckbox('#showHighlightBoxCheck', false, 'showHighlightBox')) failed++;
  if (!await testCheckbox('#showHighlightBoxCheck', true, 'showHighlightBox')) failed++;
  if (!await testCheckbox('#showSafeAreaGuideCheck', true, 'showSafeAreaGuide')) failed++;
  if (!await testCheckbox('#showSafeAreaGuideCheck', false, 'showSafeAreaGuide')) failed++;
  if (!await testCheckbox('#imgFlipHCheck', true, 'imgFlipH')) failed++;
  if (!await testCheckbox('#imgFlipHCheck', false, 'imgFlipH')) failed++;
  if (!await testCheckbox('#imgFlipVCheck', true, 'imgFlipV')) failed++;
  if (!await testCheckbox('#imgFlipVCheck', false, 'imgFlipV')) failed++;

  if (failed > 0) {
    console.error(`\n❌ FALHA: ${failed} controles não mapearam para o state.`);
    process.exit(1);
  } else {
    console.log('\n🎉 SUCESSO: Todos os controles da UI estão mapeando para o state corretamente!');
    process.exit(0);
  }
})();
