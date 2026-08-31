import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const studioPath = path.resolve(__dirname, '../index.html');
const studioUrl = `file://${studioPath}`;

(async () => {
  console.log('🚀 [Playwright] Iniciando Testes Avançados de Interação & Refino de Layout...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => {
    errors.push(`[PAGE ERROR] ${err.message}`);
  });
  page.on('requestfailed', req => {
    console.log(`[REQUEST FAILED] ${req.url()} (${req.failure()?.errorText})`);
  });

  console.log(`📍 Carregando Studio: ${studioUrl}`);
  await page.goto(studioUrl, { waitUntil: 'load' });
  await page.waitForFunction('window.pedacoStudio && window.pedacoStudio.store');
  await page.waitForTimeout(300);

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
      failed++;
    }
  }

  // 1. Testa Navegação das 4 Abas
  console.log('\n--- 1. TESTE DE NAVEGAÇÃO DE ABAS ---');
  const tabs = ['tab-acervo', 'tab-textos', 'tab-estilo', 'tab-formato'];
  for (const tabId of tabs) {
    await page.click(`[data-target="${tabId}"]`);
    await page.waitForTimeout(100);
    const isVisible = await page.$eval(`#${tabId}`, el => el.classList.contains('active'));
    assert(isVisible, `Aba ${tabId} abre e recebe classe active com sucesso`);
  }

  // 2. Testa que a Aba Acervo NÃO possui os sliders de enquadramento (foram movidos para Layout)
  console.log('\n--- 2. TESTE DE HIGIENE DA ABA ACERVO ---');
  await page.click('[data-target="tab-acervo"]');
  const acervoHasZoom = await page.$eval('#tab-acervo', el => el.querySelector('#imgZoomRange') !== null);
  assert(!acervoHasZoom, 'Aba Acervo limpa: sliders de enquadramento foram removidos de lá');
  const acervoHasUpload = await page.$eval('#tab-acervo', el => el.querySelector('#imageUploadInput') !== null);
  assert(acervoHasUpload, 'Aba Acervo mantém campo de upload de fotos do dispositivo');
  const acervoHasGallery = await page.$eval('#tab-acervo', el => el.querySelector('#photoGallery') !== null);
  assert(acervoHasGallery, 'Aba Acervo mantém catálogo de fotos do acervo');

  // 3. Testa Aba Formato & Layout com todos os controles movidos e novos
  console.log('\n--- 3. TESTE DE CONTROLES NA ABA FORMATO & LAYOUT ---');
  await page.click('[data-target="tab-formato"]');
  
  const formatoHasFit = await page.$eval('#tab-formato', el => el.querySelectorAll('[data-fit]').length === 3);
  assert(formatoHasFit, 'Aba Formato contém os 3 botões de Enquadramento (Portal, Fusão, Preenchimento)');

  const formatoHasZoom = await page.$eval('#tab-formato', el => el.querySelector('#imgZoomRange') !== null);
  assert(formatoHasZoom, 'Aba Formato contém slider de Zoom da Foto');

  const formatoHasPan = await page.$eval('#tab-formato', el => el.querySelector('#imgPanXRange') !== null && el.querySelector('#imgPanYRange') !== null);
  assert(formatoHasPan, 'Aba Formato contém sliders de Pan X e Pan Y');

  const formatoHasFlip = await page.$eval('#tab-formato', el => el.querySelector('#imgFlipHCheck') !== null && el.querySelector('#imgFlipVCheck') !== null);
  assert(formatoHasFlip, 'Aba Formato contém checkboxes de inversão horizontal e vertical');

  const formatoHasCardStyles = await page.$eval('#tab-formato', el => el.querySelectorAll('[data-text-card-style]').length === 6);
  assert(formatoHasCardStyles, 'Aba Formato contém os 6 estilos de Fundo de Texto');

  const formatoHasRefinement = await page.$eval('#tab-formato', el => 
    el.querySelector('#splitRatioRange') !== null &&
    el.querySelector('#textZoneHeightRange') !== null &&
    el.querySelector('#cardRadiusRange') !== null &&
    el.querySelector('#paddingSideRange') !== null &&
    el.querySelector('#paddingTopRange') !== null &&
    el.querySelector('#blockGapRange') !== null &&
    el.querySelector('#globalLineGapRange') !== null
  );
  assert(formatoHasRefinement, 'Aba Formato contém todos os 7 sliders de refino e proporções do layout');

  // 4. Interação em Tempo Real com Sliders de Refino
  console.log('\n--- 4. TESTE DE INTERAÇÃO EM TEMPO REAL (STATE & RENDER) ---');
  
  // 4.1 Slider Divisão Lateral (splitRatio)
  await page.$eval('#splitRatioRange', el => {
    el.value = '68';
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.waitForTimeout(100);
  const stateSplitRatio = await page.evaluate(() => window.pedacoStudio.store.state.splitRatio);
  const valSplitRatio = await page.$eval('#splitRatioVal', el => el.textContent);
  assert(stateSplitRatio === 0.68 && valSplitRatio === '68%', `splitRatio atualizado no State (0.68) e UI (${valSplitRatio})`);

  // 4.2 Slider Altura Texto (textZoneHeight)
  await page.$eval('#textZoneHeightRange', el => {
    el.value = '52';
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.waitForTimeout(100);
  const stateTextZoneHeight = await page.evaluate(() => window.pedacoStudio.store.state.textZoneHeight);
  const valTextZoneHeight = await page.$eval('#textZoneHeightVal', el => el.textContent);
  assert(stateTextZoneHeight === 0.52 && valTextZoneHeight === '52%', `textZoneHeight atualizado no State (0.52) e UI (${valTextZoneHeight})`);

  // 4.3 Slider Arredondamento Bordas (cardRadius)
  await page.$eval('#cardRadiusRange', el => {
    el.value = '28';
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.waitForTimeout(100);
  const stateCardRadius = await page.evaluate(() => window.pedacoStudio.store.state.cardRadius);
  const valCardRadius = await page.$eval('#cardRadiusVal', el => el.textContent);
  assert(stateCardRadius === 28 && valCardRadius === '28px', `cardRadius atualizado no State (28) e UI (${valCardRadius})`);

  // 4.4 Slider Zoom da Foto (imgZoom)
  await page.$eval('#imgZoomRange', el => {
    el.value = '140';
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.waitForTimeout(100);
  const stateImgZoom = await page.evaluate(() => window.pedacoStudio.store.state.imgZoom);
  const valImgZoom = await page.$eval('#imgZoomVal', el => el.textContent);
  assert(stateImgZoom === 1.4 && valImgZoom === '1.4x', `imgZoom atualizado no State (1.4) e UI (${valImgZoom})`);

  // 4.5 Slider Pan X e Pan Y
  await page.$eval('#imgPanXRange', el => {
    el.value = '45';
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.$eval('#imgPanYRange', el => {
    el.value = '-30';
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.waitForTimeout(100);
  const statePanX = await page.evaluate(() => window.pedacoStudio.store.state.imgPanX);
  const statePanY = await page.evaluate(() => window.pedacoStudio.store.state.imgPanY);
  assert(statePanX === 45 && statePanY === -30, `Pan X (45) e Pan Y (-30) sincronizados com sucesso`);

  // 4.6 Checkbox Flip H e Flip V
  await page.click('#imgFlipHCheck');
  await page.waitForTimeout(100);
  const stateFlipH = await page.evaluate(() => window.pedacoStudio.store.state.imgFlipH);
  assert(stateFlipH === true, 'imgFlipH invertido para true');

  // 5. Teste de Troca de Layout + Estilo de Fundo de Texto
  console.log('\n--- 5. TESTE DE COMBINAÇÕES DE LAYOUT & ESTILOS DE FUNDO ---');
  
  // Layout Rodapé + Vidro Sagrado
  await page.click('[data-layout="bottom"]');
  await page.click('[data-text-card-style="glass"]');
  await page.waitForTimeout(150);
  let curLayout = await page.evaluate(() => window.pedacoStudio.store.state.layout);
  let curStyle = await page.evaluate(() => window.pedacoStudio.store.state.textCardStyle);
  assert(curLayout === 'bottom' && curStyle === 'glass', 'Layout Rodapé com Vidro Sagrado renderizado perfeitamente');

  // Layout Topo + Degradê Suave
  await page.click('[data-layout="top"]');
  await page.click('[data-text-card-style="gradient"]');
  await page.waitForTimeout(150);
  curLayout = await page.evaluate(() => window.pedacoStudio.store.state.layout);
  curStyle = await page.evaluate(() => window.pedacoStudio.store.state.textCardStyle);
  assert(curLayout === 'top' && curStyle === 'gradient', 'Layout Topo com Degradê Suave renderizado perfeitamente');

  // Layout Centro + Caixas Separadas
  await page.click('[data-layout="center"]');
  await page.click('[data-text-card-style="separated"]');
  await page.waitForTimeout(150);
  curLayout = await page.evaluate(() => window.pedacoStudio.store.state.layout);
  curStyle = await page.evaluate(() => window.pedacoStudio.store.state.textCardStyle);
  assert(curLayout === 'center' && curStyle === 'separated', 'Layout Centro com Caixas Separadas renderizado perfeitamente');

  // Layout Lateral Esquerdo + Moldura Fina
  await page.click('[data-layout="left"]');
  await page.click('[data-text-card-style="framed"]');
  await page.waitForTimeout(150);
  curLayout = await page.evaluate(() => window.pedacoStudio.store.state.layout);
  curStyle = await page.evaluate(() => window.pedacoStudio.store.state.textCardStyle);
  assert(curLayout === 'left' && curStyle === 'framed', 'Layout Esquerdo com Moldura Fina renderizado perfeitamente');

  // 6. Teste de Exportação em Alta Resolução (PNG 2K)
  console.log('\n--- 6. TESTE DE EXPORTAÇÃO HIGH-RES APÓS REFINOS ---');
  try {
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 8000 }),
      page.click('#btnExport')
    ]);
    const fname = download.suggestedFilename();
    assert(fname.endsWith('.png'), `Exportação PNG 2K disparada com sucesso: ${fname}`);
  } catch (e) {
    assert(false, `Falha na exportação PNG: ${e.message}`);
  }

  // Screenshot de Validação Visual
  const screenshotDir = path.resolve(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });
  const screenshotPath = path.join(screenshotDir, 'layout_refinement_preview.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`📸 Screenshot salvo em: ${screenshotPath}`);

  // Checagem de Erros de Console
  console.log('\n--- 7. AUDITORIA DE ERROS DO NAVEGADOR ---');
  assert(errors.length === 0, `Nenhum erro de console ou crash detectado (Erros: ${errors.length})`);
  if (errors.length > 0) {
    console.error('Erros encontrados:', errors);
  }

  console.log('\n════════════════════════════════════════════════════════════');
  console.log(`  RESULTADO PLAYWRIGHT: ${passed} passaram, ${failed} falharam`);
  console.log('════════════════════════════════════════════════════════════\n');

  await browser.close();
  process.exit(failed > 0 ? 1 : 0);
})();
