// Camada de Tipografia & Textos Sagrados - Pedaço do Céu Studio v2.0
import { BaseLayer } from './base.js';
import { hexToRgba } from '../../tokens.js';
import { calculateZones, applySafeArea, calculateTextBlocks } from '../layout-engine.js';

export class TextLayer extends BaseLayer {
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

    // Header Global (todos os layouts calibrados)
    if (state.showHeader && state.headerText) {
      const align = state.align || 'center';
      const headerX = align === 'left' ? (state.paddingSide || 60) :
                      align === 'right' ? (width - (state.paddingSide || 60)) : width / 2;
      ctx.save();
      ctx.textAlign = align;
      ctx.fillStyle = state.colorHeader || '#d4af37';
      ctx.font = `${state.weightHeader || 600} ${state.sizeHeader || 12}px ${state.fontHeader || "'Cinzel', serif"}`;
      ctx.letterSpacing = `${state.spacingHeader !== undefined ? state.spacingHeader : 2}px`;
      ctx.fillText((state.headerText || '').toUpperCase(), headerX, 28);
      ctx.letterSpacing = '0px';
      ctx.restore();
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
    const tagX = this.getAlignX(colX, innerW, state.align);
    let curY = state.paddingTop || 100;

    // Header / Cabeçalho da Loja (topo absoluto)
    if (state.showHeader && state.headerText) {
      ctx.save();
      ctx.textAlign = state.align || 'center';
      ctx.fillStyle = state.colorHeader || '#d4af37';
      ctx.font = `${state.weightHeader || 600} ${state.sizeHeader || 12}px ${state.fontHeader || "'Cinzel', serif"}`;
      ctx.letterSpacing = `${state.spacingHeader !== undefined ? state.spacingHeader : 2}px`;
      ctx.fillText((state.headerText || '').toUpperCase(), tagX, curY);
      ctx.letterSpacing = '0px';
      ctx.restore();
      curY += Math.round((state.sizeHeader || 12) * 1.5) + Math.round(gap * 0.4);
    }

    // Selo Superior (Badge Pill)
    if (state.showBadge && state.badgeText) {
      curY = this.drawBadgePill(ctx, colX + innerW / 2, curY, state.badgeText, true, state);
    }

    // Tag / Categoria
    if (state.categoryTag) {
      ctx.save();
      ctx.textAlign = state.align || 'center';
      ctx.fillStyle = state.colorTag || '#d4af37';
      ctx.font = `${state.weightTag || 700} ${state.sizeTag || 15}px ${state.fontTag || "'Cinzel', serif"}`;
      ctx.letterSpacing = `${state.spacingTag !== undefined ? state.spacingTag : 1.5}px`;
      ctx.fillText((state.categoryTag || '').toUpperCase(), tagX, curY);
      ctx.letterSpacing = '0px';
      ctx.restore();
      curY += Math.round(gap * 0.8) + Math.round((state.sizeTitle || 46) * 0.85);
    } else {
      curY += Math.round((state.sizeTitle || 46) * 0.85);
    }

    // Título Principal com Glow
    ctx.save();
    ctx.fillStyle = state.colorTitle || '#f8f9fa';
    ctx.font = `${state.weightTitle || 700} ${state.sizeTitle || 46}px ${state.fontTitle || "'Cinzel Decorative', serif"}`;
    ctx.letterSpacing = `${state.spacingTitle || 1}px`;
    if (state.glowTitle > 0) {
      ctx.shadowColor = state.colorTitleGlow || '#d4af37';
      ctx.shadowBlur = state.glowTitle;
    }
    ctx.textAlign = state.align || 'center';
    const titleStartY = curY;
    curY = this.drawWrappedText(ctx, state.title, tagX, curY, innerW, (state.sizeTitle || 46) * 1.10 + lineGapExtra * 0.3);
    ctx.restore();
    this.boundingBoxes.push({ id: 'title', x: colX, y: titleStartY - 10, w: innerW, h: curY - titleStartY + 10 });

    curY += Math.round(gap * 0.5) + Math.round((state.sizeSubtitle || 20) * 0.7);

    // Subtítulo
    ctx.save();
    ctx.fillStyle = state.colorSubtitle || '#eadcb9';
    ctx.font = `${state.styleSubtitle || 'italic 500'} ${state.sizeSubtitle || 20}px ${state.fontSubtitle || "'Cormorant Garamond', serif"}`;
    ctx.textAlign = state.align || 'center';
    ctx.letterSpacing = `${state.spacingSubtitle !== undefined ? state.spacingSubtitle : 0}px`;
    curY = this.drawWrappedText(ctx, state.subtitle, tagX, curY, innerW, (state.sizeSubtitle || 20) * 1.25 + lineGapExtra * 0.2);
    ctx.letterSpacing = '0px';
    ctx.restore();
    curY += Math.round(gap * 0.8);

    // Divisor Celestial
    this.drawCelestialDivider(ctx, colX + innerW / 2, curY, 60, state.colorDividers || '#d4af37');
    curY += Math.round(gap * 0.8) + Math.round((state.sizeDesc || 16) * 0.85);

    // Descrição Poética
    ctx.save();
    ctx.fillStyle = state.colorDesc || '#f8f9fa';
    ctx.font = `${state.weightDesc || 300} ${state.sizeDesc || 16}px ${state.fontDesc || "'Montserrat', sans-serif"}`;
    ctx.textAlign = state.align || 'center';
    curY = this.drawWrappedText(ctx, state.description, tagX, curY, innerW, (state.sizeDesc || 16) * (state.lineHeightDesc || 1.6) + lineGapExtra * 0.15);
    ctx.restore();
    curY += gap;

    // Slot de Destaque Sagrado (Auto-expansível)
    if (state.showHighlightBox && state.highlightText) {
      curY = this.drawHighlightBox(ctx, colX, curY, innerW, state.highlightText, state);
    }

    // CTA / Rodapé
    if (state.ctaText) {
      const ctaY = Math.max(curY + gap, H - 70);
      ctx.save();
      ctx.fillStyle = state.colorCta || '#d4af37';
      ctx.font = `${state.weightCta || 600} ${state.sizeCta || 14}px ${state.fontCta || "'Cinzel', serif"}`;
      ctx.textAlign = state.align || 'center';
      ctx.letterSpacing = `${state.spacingCta !== undefined ? state.spacingCta : 1}px`;
      ctx.fillText(state.ctaText, tagX, ctaY);
      ctx.letterSpacing = '0px';
      ctx.restore();
    }
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
        ctx.letterSpacing = `${b.letterSpacing !== undefined ? b.letterSpacing : 0}px`;
        let sY = b.y;
        for (const line of b.lines) {
          ctx.fillText(line, b.x, sY);
          sY += b.lineHeight;
        }
        ctx.letterSpacing = '0px';
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
    const bFont = state.fontBadge || "'Cinzel', serif";
    const bSize = state.sizeBadge || 12;
    const bWeight = state.weightBadge || 700;
    ctx.font = `${bWeight} ${bSize}px ${bFont}`;
    const textWidth = ctx.measureText(text.toUpperCase()).width;
    const padX = 16;
    const badgeW = textWidth + padX * 2;
    const badgeH = Math.round(bSize * 2.4);
    const startX = centered ? x - badgeW / 2 : x;

    ctx.fillStyle = hexToRgba(state.gradientPrimary || '#00381c', 0.85);
    this.roundRect(ctx, startX, y, badgeW, badgeH, 14, true, false);

    ctx.strokeStyle = state.colorBadge || '#f5d77f';
    ctx.lineWidth = 1.2;
    this.roundRect(ctx, startX, y, badgeW, badgeH, 14, false, true);

    ctx.fillStyle = state.colorBadge || '#f5d77f';
    ctx.letterSpacing = `${state.spacingBadge !== undefined ? state.spacingBadge : 1}px`;
    ctx.textAlign = 'center';
    ctx.fillText(text.toUpperCase(), startX + badgeW / 2, y + Math.round(bSize * 1.6));
    ctx.letterSpacing = '0px';
    ctx.restore();
    return y + badgeH + 16;
  }

  drawHighlightBox(ctx, x, y, width, text, state) {
    if (!text) return y;
    ctx.save();
    const hFont = state.fontHighlight || "'Montserrat', sans-serif";
    const hSize = state.sizeHighlight || 14;
    const hWeight = state.weightHighlight || 600;
    const hSpacing = state.spacingHighlight !== undefined ? state.spacingHighlight : 0.6;
    ctx.font = `${hWeight} ${hSize}px ${hFont}`;
    ctx.letterSpacing = `${hSpacing}px`;

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
    const lineH = Math.round(hSize * 1.35);
    const boxH = lines.length * lineH + padY * 2;

    ctx.fillStyle = hexToRgba(state.gradientPrimary || '#00381c', 0.55);
    this.roundRect(ctx, x, y, width, boxH, 8, true, false);

    ctx.strokeStyle = state.colorHighlightBorder || state.colorCorners || '#d4af37';
    ctx.lineWidth = 1;
    this.roundRect(ctx, x, y, width, boxH, 8, false, true);

    ctx.fillStyle = state.colorHighlight || '#f5d77f';
    ctx.textAlign = 'center';

    let textY = y + padY + hSize * 0.9;
    for (const l of lines) {
      ctx.fillText(l, x + width / 2, textY);
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
