/**
 * SUÍTE 1: TESTES ATÔMICOS, PROPRIEDADES & FUZZING
 * Pedaço do Céu Studio v2.0 Enterprise
 *
 * Testa exaustivamente todas as funções puras, cálculos de zonas,
 * invariantes matemáticas, algoritmos de text-fit, contraste WCAG e histórico.
 */

import { hexToRgb, hexToRgba, TOKENS } from '../js/tokens.js';
import {
  LAYOUT_CONFIG,
  SAFE_AREAS,
  calculateZones,
  applySafeArea,
  measureWrappedText,
  calculateTextBlocks
} from '../js/canvas/layout-engine.js';
import { SnappingManager } from '../js/ui/snapping.js';
import { A11yManager } from '../js/ui/a11y.js';
import { HistoryManager } from '../js/state/history.js';
import { Persistence } from '../js/state/persistence.js';

export async function runAtomicSuite() {
  const suite = { name: 'Camada Atômica & Fuzzing', tests: [], passed: 0, failed: 0 };

  function assert(name, condition, info = '') {
    if (condition) {
      suite.passed++;
      suite.tests.push({ name, pass: true });
    } else {
      suite.failed++;
      suite.tests.push({ name, pass: false, info });
      console.error(`  ❌ [FALHA ATÔMICA] ${name} ${info}`);
    }
  }

  // =========================================================
  // 1. UTILITÁRIOS DE CORES (hexToRgb / hexToRgba)
  // =========================================================
  const rgbWhite = hexToRgb('#ffffff');
  assert('hexToRgb: #ffffff retorna {r:255, g:255, b:255}', rgbWhite.r === 255 && rgbWhite.g === 255 && rgbWhite.b === 255);

  const rgbBlack = hexToRgb('#000000');
  assert('hexToRgb: #000000 retorna {r:0, g:0, b:0}', rgbBlack.r === 0 && rgbBlack.g === 0 && rgbBlack.b === 0);

  const rgbGold = hexToRgb('#d4af37');
  assert('hexToRgb: #d4af37 retorna {r:212, g:175, b:55}', rgbGold.r === 212 && rgbGold.g === 175 && rgbGold.b === 55);

  const rgbShort = hexToRgb('#fff');
  assert('hexToRgb: hex curto #fff retorna valores corretos ou fallback', typeof rgbShort.r === 'number');

  const rgbInvalid = hexToRgb('invalid_color');
  assert('hexToRgb: input inválido retorna fallback seguro sem quebrar', typeof rgbInvalid.r === 'number');

  const rgbaGold50 = hexToRgba('#d4af37', 0.5);
  assert('hexToRgba: alfa 0.5 formata rgba(212, 175, 55, 0.5)', rgbaGold50 === 'rgba(212, 175, 55, 0.5)');

  const rgbaAlpha0 = hexToRgba('#d4af37', 0);
  assert('hexToRgba: alfa 0 formata rgba(212, 175, 55, 0)', rgbaAlpha0 === 'rgba(212, 175, 55, 0)');

  const rgbaAlpha1 = hexToRgba('#d4af37', 1);
  assert('hexToRgba: alfa 1 formata rgba(212, 175, 55, 1)', rgbaAlpha1 === 'rgba(212, 175, 55, 1)');

  // =========================================================
  // 2. CÁLCULO DE ZONAS ESPACIAIS (calculateZones)
  // =========================================================
  const layouts = ['right', 'bottom', 'top', 'center'];
  const testDimensions = [
    { w: 1080, h: 1080, name: '1:1' },
    { w: 1080, h: 1350, name: '4:5' },
    { w: 1080, h: 1920, name: '9:16' },
    { w: 3840, h: 2160, name: '4K' }
  ];

  for (const layout of layouts) {
    for (const { w, h, name: dimName } of testDimensions) {
      const zones = calculateZones(w, h, layout);
      assert(`calculateZones [${layout}] em [${dimName}]: zona img e text definidas`, zones.img && zones.text);
      assert(`calculateZones [${layout}] em [${dimName}]: sem valores NaN`,
        !isNaN(zones.img.x) && !isNaN(zones.img.y) && !isNaN(zones.img.w) && !isNaN(zones.img.h) &&
        !isNaN(zones.text.x) && !isNaN(zones.text.y) && !isNaN(zones.text.w) && !isNaN(zones.text.h)
      );

      // Invariantes espaciais
      if (layout === 'right') {
        assert(`calculateZones [right] [${dimName}]: soma das larguras = W`, Math.round(zones.img.w + zones.text.w) === w);
        assert(`calculateZones [right] [${dimName}]: altura total = H`, zones.img.h === h && zones.text.h === h);
      } else if (layout === 'bottom' || layout === 'top') {
        assert(`calculateZones [${layout}] [${dimName}]: soma das alturas = H`, Math.round(zones.img.h + zones.text.h) === h);
        assert(`calculateZones [${layout}] [${dimName}]: largura total = W`, zones.img.w === w && zones.text.w === w);
      } else if (layout === 'center') {
        assert(`calculateZones [center] [${dimName}]: imagem preenche 100%`, zones.img.w === w && zones.img.h === h);
        assert(`calculateZones [center] [${dimName}]: card de texto centralizado`, zones.text.x > 0 && zones.text.y > 0);
      }
    }
  }

  // =========================================================
  // 3. SAFE AREAS (applySafeArea)
  // =========================================================
  const formats = ['1:1', '4:5', '9:16-story', '9:16-tiktok'];
  for (const fmt of formats) {
    const rawZone = { x: 0, y: 1000, w: 1080, h: 920 };
    const safeZone = applySafeArea(rawZone, fmt);
    assert(`applySafeArea [${fmt}]: zona segura dentro da zona bruta`,
      safeZone.x >= rawZone.x && safeZone.y >= rawZone.y &&
      safeZone.w <= rawZone.w && safeZone.h <= rawZone.h
    );
    assert(`applySafeArea [${fmt}]: margens positivas`, safeZone.w > 0 && safeZone.h > 0);

    if (fmt.startsWith('9:16')) {
      const safeMarginTop = safeZone.y - rawZone.y;
      assert(`applySafeArea [${fmt}]: margem superior >= 90px para UI social`, safeMarginTop >= 90);
    }
  }

  // =========================================================
  // 4. MEDIÇÃO E WRAP DE TEXTO (measureWrappedText & Fuzzing)
  // =========================================================
  // Mock mínimo de Canvas Context para testes unitários
  const mockCtx = {
    save: () => {},
    restore: () => {},
    measureText: (str) => ({ width: str.length * 9 }) // aproximação 9px por char
  };

  const emptyWrap = measureWrappedText(mockCtx, '', 20, 400, 'serif');
  assert('measureWrappedText: string vazia retorna height 0', emptyWrap.height === 0);

  const shortWrap = measureWrappedText(mockCtx, 'Palavra', 20, 400, 'serif');
  assert('measureWrappedText: palavra única retorna 1 linha', shortWrap.lines.length === 1);

  const longText = 'Esta é uma descrição longa com muitas palavras para testar o algoritmo de quebra de linha com precisão cirúrgica sem distorcer o layout.';
  const wrapped = measureWrappedText(mockCtx, longText, 16, 200, 'serif');
  assert('measureWrappedText: quebra em múltiplas linhas quando excede maxWidth', wrapped.lines.length > 1);

  // Fuzzing com caracteres especiais e unicode tibetano
  const unicodeText = 'Oṃ Maṇi Padme Hūṃ • ཨོཾ་མ་ཎི་པདྨེ་ཧཱུྃ • ✨🌿✦ 432Hz';
  const unicodeWrap = measureWrappedText(mockCtx, unicodeText, 18, 300, 'serif');
  assert('measureWrappedText: processa unicode tibetano e símbolos sem erro', unicodeWrap.lines.length >= 1);

  // =========================================================
  // 5. CÁLCULO DE BLOCOS & TEXT-FIT RECURSIVO (calculateTextBlocks)
  // =========================================================
  const testStateNormal = {
    title: 'CRISTAIS & BEM-ESTAR',
    subtitle: 'A Força Primordial das Rochas Sagradas',
    description: 'Purifique a energia do seu espaço.',
    categoryTag: 'CURA & HARMONIA',
    highlightText: '✦ Frequência 432Hz',
    badgeText: 'Energia Pura',
    ctaText: 'Visite nossa loja',
    showBadge: true,
    showHighlightBox: true,
    sizeTitle: 46,
    sizeSubtitle: 20,
    sizeDesc: 16,
    paddingTop: 40,
    blockGap: 18,
    paddingSide: 20,
    align: 'center'
  };

  const zoneBottom = { x: 35, y: 600, w: 1010, h: 440 };
  const blocksNormal = calculateTextBlocks(mockCtx, testStateNormal, zoneBottom, 1080, 1080);
  assert('calculateTextBlocks: gera todos os tipos de blocos esperados',
    blocksNormal.some(b => b.type === 'badge') &&
    blocksNormal.some(b => b.type === 'tag') &&
    blocksNormal.some(b => b.type === 'title') &&
    blocksNormal.some(b => b.type === 'subtitle') &&
    blocksNormal.some(b => b.type === 'divider') &&
    blocksNormal.some(b => b.type === 'description') &&
    blocksNormal.some(b => b.type === 'highlight') &&
    blocksNormal.some(b => b.type === 'cta')
  );

  // Teste de Auto Text-Fit com texto gigantesco em zona pequena
  const testStateGiant = {
    ...testStateNormal,
    title: 'TÍTULO EXTREMAMENTE LONGO COM MUITAS PALAVRAS QUE OCUPAM MUITO ESPAÇO NO CANVAS',
    description: 'Texto de descrição gigantesco com dezenas de frases detalhando propriedades energéticas, rituais sagrados, conexões astrais, métodos de purificação, alinhamento dos chakras e frequências vibracionais milenares dos mosteiros sagrados do Tibete e dos Himalaias.'
  };
  const zoneTight = { x: 35, y: 700, w: 1010, h: 300 };
  const blocksFit = calculateTextBlocks(mockCtx, testStateGiant, zoneTight, 1080, 1080);
  assert('calculateTextBlocks: ativa Text-Fit Mode e distribui blocos sem quebrar', blocksFit.length > 0);

  // =========================================================
  // 6. ALINHAMENTO MAGNÉTICO (SnappingManager)
  // =========================================================
  const snapper = new SnappingManager(15);

  const snapCenter = snapper.applySnapping(542, 540, 1080, 1080);
  assert('SnappingManager: valor 542 dentro do threshold de 15px faz snap para 540', snapCenter.x === 540 && snapCenter.guide !== null);

  const noSnap = snapper.applySnapping(600, 600, 1080, 1080);
  assert('SnappingManager: valor 600 fora do threshold não faz snap', noSnap.x === 600 && noSnap.guide === null);

  const snapThirdLeft = snapper.applySnapping(364, 200, 1080, 1080);
  assert('SnappingManager: valor 364 faz snap para o terço esquerdo (359.64)', Math.abs(snapThirdLeft.x - 359.64) < 1);

  // =========================================================
  // 7. ACESSIBILIDADE E CONTRASTE WCAG (A11yManager)
  // =========================================================
  const lumWhite = A11yManager.calculateLuminance(255, 255, 255);
  const lumBlack = A11yManager.calculateLuminance(0, 0, 0);
  assert('A11yManager: luminância do branco é 1.0', Math.abs(lumWhite - 1.0) < 0.01);
  assert('A11yManager: luminância do preto é 0.0', Math.abs(lumBlack - 0.0) < 0.01);

  const contrastWhiteBlack = A11yManager.checkContrast('#ffffff', '#000000');
  assert('A11yManager: contraste branco x preto é 21:1', Math.abs(contrastWhiteBlack - 21.0) < 0.1);

  const contrastGoldGreen = A11yManager.checkContrast('#f5d77f', '#00381c');
  assert('A11yManager: ouro claro sobre esmeralda atende WCAG AA (ratio >= 4.5)', contrastGoldGreen >= 4.5, `Ratio: ${contrastGoldGreen.toFixed(2)}`);

  // =========================================================
  // 8. HISTÓRICO UNDO / REDO (HistoryManager)
  // =========================================================
  const history = new HistoryManager(50);
  history.push({ step: 1 });
  history.push({ step: 2 });
  history.push({ step: 3 });

  assert('HistoryManager: canUndo é true após pushes', history.canUndo());
  assert('HistoryManager: canRedo é false antes de undo', !history.canRedo());

  const state2 = history.undo({ step: 3 });
  assert('HistoryManager: undo retorna estado anterior (step: 2)', state2.step === 2);
  assert('HistoryManager: canRedo é true após undo', history.canRedo());

  const state3 = history.redo();
  assert('HistoryManager: redo avança para o estado futuro (step: 3)', state3.step === 3);

  // Teste de estresse do limite de 50 snapshots
  for (let i = 4; i <= 100; i++) {
    history.push({ step: i });
  }
  assert('HistoryManager: pilha não ultrapassa o limite configurado de 50 snapshots', history.past.length <= 50);

  // Teste de descarte de futuro ao realizar nova ação após undo
  history.undo({ step: 100 });
  history.push({ step: 'novo-ramo' });
  assert('HistoryManager: nova ação limpa a pilha de futuro', !history.canRedo());

  return suite;
}
