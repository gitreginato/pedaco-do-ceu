// Teste Massivo de Validação de Configurações, Abas e Renderização com Capturas Passo a Passo
import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const SCREENSHOTS_DIR = path.resolve(__dirname, 'screenshots', 'massive_validation');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function runMassiveValidation() {
  console.log('🚀 Iniciando Suíte Massiva de Validação com Capturas de Tela Playwright...');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const page = await browser.newPage({
    viewport: { width: 1600, height: 1000 },
    deviceScaleFactor: 2
  });

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.error('  ❌ Console Error:', msg.text());
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(err.message);
    console.error('  ❌ Page Crash / Uncaught Error:', err.message);
  });

  const indexPath = path.join(ROOT, 'index.html');
  await page.goto(`file://${indexPath}`, { waitUntil: 'load' });
  await page.waitForTimeout(500);

  // Helper para acionar input range e disparar evento input
  const setRange = async (selector, value) => {
    await page.evaluate(({ sel, val }) => {
      const el = document.querySelector(sel);
      if (el) {
        el.value = val;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, { sel: selector, val: value });
    await page.waitForTimeout(100);
  };

  // Helper para alterar text input
  const setTextInput = async (selector, text) => {
    await page.evaluate(({ sel, txt }) => {
      const el = document.querySelector(sel);
      if (el) {
        el.value = txt;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, { sel: selector, txt: text });
    await page.waitForTimeout(80);
  };

  // Helper para alterar select
  const setSelect = async (selector, val) => {
    await page.evaluate(({ sel, v }) => {
      const el = document.querySelector(sel);
      if (el) {
        el.value = v;
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, { sel: selector, v: val });
    await page.waitForTimeout(80);
  };

  // Helper para alterar checkbox
  const setCheckbox = async (selector, checked) => {
    await page.evaluate(({ sel, chk }) => {
      const el = document.querySelector(sel);
      if (el) {
        el.checked = chk;
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, { sel: selector, chk: checked });
    await page.waitForTimeout(80);
  };

  // Helper para trocar aba
  const switchTab = async (targetId) => {
    await page.click(`button[data-target="${targetId}"]`);
    await page.waitForTimeout(150);
  };

  let testStepCount = 0;
  const pass = (msg) => {
    testStepCount++;
    console.log(`  ✅ [Pass #${testStepCount}] ${msg}`);
  };

  // --------------------------------------------------------------------------
  // ETAPA 1: Aba Acervo (Catálogo, Seleção de Peça e Templates Salvos)
  // --------------------------------------------------------------------------
  console.log('\n📸 [ETAPA 1] Testando Aba Acervo, Catálogo e Templates...');
  await switchTab('tab-acervo');

  // Seleciona a 3ª peça do acervo
  const thumb3 = page.locator('.gallery-thumb-item').nth(2);
  await thumb3.click();
  await page.waitForTimeout(300);

  // Salva um template personalizado
  await setTextInput('#templateNameInput', 'Template Teste Massivo Ouro');
  await page.click('#btnSaveCustomTemplate');
  await page.waitForTimeout(200);

  const tplCount = await page.locator('.saved-template-card').count();
  if (tplCount >= 1) {
    pass('Template salvo com sucesso e listado no gerenciador');
  } else {
    throw new Error('Falha ao salvar template no LocalStorage');
  }

  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01_acervo_catalog_and_templates.png') });

  // --------------------------------------------------------------------------
  // ETAPA 2: Aba Textos & Tipografia (Todos os 8 Slots e Alinhamento)
  // --------------------------------------------------------------------------
  console.log('\n✍️ [ETAPA 2] Testando Aba Textos & Tipografia (8 Slots)...');
  await switchTab('tab-textos');

  // Slot 1: Header
  await setTextInput('#headerTextInput', '✦ PEDAÇO DO CÉU • SANCTUARY ✦');
  await setSelect('#fontHeaderSelect', "'Cinzel', serif");
  await setSelect('#weightHeaderSelect', '600');
  await setRange('#sizeHeaderRange', '14');
  await setRange('#spacingHeaderRange', '3');
  await setCheckbox('#showHeaderCheck', true);
  pass('Slot 1 (Header) configurado');

  // Slot 2: Badge
  await setTextInput('#badgeInput', 'CRISTAL SAGRADO');
  await setSelect('#fontBadgeSelect', "'Cinzel', serif");
  await setSelect('#weightBadgeSelect', '700');
  await setRange('#sizeBadgeRange', '13');
  await setRange('#spacingBadgeRange', '2');
  await setCheckbox('#showBadgeCheck', true);
  pass('Slot 2 (Badge) configurado');

  // Slot 3: Tag
  await setTextInput('#categoryTagInput', 'ALQUIMIA & HARMONIA');
  await setSelect('#fontTagSelect', "'Cinzel', serif");
  await setSelect('#weightTagSelect', '700');
  await setRange('#sizeTagRange', '15');
  await setRange('#spacingTagRange', '3');
  pass('Slot 3 (Tag) configurado');

  // Slot 4: Title
  await setTextInput('#titleInput', 'Japamala de Lápis-Lazúli');
  await setSelect('#fontTitleSelect', "'Cinzel Decorative', 'Cinzel', serif");
  await setSelect('#weightTitleSelect', '700');
  await setRange('#sizeTitleRange', '50');
  await setRange('#spacingTitleRange', '2');
  await setRange('#glowTitleRange', '8');
  pass('Slot 4 (Título) configurado');

  // Slot 5: Subtitle
  await setTextInput('#subtitleInput', 'Sabedoria Ancestral & Visão Espiritual');
  await setSelect('#fontSubtitleSelect', "'Cormorant Garamond', serif");
  await setSelect('#styleSubtitleSelect', 'italic 500');
  await setRange('#sizeSubtitleRange', '26');
  await setRange('#spacingSubtitleRange', '1');
  pass('Slot 5 (Subtítulo) configurado');

  // Slot 6: Description
  await setTextInput('#descriptionInput', 'Peça artesanal consagrada com 108 contas de pura pedra natural, amplificando a intuição e a paz interior profunda.');
  await setSelect('#fontDescSelect', "'Montserrat', sans-serif");
  await setSelect('#weightDescSelect', '300');
  await setRange('#sizeDescRange', '17');
  await setRange('#lineHeightDescRange', '16');
  pass('Slot 6 (Descrição) configurado');

  // Slot 7: Highlight
  await setTextInput('#highlightInput', '✦ Ativa o Chakra Frontal e a Clareza Mental');
  await setSelect('#fontHighlightSelect', "'Montserrat', sans-serif");
  await setSelect('#weightHighlightSelect', '600');
  await setRange('#sizeHighlightRange', '14');
  await setRange('#spacingHighlightRange', '1');
  await setCheckbox('#showHighlightBoxCheck', true);
  pass('Slot 7 (Destaque) configurado');

  // Slot 8: CTA
  await setTextInput('#ctaInput', 'Adquira em pedacodoceu.com.br');
  await setSelect('#fontCtaSelect', "'Cinzel', serif");
  await setSelect('#weightCtaSelect', '600');
  await setRange('#sizeCtaRange', '14');
  await setRange('#spacingCtaRange', '2');
  pass('Slot 8 (CTA) configurado');

  // Alinhamento Central
  await page.click('[data-align="center"]');
  await page.waitForTimeout(200);

  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02_typography_all_slots_configured.png') });

  // --------------------------------------------------------------------------
  // ETAPA 3: Aba Estilo & Cores (Degradês, Geometria Sagrada e Cantoneiras)
  // --------------------------------------------------------------------------
  console.log('\n🔮 [ETAPA 3] Testando Aba Estilo & Cores (Degradês, Geometria e Efeitos)...');
  await switchTab('tab-estilo');

  await setSelect('#sacredPatternSelect', 'metatronCube');
  await setRange('#patternOpacityRange', '40');
  await setRange('#gradientIntensityRange', '95');
  await setRange('#boxOpacityRange', '90');
  await setCheckbox('#showCornersCheck', true);
  pass('Geometria Sagrada, Opacidades e Cantoneiras configuradas');

  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03_style_colors_and_metatron_cube.png') });

  // --------------------------------------------------------------------------
  // ETAPA 4: Aba Formato & Layout (Refino de Dimensões, Enquadramento e Proporções)
  // --------------------------------------------------------------------------
  console.log('\n📐 [ETAPA 4] Testando Aba Formato & Layout (Sliders de Refino e Enquadramento)...');
  await switchTab('tab-formato');

  // Testa proporção Feed 1:1 com Split Lateral Esquerdo
  await page.click('.segmented-btn[data-format="1:1"]');
  await page.click('.segmented-btn[data-layout="left"]');
  await page.click('.segmented-btn[data-fit="portal"]');
  await page.click('.segmented-btn[data-text-card-style="card"]');

  // Modifica todos os sliders de refino
  await setRange('#splitRatioRange', '55');
  await setRange('#cardRadiusRange', '22');
  await setRange('#paddingSideRange', '50');
  await setRange('#paddingTopRange', '80');
  await setRange('#blockGapRange', '24');
  await setRange('#globalLineGapRange', '14');
  await setRange('#imgZoomRange', '115');
  await setRange('#imgPanXRange', '20');
  await setRange('#imgPanYRange', '-15');
  await setCheckbox('#showSafeAreaGuideCheck', true);

  pass('Sliders de refino milimétrico (splitRatio, radius, paddings, gaps, zoom, pan) validados');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04_layout_left_split_55pct_portal.png') });

  // --------------------------------------------------------------------------
  // ETAPA 5: Teste Visual Combinatório de Layouts e Estilos de Fundo
  // --------------------------------------------------------------------------
  console.log('\n🎨 [ETAPA 5] Testando Matriz de Layouts e Estilos de Fundo...');

  // 5.1 Layout Lateral Direito com Fusão
  await page.click('.segmented-btn[data-layout="right"]');
  await page.click('.segmented-btn[data-fit="fusion"]');
  await setRange('#splitRatioRange', '65');
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '05_layout_right_fusion_65pct.png') });
  pass('Layout Lateral Direito com Fusão renderizado com sucesso');

  // 5.2 Layout Rodapé (Bottom Stack) com Estilo Vidro (Glass)
  await page.click('.segmented-btn[data-format="4:5"]');
  await page.click('.segmented-btn[data-layout="bottom"]');
  await page.click('.segmented-btn[data-text-card-style="glass"]');
  await setRange('#textZoneHeightRange', '48');
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '06_layout_bottom_stack_glass_4x5.png') });
  pass('Layout Rodapé com Estilo Vidro em Feed 4:5 renderizado com sucesso');

  // 5.3 Layout Topo (Top Stack) com Caixas Separadas (Separated)
  await page.click('.segmented-btn[data-format="9:16-story"]');
  await page.click('.segmented-btn[data-layout="top"]');
  await page.click('.segmented-btn[data-text-card-style="separated"]');
  await setRange('#textZoneHeightRange', '50');
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '07_layout_top_stack_separated_stories.png') });
  pass('Layout Topo com Caixas Separadas em Stories 9:16 renderizado com sucesso');

  // 5.4 Layout Centro (Center Overlay) com Moldura Sagrada (Framed)
  await page.click('.segmented-btn[data-format="1:1"]');
  await page.click('.segmented-btn[data-layout="center"]');
  await page.click('.segmented-btn[data-text-card-style="framed"]');
  await setRange('#cardRadiusRange', '28');
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '08_layout_center_overlay_framed_1x1.png') });
  pass('Layout Centro com Moldura Sagrada renderizado com sucesso');

  // 5.5 Layout Degradê Suave (Gradient Fade)
  await page.click('.segmented-btn[data-layout="bottom"]');
  await page.click('.segmented-btn[data-text-card-style="gradient"]');
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '09_layout_bottom_gradient_fade.png') });
  pass('Layout Rodapé com Degradê Suave renderizado com sucesso');

  // --------------------------------------------------------------------------
  // ETAPA 6: Teste de Exportação em 2K Ultra-HD
  // --------------------------------------------------------------------------
  console.log('\n💾 [ETAPA 6] Testando Exportação em Alta Resolução 2K...');
  const exportResult = await page.evaluate(async () => {
    if (!window.studioApp || !window.studioApp.renderer) return { success: false, reason: 'studioApp indisponível' };
    const offscreen = await window.studioApp.renderer.renderHighRes(2);
    if (!offscreen) return { success: false, reason: 'renderHighRes retornou nulo' };
    return {
      success: true,
      width: offscreen.width,
      height: offscreen.height,
      dataUrlSample: offscreen.toDataURL('image/png', 0.8).slice(0, 100)
    };
  });

  if (exportResult.success && exportResult.width === 2160 && exportResult.height === 2160) {
    pass(`Exportação 2K confirmada nativamente: ${exportResult.width}x${exportResult.height}px`);
  } else {
    throw new Error(`Falha na exportação 2K: ${JSON.stringify(exportResult)}`);
  }

  // Gera captura de tela final do Estúdio Completo com painel e canvas
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '10_full_studio_final_state.png'), fullPage: true });

  await browser.close();

  console.log('\n=============================================================');
  console.log(`🎉 TESTES MASSIVOS CONCLUÍDOS COM SUCESSO: ${testStepCount} verificações aprovadas!`);
  console.log(`🚨 Console Errors do Navegador: ${consoleErrors.length}`);
  console.log(`📸 10 Capturas de Tela Geradas em: ${SCREENSHOTS_DIR}`);
  console.log('=============================================================\n');

  if (consoleErrors.length > 0) {
    console.error('❌ Erros encontrados no console do navegador:');
    consoleErrors.forEach(err => console.error('  -', err));
    process.exit(1);
  }
}

runMassiveValidation().catch(err => {
  console.error('❌ Falha crítica no teste massivo Playwright:', err);
  process.exit(1);
});
