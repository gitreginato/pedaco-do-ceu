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

export function calculateZones(canvasW, canvasH, layoutKey, state) {
  const config = LAYOUT_CONFIG[layoutKey] || LAYOUT_CONFIG.right;
  const zones = {};

  if (config.type === 'split') {
    const splitRatio = state && state.splitRatio !== undefined ? state.splitRatio : (config.imgWidthPercent || 0.60);
    const splitX = Math.round(canvasW * splitRatio);
    if (config.imgAnchor === 'right') {
      zones.text = { x: 0, y: 0, w: canvasW - splitX, h: canvasH };
      zones.img = { x: canvasW - splitX, y: 0, w: splitX, h: canvasH };
    } else {
      zones.img = { x: 0, y: 0, w: splitX, h: canvasH };
      zones.text = { x: splitX, y: 0, w: canvasW - splitX, h: canvasH };
    }
  } else if (config.type === 'stack') {
    const textHPercent = state && state.textZoneHeight !== undefined ? state.textZoneHeight : (config.textHeightPercent || 0.44);
    if (config.imgAnchor === 'top') {
      const imgH = Math.round(canvasH * (1 - textHPercent));
      zones.img = { x: 0, y: 0, w: canvasW, h: imgH };
      zones.text = { x: 0, y: imgH, w: canvasW, h: canvasH - imgH };
    } else {
      const textH = Math.round(canvasH * textHPercent);
      zones.text = { x: 0, y: 0, w: canvasW, h: textH };
      zones.img = { x: 0, y: textH, w: canvasW, h: canvasH - textH };
    }
  } else if (config.type === 'overlay') {
    zones.img = { x: 0, y: 0, w: canvasW, h: canvasH };
    const cardW = Math.min(canvasW * 0.88, 860);
    const cardH = Math.min(canvasH * 0.78, 1060);
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

  // Escala dinâmica se houver overflow severo
  const scale = iteration > 0 ? Math.pow(0.9, iteration) : 1.0;
  const gap = Math.round((state.blockGap || 20) * scale);
  const lineGapExtra = (state.globalLineGap || 12) * scale;
  let currentY = zone.y + Math.max(10, Math.round(((state.paddingTop || 40) - 30) * scale));

  // Tamanhos de fonte respeitando o controle do usuário
  const titleSize = Math.round((state.sizeTitle || 46) * scale);
  const subSize = Math.round((state.sizeSubtitle || 24) * scale);
  const descSize = Math.round((state.sizeDesc || 16) * scale);
  const tagSize = Math.round((state.sizeTag || 14) * scale);
  const badgeSize = Math.round((state.sizeBadge || 12) * scale);
  const highlightSize = Math.round((state.sizeHighlight || 14) * scale);
  const ctaSize = Math.round((state.sizeCta || 14) * scale);

  // 1. Badge (Selo Superior)
  if (state.showBadge && state.badgeText) {
    blocks.push({
      type: 'badge',
      text: state.badgeText,
      x: centerX,
      y: currentY,
      size: badgeSize,
      align: 'center',
      color: state.colorBadge,
      colorBorder: state.colorBadge,
      maxWidth: maxWidth
    });
    currentY += Math.round(badgeSize * 2.4) + gap;
  }

  // 2. Tag / Categoria
  if (state.categoryTag) {
    blocks.push({
      type: 'tag',
      text: state.categoryTag.toUpperCase(),
      x: getX(),
      y: currentY,
      size: tagSize,
      align: align,
      font: `${state.weightTag || 700} ${tagSize}px ${state.fontTag || "'Cinzel', serif"}`,
      color: state.colorTag,
      letterSpacing: state.spacingTag !== undefined ? state.spacingTag : 2,
      maxWidth: maxWidth
    });
    currentY += Math.round(tagSize * 1.5) + gap + Math.round(titleSize * 0.82);
  } else {
    currentY += Math.round(titleSize * 0.82);
  }

  // 3. Título Principal
  const titleFontFamily = state.fontTitle || "'Cinzel Decorative', 'Cinzel', serif";
  const titleFont = `${state.weightTitle || 700} ${titleSize}px ${titleFontFamily}`;
  const titleMetrics = measureWrappedText(ctx, state.title, titleSize, maxWidth, titleFontFamily);
  
  blocks.push({
    type: 'title',
    text: state.title,
    size: titleSize,
    lines: titleMetrics.lines,
    lineHeight: titleSize * 1.12 + lineGapExtra * 0.3,
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
  currentY += ((titleMetrics.lines.length - 1) * (titleSize * 1.12 + lineGapExtra * 0.3)) + Math.round(gap * 0.5) + Math.round(subSize * 0.75);

  // 4. Subtítulo
  const subFontFamily = state.fontSubtitle || "'Cormorant Garamond', serif";
  const subFont = `${state.styleSubtitle || 'italic 500'} ${subSize}px ${subFontFamily}`;
  const subMetrics = measureWrappedText(ctx, state.subtitle, subSize, maxWidth, subFontFamily);

  blocks.push({
    type: 'subtitle',
    text: state.subtitle,
    size: subSize,
    lines: subMetrics.lines,
    lineHeight: subSize * 1.25 + lineGapExtra * 0.2,
    x: getX(),
    y: currentY,
    align: align,
    font: subFont,
    color: state.colorSubtitle,
    letterSpacing: state.spacingSubtitle !== undefined ? state.spacingSubtitle : 0,
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
    const descFontFamily = state.fontDesc || "'Montserrat', sans-serif";
    const descFont = `${state.weightDesc || 300} ${descSize}px ${descFontFamily}`;
    const descLineH = state.lineHeightDesc ? Math.round(descSize * state.lineHeightDesc) + lineGapExtra * 0.15 : Math.round(descSize * 1.5) + lineGapExtra * 0.15;
    const descMetrics = measureWrappedText(ctx, state.description, descSize, maxWidth, descFontFamily);
    currentY += Math.round(descSize * 0.85);

    blocks.push({
      type: 'description',
      text: state.description,
      size: descSize,
      lines: descMetrics.lines,
      lineHeight: descLineH,
      x: getX(),
      y: currentY,
      align: align,
      font: descFont,
      color: state.colorDesc,
      maxWidth: maxWidth
    });
    currentY += ((descMetrics.lines.length - 1) * descLineH) + gap;
  }

  // 7. Highlight / Afirmação Sagrada
  if (state.showHighlightBox && state.highlightText) {
    blocks.push({
      type: 'highlight',
      text: state.highlightText,
      size: highlightSize,
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
  if (state.ctaText && state.ctaText.trim() !== '') {
    const ctaY = Math.max(currentY + gap, zone.y + zone.h - 25);
    blocks.push({
      type: 'cta',
      text: state.ctaText,
      size: ctaSize,
      x: getX(),
      y: ctaY,
      align: align,
      font: `${state.weightCta || 600} ${ctaSize}px ${state.fontCta || "'Cinzel', serif"}`,
      color: state.colorCta || state.colorTitle,
      letterSpacing: state.spacingCta !== undefined ? state.spacingCta : 1.5,
      maxWidth: maxWidth
    });
  }

  // Text Fit Mode: se o conteúdo estourar excessivamente a altura da zona segura, reduz recursivamente até 3 vezes
  if (currentY > zone.y + zone.h + 20 && iteration < 3) {
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
