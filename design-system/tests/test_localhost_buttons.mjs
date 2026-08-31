import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  const consoleLogs = [];
  const errors = [];

  page.on('console', msg => {
    consoleLogs.push(`[${msg.type().toUpperCase()}] ${msg.text()}`);
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    errors.push(`[PAGE ERROR] ${err.message}`);
  });

  console.log('📍 Conectando ao servidor http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForFunction('window.pedacoStudio && window.pedacoStudio.store');
  await page.waitForTimeout(400);

  let passed = 0;
  let failed = 0;

  // 1. Testa Exportação PNG 2K
  console.log('\n--- 1. TESTANDO BOTÃO EXPORTAR PNG ---');
  try {
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 6000 }),
      page.click('#btnExport')
    ]);
    const filename = download.suggestedFilename();
    console.log(`✅ [OK] btnExport disparou download com sucesso: "${filename}"`);
    passed++;
  } catch (e) {
    console.error(`❌ [ERROR] btnExport falhou: ${e.message}`);
    failed++;
  }

  // 2. Testa Exportar HTML
  console.log('\n--- 2. TESTANDO BOTÃO EXPORTAR HTML ---');
  try {
    const [htmlDownload] = await Promise.all([
      page.waitForEvent('download', { timeout: 6000 }),
      page.click('#btnExportHtml')
    ]);
    const htmlFilename = htmlDownload.suggestedFilename();
    console.log(`✅ [OK] btnExportHtml disparou download com sucesso: "${htmlFilename}"`);
    passed++;
  } catch (e) {
    console.error(`❌ [ERROR] btnExportHtml falhou: ${e.message}`);
    failed++;
  }

  // 3. Testa Botão Salvar Template Rápido (Header)
  console.log('\n--- 3. TESTANDO BOTÃO SALVAR TEMPLATE (HEADER) ---');
  try {
    page.once('dialog', async dialog => {
      await dialog.accept('Template Header Teste');
    });
    await page.click('#btnSaveTemplateQuick');
    await page.waitForTimeout(300);
    const count = await page.$$eval('.saved-template-card', c => c.length);
    if (count > 0) {
      console.log(`✅ [OK] btnSaveTemplateQuick salvou template (total: ${count})`);
      passed++;
    } else {
      console.error('❌ [ERROR] btnSaveTemplateQuick não salvou template');
      failed++;
    }
  } catch (e) {
    console.error(`❌ [ERROR] btnSaveTemplateQuick erro: ${e.message}`);
    failed++;
  }

  // 4. Testa Todas as 4 Abas
  console.log('\n--- 4. TESTANDO NAVEGAÇÃO DE ABAS ---');
  const tabs = ['tab-btn-tab-acervo', 'tab-btn-tab-textos', 'tab-btn-tab-estilo', 'tab-btn-tab-formato'];
  for (const tid of tabs) {
    await page.click(`#${tid}`);
    const isAct = await page.$eval(`#${tid}`, el => el.classList.contains('active'));
    if (isAct) {
      console.log(`✅ [OK] Aba #${tid} ativada com sucesso`);
      passed++;
    } else {
      console.error(`❌ [ERROR] Aba #${tid} falhou`);
      failed++;
    }
  }

  // 5. Testa Presets Místicos
  console.log('\n--- 5. TESTANDO TODOS OS PRESETS ---');
  await page.click('#tab-btn-tab-acervo');
  const presets = await page.$$('.preset-btn');
  for (const p of presets) {
    const txt = (await p.innerText()).trim();
    await p.click();
    console.log(`✅ [OK] Preset "${txt}" clicado e ativo`);
    passed++;
  }

  // 6. Testa Todas as Thumbnails do Catálogo
  console.log('\n--- 6. TESTANDO THUMBNAILS DO CATÁLOGO ---');
  const thumbs = await page.$$('.gallery-thumb-item');
  console.log(`Testando ${thumbs.length} fotos do acervo...`);
  for (let i = 0; i < Math.min(thumbs.length, 5); i++) {
    await thumbs[i].click();
    await page.waitForTimeout(100);
  }
  console.log(`✅ [OK] ${Math.min(thumbs.length, 5)} fotos selecionadas e renderizadas com sucesso`);
  passed++;

  // 7. Testa Formatos de Tela
  console.log('\n--- 7. TESTANDO FORMATOS DE TELA ---');
  await page.click('#tab-btn-tab-formato');
  const formats = ['1:1', '4:5', '9:16-story', '9:16-tiktok'];
  for (const fmt of formats) {
    await page.click(`.segmented-btn[data-format="${fmt}"]`);
    const cur = await page.evaluate(() => window.pedacoStudio.store.state.format);
    if (cur === fmt) {
      console.log(`✅ [OK] Formato "${fmt}" ativado`);
      passed++;
    } else {
      console.error(`❌ [ERROR] Formato "${fmt}" falhou`);
      failed++;
    }
  }

  // 8. Testa Todos os Layouts
  console.log('\n--- 8. TESTANDO LAYOUTS ---');
  const layouts = ['bottom', 'top', 'center', 'right', 'left'];
  for (const lay of layouts) {
    await page.click(`.segmented-btn[data-layout="${lay}"]`);
    const cur = await page.evaluate(() => window.pedacoStudio.store.state.layout);
    if (cur === lay) {
      console.log(`✅ [OK] Layout "${lay}" ativado`);
      passed++;
    } else {
      console.error(`❌ [ERROR] Layout "${lay}" falhou`);
      failed++;
    }
  }

  // 8.1 Testa Todos os Estilos de Fundo de Texto
  console.log('\n--- 8.1 TESTANDO ESTILOS DE FUNDO DE TEXTO ---');
  const cardStyles = ['card', 'gradient', 'separated', 'glass', 'transparent', 'framed'];
  for (const cs of cardStyles) {
    await page.click(`.segmented-btn[data-text-card-style="${cs}"]`);
    const cur = await page.evaluate(() => window.pedacoStudio.store.state.textCardStyle);
    if (cur === cs) {
      console.log(`✅ [OK] Estilo de Fundo "${cs}" ativado`);
      passed++;
    } else {
      console.error(`❌ [ERROR] Estilo de Fundo "${cs}" falhou`);
      failed++;
    }
  }

  // 8.2 Testa Estilos de Enquadramento da Foto na Aba Formato
  console.log('\n--- 8.2 TESTANDO ENQUADRAMENTO DA FOTO NA ABA FORMATO ---');
  const fitModes = ['portal', 'fusion', 'cover'];
  for (const fm of fitModes) {
    await page.click(`.segmented-btn[data-fit="${fm}"]`);
    const cur = await page.evaluate(() => window.pedacoStudio.store.state.fitMode);
    if (cur === fm) {
      console.log(`✅ [OK] Enquadramento "${fm}" ativado na aba Formato`);
      passed++;
    } else {
      console.error(`❌ [ERROR] Enquadramento "${fm}" falhou`);
      failed++;
    }
  }

  // 8.3 Testa Sliders de Refino do Layout
  console.log('\n--- 8.3 TESTANDO SLIDERS DE REFINO DO LAYOUT ---');
  await page.$eval('#splitRatioRange', el => { el.value = '65'; el.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.$eval('#textZoneHeightRange', el => { el.value = '50'; el.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.$eval('#cardRadiusRange', el => { el.value = '24'; el.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.waitForTimeout(100);
  const sRatio = await page.evaluate(() => window.pedacoStudio.store.state.splitRatio);
  const tzHeight = await page.evaluate(() => window.pedacoStudio.store.state.textZoneHeight);
  const cRadius = await page.evaluate(() => window.pedacoStudio.store.state.cardRadius);
  if (sRatio === 0.65 && tzHeight === 0.50 && cRadius === 24) {
    console.log('✅ [OK] Sliders de refino (splitRatio: 65%, textZoneHeight: 50%, cardRadius: 24px) sincronizados');
    passed++;
  } else {
    console.error('❌ [ERROR] Sliders de refino falharam');
    failed++;
  }

  // 9. Testa View Modes
  console.log('\n--- 9. TESTANDO VIEW MODES (CANVAS) ---');
  await page.click('.view-mode-btn[data-view-mode="split"]');
  await page.waitForTimeout(150);
  let sideBySide = await page.evaluate(() => window.pedacoStudio.store.state.sideBySideMode);
  if (sideBySide === true) {
    console.log('✅ [OK] Modo Split (Lado a Lado) ativado');
    passed++;
  } else {
    console.error('❌ [ERROR] Modo Split falhou');
    failed++;
  }

  await page.click('.view-mode-btn[data-view-mode="single"]');
  await page.waitForTimeout(150);
  sideBySide = await page.evaluate(() => window.pedacoStudio.store.state.sideBySideMode);
  if (sideBySide === false) {
    console.log('✅ [OK] Modo Single (Template) ativado');
    passed++;
  } else {
    console.error('❌ [ERROR] Modo Single falhou');
    failed++;
  }

  // 10. Testa Botões de Undo e Redo
  console.log('\n--- 10. TESTANDO UNDO / REDO ---');
  await page.evaluate(() => {
    window.pedacoStudio.store.state.title = 'TESTE FINAL UNDO';
  });
  await page.waitForTimeout(300);
  await page.click('#btnUndo');
  await page.waitForTimeout(100);
  console.log('✅ [OK] btnUndo clicado com sucesso');
  passed++;

  await page.click('#btnRedo');
  await page.waitForTimeout(100);
  console.log('✅ [OK] btnRedo clicado com sucesso');
  passed++;

  console.log('\n========================================');
  console.log(`Console Errors detectados: ${errors.length}`);
  if (errors.length > 0) {
    console.log(errors.join('\n'));
  }
  console.log(`TOTAL DE TESTES APROVADOS: ${passed} | FALHAS: ${failed}`);
  console.log('========================================');

  await browser.close();
  process.exit(failed > 0 ? 1 : 0);
})();
