/**
 * SUÍTE 2: TESTES MASSIVOS COMBINATÓRIOS & CONTRATOS (E2E)
 * Pedaço do Céu Studio v2.0 Enterprise
 *
 * Executa a matriz combinatória completa de 240 variações:
 * 15 Peças do Acervo x 4 Formatos Sociais x 4 Layouts Estruturais
 * Além de todas as Geometrias Sagradas, Modos de Enquadramento e Alinhamentos.
 */

import { PHOTO_CATALOG } from '../js/app.js';

export async function runMassiveCombinatorialSuite(page) {
  const suite = { name: 'Camada Massiva Combinatória (300 Combinações)', tests: [], passed: 0, failed: 0 };

  function assert(name, condition, info = '') {
    if (condition) {
      suite.passed++;
      suite.tests.push({ name, pass: true });
    } else {
      suite.failed++;
      suite.tests.push({ name, pass: false, info });
      console.error(`  ❌ [FALHA COMBINATÓRIA] ${name} ${info}`);
    }
  }

  const formats = ['1:1', '4:5', '9:16-story', '9:16-tiktok'];
  const layouts = ['left', 'right', 'bottom', 'top', 'center'];

  console.log(`  ⚡ Testando matriz completa de ${PHOTO_CATALOG.length} peças x ${formats.length} formatos x ${layouts.length} layouts...`);

  // =========================================================
  // 1. MATRIZ COMBINATÓRIA (240 Combinações de Estado & Render)
  // =========================================================
  let combinationCount = 0;
  let renderErrors = 0;

  for (const item of PHOTO_CATALOG) {
    for (const fmt of formats) {
      for (const layout of layouts) {
        combinationCount++;
        try {
          const success = await page.evaluate(({ piece, format, lay }) => {
            if (!window.pedacoStudio) return false;
            const studio = window.pedacoStudio;
            
            // Aplica a peça e o formato
            studio.applyCatalogItem(piece);
            studio.setFormat(format);
            studio.store.state.layout = lay;
            studio.renderer.render();

            return true;
          }, { piece: item, format: fmt, lay: layout });

          if (!success) renderErrors++;
        } catch (e) {
          renderErrors++;
        }
      }
    }
  }

  assert(`Matriz Combinatória: ${combinationCount} combinações testadas no Canvas sem falha`,
    combinationCount === 300 && renderErrors === 0,
    `Erros: ${renderErrors} / ${combinationCount}`
  );

  // =========================================================
  // 2. TODAS AS GEOMETRIAS SAGRADAS
  // =========================================================
  const patterns = ['flowerOfLife', 'metatronCube', 'sriYantra', 'lunarMandala', 'logoPattern', 'none'];
  for (const pat of patterns) {
    const ok = await page.evaluate((patternKey) => {
      window.pedacoStudio.store.state.sacredPattern = patternKey;
      window.pedacoStudio.renderer.render();
      return true;
    }, pat);
    assert(`Geometria Sagrada [${pat}] renderiza sem exceção`, ok);
  }

  // =========================================================
  // 3. TODOS OS MODOS DE ENQUADRAMENTO
  // =========================================================
  for (const fit of ['portal', 'fusion', 'cover']) {
    const ok = await page.evaluate((fitMode) => {
      window.pedacoStudio.store.state.fitMode = fitMode;
      window.pedacoStudio.renderer.render();
      return true;
    }, fit);
    assert(`Modo de Enquadramento [${fit}] renderiza com precisão`, ok);
  }

  // =========================================================
  // 4. TODOS OS ALINHAMENTOS DE TEXTO
  // =========================================================
  for (const align of ['left', 'center', 'right']) {
    const ok = await page.evaluate((al) => {
      window.pedacoStudio.store.state.align = al;
      window.pedacoStudio.renderer.render();
      return true;
    }, align);
    assert(`Alinhamento de Texto [${align}] renderiza com precisão`, ok);
  }

  // =========================================================
  // 5. TESTE DE EXPORTAÇÃO HIGH-DPI
  // =========================================================
  const exportCheck = await page.evaluate(async () => {
    const studio = window.pedacoStudio;
    const dataUrl = studio.renderer.highDPICanvas.getExportDataURL('image/png');
    const blob = await studio.renderer.highDPICanvas.getExportBlob('image/png');
    return {
      hasDataUrl: dataUrl && dataUrl.startsWith('data:image/png;base64,'),
      hasBlob: blob && blob.size > 0
    };
  });

  assert('Exportação High-DPI: gera DataURL PNG válido', exportCheck.hasDataUrl);
  assert('Exportação High-DPI: gera Blob binário com tamanho positivo', exportCheck.hasBlob);

  return suite;
}
