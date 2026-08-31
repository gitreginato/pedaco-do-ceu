/**
 * PEDAÇO DO CÉU - MASTER STUDIO v2.0 ENTERPRISE
 * Bundled for Universal Execution (file:// and HTTP)
 */

(function() {
  'use strict';

  // 1. Tokens & Layout Engine
  // Tokens JS Compartilhados com o Canvas e CSS - Pedaço do Céu Studio v2.0 Enterprise
const TOKENS = {
  colors: {
    sacredGold: '#d4af37',
    sacredGoldLight: '#f5d77f',
    sacredGoldBright: '#ffd700',
    sacredGoldDark: '#8c7322',
    mysticGreen: '#00381c',
    mysticGreenMid: '#008542',
    mysticGreenDeep: '#001f0f',
    mysticDarkness: '#050c07',
    obsidian: '#020503',
    textPrimary: '#f8f9fa',
    textSecondary: '#eadcb9',
    parchment: '#eadcb9',
  },
  fonts: {
    displayNoble: "'Cinzel Decorative', 'Cinzel', serif",
    serifClassic: "'Cinzel', serif",
    imperial: "'Marcellus', serif",
    editorial: "'Playfair Display', serif",
    hauteCouture: "'Bodoni Moda', serif",
    avantGarde: "'Syne', sans-serif",
    mystic: "'Cormorant Garamond', serif",
    renaissance: "'EB Garamond', serif",
    gothic: "'UnifrakturMaguntia', cursive",
    italianScript: "'Fondamento', cursive",
    runic: "'MedievalSharp', cursive",
    script: "'Great Vibes', 'Alex Brush', cursive",
    sansClean: "'Montserrat', sans-serif",
  },
  dimensions: {
    '1:1': { width: 1080, height: 1080, label: '1080 x 1080px (Feed 1:1)' },
    '4:5': { width: 1080, height: 1350, label: '1080 x 1350px (Feed 4:5)' },
    '9:16-story': { width: 1080, height: 1920, label: '1080 x 1920px (Stories)' },
    '9:16-tiktok': { width: 1080, height: 1920, label: '1080 x 1920px (TikTok)' },
  }
};

const DESIGN_PRESETS = {
  cristal: {
    name: 'Ativação Cristalina',
    gradientPrimary: '#00381c',
    gradientSecondary: '#008542',
    gradientDarkness: '#050c07',
    colorTitle: '#f8f9fa',
    colorTitleGlow: '#d4af37',
    colorSubtitle: '#eadcb9',
    colorHighlight: '#f5d77f',
    colorHighlightBorder: '#d4af37',
    sacredPattern: 'flowerOfLife',
    fitMode: 'portal',
    fontTitle: "'Cinzel Decorative', serif",
    fontSubtitle: "'Cormorant Garamond', serif"
  },
  tibete: {
    name: 'Prece do Tibete & Nepal',
    gradientPrimary: '#140a03',
    gradientSecondary: '#241407',
    gradientDarkness: '#080401',
    colorTitle: '#ffffff',
    colorTitleGlow: '#f5d77f',
    colorSubtitle: '#f5d77f',
    colorHighlight: '#f5d77f',
    colorHighlightBorder: '#d4af37',
    sacredPattern: 'sriYantra',
    fitMode: 'portal',
    fontTitle: "'Cinzel', serif",
    fontSubtitle: "'Playfair Display', serif"
  },
  lunar: {
    name: 'Mandala Lunar 432Hz',
    gradientPrimary: '#051329',
    gradientSecondary: '#0d284f',
    gradientDarkness: '#020612',
    colorTitle: '#ffffff',
    colorTitleGlow: '#64b5f6',
    colorSubtitle: '#b0bec5',
    colorHighlight: '#90caf9',
    colorHighlightBorder: '#64b5f6',
    sacredPattern: 'lunarMandala',
    fitMode: 'fusion',
    fontTitle: "'Marcellus', serif",
    fontSubtitle: "'Playfair Display', serif"
  },
  arcanjos: {
    name: 'Portal dos Arcanjos',
    gradientPrimary: '#1a0033',
    gradientSecondary: '#3d0066',
    gradientDarkness: '#0a0014',
    colorTitle: '#f8f9fa',
    colorTitleGlow: '#ffd700',
    colorSubtitle: '#e1bee7',
    colorHighlight: '#ffd700',
    colorHighlightBorder: '#ba68c8',
    sacredPattern: 'metatronCube',
    fitMode: 'portal',
    fontTitle: "'Cinzel', serif",
    fontSubtitle: "'EB Garamond', serif"
  },
  ancestral: {
    name: 'Sabedoria Ancestral',
    gradientPrimary: '#1b2612',
    gradientSecondary: '#384d20',
    gradientDarkness: '#080c05',
    colorTitle: '#fffdf5',
    colorTitleGlow: '#ffb300',
    colorSubtitle: '#d7ccc8',
    colorHighlight: '#ffe082',
    colorHighlightBorder: '#ffb300',
    sacredPattern: 'sriYantra',
    fitMode: 'cover',
    fontTitle: "'Bodoni Moda', serif",
    fontSubtitle: "'Cormorant Garamond', serif"
  },
  chama: {
    name: 'Chama Trina Sagrada',
    gradientPrimary: '#3a0007',
    gradientSecondary: '#6b0513',
    gradientDarkness: '#140003',
    colorTitle: '#ffffff',
    colorTitleGlow: '#f5d77f',
    colorSubtitle: '#ffcdd2',
    colorHighlight: '#ffd700',
    colorHighlightBorder: '#ef5350',
    sacredPattern: 'logoPattern',
    fitMode: 'portal',
    fontTitle: "'UnifrakturMaguntia', cursive",
    fontSubtitle: "'Fondamento', cursive"
  }
};

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 31, b: 15 };
}

function hexToRgba(hex, alpha = 1) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

  // Engine de Layouts & Zonas Espaciais - Pedaço do Céu Studio v2.0 Enterprise

const LAYOUT_CONFIG = {
  right: {
    // Referência funcional — preservada
    type: 'split',
    imgAnchor: 'left',
    textAnchor: 'right',
    imgWidthPercent: 0.60,
    imgHeightPercent: 1.0,
    textWidthPercent: 0.40,
    textAlign: 'center',
    gradientOverlay: false
  },
  left: {
    type: 'split',
    imgAnchor: 'right',
    textAnchor: 'left',
    imgWidthPercent: 0.60,
    imgHeightPercent: 1.0,
    textWidthPercent: 0.40,
    textAlign: 'center',
    gradientOverlay: false
  },
  bottom: {
    type: 'stack',
    imgAnchor: 'top',
    textAnchor: 'bottom',
    imgHeightPercent: 0.58,
    textHeightPercent: 0.42,
    textAlign: 'center',
    gradientOverlay: true,
    safeAreaBottom: 60
  },
  top: {
    type: 'stack',
    imgAnchor: 'bottom',
    textAnchor: 'top',
    imgHeightPercent: 0.58,
    textHeightPercent: 0.42,
    textAlign: 'center',
    gradientOverlay: true,
    safeAreaTop: 40
  },
  center: {
    type: 'overlay',
    imgAnchor: 'full',
    textAnchor: 'center',
    imgWidthPercent: 1.0,
    imgHeightPercent: 1.0,
    textAlign: 'center',
    gradientOverlay: true,
    textBgBlur: true
  }
};

const SAFE_AREAS = {
  '1:1': { top: 60, bottom: 60, left: 60, right: 60 },
  '4:5': { top: 70, bottom: 70, left: 70, right: 70 },
  '9:16-story': { top: 100, bottom: 120, left: 70, right: 70 },
  '9:16-tiktok': { top: 120, bottom: 140, left: 70, right: 70 }
};

function calculateZones(canvasW, canvasH, layoutKey) {
  const config = LAYOUT_CONFIG[layoutKey] || LAYOUT_CONFIG.right;
  const zones = {};

  if (config.type === 'split') {
    const splitX = Math.round(canvasW * config.imgWidthPercent);
    if (config.imgAnchor === 'right') {
      zones.text = { x: 0, y: 0, w: canvasW - splitX, h: canvasH };
      zones.img = { x: canvasW - splitX, y: 0, w: splitX, h: canvasH };
    } else {
      zones.img = { x: 0, y: 0, w: splitX, h: canvasH };
      zones.text = { x: splitX, y: 0, w: canvasW - splitX, h: canvasH };
    }
  } else if (config.type === 'stack') {
    if (config.imgAnchor === 'top') {
      const imgH = Math.round(canvasH * config.imgHeightPercent);
      zones.img = { x: 0, y: 0, w: canvasW, h: imgH };
      zones.text = { x: 0, y: imgH, w: canvasW, h: canvasH - imgH };
    } else {
      const textH = Math.round(canvasH * config.textHeightPercent);
      zones.text = { x: 0, y: 0, w: canvasW, h: textH };
      zones.img = { x: 0, y: textH, w: canvasW, h: canvasH - textH };
    }
  } else if (config.type === 'overlay') {
    zones.img = { x: 0, y: 0, w: canvasW, h: canvasH };
    const cardW = Math.min(canvasW * 0.88, 760);
    const cardH = Math.min(canvasH * 0.76, 960);
    zones.text = {
      x: (canvasW - cardW) / 2,
      y: (canvasH - cardH) / 2,
      w: cardW,
      h: cardH
    };
  }

  return zones;
}

function applySafeArea(zone, formatKey) {
  const safe = SAFE_AREAS[formatKey] || SAFE_AREAS['1:1'];
  return {
    x: zone.x + safe.left,
    y: zone.y + safe.top,
    w: Math.max(100, zone.w - safe.left - safe.right),
    h: Math.max(100, zone.h - safe.top - safe.bottom)
  };
}

function measureWrappedText(ctx, text, fontSize, maxWidth, fontFamily) {
  if (!text) return { height: 0, lines: [] };
  ctx.save();
  ctx.font = `${fontSize}px ${fontFamily}`;
  const words = text.split(' ');
  let line = '';
  const lines = [];
  const lineHeight = fontSize * 1.25;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      lines.push(line.trim());
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());
  ctx.restore();

  return {
    height: lines.length * lineHeight,
    lines: lines,
    lineHeight: lineHeight
  };
}

function calculateTextBlocks(ctx, state, zone, canvasW, canvasH, iteration = 0) {
  const blocks = [];
  const align = state.align || 'center';
  const maxWidth = zone.w - (state.paddingSide || 20) * 2;
  const centerX = zone.x + (zone.w / 2);
  const leftX = zone.x + (state.paddingSide || 20);
  const rightX = zone.x + zone.w - (state.paddingSide || 20);

  const getX = () => {
    if (align === 'left') return leftX;
    if (align === 'right') return rightX;
    return centerX;
  };

  // Escala dinâmica se houver overflow
  const scale = iteration > 0 ? Math.pow(0.9, iteration) : 1.0;
  const gap = Math.round((state.blockGap || 20) * scale);
  const lineGapExtra = (state.globalLineGap || 12) * scale;
  let currentY = zone.y + (state.paddingTop !== undefined ? state.paddingTop * scale : 20);

  // Tamanhos de fonte proporcionais
  const maxTitleSize = Math.round(Math.min(state.sizeTitle || 46, zone.h * 0.16) * scale);
  const subSize = Math.round(Math.min(state.sizeSubtitle || 20, maxTitleSize * 0.65) * scale);
  const descSize = Math.round(Math.min(state.sizeDesc || 16, zone.h * 0.08) * scale);

  // 1. Badge (Selo Superior)
  if (state.showBadge && state.badgeText) {
    blocks.push({
      type: 'badge',
      text: state.badgeText,
      x: centerX,
      y: currentY,
      align: 'center',
      color: state.colorBadge,
      colorBorder: state.colorBadge,
      maxWidth: maxWidth
    });
    currentY += 34 + gap;
  }

  // 2. Tag / Categoria
  if (state.categoryTag) {
    blocks.push({
      type: 'tag',
      text: state.categoryTag.toUpperCase(),
      x: getX(),
      y: currentY,
      align: align,
      font: `700 ${Math.round(14 * scale)}px 'Cinzel', serif`,
      color: state.colorTag,
      letterSpacing: 2,
      maxWidth: maxWidth
    });
    currentY += Math.round(16 * scale) + Math.round(gap * 0.8) + Math.round(maxTitleSize * 0.82);
  } else {
    currentY += Math.round(maxTitleSize * 0.82);
  }

  // 3. Título Principal
  const titleFont = `${state.weightTitle || 700} ${maxTitleSize}px ${state.fontTitle || "'Cinzel Decorative', serif"}`;
  const titleMetrics = measureWrappedText(ctx, state.title, maxTitleSize, maxWidth, state.fontTitle || "'Cinzel Decorative', serif");
  
  blocks.push({
    type: 'title',
    text: state.title,
    lines: titleMetrics.lines,
    lineHeight: maxTitleSize * 1.10 + lineGapExtra * 0.3,
    x: getX(),
    y: currentY,
    align: align,
    font: titleFont,
    color: state.colorTitle,
    glow: state.glowTitle,
    glowColor: state.colorTitleGlow,
    letterSpacing: state.spacingTitle,
    maxWidth: maxWidth
  });
  currentY += ((titleMetrics.lines.length - 1) * (maxTitleSize * 1.10 + lineGapExtra * 0.3)) + Math.round(gap * 0.5) + Math.round(subSize * 0.75);

  // 4. Subtítulo
  const subFont = `${state.styleSubtitle || 'italic 500'} ${subSize}px ${state.fontSubtitle || "'Cormorant Garamond', serif"}`;
  const subMetrics = measureWrappedText(ctx, state.subtitle, subSize, maxWidth, state.fontSubtitle || "'Cormorant Garamond', serif");

  blocks.push({
    type: 'subtitle',
    text: state.subtitle,
    lines: subMetrics.lines,
    lineHeight: subSize * 1.25 + lineGapExtra * 0.2,
    x: getX(),
    y: currentY,
    align: align,
    font: subFont,
    color: state.colorSubtitle,
    maxWidth: maxWidth
  });
  currentY += ((subMetrics.lines.length - 1) * (subSize * 1.25 + lineGapExtra * 0.2)) + Math.round(gap * 0.8);

  // 5. Divisor Celestial
  blocks.push({
    type: 'divider',
    x: centerX,
    y: currentY,
    width: Math.min(80, maxWidth * 0.3),
    color: state.colorDividers
  });
  currentY += Math.round(gap * 0.8);

  // 6. Descrição
  if (state.description) {
    const descFont = `300 ${descSize}px 'Montserrat', sans-serif`;
    const descMetrics = measureWrappedText(ctx, state.description, descSize, maxWidth, "'Montserrat', sans-serif");
    currentY += Math.round(descSize * 0.85);

    blocks.push({
      type: 'description',
      text: state.description,
      lines: descMetrics.lines,
      lineHeight: descSize * (state.lineHeightDesc || 1.6) + lineGapExtra * 0.15,
      x: getX(),
      y: currentY,
      align: align,
      font: descFont,
      color: state.colorDesc,
      maxWidth: maxWidth
    });
    currentY += ((descMetrics.lines.length - 1) * (descSize * (state.lineHeightDesc || 1.6) + lineGapExtra * 0.15)) + gap;
  }

  // 7. Highlight / Afirmação Sagrada
  if (state.showHighlightBox && state.highlightText) {
    blocks.push({
      type: 'highlight',
      text: state.highlightText,
      x: leftX,
      y: currentY,
      width: maxWidth,
      align: align,
      color: state.colorHighlight,
      colorBorder: state.colorHighlightBorder,
      showBox: state.showHighlightBox
    });
    currentY += 46 + gap;
  }

  // 8. CTA / Assinatura (ancorado com safe area)
  if (state.ctaText) {
    const ctaY = Math.max(currentY + gap, zone.y + zone.h - 25);
    blocks.push({
      type: 'cta',
      text: state.ctaText,
      x: getX(),
      y: ctaY,
      align: align,
      font: `600 ${Math.round(13 * scale)}px 'Cinzel', serif`,
      color: state.colorCta,
      letterSpacing: 1.5,
      maxWidth: maxWidth
    });
  }

  // Text Fit Mode: se o conteúdo estourar a altura da zona segura, reduz recursivamente até 3 vezes
  if (currentY > zone.y + zone.h - 10 && iteration < 3) {
    return calculateTextBlocks(ctx, state, zone, canvasW, canvasH, iteration + 1);
  }

  return blocks;
}

function renderGradientOverlay(ctx, zones, config, state, canvasW, canvasH) {
  if (!config.gradientOverlay || !zones.img) return;

  ctx.save();
  if (config.imgAnchor === 'top') {
    // Bottom Layout: degradê subindo da base da imagem para transição suave com o texto
    const overlay = ctx.createLinearGradient(0, zones.img.h - 160, 0, zones.img.h + 80);
    overlay.addColorStop(0, 'rgba(5, 12, 7, 0)');
    overlay.addColorStop(0.5, hexToRgba(state.gradientPrimary || '#00381c', 0.85 * (state.gradientIntensity || 0.88)));
    overlay.addColorStop(1, hexToRgba(state.gradientDarkness || '#050c07', state.gradientIntensity || 0.88));
    ctx.fillStyle = overlay;
    ctx.fillRect(0, zones.img.h - 160, canvasW, 240);
  } else if (config.imgAnchor === 'bottom') {
    // Top Layout: degradê descendo do topo
    const overlay = ctx.createLinearGradient(0, zones.img.y - 80, 0, zones.img.y + 160);
    overlay.addColorStop(0, hexToRgba(state.gradientDarkness || '#050c07', state.gradientIntensity || 0.88));
    overlay.addColorStop(0.5, hexToRgba(state.gradientPrimary || '#00381c', 0.85 * (state.gradientIntensity || 0.88)));
    overlay.addColorStop(1, 'rgba(5, 12, 7, 0)');
    ctx.fillStyle = overlay;
    ctx.fillRect(0, zones.img.y - 80, canvasW, 240);
  } else if (config.type === 'overlay') {
    // Center Layout: vinheta radial envolvente
    const radial = ctx.createRadialGradient(
      canvasW / 2, canvasH / 2, canvasW * 0.22,
      canvasW / 2, canvasH / 2, canvasW * 0.78
    );
    radial.addColorStop(0, 'rgba(5, 12, 7, 0.2)');
    radial.addColorStop(0.6, hexToRgba(state.gradientDarkness || '#050c07', 0.65 * (state.gradientIntensity || 0.88)));
    radial.addColorStop(1, hexToRgba(state.gradientDarkness || '#050c07', 0.92 * (state.gradientIntensity || 0.88)));
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, canvasW, canvasH);
  }
  ctx.restore();
}


  // 2. State & History
  // Gerenciador de Histórico de Estados (Undo / Redo) - Pedaço do Céu Studio v2.0
class HistoryManager {
  constructor(maxSnapshots = 50) {
    this.maxSnapshots = maxSnapshots;
    this.past = [];
    this.future = [];
  }

  push(state) {
    // Clonagem profunda segura com structuredClone
    const snapshot = structuredClone(state);
    this.past.push(snapshot);
    if (this.past.length > this.maxSnapshots) {
      this.past.shift();
    }
    this.future = []; // Limpa o futuro ao realizar nova ação
  }

  canUndo() {
    return this.past.length > 1;
  }

  canRedo() {
    return this.future.length > 0;
  }

  undo(currentState) {
    if (!this.canUndo()) return null;
    const current = structuredClone(currentState);
    this.future.push(current);
    this.past.pop(); // Remove o estado atual
    const previous = this.past[this.past.length - 1];
    return structuredClone(previous);
  }

  redo() {
    if (!this.canRedo()) return null;
    const next = this.future.pop();
    this.past.push(structuredClone(next));
    return structuredClone(next);
  }

  clear() {
    this.past = [];
    this.future = [];
  }
}

  // Persistência Automática em LocalStorage - Pedaço do Céu Studio v2.0
class Persistence {
  static STORAGE_KEY = 'pedaco-do-ceu-studio-state-v2';

  static save(state) {
    try {
      // Clona e remove referências a nós DOM/Imagens não-serializáveis antes de salvar
      const serializableState = { ...state };
      delete serializableState.imgObj;
      delete serializableState.bgImageObj;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(serializableState));
    } catch (e) {
      console.warn('Falha ao salvar no localStorage (limite excedido ou modo anônimo):', e);
    }
  }

  static load() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn('Falha ao carregar estado do localStorage:', e);
      return null;
    }
  }

  static clear() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (e) {
      console.warn('Falha ao limpar localStorage:', e);
    }
  }
}

  // Store Reativo com Proxy, Undo/Redo e Persistência - Pedaço do Céu Studio v2.0

class Store {
  constructor(initialState) {
    this._listeners = new Set();
    this._history = new HistoryManager(50);
    this._saveTimeout = null;
    this._isRestoring = false;

    // Inicializa o estado com Proxy para interceptar mutações
    this.state = new Proxy({ ...initialState }, {
      set: (target, prop, value) => {
        const oldValue = target[prop];
        if (oldValue !== value) {
          target[prop] = value;
          this._notify(prop, value, oldValue);
          
          if (!this._isRestoring && !prop.startsWith('_') && prop !== 'imgObj' && prop !== 'bgImageObj') {
            this._debouncedHistoryPush();
            this._debouncedSave();
          }
        }
        return true;
      }
    });

    // Salva o snapshot inicial
    this._history.push(this.getSerializableState());
  }

  getSerializableState() {
    const s = { ...this.state };
    delete s.imgObj;
    delete s.bgImageObj;
    return s;
  }

  subscribe(listener) {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  _notify(prop, value, oldValue) {
    for (const listener of this._listeners) {
      try {
        listener(prop, value, oldValue, this.state);
      } catch (err) {
        console.error('Erro em listener do Store:', err);
      }
    }
  }

  _debouncedHistoryPush() {
    clearTimeout(this._historyTimeout);
    this._historyTimeout = setTimeout(() => {
      this._history.push(this.getSerializableState());
      this._updateUndoRedoUI();
    }, 250);
  }

  _debouncedSave() {
    clearTimeout(this._saveTimeout);
    this._saveTimeout = setTimeout(() => {
      this.saveNow();
    }, 300);
  }

  saveNow() {
    Persistence.save(this.state);
  }

  undo() {
    if (!this._history.canUndo()) return false;
    const previous = this._history.undo(this.getSerializableState());
    if (previous) {
      this._applyState(previous);
      return true;
    }
    return false;
  }

  redo() {
    if (!this._history.canRedo()) return false;
    const next = this._history.redo();
    if (next) {
      this._applyState(next);
      return true;
    }
    return false;
  }

  canUndo() {
    return this._history.canUndo();
  }

  canRedo() {
    return this._history.canRedo();
  }

  _applyState(newState) {
    this._isRestoring = true;
    Object.keys(newState).forEach(key => {
      this.state[key] = newState[key];
    });
    this._isRestoring = false;
    this._notify('*', this.state, null);
    this._updateUndoRedoUI();
  }

  _updateUndoRedoUI() {
    const btnUndo = document.getElementById('btnUndo');
    const btnRedo = document.getElementById('btnRedo');
    if (btnUndo) btnUndo.disabled = !this.canUndo();
    if (btnRedo) btnRedo.disabled = !this.canRedo();
  }
}


  // 3. High-DPI Canvas & Layers
  // Gerenciador de Canvas High-DPI para Renderização Ultra Nítida - Pedaço do Céu Studio v2.0
class HighDPICanvas {
  constructor(canvasElement, targetWidth = 1080, targetHeight = 1080) {
    this.canvas = canvasElement;
    this.targetWidth = targetWidth;
    this.targetHeight = targetHeight;
    this.dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 3) : 1;
    this.ctx = null;
    this.resize(targetWidth, targetHeight);
  }

  resize(width, height) {
    this.targetWidth = width;
    this.targetHeight = height;
    this.dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 3) : 1;

    // Resolução física em pixels do buffer interno
    this.canvas.width = Math.round(this.targetWidth * this.dpr);
    this.canvas.height = Math.round(this.targetHeight * this.dpr);

    // Dimensões CSS no DOM para exibição proporcional
    this.canvas.style.aspectRatio = `${this.targetWidth} / ${this.targetHeight}`;

    this.ctx = this.canvas.getContext('2d', {
      alpha: false,
      desynchronized: true
    });

    // Escala o contexto para trabalhar com coordenadas virtuais exatas (1080x1080)
    this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset
    this.ctx.scale(this.dpr, this.dpr);
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
  }

  getContext() {
    return this.ctx;
  }

  getExportDataURL(format = 'image/png', quality = 1.0) {
    try {
      if (this.dpr === 1) {
        return this.canvas.toDataURL(format, quality);
      }
      
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = this.targetWidth;
      exportCanvas.height = this.targetHeight;
      const expCtx = exportCanvas.getContext('2d', { alpha: false });
      expCtx.imageSmoothingEnabled = true;
      expCtx.imageSmoothingQuality = 'high';
      expCtx.drawImage(this.canvas, 0, 0, this.targetWidth, this.targetHeight);
      return exportCanvas.toDataURL(format, quality);
    } catch (err) {
      console.warn('Exportação toDataURL protegida contra canvas tainted no protocolo file://:', err.message);
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    }
  }

  async getExportBlob(format = 'image/png', quality = 1.0) {
    return new Promise(resolve => {
      try {
        if (this.dpr === 1) {
          this.canvas.toBlob((blob) => {
            resolve(blob || new Blob(['dummy'], { type: 'image/png' }));
          }, format, quality);
        } else {
          const exportCanvas = document.createElement('canvas');
          exportCanvas.width = this.targetWidth;
          exportCanvas.height = this.targetHeight;
          const expCtx = exportCanvas.getContext('2d', { alpha: false });
          expCtx.imageSmoothingEnabled = true;
          expCtx.imageSmoothingQuality = 'high';
          expCtx.drawImage(this.canvas, 0, 0, this.targetWidth, this.targetHeight);
          exportCanvas.toBlob((blob) => {
            resolve(blob || new Blob(['dummy'], { type: 'image/png' }));
          }, format, quality);
        }
      } catch (err) {
        console.warn('Exportação toBlob protegida contra canvas tainted no protocolo file://:', err.message);
        resolve(new Blob(['fallback'], { type: 'image/png' }));
      }
    });
  }
}

  // Classe Base para Camadas de Renderização - Pedaço do Céu Studio v2.0
class BaseLayer {
  constructor(name, zIndex = 0) {
    this.name = name;
    this.zIndex = zIndex;
    this.visible = true;
    this.dirty = true;
  }

  markDirty() {
    this.dirty = true;
  }

  render(ctx, width, height, state) {
    if (!this.visible) return;
    this.draw(ctx, width, height, state);
    this.dirty = false;
  }

  draw(ctx, width, height, state) {
    // Implementado nas subclasses
  }
}

  // Camada de Fundo & Degradê Místico em 3 Pontos - Pedaço do Céu Studio v2.0

class GradientLayer extends BaseLayer {
  constructor() {
    super('gradient', 10);
  }

  draw(ctx, width, height, state) {
    // 1. Imagem de Fundo Personalizada (se houver)
    if (state.bgImageObj) {
      ctx.save();
      ctx.drawImage(state.bgImageObj, 0, 0, width, height);
      ctx.fillStyle = hexToRgba(state.gradientDarkness, 1 - (state.bgImageOpacity || 0.6));
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    } else {
      // 2. Degradê Místico contínuo em 3 Pontos
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, state.gradientPrimary);
      grad.addColorStop(0.5, state.gradientSecondary);
      grad.addColorStop(1, state.gradientDarkness);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }
  }
}

  // Camada de Renderização da Foto do Produto - Pedaço do Céu Studio v2.0

class ImageLayer extends BaseLayer {
  constructor() {
    super('image', 20);
  }

  draw(ctx, width, height, state) {
    if (!state.imgObj) return;

    if (state.layout === 'right') {
      this.drawSplit(ctx, width, height, state, false);
      return;
    }
    if (state.layout === 'left') {
      this.drawSplit(ctx, width, height, state, true);
      return;
    }

    const zones = calculateZones(width, height, state.layout);
    if (!zones.img) return;

    switch (state.layout) {
      case 'bottom':
        this.drawBottomStack(ctx, width, height, zones.img, state);
        break;
      case 'top':
        this.drawTopStack(ctx, width, height, zones.img, state);
        break;
      case 'center':
        this.drawCenterOverlay(ctx, width, height, zones.img, state);
        break;
      default:
        this.drawSplit(ctx, width, height, state, false);
    }
  }

  drawSplit(ctx, W, H, state, isLeft) {
    const splitX = Math.round(W * 0.60);

    if (state.fitMode === 'portal') {
      const frameX = isLeft ? W - splitX + 10 : 35;
      const frameY = 40;
      const frameW = splitX - 45; // slightly thinner to account for padding
      const frameH = H - 80;

      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
      ctx.shadowBlur = 25;
      ctx.shadowOffsetY = 8;
      
      ctx.fillStyle = '#020904';
      this.roundRect(ctx, frameX, frameY, frameW, frameH, 18, true, false);
      ctx.shadowColor = 'transparent';

      ctx.save();
      this.roundRect(ctx, frameX, frameY, frameW, frameH, 18, false, false);
      ctx.clip();
      this.drawImageCover(ctx, state.imgObj, frameX, frameY, frameW, frameH, state);
      ctx.restore();

      // Borda dupla em ouro líquido
      ctx.strokeStyle = state.colorCorners;
      ctx.lineWidth = 2.5;
      this.roundRect(ctx, frameX, frameY, frameW, frameH, 18, false, true);
      
      ctx.strokeStyle = hexToRgba(state.colorCorners, 0.4);
      ctx.lineWidth = 1;
      this.roundRect(ctx, frameX + 6, frameY + 6, frameW - 12, frameH - 12, 14, false, true);
      ctx.restore();

    } else if (state.fitMode === 'fusion') {
      ctx.save();
      ctx.beginPath();
      if (isLeft) {
        ctx.rect(W - splitX - 80, 0, splitX + 80, H);
      } else {
        ctx.rect(0, 0, splitX + 80, H);
      }
      ctx.clip();
      
      if (isLeft) {
        this.drawImageCover(ctx, state.imgObj, W - splitX - 80, 0, splitX + 80, H, state);
      } else {
        this.drawImageCover(ctx, state.imgObj, 0, 0, splitX + 80, H, state);
      }
      ctx.restore();

      let fadeGrad;
      if (isLeft) {
        fadeGrad = ctx.createLinearGradient(W - splitX + 160, 0, W - splitX - 80, 0);
      } else {
        fadeGrad = ctx.createLinearGradient(splitX - 160, 0, splitX + 80, 0);
      }
      fadeGrad.addColorStop(0, 'rgba(0, 31, 15, 0)');
      fadeGrad.addColorStop(0.4, hexToRgba(state.gradientPrimary, 0.85 * (state.gradientIntensity || 0.88)));
      fadeGrad.addColorStop(0.8, hexToRgba(state.gradientSecondary, 0.96 * (state.gradientIntensity || 0.88)));
      fadeGrad.addColorStop(1, hexToRgba(state.gradientDarkness, state.gradientIntensity || 0.88));
      ctx.fillStyle = fadeGrad;
      
      if (isLeft) {
        ctx.fillRect(0, 0, W - splitX + 160, H);
      } else {
        ctx.fillRect(splitX - 160, 0, W - (splitX - 160), H);
      }

    } else {
      this.drawImageCover(ctx, state.imgObj, 0, 0, W, H, state);
      const ov = ctx.createLinearGradient(isLeft ? W : 0, 0, isLeft ? 0 : W, 0);
      ov.addColorStop(0, 'rgba(0, 20, 10, 0.25)');
      ov.addColorStop(0.45, hexToRgba(state.gradientPrimary, 0.85 * (state.gradientIntensity || 0.88)));
      ov.addColorStop(1, hexToRgba(state.gradientDarkness, 0.96 * (state.gradientIntensity || 0.88)));
      ctx.fillStyle = ov;
      ctx.fillRect(0, 0, W, H);
    }
  }

  drawBottomStack(ctx, W, H, zone, state) {
    if (state.fitMode === 'portal') {
      const portalW = W - 70;
      const portalH = zone.h - 50;
      const portalX = 35;
      const portalY = 35;

      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
      ctx.shadowBlur = 22;
      ctx.shadowOffsetY = 6;
      ctx.fillStyle = '#020904';
      this.roundRect(ctx, portalX, portalY, portalW, portalH, 18, true, false);
      ctx.shadowColor = 'transparent';

      ctx.save();
      this.roundRect(ctx, portalX, portalY, portalW, portalH, 18, false, false);
      ctx.clip();
      this.drawImageCover(ctx, state.imgObj, portalX, portalY, portalW, portalH, state);
      ctx.restore();

      ctx.strokeStyle = state.colorCorners;
      ctx.lineWidth = 2.2;
      this.roundRect(ctx, portalX, portalY, portalW, portalH, 18, false, true);
      ctx.restore();
    } else {
      ctx.save();
      ctx.beginPath();
      ctx.rect(zone.x, zone.y, zone.w, zone.h);
      ctx.clip();
      this.drawImageCover(ctx, state.imgObj, zone.x, zone.y, zone.w, zone.h, state);
      ctx.restore();
    }
  }

  drawTopStack(ctx, W, H, zone, state) {
    if (state.fitMode === 'portal') {
      const portalW = W - 70;
      const portalH = zone.h - 50;
      const portalX = 35;
      const portalY = zone.y + 15;

      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
      ctx.shadowBlur = 22;
      ctx.fillStyle = '#020904';
      this.roundRect(ctx, portalX, portalY, portalW, portalH, 18, true, false);
      ctx.shadowColor = 'transparent';

      ctx.save();
      this.roundRect(ctx, portalX, portalY, portalW, portalH, 18, false, false);
      ctx.clip();
      this.drawImageCover(ctx, state.imgObj, portalX, portalY, portalW, portalH, state);
      ctx.restore();

      ctx.strokeStyle = state.colorCorners;
      ctx.lineWidth = 2.2;
      this.roundRect(ctx, portalX, portalY, portalW, portalH, 18, false, true);
      ctx.restore();
    } else {
      ctx.save();
      ctx.beginPath();
      ctx.rect(zone.x, zone.y, zone.w, zone.h);
      ctx.clip();
      this.drawImageCover(ctx, state.imgObj, zone.x, zone.y, zone.w, zone.h, state);
      ctx.restore();
    }
  }

  drawCenterOverlay(ctx, W, H, zone, state) {
    this.drawImageCover(ctx, state.imgObj, 0, 0, W, H, state);
  }

  drawImageCover(ctx, img, x, y, w, h, state) {
    const imgRatio = img.width / img.height;
    const targetRatio = w / h;
    let renderW, renderH, offsetX, offsetY;

    const zoom = state.imgZoom || 1.0;
    const panX = state.imgPanX || 0;
    const panY = state.imgPanY || 0;

    if (imgRatio > targetRatio) {
      renderH = h * zoom;
      renderW = h * imgRatio * zoom;
    } else {
      renderW = w * zoom;
      renderH = (w / imgRatio) * zoom;
    }
    offsetX = x + (w - renderW) / 2 + panX;
    offsetY = y + (h - renderH) / 2 + panY;

    ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
  }

  roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  }
}

  // Camada de Geometria Sagrada Vetorial - Pedaço do Céu Studio v2.0

class PatternLayer extends BaseLayer {
  constructor() {
    super('pattern', 30);
    this.pathCache = new Map();
  }

  getPath(svgString) {
    if (!this.pathCache.has(svgString)) {
      this.pathCache.set(svgString, new Path2D(svgString));
    }
    return this.pathCache.get(svgString);
  }

  draw(ctx, width, height, state) {
    if (!state.sacredPattern || state.sacredPattern === 'none' || !window.PEDACO_DO_CEU_SVGS) return;
    const svgString = window.PEDACO_DO_CEU_SVGS[state.sacredPattern];
    if (!svgString) return;

    let cx = width / 2;
    let cy = height / 2;
    let size = Math.min(width, height) * 0.75;

    if (state.layout === 'right') {
      const splitX = Math.round(width * 0.60);
      cx = width - (width - splitX) / 2;
      cy = height / 2;
      size = (width - splitX) * 0.95;
    } else if (state.layout === 'bottom') {
      const cardH = state.format.startsWith('9:16') ? Math.round(height * 0.40) : Math.round(height * 0.44);
      cx = width / 2;
      cy = height - cardH / 2;
      size = Math.min(width * 0.7, cardH * 0.8);
    } else if (state.layout === 'top') {
      const barH = Math.round(height * 0.38);
      cx = width / 2;
      cy = barH / 2;
      size = barH * 0.9;
    } else if (state.layout === 'center') {
      const cardW = Math.min(width * 0.86, 740);
      cx = width / 2;
      cy = height / 2;
      size = cardW * 0.8;
    }

    ctx.save();
    ctx.globalAlpha = state.patternOpacity !== undefined ? state.patternOpacity : 0.35;
    const p = this.getPath(svgString);
    ctx.translate(cx, cy);
    const scale = size / 200;
    ctx.scale(scale, scale);
    ctx.translate(-100, -100);

    ctx.strokeStyle = state.colorDividers || '#d4af37';
    ctx.lineWidth = 1.0;
    ctx.stroke(p);

    ctx.restore();
  }
}

  // Camada de Gradient Overlay Intermediário - Pedaço do Céu Studio v2.0

class OverlayLayer extends BaseLayer {
  constructor() {
    super('overlay', 35);
  }

  draw(ctx, width, height, state) {
    const config = LAYOUT_CONFIG[state.layout];
    if (!config || !config.gradientOverlay) return;

    const zones = calculateZones(width, height, state.layout);
    renderGradientOverlay(ctx, zones, config, state, width, height);
  }
}

  // Camada de Tipografia & Textos Sagrados - Pedaço do Céu Studio v2.0

class TextLayer extends BaseLayer {
  constructor() {
    super('text', 40);
    this.boundingBoxes = []; // Para hit-testing WYSIWYG
  }

  draw(ctx, width, height, state) {
    this.boundingBoxes = [];

    // Layout Lateral (Split: Right ou Left)
    if (state.layout === 'right' || state.layout === 'left') {
      this.drawSplitLayout(ctx, width, height, state, state.layout === 'left');
      return;
    }

    // Layouts Calibrados (Bottom, Top, Center)
    const zones = calculateZones(width, height, state.layout);
    if (!zones.text) return;

    if (state.layout === 'center') {
      this.drawCenterCardBackground(ctx, zones.text, state);
    } else if (state.layout === 'bottom') {
      this.drawBottomCardBackground(ctx, zones.text, state);
    } else if (state.layout === 'top') {
      this.drawTopCardBackground(ctx, zones.text, state);
    }

    const safeZone = applySafeArea(zones.text, state.format);
    const blocks = calculateTextBlocks(ctx, state, safeZone, width, height);

    this.renderCalibratedBlocks(ctx, blocks, state);
  }

  drawSplitLayout(ctx, W, H, state, isLeft) {
    const imgW = Math.round(W * 0.60);
    const textW = W - imgW;
    const colX = isLeft ? (state.paddingSide || 20) : imgW + (state.paddingSide || 20);
    const innerW = textW - (state.paddingSide || 20) * 2;
    const gap = state.blockGap || 22;
    const lineGapExtra = state.globalLineGap || 12;
    let curY = state.paddingTop || 100;

    // Selo Superior
    if (state.showBadge && state.badgeText) {
      curY = this.drawBadgePill(ctx, colX + innerW / 2, curY, state.badgeText, true, state);
    }

    // Tag / Categoria
    if (state.categoryTag) {
      ctx.textAlign = state.align || 'center';
      ctx.fillStyle = state.colorTag || '#d4af37';
      ctx.font = `700 15px "Cinzel", serif`;
      ctx.letterSpacing = '1.5px';
      const tagX = this.getAlignX(colX, innerW, state.align);
      ctx.fillText((state.categoryTag || '').toUpperCase(), tagX, curY);
      ctx.letterSpacing = '0px';
      curY += Math.round(gap * 0.8) + Math.round((state.sizeTitle || 46) * 0.85);
    } else {
      curY += Math.round((state.sizeTitle || 46) * 0.85);
    }

    // Título Principal com Glow
    ctx.fillStyle = state.colorTitle || '#f8f9fa';
    ctx.font = `${state.weightTitle || 700} ${state.sizeTitle || 46}px ${state.fontTitle || "'Cinzel Decorative', serif"}`;
    ctx.letterSpacing = `${state.spacingTitle || 1}px`;
    if (state.glowTitle > 0) {
      ctx.shadowColor = state.colorTitleGlow || '#d4af37';
      ctx.shadowBlur = state.glowTitle;
    }
    const tagX = this.getAlignX(colX, innerW, state.align);
    const titleStartY = curY;
    curY = this.drawWrappedText(ctx, state.title, tagX, curY, innerW, (state.sizeTitle || 46) * 1.10 + lineGapExtra * 0.3);
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.letterSpacing = '0px';
    
    this.boundingBoxes.push({ id: 'title', x: colX, y: titleStartY - 10, w: innerW, h: curY - titleStartY + 10 });

    curY += Math.round(gap * 0.5) + Math.round((state.sizeSubtitle || 20) * 0.7);

    // Subtítulo
    ctx.fillStyle = state.colorSubtitle || '#eadcb9';
    ctx.font = `${state.styleSubtitle || 'italic 500'} ${state.sizeSubtitle || 20}px ${state.fontSubtitle || "'Cormorant Garamond', serif"}`;
    curY = this.drawWrappedText(ctx, state.subtitle, tagX, curY, innerW, (state.sizeSubtitle || 20) * 1.25 + lineGapExtra * 0.2);
    curY += Math.round(gap * 0.8);

    // Divisor Celestial
    this.drawCelestialDivider(ctx, colX + innerW / 2, curY, 60, state.colorDividers || '#d4af37');
    curY += Math.round(gap * 0.8) + Math.round((state.sizeDesc || 16) * 0.85);

    // Descrição Poética
    ctx.fillStyle = state.colorDesc || '#f8f9fa';
    ctx.font = `300 ${state.sizeDesc || 16}px ${state.fontDesc || '"Montserrat", sans-serif'}`;
    curY = this.drawWrappedText(ctx, state.description, tagX, curY, innerW, (state.sizeDesc || 16) * (state.lineHeightDesc || 1.6) + lineGapExtra * 0.15);
    curY += gap;

    // Slot de Destaque Sagrado (Auto-expansível)
    if (state.showHighlightBox && state.highlightText) {
      curY = this.drawHighlightBox(ctx, colX, curY, innerW, state.highlightText, state);
    }

    // CTA
    const ctaY = Math.max(curY + gap, H - 70);
    ctx.fillStyle = state.colorCta || '#d4af37';
    ctx.font = `600 14px "Cinzel", serif`;
    ctx.letterSpacing = '1px';
    ctx.fillText(state.ctaText || 'Visite nossa loja • Pedaço do Céu', tagX, ctaY);
    ctx.letterSpacing = '0px';
  }

  drawBottomCardBackground(ctx, zone, state) {
    const opacity = state.boxOpacity !== undefined ? state.boxOpacity : 0.95;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 25;
    const cardGrad = ctx.createLinearGradient(zone.x, zone.y, zone.x, zone.y + zone.h);
    cardGrad.addColorStop(0, hexToRgba(state.gradientPrimary || '#00381c', opacity));
    cardGrad.addColorStop(1, hexToRgba(state.gradientDarkness || '#050c07', Math.min(opacity + 0.03, 1)));
    ctx.fillStyle = cardGrad;
    this.roundRect(ctx, zone.x + 28, zone.y + 10, zone.w - 56, zone.h - 38, 16, true, false);
    ctx.shadowColor = 'transparent';

    ctx.strokeStyle = hexToRgba(state.colorCorners || '#d4af37', 0.5);
    ctx.lineWidth = 1.2;
    this.roundRect(ctx, zone.x + 28, zone.y + 10, zone.w - 56, zone.h - 38, 16, false, true);
    ctx.restore();
  }

  drawTopCardBackground(ctx, zone, state) {
    const opacity = state.boxOpacity !== undefined ? state.boxOpacity : 0.95;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 25;
    const cardGrad = ctx.createLinearGradient(zone.x, zone.y, zone.x, zone.y + zone.h);
    cardGrad.addColorStop(0, hexToRgba(state.gradientDarkness || '#050c07', Math.min(opacity + 0.03, 1)));
    cardGrad.addColorStop(1, hexToRgba(state.gradientPrimary || '#00381c', opacity));
    ctx.fillStyle = cardGrad;
    this.roundRect(ctx, zone.x + 28, zone.y + 28, zone.w - 56, zone.h - 38, 16, true, false);
    ctx.shadowColor = 'transparent';

    ctx.strokeStyle = hexToRgba(state.colorCorners || '#d4af37', 0.5);
    ctx.lineWidth = 1.2;
    this.roundRect(ctx, zone.x + 28, zone.y + 28, zone.w - 56, zone.h - 38, 16, false, true);
    ctx.restore();
  }

  drawCenterCardBackground(ctx, zone, state) {
    const opacity = state.boxOpacity !== undefined ? state.boxOpacity : 0.95;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 35;
    const grad = ctx.createLinearGradient(zone.x, zone.y, zone.x, zone.y + zone.h);
    grad.addColorStop(0, hexToRgba(state.gradientPrimary || '#00381c', opacity));
    grad.addColorStop(0.5, hexToRgba(state.gradientSecondary || '#008542', Math.min(opacity + 0.01, 1)));
    grad.addColorStop(1, hexToRgba(state.gradientDarkness || '#050c07', Math.min(opacity + 0.03, 1)));
    ctx.fillStyle = grad;
    this.roundRect(ctx, zone.x, zone.y, zone.w, zone.h, 20, true, false);
    ctx.shadowColor = 'transparent';

    ctx.strokeStyle = hexToRgba(state.colorCorners || '#d4af37', 0.6);
    ctx.lineWidth = 1.5;
    this.roundRect(ctx, zone.x, zone.y, zone.w, zone.h, 20, false, true);

    ctx.strokeStyle = hexToRgba(state.colorCorners || '#d4af37', 0.25);
    ctx.lineWidth = 0.8;
    this.roundRect(ctx, zone.x + 6, zone.y + 6, zone.w - 12, zone.h - 12, 16, false, true);
    ctx.restore();
  }

  renderCalibratedBlocks(ctx, blocks, state) {
    for (const b of blocks) {
      if (b.type === 'badge') {
        this.drawBadgePill(ctx, b.x, b.y, b.text, true, state);
      } else if (b.type === 'tag') {
        ctx.save();
        ctx.textAlign = b.align;
        ctx.fillStyle = b.color;
        ctx.font = b.font;
        ctx.letterSpacing = `${b.letterSpacing}px`;
        ctx.fillText(b.text, b.x, b.y);
        ctx.restore();
      } else if (b.type === 'title') {
        ctx.save();
        ctx.textAlign = b.align;
        ctx.fillStyle = b.color;
        ctx.font = b.font;
        ctx.letterSpacing = `${b.letterSpacing || 1}px`;
        if (b.glow > 0) {
          ctx.shadowColor = b.glowColor;
          ctx.shadowBlur = b.glow;
        }
        let tY = b.y;
        for (const line of b.lines) {
          ctx.fillText(line, b.x, tY);
          tY += b.lineHeight;
        }
        this.boundingBoxes.push({ id: 'title', x: b.x - (b.align === 'center' ? b.maxWidth / 2 : 0), y: b.y - 10, w: b.maxWidth, h: tY - b.y + 10 });
        ctx.restore();
      } else if (b.type === 'subtitle') {
        ctx.save();
        ctx.textAlign = b.align;
        ctx.fillStyle = b.color;
        ctx.font = b.font;
        let sY = b.y;
        for (const line of b.lines) {
          ctx.fillText(line, b.x, sY);
          sY += b.lineHeight;
        }
        ctx.restore();
      } else if (b.type === 'divider') {
        this.drawCelestialDivider(ctx, b.x, b.y, b.width, b.color);
      } else if (b.type === 'description') {
        ctx.save();
        ctx.textAlign = b.align;
        ctx.fillStyle = b.color;
        ctx.font = b.font;
        let dY = b.y;
        for (const line of b.lines) {
          ctx.fillText(line, b.x, dY);
          dY += b.lineHeight;
        }
        ctx.restore();
      } else if (b.type === 'highlight') {
        this.drawHighlightBox(ctx, b.x, b.y, b.width, b.text, state);
      } else if (b.type === 'cta') {
        ctx.save();
        ctx.textAlign = b.align;
        ctx.fillStyle = b.color;
        ctx.font = b.font;
        ctx.letterSpacing = `${b.letterSpacing}px`;
        ctx.fillText(b.text, b.x, b.y);
        ctx.restore();
      }
    }
  }

  getAlignX(startX, width, align) {
    if (align === 'left') return startX;
    if (align === 'right') return startX + width;
    return startX + width / 2;
  }

  drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
    if (!text) return y;
    const words = text.split(' ');
    let line = '';
    let curY = y;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const testWidth = ctx.measureText(testLine).width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, curY);
        line = words[n] + ' ';
        curY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, curY);
    return curY + lineHeight;
  }

  drawBadgePill(ctx, x, y, text, centered, state) {
    if (!text) return y;
    ctx.save();
    ctx.font = `700 12px "Cinzel", serif`;
    const textWidth = ctx.measureText(text.toUpperCase()).width;
    const padX = 16;
    const badgeW = textWidth + padX * 2;
    const badgeH = 28;
    const startX = centered ? x - badgeW / 2 : x;

    ctx.fillStyle = hexToRgba(state.gradientPrimary || '#00381c', 0.85);
    this.roundRect(ctx, startX, y, badgeW, badgeH, 14, true, false);

    ctx.strokeStyle = state.colorBadge || '#f5d77f';
    ctx.lineWidth = 1.2;
    this.roundRect(ctx, startX, y, badgeW, badgeH, 14, false, true);

    ctx.fillStyle = state.colorBadge || '#f5d77f';
    ctx.letterSpacing = '1px';
    ctx.textAlign = 'center';
    ctx.fillText(text.toUpperCase(), startX + badgeW / 2, y + 18);
    ctx.restore();
    return y + badgeH + 16;
  }

  drawHighlightBox(ctx, x, y, width, text, state) {
    if (!text) return y;
    ctx.save();
    ctx.font = `600 14px "Cinzel", serif`;
    ctx.letterSpacing = '0.6px';

    const words = text.split(' ');
    let line = '';
    const lines = [];
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const testWidth = ctx.measureText(testLine).width;
      if (testWidth > width - 28 && n > 0) {
        lines.push(line.trim());
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line.trim());

    const padY = 10;
    const lineH = 18;
    const boxH = lines.length * lineH + padY * 2;

    ctx.fillStyle = hexToRgba(state.gradientPrimary || '#00381c', 0.55);
    this.roundRect(ctx, x, y, width, boxH, 8, true, false);

    ctx.strokeStyle = state.colorHighlightBorder || '#d4af37';
    ctx.lineWidth = 1.3;
    this.roundRect(ctx, x, y, width, boxH, 8, false, true);

    ctx.fillStyle = state.colorHighlight || '#f5d77f';
    ctx.textAlign = state.align || 'center';

    let textY = y + padY + 13;
    const alignX = this.getAlignX(x, width, state.align);
    for (const l of lines) {
      ctx.fillText(l, alignX, textY);
      textY += lineH;
    }
    ctx.restore();
    return y + boxH + 12;
  }

  drawCelestialDivider(ctx, cx, cy, width, color) {
    ctx.save();
    ctx.strokeStyle = hexToRgba(color || '#d4af37', 0.65);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(cx - width / 2, cy);
    ctx.lineTo(cx - 20, cy);
    ctx.moveTo(cx + 20, cy);
    ctx.lineTo(cx + width / 2, cy);
    ctx.stroke();

    ctx.fillStyle = color || '#d4af37';
    ctx.beginPath();
    const r = 5;
    for (let i = 0; i < 4; i++) {
      const a = (i * 90) * (Math.PI / 180);
      const aIn = (i * 90 + 45) * (Math.PI / 180);
      const x = cx + r * Math.cos(a);
      const y = cy + r * Math.sin(a);
      const xIn = cx + (r * 0.3) * Math.cos(aIn);
      const yIn = cy + (r * 0.3) * Math.sin(aIn);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      ctx.lineTo(xIn, yIn);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  }
}

  // Camada de Cantoneiras Barrocas Sagradas - Pedaço do Céu Studio v2.0

class CornersLayer extends BaseLayer {
  constructor() {
    super('corners', 50);
  }

  draw(ctx, width, height, state) {
    if (!state.showBaroqueCorners) return;

    const m = 28;
    const size = 60;
    ctx.save();
    ctx.strokeStyle = state.colorCorners || '#d4af37';
    ctx.lineWidth = 2.2;
    ctx.beginPath();

    // Top-Left
    ctx.moveTo(m, m + size);
    ctx.lineTo(m, m);
    ctx.lineTo(m + size, m);

    // Top-Right
    ctx.moveTo(width - m - size, m);
    ctx.lineTo(width - m, m);
    ctx.lineTo(width - m, m + size);

    // Bottom-Left
    ctx.moveTo(m, height - m - size);
    ctx.lineTo(m, height - m);
    ctx.lineTo(m + size, height - m);

    // Bottom-Right
    ctx.moveTo(width - m - size, height - m);
    ctx.lineTo(width - m, height - m);
    ctx.lineTo(width - m, height - m - size);

    ctx.stroke();
    ctx.restore();
  }
}

  // Renderizador Principal e Orquestrador de Camadas - Pedaço do Céu Studio v2.0

class Renderer {
  constructor(canvasElement, store) {
    this.canvasElement = canvasElement;
    this.store = store;
    this.highDPICanvas = new HighDPICanvas(canvasElement, store.state.width || 1080, store.state.height || 1080);
    
    // Instancia as camadas modulares ordenadas por zIndex
    this.layers = [
      new GradientLayer(),
      new ImageLayer(),
      new PatternLayer(),
      new OverlayLayer(),
      new TextLayer(),
      new CornersLayer()
    ];
    this.layers.sort((a, b) => a.zIndex - b.zIndex);

    this.rafId = null;
    this.snappingGuide = null; // Para guias WYSIWYG
    
    // Inscreve no Store para renderizar quando o estado mudar
    this.store.subscribe((prop) => {
      if (prop === 'width' || prop === 'height' || prop === 'format') {
        this.highDPICanvas.resize(this.store.state.width, this.store.state.height);
      }
      this.markAllDirty();
      this.requestRender();
    });
  }

  markAllDirty() {
    this.layers.forEach(l => l.markDirty());
  }

  requestRender() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(() => this.render());
  }

  render() {
    const ctx = this.highDPICanvas.getContext();
    if (!ctx) return;

    const width = this.store.state.width || 1080;
    const height = this.store.state.height || 1080;
    const state = this.store.state;

    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // Renderiza cada camada na ordem correta
    for (const layer of this.layers) {
      layer.render(ctx, width, height, state);
    }

    // Desenha linhas guia de Safe Area se ativado
    if (state.showSafeAreaGuide) {
      this.drawSafeAreaGuide(ctx, width, height, state);
    }

    // Desenha linhas guia magnéticas (snapping) se houver arrasto ativo
    if (this.snappingGuide) {
      this.drawSnappingGuide(ctx, width, height, this.snappingGuide);
    }

    ctx.restore();
  }

  drawSafeAreaGuide(ctx, W, H, state) {
    const safe = SAFE_AREAS[state.format] || SAFE_AREAS['1:1'];

    ctx.save();
    ctx.strokeStyle = 'rgba(245, 215, 127, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([8, 6]);

    // Linha Top Safe
    ctx.beginPath();
    ctx.moveTo(0, safe.top);
    ctx.lineTo(W, safe.top);
    ctx.stroke();

    // Linha Bottom Safe
    ctx.beginPath();
    ctx.moveTo(0, H - safe.bottom);
    ctx.lineTo(W, H - safe.bottom);
    ctx.stroke();

    // Linhas Laterais
    ctx.beginPath();
    ctx.moveTo(safe.left, 0);
    ctx.lineTo(safe.left, H);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(W - safe.right, 0);
    ctx.lineTo(W - safe.right, H);
    ctx.stroke();

    // Legenda discreta
    ctx.fillStyle = 'rgba(245, 215, 127, 0.7)';
    ctx.font = '500 12px "Montserrat", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Safe Area (${state.format})`, safe.left + 10, safe.top > 40 ? safe.top - 8 : safe.top + 18);

    ctx.restore();
  }

  setSnappingGuide(guide) {
    this.snappingGuide = guide;
    this.requestRender();
  }

  drawSnappingGuide(ctx, W, H, guide) {
    ctx.save();
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 6]);

    if (guide.type === 'vertical') {
      ctx.beginPath();
      ctx.moveTo(guide.x, 0);
      ctx.lineTo(guide.x, H);
      ctx.stroke();
    } else if (guide.type === 'horizontal') {
      ctx.beginPath();
      ctx.moveTo(0, guide.y);
      ctx.lineTo(W, guide.y);
      ctx.stroke();
    }
    ctx.restore();
  }

  getTextLayer() {
    return this.layers.find(l => l.name === 'text');
  }

  exportImage(filename = 'pedaco-do-ceu-post.png') {
    const link = document.createElement('a');
    link.download = filename;
    link.href = this.highDPICanvas.getExportDataURL('image/png', 1.0);
    link.click();
  }
}


  // 4. UI Interactions
  // Guias de Alinhamento Magnético (Snapping) - Pedaço do Céu Studio v2.0
class SnappingManager {
  constructor(threshold = 12) {
    this.threshold = threshold;
  }

  getSnapPoints(width, height) {
    return {
      vertical: [
        { x: width / 2, label: 'center-x' },
        { x: width * 0.333, label: 'third-left' },
        { x: width * 0.667, label: 'third-right' },
        { x: width * 0.618, label: 'golden-ratio-x' }
      ],
      horizontal: [
        { y: height / 2, label: 'center-y' },
        { y: height * 0.333, label: 'third-top' },
        { y: height * 0.667, label: 'third-bottom' }
      ]
    };
  }

  applySnapping(x, y, width, height) {
    const points = this.getSnapPoints(width, height);
    let snappedX = x;
    let snappedY = y;
    let activeGuide = null;

    // Snapping vertical
    for (const p of points.vertical) {
      if (Math.abs(x - p.x) <= this.threshold) {
        snappedX = p.x;
        activeGuide = { type: 'vertical', x: p.x };
        break;
      }
    }

    // Snapping horizontal
    for (const p of points.horizontal) {
      if (Math.abs(y - p.y) <= this.threshold) {
        snappedY = p.y;
        activeGuide = { type: 'horizontal', y: p.y };
        break;
      }
    }

    return { x: snappedX, y: snappedY, guide: activeGuide };
  }
}

  // Interação WYSIWYG Drag-and-Drop no Canvas - Pedaço do Céu Studio v2.0

class CanvasDragDrop {
  constructor(canvasElement, renderer, store) {
    this.canvas = canvasElement;
    this.renderer = renderer;
    this.store = store;
    this.snapper = new SnappingManager(15);

    this.isDragging = false;
    this.dragTarget = null;
    this.startPointer = { x: 0, y: 0 };
    this.initialPaddingTop = 100;
    this.initialPaddingSide = 20;

    this.initEvents();
  }

  initEvents() {
    this.canvas.addEventListener('pointerdown', this.onPointerDown.bind(this));
    window.addEventListener('pointermove', this.onPointerMove.bind(this));
    window.addEventListener('pointerup', this.onPointerUp.bind(this));
    window.addEventListener('pointercancel', this.onPointerUp.bind(this));
  }

  getCanvasCoordinates(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = (this.store.state.width || 1080) / rect.width;
    const scaleY = (this.store.state.height || 1080) / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }

  onPointerDown(e) {
    const coords = this.getCanvasCoordinates(e);
    const textLayer = this.renderer.getTextLayer();
    if (!textLayer) return;

    // Hit-testing nas caixas de texto
    const hit = textLayer.boundingBoxes.find(b => 
      coords.x >= b.x && coords.x <= b.x + b.w &&
      coords.y >= b.y && coords.y <= b.y + b.h
    );

    if (hit) {
      this.isDragging = true;
      this.dragTarget = hit;
      this.startPointer = coords;
      this.initialPaddingTop = this.store.state.paddingTop || 100;
      this.initialPaddingSide = this.store.state.paddingSide || 20;
      this.canvas.classList.add('cursor-grabbing');
    }
  }

  onPointerMove(e) {
    if (!this.isDragging) {
      // Atualiza cursor de hover
      const coords = this.getCanvasCoordinates(e);
      const textLayer = this.renderer.getTextLayer();
      if (textLayer) {
        const hover = textLayer.boundingBoxes.some(b => 
          coords.x >= b.x && coords.x <= b.x + b.w &&
          coords.y >= b.y && coords.y <= b.y + b.h
        );
        this.canvas.style.cursor = hover ? 'grab' : 'default';
      }
      return;
    }

    const coords = this.getCanvasCoordinates(e);
    const deltaY = coords.y - this.startPointer.y;
    const deltaX = coords.x - this.startPointer.x;

    const W = this.store.state.width || 1080;
    const H = this.store.state.height || 1080;

    let newTop = Math.max(40, Math.min(220, this.initialPaddingTop + deltaY));
    let newSide = Math.max(10, Math.min(80, this.initialPaddingSide - deltaX));

    // Aplica snapping magnético
    const snapped = this.snapper.applySnapping(coords.x, newTop, W, H);
    this.renderer.setSnappingGuide(snapped.guide);

    this.store.state.paddingTop = Math.round(snapped.y);
    this.store.state.paddingSide = Math.round(newSide);

    // Sincroniza sliders da UI
    const topSlider = document.getElementById('paddingTopRange');
    const topVal = document.getElementById('paddingTopVal');
    if (topSlider) topSlider.value = this.store.state.paddingTop;
    if (topVal) topVal.textContent = this.store.state.paddingTop + 'px';

    const sideSlider = document.getElementById('paddingSideRange');
    const sideVal = document.getElementById('paddingSideVal');
    if (sideSlider) sideSlider.value = this.store.state.paddingSide;
    if (sideVal) sideVal.textContent = this.store.state.paddingSide + 'px';
  }

  onPointerUp() {
    if (this.isDragging) {
      this.isDragging = false;
      this.dragTarget = null;
      this.renderer.setSnappingGuide(null);
      this.canvas.classList.remove('cursor-grabbing');
    }
  }
}

  // Gerenciador de Atalhos de Teclado - Pedaço do Céu Studio v2.0
class ShortcutManager {
  constructor(store, renderer, onResetCallback) {
    this.store = store;
    this.renderer = renderer;
    this.onReset = onResetCallback;
    this.initEvents();
  }

  initEvents() {
    window.addEventListener('keydown', (e) => {
      // Ignora atalhos se o foco estiver digitando em um input ou textarea
      const target = e.target;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT';

      const isCtrl = e.ctrlKey || e.metaKey;

      // Undo: Ctrl+Z (não em inputs de texto para não conflitar com undo nativo do input)
      if (isCtrl && !e.shiftKey && e.key.toLowerCase() === 'z') {
        if (!isInput) {
          e.preventDefault();
          this.store.undo();
        }
      }

      // Redo: Ctrl+Shift+Z ou Ctrl+Y
      if ((isCtrl && e.shiftKey && e.key.toLowerCase() === 'z') || (isCtrl && e.key.toLowerCase() === 'y')) {
        if (!isInput) {
          e.preventDefault();
          this.store.redo();
        }
      }

      // Exportar PNG: Ctrl+E
      if (isCtrl && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        const cleanTitle = (this.store.state.title || 'post')
          .toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]/g, '-');
        this.renderer.exportImage(`pedaco-do-ceu-${this.store.state.format}-${cleanTitle}.png`);
      }
    });
  }
}

  // Gerenciador de Acessibilidade (A11y) & ARIA - Pedaço do Céu Studio v2.0
class A11yManager {
  static announce(message) {
    let region = document.getElementById('a11yStatus');
    if (!region) {
      region = document.createElement('div');
      region.id = 'a11yStatus';
      region.className = 'a11y-live-region';
      region.setAttribute('aria-live', 'polite');
      region.setAttribute('aria-atomic', 'true');
      document.body.appendChild(region);
    }
    region.textContent = message;
  }

  static initTabs() {
    const tabButtons = document.querySelectorAll('.tabs-nav .tab-btn');
    const tabPanels = document.querySelectorAll('.tabs-container .tab-content');

    tabButtons.forEach((btn, index) => {
      const targetId = btn.getAttribute('data-target');
      btn.setAttribute('role', 'tab');
      btn.setAttribute('id', `tab-btn-${targetId}`);
      btn.setAttribute('aria-controls', targetId);
      btn.setAttribute('aria-selected', btn.classList.contains('active') ? 'true' : 'false');
      btn.setAttribute('tabindex', btn.classList.contains('active') ? '0' : '-1');

      // Navegação por teclado com setas
      btn.addEventListener('keydown', (e) => {
        let newIndex = index;
        if (e.key === 'ArrowRight') {
          newIndex = (index + 1) % tabButtons.length;
        } else if (e.key === 'ArrowLeft') {
          newIndex = (index - 1 + tabButtons.length) % tabButtons.length;
        } else {
          return;
        }
        e.preventDefault();
        tabButtons[newIndex].focus();
        tabButtons[newIndex].click();
      });
    });

    tabPanels.forEach((panel) => {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', `tab-btn-${panel.id}`);
      panel.setAttribute('tabindex', '0');
    });
  }

  static calculateLuminance(r, g, b) {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  static checkContrast(hexColor1, hexColor2) {
    const parse = hex => {
      const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : { r: 0, g: 0, b: 0 };
    };
    const c1 = parse(hexColor1);
    const c2 = parse(hexColor2);
    const l1 = this.calculateLuminance(c1.r, c1.g, c1.b) + 0.05;
    const l2 = this.calculateLuminance(c2.r, c2.g, c2.b) + 0.05;
    return l1 > l2 ? l1 / l2 : l2 / l1;
  }
}


  // 5. App Main
  // Pedaço do Céu — Template Studio Místico & Sagrado v2.0 Enterprise

// Catálogo Completo de Imagens do Acervo Real
const PHOTO_CATALOG = [
  // Categoria: Bem-Estar & Cristais
  {
    id: 'be1',
    category: 'bem-estar',
    categoryLabel: '🌿 Bem-Estar & Cristais',
    src: '../Fotos/Bem Estar/Tratadas/IMG_20260828_160836341.jpg',
    title: 'CRISTAIS & BEM-ESTAR',
    subtitle: 'A Força Primordial das Rochas Sagradas',
    description: 'Purifique a energia do seu espaço com a força vibracional dos quartzos e ametistas. Peças brutas selecionadas para ancorar paz, clareza mental e cura interior.',
    categoryTag: 'CURA & HARMONIA',
    highlightText: '✦ Transmutação Energética & Paz',
    badgeText: 'Energia Pura',
    sacredPattern: 'flowerOfLife',
    gradientPrimary: '#00381c',
    gradientSecondary: '#008542',
    gradientDarkness: '#050c07',
    colorTitle: '#f8f9fa',
    colorSubtitle: '#eadcb9',
    colorDesc: '#f8f9fa',
    colorHighlight: '#f5d77f',
    colorHighlightBorder: '#d4af37',
    colorTag: '#d4af37',
    colorBadge: '#f5d77f',
    colorCta: '#d4af37',
    colorPattern: '#d4af37',
    colorCorners: '#d4af37',
    colorDividers: '#d4af37',
    fontTitle: "'Cinzel Decorative', serif",
    weightTitle: "700",
    sizeTitle: 54,
    spacingTitle: 1,
    glowTitle: 14,
    colorTitleGlow: '#d4af37',
    fontSubtitle: "'Cormorant Garamond', serif",
    styleSubtitle: "italic 500",
    sizeSubtitle: 26,
    sizeDesc: 18,
    lineHeightDesc: 1.6
  },
  {
    id: 'be2',
    category: 'bem-estar',
    categoryLabel: '🌿 Bem-Estar & Cristais',
    src: '../Fotos/Bem Estar/Tratadas/IMG_20260828_163415579.jpg',
    title: 'SABONETES FITOENERGÉTICOS',
    subtitle: 'Alquimia Sagrada das Ervas Medicinais',
    description: 'Banhos rituais que limpam a aura e renovam a vitalidade do corpo físico e sutil. Feito com extratos naturais puros e óleos essenciais de alta vibração.',
    categoryTag: 'RITUAL DIÁRIO',
    highlightText: '✦ Limpeza Áurica & Vitalidade Natural',
    badgeText: 'Ervas Sagradas',
    sacredPattern: 'flowerOfLife',
    gradientPrimary: '#002f18',
    gradientSecondary: '#007038',
    gradientDarkness: '#030d06',
    colorTitle: '#f8f9fa',
    colorSubtitle: '#eadcb9',
    colorDesc: '#f8f9fa',
    colorHighlight: '#f5d77f',
    colorHighlightBorder: '#d4af37',
    colorTag: '#d4af37',
    colorBadge: '#f5d77f',
    colorCta: '#d4af37',
    colorPattern: '#d4af37',
    colorCorners: '#d4af37',
    colorDividers: '#d4af37',
    fontTitle: "'Cinzel Decorative', serif",
    weightTitle: "700",
    sizeTitle: 54,
    spacingTitle: 1,
    glowTitle: 12,
    colorTitleGlow: '#d4af37',
    fontSubtitle: "'Cormorant Garamond', serif",
    styleSubtitle: "italic 500",
    sizeSubtitle: 26,
    sizeDesc: 18,
    lineHeightDesc: 1.6
  },
  {
    id: 'be3',
    category: 'bem-estar',
    categoryLabel: '🌿 Bem-Estar & Cristais',
    src: '../Fotos/Bem Estar/Tratadas/IMG_20260828_160836341.jpg',
    title: 'AROMATERAPIA SAGRADA',
    subtitle: 'Gotas de Luz e Conexão Espiritual',
    description: 'Velas aromáticas e óleos essenciais que elevam o padrão vibratório do seu ambiente. Crie um santuário de serenidade para seus momentos de oração e recolhimento.',
    categoryTag: 'SANTO SANTUÁRIO',
    highlightText: '✦ Frequência Vibracional Elevada',
    badgeText: 'Aromas da Alma',
    sacredPattern: 'sriYantra',
    gradientPrimary: '#1a1005',
    gradientSecondary: '#3d2508',
    gradientDarkness: '#0a0502',
    colorTitle: '#f5d77f',
    colorSubtitle: '#ffe0b2',
    colorDesc: '#fff3e0',
    colorHighlight: '#f5d77f',
    colorHighlightBorder: '#d4af37',
    colorTag: '#d4af37',
    colorBadge: '#f5d77f',
    colorCta: '#d4af37',
    colorPattern: '#f5d77f',
    colorCorners: '#f5d77f',
    colorDividers: '#f5d77f',
    fontTitle: "'Cinzel Decorative', serif",
    weightTitle: "700",
    sizeTitle: 54,
    spacingTitle: 2,
    glowTitle: 16,
    colorTitleGlow: '#f5d77f',
    fontSubtitle: "'Cormorant Garamond', serif",
    styleSubtitle: "italic 500",
    sizeSubtitle: 26,
    sizeDesc: 18,
    lineHeightDesc: 1.6
  },
  // Categoria: Arcanjo Miguel
  {
    id: 'am1',
    category: 'arcanjo',
    categoryLabel: '⚔️ Arcanjo Miguel',
    src: '../Fotos/Arcanjo Miguel/Tratadas/IMG_20260828_145751956_HDR.jpg',
    title: 'SÃO MIGUEL ARCANJO',
    subtitle: 'Príncipe da Luz e Guardião das Almas',
    description: 'Que a Espada Flamejante de São Miguel Arcanjo corte todos os laços energéticos negativos e sele o seu lar em uma abóbada de proteção divina e justiça celeste.',
    categoryTag: 'PROTEÇÃO DIVINA',
    highlightText: '✦ Espada de Luz • Corte de Laços Negativos',
    badgeText: 'Manto Azul',
    sacredPattern: 'metatronCube',
    gradientPrimary: '#001a33',
    gradientSecondary: '#003366',
    gradientDarkness: '#000814',
    colorTitle: '#64b5f6',
    colorSubtitle: '#e3f2fd',
    colorDesc: '#f8f9fa',
    colorHighlight: '#90caf9',
    colorHighlightBorder: '#64b5f6',
    colorTag: '#64b5f6',
    colorBadge: '#90caf9',
    colorCta: '#d4af37',
    colorPattern: '#64b5f6',
    colorCorners: '#f5d77f',
    colorDividers: '#90caf9',
    fontTitle: "'Cinzel Decorative', serif",
    weightTitle: "700",
    sizeTitle: 54,
    spacingTitle: 2,
    glowTitle: 18,
    colorTitleGlow: '#64b5f6',
    fontSubtitle: "'Cinzel', serif",
    styleSubtitle: "normal 600",
    sizeSubtitle: 26,
    sizeDesc: 18,
    lineHeightDesc: 1.6
  },
  {
    id: 'am2',
    category: 'arcanjo',
    categoryLabel: '⚔️ Arcanjo Miguel',
    src: '../Fotos/Arcanjo Miguel/Tratadas/IMG_20260828_145751956_HDR.jpg',
    title: 'DEFENSOR CELESTIAL',
    subtitle: 'Coragem, Fé e Vitória Espiritual',
    description: 'Invoque a presença do Príncipe da Milícia Celeste. Imagem esculpida com riqueza de detalhes para ancorar a energia da coragem e determinação no seu altar sagrado.',
    categoryTag: 'CHAMA AZUL',
    highlightText: '✦ Escudo de Fé Inabalável & Proteção',
    badgeText: 'Presença Divina',
    sacredPattern: 'metatronCube',
    gradientPrimary: '#002b16',
    gradientSecondary: '#006633',
    gradientDarkness: '#020d06',
    colorTitle: '#f8f9fa',
    colorSubtitle: '#90caf9',
    colorDesc: '#f8f9fa',
    colorHighlight: '#f5d77f',
    colorHighlightBorder: '#d4af37',
    colorTag: '#d4af37',
    colorBadge: '#f5d77f',
    colorCta: '#d4af37',
    colorPattern: '#d4af37',
    colorCorners: '#d4af37',
    colorDividers: '#d4af37',
    fontTitle: "'Cinzel Decorative', serif",
    weightTitle: "700",
    sizeTitle: 54,
    spacingTitle: 1,
    glowTitle: 14,
    colorTitleGlow: '#d4af37',
    fontSubtitle: "'Cormorant Garamond', serif",
    styleSubtitle: "italic 600",
    sizeSubtitle: 26,
    sizeDesc: 18,
    lineHeightDesc: 1.6
  },
  {
    id: 'am3',
    category: 'arcanjo',
    categoryLabel: '⚔️ Arcanjo Miguel',
    src: '../Fotos/Arcanjo Miguel/Tratadas/IMG_20260828_152249527_HDR.jpg',
    title: 'QUEBRA DE DEMANDAS',
    subtitle: 'Sob as Asas do Guardião Maior',
    description: 'Nenhuma força contrária prevalece diante do comando de São Miguel Arcanjo. Sinta a presença pacificadora e protetora que envolve seu espírito e sua família.',
    categoryTag: 'PROTEÇÃO MÁXIMA',
    highlightText: '✦ Corte de Amarras & Libertação Espiritual',
    badgeText: 'Escudo Sagrado',
    sacredPattern: 'metatronCube',
    gradientPrimary: '#081a2e',
    gradientSecondary: '#0e2e52',
    gradientDarkness: '#02060a',
    colorTitle: '#64b5f6',
    colorSubtitle: '#f8f9fa',
    colorDesc: '#e0e0e0',
    colorHighlight: '#90caf9',
    colorHighlightBorder: '#64b5f6',
    colorTag: '#d4af37',
    colorBadge: '#64b5f6',
    colorCta: '#d4af37',
    colorPattern: '#64b5f6',
    colorCorners: '#f5d77f',
    colorDividers: '#64b5f6',
    fontTitle: "'Cinzel Decorative', serif",
    weightTitle: "700",
    sizeTitle: 54,
    spacingTitle: 1,
    glowTitle: 16,
    colorTitleGlow: '#64b5f6',
    fontSubtitle: "'Cormorant Garamond', serif",
    styleSubtitle: "italic 500",
    sizeSubtitle: 26,
    sizeDesc: 18,
    lineHeightDesc: 1.6
  },
  // Categoria: Zodíaco
  {
    id: 'zod1',
    category: 'zodiaco',
    categoryLabel: '♈ Linha Zodíaco',
    src: '../Fotos/zodiaco/Tratadas/IMG_20260828_175142446_HDR.jpg',
    title: 'SABEDORIA DOS ASTROS',
    subtitle: 'A Vibração Cósmica do Seu Signo',
    description: 'Cada signo do zodíaco ressoa com elementos e pedras específicas. Alinhe a sua essência com a geometria celeste e fortaleça os seus dons naturais.',
    categoryTag: 'ASTROLOGIA VIVA',
    highlightText: '✦ Ressonância Planetária & Essência Astral',
    badgeText: 'Luz Celestial',
    sacredPattern: 'lunarMandala',
    gradientPrimary: '#1f0d2b',
    gradientSecondary: '#421d5c',
    gradientDarkness: '#08030b',
    colorTitle: '#ce93d8',
    colorSubtitle: '#f3e5f5',
    colorDesc: '#f8f9fa',
    colorHighlight: '#f5d77f',
    colorHighlightBorder: '#ba68c8',
    colorTag: '#ce93d8',
    colorBadge: '#f5d77f',
    colorCta: '#d4af37',
    colorPattern: '#ce93d8',
    colorCorners: '#f5d77f',
    colorDividers: '#ce93d8',
    fontTitle: "'Cinzel Decorative', serif",
    weightTitle: "700",
    sizeTitle: 54,
    spacingTitle: 2,
    glowTitle: 16,
    colorTitleGlow: '#ce93d8',
    fontSubtitle: "'Cormorant Garamond', serif",
    styleSubtitle: "italic 500",
    sizeSubtitle: 26,
    sizeDesc: 18,
    lineHeightDesc: 1.6
  },
  {
    id: 'zod2',
    category: 'zodiaco',
    categoryLabel: '♈ Linha Zodíaco',
    src: '../Fotos/zodiaco/Tratadas/IMG_20260828_175100702.jpg',
    title: 'MAPA ASTRAL & CRISTAIS',
    subtitle: 'Harmonização dos 4 Elementos Sagrados',
    description: 'Fogo, Terra, Ar e Água integrados no seu campo áurico. Cristais consagrados para equilibrar a sua carta natal e abrir caminhos de realização.',
    categoryTag: '4 ELEMENTOS',
    highlightText: '✦ Equilíbrio dos Chakras & Força Planetária',
    badgeText: 'Força Cósmica',
    sacredPattern: 'lunarMandala',
    gradientPrimary: '#14142b',
    gradientSecondary: '#292954',
    gradientDarkness: '#05050d',
    colorTitle: '#9fa8da',
    colorSubtitle: '#e8eaf6',
    colorDesc: '#f8f9fa',
    colorHighlight: '#f5d77f',
    colorHighlightBorder: '#7986cb',
    colorTag: '#9fa8da',
    colorBadge: '#f5d77f',
    colorCta: '#d4af37',
    colorPattern: '#9fa8da',
    colorCorners: '#f5d77f',
    colorDividers: '#9fa8da',
    fontTitle: "'Cinzel Decorative', serif",
    weightTitle: "700",
    sizeTitle: 54,
    spacingTitle: 1,
    glowTitle: 14,
    colorTitleGlow: '#9fa8da',
    fontSubtitle: "'Cormorant Garamond', serif",
    styleSubtitle: "italic 500",
    sizeSubtitle: 26,
    sizeDesc: 18,
    lineHeightDesc: 1.6
  },
  // Categoria: Kailash Aromas
  {
    id: 'kai1',
    category: 'kailash',
    categoryLabel: '🏔️ Kailash Aromas',
    src: '../Fotos/Kailash/Tratadas/IMG_20260828_173627904.jpg',
    title: 'AROMAS DE KAILASH',
    subtitle: 'A Pureza Mística das Altas Montanhas',
    description: 'Incensos artesanais de queima suave e longa duração. Cada aroma conduz a mente para estados meditativos elevados, dissipando cansaço mental e tensões.',
    categoryTag: 'DEFUMAÇÃO PURA',
    highlightText: '✦ Limpeza de Ambientes & Purificação',
    badgeText: 'Ervas Nobres',
    sacredPattern: 'flowerOfLife',
    gradientPrimary: '#1a1f0a',
    gradientSecondary: '#3b4717',
    gradientDarkness: '#060802',
    colorTitle: '#f8f9fa',
    colorSubtitle: '#dcedc8',
    colorDesc: '#f8f9fa',
    colorHighlight: '#f5d77f',
    colorHighlightBorder: '#aed581',
    colorTag: '#d4af37',
    colorBadge: '#f5d77f',
    colorCta: '#d4af37',
    colorPattern: '#d4af37',
    colorCorners: '#d4af37',
    colorDividers: '#d4af37',
    fontTitle: "'Cinzel Decorative', serif",
    weightTitle: "700",
    sizeTitle: 54,
    spacingTitle: 1,
    glowTitle: 12,
    colorTitleGlow: '#d4af37',
    fontSubtitle: "'Cormorant Garamond', serif",
    styleSubtitle: "italic 500",
    sizeSubtitle: 26,
    sizeDesc: 18,
    lineHeightDesc: 1.6
  },
  {
    id: 'kai2',
    category: 'kailash',
    categoryLabel: '🏔️ Kailash Aromas',
    src: '../Fotos/Kailash/Tratadas/IMG_20260828_174047079_HDR.jpg',
    title: 'ESSÊNCIA DOS HIMALAIS',
    subtitle: 'Onde a Fumaça Sobe, o Espírito se Eleva',
    description: 'Notas olfativas nobres extraídas da botânica sagrada para acalmar a mente agitada, facilitar a concentração na meditação e atrair boas energias.',
    categoryTag: 'BEM-ESTAR OLFATIVO',
    highlightText: '✦ Resinas Sagradas & Defumação Serena',
    badgeText: 'Alta Frequência',
    sacredPattern: 'flowerOfLife',
    gradientPrimary: '#002614',
    gradientSecondary: '#00592e',
    gradientDarkness: '#030805',
    colorTitle: '#f8f9fa',
    colorSubtitle: '#eadcb9',
    colorDesc: '#f8f9fa',
    colorHighlight: '#f5d77f',
    colorHighlightBorder: '#d4af37',
    colorTag: '#d4af37',
    colorBadge: '#f5d77f',
    colorCta: '#d4af37',
    colorPattern: '#d4af37',
    colorCorners: '#d4af37',
    colorDividers: '#d4af37',
    fontTitle: "'Cinzel Decorative', serif",
    weightTitle: "700",
    sizeTitle: 54,
    spacingTitle: 1,
    glowTitle: 10,
    colorTitleGlow: '#d4af37',
    fontSubtitle: "'Cormorant Garamond', serif",
    styleSubtitle: "italic 500",
    sizeSubtitle: 26,
    sizeDesc: 18,
    lineHeightDesc: 1.6
  },
  // Categoria: NOA Orixás
  {
    id: 'noa1',
    category: 'noa',
    categoryLabel: '✨ Linha NOA Orixás',
    src: '../Fotos/NOA/Tratadas/IMG_20260828_180047923.jpg',
    title: 'NOA ORIXÁS',
    subtitle: 'Força Vital, Axé e Ancestralidade',
    description: 'A natureza é a morada do sagrado. Conecte-se com as forças dos elementos e a sabedoria ancestral dos Orixás. Peças de respeito e devoção que acolhem a alma.',
    categoryTag: 'ANCESTRALIDADE',
    highlightText: '✦ Força dos Elementos • Axé & Proteção',
    badgeText: 'Axé & Luz',
    sacredPattern: 'none',
    gradientPrimary: '#002914',
    gradientSecondary: '#006b35',
    gradientDarkness: '#030b05',
    colorTitle: '#f8f9fa',
    colorSubtitle: '#eadcb9',
    colorDesc: '#f8f9fa',
    colorHighlight: '#f5d77f',
    colorHighlightBorder: '#d4af37',
    colorTag: '#d4af37',
    colorBadge: '#f5d77f',
    colorCta: '#d4af37',
    colorPattern: '#d4af37',
    colorCorners: '#d4af37',
    colorDividers: '#d4af37',
    fontTitle: "'Cinzel Decorative', serif",
    weightTitle: "700",
    sizeTitle: 54,
    spacingTitle: 2,
    glowTitle: 14,
    colorTitleGlow: '#d4af37',
    fontSubtitle: "'Cormorant Garamond', serif",
    styleSubtitle: "italic 500",
    sizeSubtitle: 26,
    sizeDesc: 18,
    lineHeightDesc: 1.6
  },
  // Categoria: Tibete & Homenagem Sagrada
  {
    id: 'tib_homenagem1',
    category: 'tibete',
    categoryLabel: '🕊️ Prece do Tibete (Lâmpada de Sal)',
    src: '../Fotos/TIbate/Tratadas/IMG_20260828_171759729.jpg',
    title: 'ORAÇÃO PELO TIBETE & NEPAL',
    subtitle: 'Em profunda reverência e união espiritual',
    description: 'Nossos corações e orações se voltam para os povos do Tibete e do Nepal, tocados pela recente tragédia nas montanhas sagradas. Que o poder de Karuna e a luz de Chenrezig abracem cada família, trazendo serenidade e força na reconstrução de seus lares.',
    categoryTag: '🕊️ HOMENAGEM & SOLIDARIEDADE',
    highlightText: '✦ OṂ MAṆI PADME HŪṂ ✦ Alívio, Amparo e Cura',
    badgeText: 'Prece Sagrada',
    ctaText: 'PEDAÇO DO CÉU • SOLIDARIEDADE & FÉ',
    sacredPattern: 'sriYantra',
    gradientPrimary: '#140a03',
    gradientSecondary: '#241407',
    gradientDarkness: '#080401',
    colorTitle: '#ffffff',
    colorSubtitle: '#f5d77f',
    colorDesc: '#ffffff',
    colorHighlight: '#f5d77f',
    colorHighlightBorder: '#d4af37',
    colorTag: '#f5d77f',
    colorBadge: '#f5d77f',
    colorCta: '#d4af37',
    colorPattern: '#d4af37',
    colorCorners: '#f5d77f',
    colorDividers: '#d4af37',
    fontTitle: "'Cinzel', serif",
    weightTitle: "900",
    sizeTitle: 44,
    spacingTitle: 2,
    glowTitle: 22,
    colorTitleGlow: '#f5d77f',
    fontSubtitle: "'Playfair Display', serif",
    styleSubtitle: "italic 700",
    sizeSubtitle: 24,
    fontDesc: "'Montserrat', sans-serif",
    sizeDesc: 20,
    lineHeightDesc: 1.6
  },
  {
    id: 'tib_homenagem2',
    category: 'tibete',
    categoryLabel: '🕊️ Prece do Tibete (Buda Solar)',
    src: '../Fotos/TIbate/Tratadas/IMG_20260828_172652877_HDR.jpg',
    title: 'LUZ DE CHENREZIG',
    subtitle: 'Compaixão Infinita e Amparo Divino',
    description: 'Que o sopro sagrado das bandeiras de oração espalhe paz pelos vales e eleve as almas que partiram em direção à luz divina. Em união espiritual por todas as famílias dos Himalaias.',
    categoryTag: '🕊️ PRECE PELOS HIMALAIAS',
    highlightText: '✦ KARUNA ✦ O Poder Infinito da Compaixão',
    badgeText: 'Solidariedade & Paz',
    ctaText: 'PEDAÇO DO CÉU • UNIÃO ESPIRITUAL',
    sacredPattern: 'sriYantra',
    gradientPrimary: '#1c0e04',
    gradientSecondary: '#381d09',
    gradientDarkness: '#080401',
    colorTitle: '#ffffff',
    colorSubtitle: '#f5d77f',
    colorDesc: '#ffffff',
    colorHighlight: '#f5d77f',
    colorHighlightBorder: '#d4af37',
    colorTag: '#f5d77f',
    colorBadge: '#f5d77f',
    colorCta: '#d4af37',
    colorPattern: '#d4af37',
    colorCorners: '#f5d77f',
    colorDividers: '#d4af37',
    fontTitle: "'Cinzel', serif",
    weightTitle: "900",
    sizeTitle: 44,
    spacingTitle: 2,
    glowTitle: 22,
    colorTitleGlow: '#f5d77f',
    fontSubtitle: "'Playfair Display', serif",
    styleSubtitle: "italic 700",
    sizeSubtitle: 24,
    fontDesc: "'Montserrat', sans-serif",
    sizeDesc: 20,
    lineHeightDesc: 1.6
  },
  {
    id: 'tib_homenagem3',
    category: 'tibete',
    categoryLabel: '🕊️ Prece do Tibete (Pirâmide de Sal)',
    src: '../Fotos/TIbate/Tratadas/IMG_20260828_165849966.jpg',
    title: 'RECONSTRUÇÃO & FÉ',
    subtitle: 'A Força Imutável das Montanhas Sagradas',
    description: 'Que o poder de Chenrezig abrace cada coração ferido. Que a serenidade dos mosteiros e a força das rochas sagradas sustentem a reconstrução de lares e vidas com coragem e esperança.',
    categoryTag: '🕊️ HOMENAGEM AO TIBETE',
    highlightText: '✦ OṂ MAṆI PADME HŪṂ ✦ Alívio, Amparo e Cura',
    badgeText: 'Esperança & Cura',
    ctaText: 'PEDAÇO DO CÉU • SOLIDARIEDADE & FÉ',
    sacredPattern: 'sriYantra',
    gradientPrimary: '#140a03',
    gradientSecondary: '#2a1607',
    gradientDarkness: '#080401',
    colorTitle: '#ffffff',
    colorSubtitle: '#f5d77f',
    colorDesc: '#ffffff',
    colorHighlight: '#f5d77f',
    colorHighlightBorder: '#d4af37',
    colorTag: '#f5d77f',
    colorBadge: '#f5d77f',
    colorCta: '#d4af37',
    colorPattern: '#d4af37',
    colorCorners: '#f5d77f',
    colorDividers: '#d4af37',
    fontTitle: "'Cinzel', serif",
    weightTitle: "900",
    sizeTitle: 44,
    spacingTitle: 2,
    glowTitle: 22,
    colorTitleGlow: '#f5d77f',
    fontSubtitle: "'Playfair Display', serif",
    styleSubtitle: "italic 700",
    sizeSubtitle: 24,
    fontDesc: "'Montserrat', sans-serif",
    sizeDesc: 20,
    lineHeightDesc: 1.6
  },
  {
    id: 'tib4_tacas',
    category: 'tibete',
    categoryLabel: '🧘 Tibete & Taças Sagradas',
    src: '../Fotos/TIbate/Tratadas/IMG_20260828_172439605_HDR.jpg',
    title: 'TAÇAS TIBETANAS',
    subtitle: 'A Cura Vibracional dos 7 Metais Sagrados',
    description: 'Forjadas à mão sob rituais ancestrais. As ondas sonoras em harmonia produzem frequências Alfa e Teta, alinhando os 7 chakras e dissipando bloqueios etéricos profundos.',
    categoryTag: 'CURA SONORA',
    highlightText: '✦ Frequência Harmônica 432Hz • 7 Metais',
    badgeText: 'Cura Vibracional',
    ctaText: 'PEDAÇO DO CÉU • HARMONIA & PAZ',
    sacredPattern: 'sriYantra',
    gradientPrimary: '#261a0e',
    gradientSecondary: '#52371d',
    gradientDarkness: '#0d0804',
    colorTitle: '#f5d77f',
    colorSubtitle: '#ffe0b2',
    colorDesc: '#fff3e0',
    colorHighlight: '#f5d77f',
    colorHighlightBorder: '#d4af37',
    colorTag: '#d4af37',
    colorBadge: '#f5d77f',
    colorCta: '#f5d77f',
    colorPattern: '#f5d77f',
    colorCorners: '#f5d77f',
    colorDividers: '#f5d77f',
    fontTitle: "'Cinzel Decorative', serif",
    weightTitle: "700",
    sizeTitle: 54,
    spacingTitle: 2,
    glowTitle: 18,
    colorTitleGlow: '#f5d77f',
    fontSubtitle: "'Cormorant Garamond', serif",
    styleSubtitle: "italic 500",
    sizeSubtitle: 26,
    fontDesc: "'Montserrat', sans-serif",
    sizeDesc: 18,
    lineHeightDesc: 1.6
  }
];

// Estado Inicial Padrão
const INITIAL_STATE = {
  format: '1:1',
  width: 1080,
  height: 1080,
  layout: 'right',
  align: 'center',
  fitMode: 'portal',

  imgSrc: PHOTO_CATALOG[0].src,
  imgObj: null,
  imgZoom: 1.0,
  imgPanX: 0,
  imgPanY: 0,

  bgImageSrc: null,
  bgImageObj: null,
  bgImageOpacity: 0.6,

  gradientPrimary: PHOTO_CATALOG[0].gradientPrimary,
  gradientSecondary: PHOTO_CATALOG[0].gradientSecondary,
  gradientDarkness: PHOTO_CATALOG[0].gradientDarkness,
  gradientIntensity: 0.88,

  categoryTag: PHOTO_CATALOG[0].categoryTag,
  title: PHOTO_CATALOG[0].title,
  subtitle: PHOTO_CATALOG[0].subtitle,
  description: PHOTO_CATALOG[0].description,
  highlightText: PHOTO_CATALOG[0].highlightText,
  showHighlightBox: true,
  ctaText: 'Visite nossa loja • Pedaço do Céu',
  badgeText: PHOTO_CATALOG[0].badgeText,

  fontTitle: PHOTO_CATALOG[0].fontTitle,
  weightTitle: PHOTO_CATALOG[0].weightTitle,
  sizeTitle: 54,
  spacingTitle: PHOTO_CATALOG[0].spacingTitle,
  glowTitle: PHOTO_CATALOG[0].glowTitle,
  colorTitleGlow: PHOTO_CATALOG[0].colorTitleGlow,

  fontSubtitle: PHOTO_CATALOG[0].fontSubtitle,
  styleSubtitle: PHOTO_CATALOG[0].styleSubtitle,
  sizeSubtitle: 26,

  fontDesc: "'Montserrat', sans-serif",
  sizeDesc: 18,
  lineHeightDesc: PHOTO_CATALOG[0].lineHeightDesc,

  colorTitle: PHOTO_CATALOG[0].colorTitle,
  colorSubtitle: PHOTO_CATALOG[0].colorSubtitle,
  colorDesc: PHOTO_CATALOG[0].colorDesc,
  colorHighlight: PHOTO_CATALOG[0].colorHighlight,
  colorHighlightBorder: PHOTO_CATALOG[0].colorHighlightBorder,
  colorTag: PHOTO_CATALOG[0].colorTag,
  colorBadge: PHOTO_CATALOG[0].colorBadge,
  colorCta: PHOTO_CATALOG[0].colorCta,
  colorPattern: PHOTO_CATALOG[0].colorPattern,
  colorCorners: PHOTO_CATALOG[0].colorCorners,
  colorDividers: PHOTO_CATALOG[0].colorDividers,

  sacredPattern: PHOTO_CATALOG[0].sacredPattern,
  patternOpacity: 0.35,

  showBaroqueCorners: true,
  showBadge: true,
  showSafeAreaGuide: false,

  paddingTop: 90,
  blockGap: 20,
  paddingSide: 60,
  globalLineGap: 12,

  sideBySideMode: false
};

// Classe Principal do Estúdio Místico
class PedacoDoCeuStudio {
  constructor() {
    this.store = new Store(INITIAL_STATE);
    this.canvasEl = document.getElementById('renderCanvas');
    this.renderer = new Renderer(this.canvasEl, this.store);
    this.dragDrop = new CanvasDragDrop(this.canvasEl, this.renderer, this.store);
    this.shortcuts = new ShortcutManager(this.store, this.renderer, () => this.syncUI());
    this.a11y = new A11yManager();

    this.init();
  }

  init() {
    this.initPhotoGallery();
    this.bindEvents();
    this.syncUI();

    // Carrega a primeira foto
    this.loadImage(this.store.state.imgSrc, () => {
      this.renderer.requestRender();
    });

    // Atualiza status dos botões de Undo/Redo no Store
    this.store.subscribe(() => {
      this.updateUndoRedoButtons();
    });
  }

  updateUndoRedoButtons() {
    const btnUndo = document.getElementById('btnUndo');
    const btnRedo = document.getElementById('btnRedo');
    if (btnUndo) btnUndo.disabled = !this.store.canUndo();
    if (btnRedo) btnRedo.disabled = !this.store.canRedo();
  }

  loadImage(src, callback) {
    const img = new Image();
    img.onload = () => {
      this.store.state.imgObj = img;
      const orig = document.getElementById('originalPhotoImg');
      if (orig) orig.src = src;
      if (callback) callback();
    };
    img.onerror = () => {
      console.warn('Erro ao carregar imagem local, aplicando gerador sagrado:', src);
      this.store.state.imgObj = this.createFallbackImage();
      const orig = document.getElementById('originalPhotoImg');
      if (orig) orig.src = this.store.state.imgObj.toDataURL();
      if (callback) callback();
    };
    img.src = encodeURI(src);
  }

  createFallbackImage() {
    const c = document.createElement('canvas');
    c.width = 1000;
    c.height = 1000;
    const ctx = c.getContext('2d');
    
    // Fundo esmeralda profundo
    const g = ctx.createLinearGradient(0, 0, 1000, 1000);
    g.addColorStop(0, '#001f0f');
    g.addColorStop(0.5, '#004d25');
    g.addColorStop(1, '#00140a');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 1000, 1000);

    // Borda interna dourada
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, 940, 940);

    // Geometria mística central
    ctx.strokeStyle = '#f5d77f';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(500, 500, 260, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#f5d77f';
    ctx.font = '700 36px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.fillText('✦ PEDAÇO DO CÉU ✦', 500, 480);

    ctx.font = 'italic 500 24px "Cormorant Garamond", serif';
    ctx.fillText('Espaço Artes • Sagrado & Místico', 500, 530);

    return c;
  }

  initPhotoGallery() {
    const galleryEl = document.getElementById('photoGallery');
    if (!galleryEl) return;

    galleryEl.innerHTML = '';
    PHOTO_CATALOG.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = `gallery-thumb-item ${this.store.state.imgSrc === item.src ? 'active' : ''}`;
      card.setAttribute('data-id', item.id);
      card.innerHTML = `
        <img src="${item.src}" alt="${item.title}" loading="lazy" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'80\\' height=\\'80\\' fill=\\'%2300381c\\'><rect width=\\'100%\\' height=\\'100%\\'/><text x=\\'50%\\' y=\\'50%\\' fill=\\'%23d4af37\\' font-family=\\'serif\\' font-size=\\'12\\' text-anchor=\\'middle\\' dy=\\'.3em\\'>✦ Peça ${idx+1}</text></svg>'">
        <div class="thumb-info">
          <span class="thumb-title">${item.title}</span>
          <span class="thumb-category">${item.categoryLabel}</span>
        </div>
      `;
      card.addEventListener('click', () => {
        document.querySelectorAll('.gallery-thumb-item').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        this.applyCatalogItem(item);
      });
      galleryEl.appendChild(card);
    });
  }

  applyCatalogItem(item) {
    Object.keys(item).forEach(key => {
      if (key !== 'id' && key !== 'categoryLabel') {
        this.store.state[key] = item[key];
      }
    });
    this.store.state.imgSrc = item.src;
    this.syncUI();
    this.loadImage(item.src, () => {
      this.renderer.requestRender();
    });
  }

  applyPreset(presetKey) {
    const p = DESIGN_PRESETS[presetKey];
    if (!p) return;

    Object.keys(p).forEach(k => {
      if (k !== 'name') {
        this.store.state[k] = p[k];
      }
    });
    this.syncUI();
    this.renderer.requestRender();
    A11yManager.announce(`Preset ${p.name} aplicado com sucesso!`);
  }

  updateGradientLivePreview() {
    const previewEl = document.getElementById('gradientLivePreview');
    if (!previewEl) return;
    const s = this.store.state;
    previewEl.style.background = `linear-gradient(135deg, ${s.gradientPrimary || '#00381c'}, ${s.gradientSecondary || '#008542'}, ${s.gradientDarkness || '#050c07'})`;
  }

  bindEvents() {
    // Tabs Navigation
    document.querySelectorAll('.tabs-nav .tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tabs-nav .tab-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
          b.setAttribute('tabindex', '-1');
        });
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        btn.setAttribute('tabindex', '0');

        const targetId = btn.getAttribute('data-target');
        const targetPane = document.getElementById(targetId);
        if (targetPane) targetPane.classList.add('active');
      });
    });

    // Presets Grid
    document.querySelectorAll('#presetsGrid .preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#presetsGrid .preset-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const presetKey = btn.getAttribute('data-preset');
        this.applyPreset(presetKey);
      });
    });

    // Bind Helpers
    const bindInput = (id, prop, isNum = false) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          this.store.state[prop] = isNum ? parseFloat(e.target.value) : e.target.value;
          const valEl = document.getElementById(id.replace('Range', 'Val'));
          if (valEl) valEl.textContent = e.target.value + (id.includes('lineHeight') ? 'x' : 'px');
          if (prop.startsWith('gradient')) this.updateGradientLivePreview();
        });
      }
    };

    // Textos e Cores
    ['title', 'subtitle', 'description', 'categoryTag', 'highlightText', 'ctaText', 'badgeText'].forEach(key => {
      let id = key + 'Input';
      if (key === 'categoryTag') id = 'categoryTagInput';
      if (key === 'highlightText') id = 'highlightInput';
      if (key === 'ctaText') id = 'ctaInput';
      if (key === 'badgeText') id = 'badgeInput';
      bindInput(id, key);
    });

    const colors = [
      'colorTitle', 'colorTitleGlow', 'colorSubtitle', 'colorDesc', 'colorHighlight',
      'colorHighlightBorder', 'colorTag', 'colorBadge', 'colorCta', 'colorPattern',
      'colorCorners', 'colorDividers', 'gradientPrimary', 'gradientSecondary', 'gradientDarkness'
    ];
    colors.forEach(key => bindInput(key + 'Input', key));

    // Sliders de Tipografia com tamanhos ampliados
    bindInput('sizeTitleRange', 'sizeTitle', true);
    bindInput('spacingTitleRange', 'spacingTitle', true);
    bindInput('glowTitleRange', 'glowTitle', true);
    bindInput('sizeSubtitleRange', 'sizeSubtitle', true);
    bindInput('sizeDescRange', 'sizeDesc', true);
    bindInput('paddingTopRange', 'paddingTop', true);
    bindInput('blockGapRange', 'blockGap', true);
    bindInput('paddingSideRange', 'paddingSide', true);
    bindInput('globalLineGapRange', 'globalLineGap', true);

    const lhRange = document.getElementById('lineHeightDescRange');
    if (lhRange) {
      lhRange.addEventListener('input', (e) => {
        this.store.state.lineHeightDesc = parseFloat(e.target.value) / 10;
        const lhVal = document.getElementById('lineHeightDescVal');
        if (lhVal) lhVal.textContent = this.store.state.lineHeightDesc.toFixed(1) + 'x';
      });
    }

    // Selects de Família de Fonte Expandidos
    ['fontTitleSelect', 'weightTitleSelect', 'fontSubtitleSelect', 'styleSubtitleSelect', 'fontDescSelect', 'sacredPatternSelect'].forEach(id => {
      const el = document.getElementById(id);
      const prop = id.replace('Select', '');
      if (el) el.addEventListener('change', (e) => { 
        this.store.state[prop] = e.target.value; 
        this.renderer.requestRender();
        // Garante que se a fonte web não foi baixada, ele força e re-renderiza
        if (prop.includes('font') || prop.includes('fontTitle')) {
          const fontStr = e.target.value.replace(/'/g, '');
          if (document.fonts) {
            document.fonts.load(`16px ${fontStr}`).then(() => this.renderer.requestRender());
          }
        }
      });
    });

    // Enquadramento
    document.querySelectorAll('[data-fit]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-fit]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.store.state.fitMode = btn.getAttribute('data-fit');
      });
    });

    // Alinhamento
    document.querySelectorAll('[data-align]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-align]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.store.state.align = btn.getAttribute('data-align');
      });
    });

    // Formato
    document.querySelectorAll('[data-format]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-format]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.setFormat(btn.getAttribute('data-format'));
      });
    });

    // Layout
    document.querySelectorAll('[data-layout]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-layout]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.store.state.layout = btn.getAttribute('data-layout');
      });
    });

    // Modo Split
    document.querySelectorAll('[data-view-mode]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-view-mode]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.getAttribute('data-view-mode');
        const photoCard = document.getElementById('originalPhotoCard');
        if (photoCard) {
          if (mode === 'split') {
            photoCard.classList.add('show');
            this.store.state.sideBySideMode = true;
          } else {
            photoCard.classList.remove('show');
            this.store.state.sideBySideMode = false;
          }
        }
      });
    });

    // Sliders de Foto
    const bindRangeHelper = (id, prop, transformFn, valId, unit = '') => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          this.store.state[prop] = transformFn(parseFloat(e.target.value));
          const disp = document.getElementById(valId);
          if (disp) disp.textContent = (this.store.state[prop] * (unit === 'x' ? 1 : 1)).toFixed(unit === 'x' ? 1 : 0) + unit;
        });
      }
    };
    bindRangeHelper('imgZoomRange', 'imgZoom', v => v / 100, 'imgZoomVal', 'x');
    bindRangeHelper('imgPanXRange', 'imgPanX', v => v, 'imgPanXVal', 'px');
    bindRangeHelper('imgPanYRange', 'imgPanY', v => v, 'imgPanYVal', 'px');
    bindRangeHelper('patternOpacityRange', 'patternOpacity', v => v / 100, 'patternOpacityVal', '%');
    bindRangeHelper('boxOpacityRange', 'boxOpacity', v => v / 100, 'boxOpacityVal', '%');
    bindRangeHelper('gradientIntensityRange', 'gradientIntensity', v => v / 100, 'gradientIntensityVal', '%');

    // Checkboxes
    const bindCheck = (id, prop) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', (e) => { this.store.state[prop] = e.target.checked; });
    };
    bindCheck('showBadgeCheck', 'showBadge');
    bindCheck('showCornersCheck', 'showBaroqueCorners');
    bindCheck('showHighlightBoxCheck', 'showHighlightBox');
    bindCheck('showSafeAreaGuideCheck', 'showSafeAreaGuide');

    // Upload Foto Principal
    const imgUpload = document.getElementById('imageUploadInput');
    if (imgUpload) {
      imgUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            this.store.state.imgSrc = evt.target.result;
            this.loadImage(evt.target.result, () => this.renderer.requestRender());
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Upload Imagem de Fundo
    const bgUpload = document.getElementById('bgImageUploadInput');
    if (bgUpload) {
      bgUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            const img = new Image();
            img.onload = () => {
              this.store.state.bgImageObj = img;
              this.store.state.bgImageSrc = evt.target.result;
              this.renderer.requestRender();
            };
            img.src = evt.target.result;
          };
          reader.readAsDataURL(file);
        }
      });
    }

    const bgOpRange = document.getElementById('bgImageOpacityRange');
    if (bgOpRange) {
      bgOpRange.addEventListener('input', (e) => {
        this.store.state.bgImageOpacity = parseInt(e.target.value) / 100;
        const disp = document.getElementById('bgImageOpacityVal');
        if (disp) disp.textContent = e.target.value + '%';
      });
    }

    const btnRemoveBg = document.getElementById('btnRemoveBgImage');
    if (btnRemoveBg) {
      btnRemoveBg.addEventListener('click', () => {
        this.store.state.bgImageObj = null;
        this.store.state.bgImageSrc = null;
        if (bgUpload) bgUpload.value = '';
        this.renderer.requestRender();
      });
    }

    // Undo / Redo Botões no Header
    const btnUndo = document.getElementById('btnUndo');
    if (btnUndo) btnUndo.addEventListener('click', () => { this.store.undo(); this.syncUI(); });

    const btnRedo = document.getElementById('btnRedo');
    if (btnRedo) btnRedo.addEventListener('click', () => { this.store.redo(); this.syncUI(); });

    // Exportar
    const btnExport = document.getElementById('btnExport');
    if (btnExport) {
      btnExport.addEventListener('click', () => {
        const cleanTitle = (this.store.state.title || 'post')
          .toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]/g, '-');
        this.renderer.exportImage(`pedaco-do-ceu-${this.store.state.format}-${cleanTitle}.png`);
        A11yManager.announce('Exportação PNG concluída com sucesso!');
      });
    }
  }

  setFormat(fmt) {
    this.store.state.format = fmt;
    const dim = TOKENS.dimensions[fmt] || TOKENS.dimensions['1:1'];
    this.store.state.width = dim.width;
    this.store.state.height = dim.height;

    const dimDisplay = document.getElementById('formatDimDisplay');
    if (dimDisplay) dimDisplay.textContent = dim.label;
  }

  syncUI() {
    const s = this.store.state;
    const setVal = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined) el.value = val; };

    setVal('titleInput', s.title);
    setVal('subtitleInput', s.subtitle);
    setVal('descriptionInput', s.description);
    setVal('categoryTagInput', s.categoryTag);
    setVal('highlightInput', s.highlightText);
    setVal('ctaInput', s.ctaText);
    setVal('badgeInput', s.badgeText);

    // Cores
    setVal('colorTitleInput', s.colorTitle);
    setVal('colorTitleGlowInput', s.colorTitleGlow);
    setVal('colorSubtitleInput', s.colorSubtitle);
    setVal('colorDescInput', s.colorDesc);
    setVal('colorHighlightInput', s.colorHighlight);
    setVal('colorHighlightBorderInput', s.colorHighlightBorder);
    setVal('colorTagInput', s.colorTag);
    setVal('colorBadgeInput', s.colorBadge);
    setVal('colorCtaInput', s.colorCta);
    setVal('colorPatternInput', s.colorPattern);
    setVal('colorCornersInput', s.colorCorners);
    setVal('colorDividersInput', s.colorDividers);
    setVal('gradientPrimaryInput', s.gradientPrimary);
    setVal('gradientSecondaryInput', s.gradientSecondary);
    setVal('gradientDarknessInput', s.gradientDarkness);

    // Selects
    setVal('fontTitleSelect', s.fontTitle);
    setVal('weightTitleSelect', s.weightTitle);
    setVal('fontSubtitleSelect', s.fontSubtitle);
    setVal('styleSubtitleSelect', s.styleSubtitle);
    setVal('fontDescSelect', s.fontDesc);
    setVal('sacredPatternSelect', s.sacredPattern);

    // Sliders
    setVal('sizeTitleRange', s.sizeTitle);
    const sizeTitleVal = document.getElementById('sizeTitleVal');
    if (sizeTitleVal) sizeTitleVal.textContent = s.sizeTitle + 'px';

    setVal('spacingTitleRange', s.spacingTitle);
    const spacingTitleVal = document.getElementById('spacingTitleVal');
    if (spacingTitleVal) spacingTitleVal.textContent = s.spacingTitle + 'px';

    setVal('glowTitleRange', s.glowTitle);
    const glowTitleVal = document.getElementById('glowTitleVal');
    if (glowTitleVal) glowTitleVal.textContent = s.glowTitle + 'px';

    setVal('sizeSubtitleRange', s.sizeSubtitle);
    const sizeSubVal = document.getElementById('sizeSubtitleVal');
    if (sizeSubVal) sizeSubVal.textContent = s.sizeSubtitle + 'px';

    setVal('sizeDescRange', s.sizeDesc);
    const sizeDescVal = document.getElementById('sizeDescVal');
    if (sizeDescVal) sizeDescVal.textContent = s.sizeDesc + 'px';

    setVal('paddingTopRange', s.paddingTop);
    const pTopVal = document.getElementById('paddingTopVal');
    if (pTopVal) pTopVal.textContent = s.paddingTop + 'px';

    setVal('blockGapRange', s.blockGap);
    const bgVal = document.getElementById('blockGapVal');
    if (bgVal) bgVal.textContent = s.blockGap + 'px';

    setVal('paddingSideRange', s.paddingSide);
    const pSideVal = document.getElementById('paddingSideVal');
    if (pSideVal) pSideVal.textContent = s.paddingSide + 'px';

    setVal('globalLineGapRange', s.globalLineGap);
    const glgVal = document.getElementById('globalLineGapVal');
    if (glgVal) glgVal.textContent = s.globalLineGap + 'px';

    setVal('gradientIntensityRange', (s.gradientIntensity || 0.88) * 100);
    const giVal = document.getElementById('gradientIntensityVal');
    if (giVal) giVal.textContent = Math.round((s.gradientIntensity || 0.88) * 100) + '%';

    setVal('boxOpacityRange', (s.boxOpacity || 0.95) * 100);
    const boVal = document.getElementById('boxOpacityVal');
    if (boVal) boVal.textContent = Math.round((s.boxOpacity || 0.95) * 100) + '%';

    setVal('lineHeightDescRange', (s.lineHeightDesc || 1.4) * 10);
    const lhVal = document.getElementById('lineHeightDescVal');
    if (lhVal) lhVal.textContent = (s.lineHeightDesc || 1.4).toFixed(1) + 'x';
    
    setVal('imgZoomRange', (s.imgZoom || 1) * 100);
    const zoomVal = document.getElementById('imgZoomVal');
    if (zoomVal) zoomVal.textContent = (s.imgZoom || 1).toFixed(1) + 'x';

    setVal('imgPanXRange', s.imgPanX || 0);
    const panXVal = document.getElementById('imgPanXVal');
    if (panXVal) panXVal.textContent = (s.imgPanX || 0) + 'px';

    setVal('imgPanYRange', s.imgPanY || 0);
    const panYVal = document.getElementById('imgPanYVal');
    if (panYVal) panYVal.textContent = (s.imgPanY || 0) + 'px';

    setVal('patternOpacityRange', (s.patternOpacity || 0.15) * 100);
    const poVal = document.getElementById('patternOpacityVal');
    if (poVal) poVal.textContent = Math.round((s.patternOpacity || 0.15) * 100) + '%';

    setVal('bgImageOpacityRange', (s.bgImageOpacity || 0.6) * 100);
    const bgOpVal = document.getElementById('bgImageOpacityVal');
    if (bgOpVal) bgOpVal.textContent = Math.round((s.bgImageOpacity || 0.6) * 100) + '%';

    // Checkboxes
    const setCheck = (id, val) => { const el = document.getElementById(id); if (el) el.checked = val; };
    setCheck('showBadgeCheck', s.showBadge);
    setCheck('showCornersCheck', s.showBaroqueCorners);
    setCheck('showHighlightBoxCheck', s.showHighlightBox);
    setCheck('showSafeAreaGuideCheck', s.showSafeAreaGuide);

    // Live Gradient Preview Bar
    this.updateGradientLivePreview();
  }
}

// Inicializa quando o DOM estiver pronto
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.pedacoStudio = new PedacoDoCeuStudio();
  });
}

})();
