// Engine de Layouts & Zonas Espaciais - Pedaço do Céu Studio v2.0 Enterprise
import { hexToRgba } from '../tokens.js';

export const LAYOUT_CONFIG = {
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

export const SAFE_AREAS = {
  '1:1': { top: 60, bottom: 60, left: 60, right: 60 },
  '4:5': { top: 70, bottom: 70, left: 70, right: 70 },
  '9:16-story': { top: 100, bottom: 120, left: 70, right: 70 },
  '9:16-tiktok': { top: 120, bottom: 140, left: 70, right: 70 }
};

export function calculateZones(canvasW, canvasH, layoutKey) {
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

export function applySafeArea(zone, formatKey) {
  const safe = SAFE_AREAS[formatKey] || SAFE_AREAS['1:1'];
  return {
    x: zone.x + safe.left,
    y: zone.y + safe.top,
    w: Math.max(100, zone.w - safe.left - safe.right),
    h: Math.max(100, zone.h - safe.top - safe.bottom)
  };
}

export function measureWrappedText(ctx, text, fontSize, maxWidth, fontFamily) {
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

export function calculateTextBlocks(ctx, state, zone, canvasW, canvasH, iteration = 0) {
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
    const descFontFamily = state.fontDesc || '"Montserrat", sans-serif';
    const descFont = `300 ${descSize}px ${descFontFamily}`;
    const descMetrics = measureWrappedText(ctx, state.description, descSize, maxWidth, descFontFamily);
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

export function renderGradientOverlay(ctx, zones, config, state, canvasW, canvasH) {
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
