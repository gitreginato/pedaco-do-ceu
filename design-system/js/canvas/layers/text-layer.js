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
    const zones = calculateZones(width, height, state.layout, state);
    if (!zones.text) return;

    const cardStyle = state.textCardStyle || 'card';

    if (cardStyle !== 'transparent' && cardStyle !== 'separated') {
      if (cardStyle === 'gradient') {
        this.drawGradientFadeBackground(ctx, width, height, zones.text, state);
      } else if (cardStyle === 'glass') {
        this.drawGlassCardBackground(ctx, zones.text, state);
      } else if (cardStyle === 'framed') {
        this.drawFramedCardBackground(ctx, zones.text, state);
      } else {
        // card (fundo preenchido / sólido clássico)
        if (state.layout === 'center') {
          this.drawCenterCardBackground(ctx, zones.text, state);
        } else if (state.layout === 'bottom') {
          this.drawBottomCardBackground(ctx, zones.text, state);
        } else if (state.layout === 'top') {
          this.drawTopCardBackground(ctx, zones.text, state);
        }
      }
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
    const imgW = Math.round(W * (state.splitRatio !== undefined ? state.splitRatio : 0.60));
    const textW = W - imgW;
    const colX = isLeft ? (state.paddingSide || 20) : imgW + (state.paddingSide || 20);
    const innerW = textW - (state.paddingSide || 20) * 2;
    const gap = state.blockGap || 22;
    const lineGapExtra = state.globalLineGap || 12;

    let curY = state.paddingTop || 90;
    const tagX = this.getAlignX(colX, innerW, state.align);

    // 1. Tag de Categoria
    if (state.categoryTag) {
      ctx.save();
      ctx.textAlign = state.align;
      ctx.fillStyle = state.colorTag;
      const tFont = state.fontTag || "'Cinzel', serif";
      const tSize = state.sizeTag || 14;
      const tWeight = state.weightTag || 600;
      ctx.font = `${tWeight} ${tSize}px ${tFont}`;
      ctx.letterSpacing = `${state.spacingTag !== undefined ? state.spacingTag : 2}px`;
      ctx.fillText(state.categoryTag.toUpperCase(), tagX, curY);
      ctx.letterSpacing = '0px';
      ctx.restore();
      curY += Math.round(tSize * 1.5) + gap;
    }

    // 2. Título Principal
    if (state.title) {
      ctx.save();
      ctx.textAlign = state.align;
      ctx.fillStyle = state.colorTitle;
      const titFont = state.fontTitle || "'Cinzel Decorative', 'Cinzel', serif";
      const titSize = state.sizeTitle || 38;
      const titWeight = state.weightTitle || 700;
      ctx.font = `${titWeight} ${titSize}px ${titFont}`;
      ctx.letterSpacing = `${state.spacingTitle !== undefined ? state.spacingTitle : 1}px`;
      if (state.glowTitle > 0) {
        ctx.shadowColor = state.colorTitleGlow || state.colorTitle;
        ctx.shadowBlur = state.glowTitle;
      }
      curY = this.drawWrappedText(ctx, state.title, tagX, curY, innerW, Math.round(titSize * 1.15) + lineGapExtra);
      ctx.shadowColor = 'transparent';
      ctx.letterSpacing = '0px';
      ctx.restore();
      curY += gap;
    }

    // 3. Subtítulo Poético
    if (state.subtitle) {
      ctx.save();
      ctx.textAlign = state.align;
      ctx.fillStyle = state.colorSubtitle;
      const subFont = state.fontSubtitle || "'Cormorant Garamond', serif";
      const subSize = state.sizeSubtitle || 24;
      const subStyle = state.styleSubtitle || "italic";
      ctx.font = `${subStyle} ${subSize}px ${subFont}`;
      ctx.letterSpacing = `${state.spacingSubtitle !== undefined ? state.spacingSubtitle : 0}px`;
      curY = this.drawWrappedText(ctx, state.subtitle, tagX, curY, innerW, Math.round(subSize * 1.25) + lineGapExtra);
      ctx.letterSpacing = '0px';
      ctx.restore();
      curY += gap;
    }

    // Divisor Sagrado Místico
    this.drawCelestialDivider(ctx, colX, curY, innerW, state.colorDividers);
    curY += 26;

    // 4. Descrição do Produto
    if (state.description) {
      ctx.save();
      ctx.textAlign = state.align;
      ctx.fillStyle = state.colorDesc;
      const dFont = state.fontDesc || "'Montserrat', sans-serif";
      const dSize = state.sizeDesc || 15;
      const dWeight = state.weightDesc || 300;
      const dLineH = state.lineHeightDesc ? Math.round(dSize * state.lineHeightDesc) : 22;
      ctx.font = `${dWeight} ${dSize}px ${dFont}`;
      curY = this.drawWrappedText(ctx, state.description, tagX, curY, innerW, dLineH);
      ctx.restore();
      curY += gap + 6;
    }

    // 5. Destaque Vibracional
    if (state.highlightText) {
      curY = this.drawHighlightBox(ctx, colX, curY, innerW, state.highlightText, state);
      curY += gap;
    }

    // 6. Chamada para Ação / CTA
    if (state.ctaText && state.ctaText.trim() !== '') {
      const ctaY = Math.max(curY + 10, H - 55);
      ctx.save();
      ctx.textAlign = state.align;
      ctx.fillStyle = state.colorCta || state.colorTitle;
      const cFont = state.fontCta || "'Cinzel', serif";
      const cSize = state.sizeCta || 14;
      const cWeight = state.weightCta || 600;
      ctx.font = `${cWeight} ${cSize}px ${cFont}`;
      ctx.letterSpacing = `${state.spacingCta !== undefined ? state.spacingCta : 1}px`;
      ctx.fillText(state.ctaText, tagX, ctaY);
      ctx.letterSpacing = '0px';
      ctx.restore();
    }
  }

  drawBottomCardBackground(ctx, zone, state) {
    const opacity = state.boxOpacity !== undefined ? state.boxOpacity : 0.95;
    const radius = state.cardRadius !== undefined ? state.cardRadius : 16;
    const padX = state.paddingSide !== undefined ? Math.min(state.paddingSide, 80) : 28;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 25;
    const cardGrad = ctx.createLinearGradient(zone.x, zone.y, zone.x, zone.y + zone.h);
    cardGrad.addColorStop(0, hexToRgba(state.gradientPrimary || '#00381c', opacity));
    cardGrad.addColorStop(1, hexToRgba(state.gradientDarkness || '#050c07', Math.min(opacity + 0.03, 1)));
    ctx.fillStyle = cardGrad;
    this.roundRect(ctx, zone.x + padX, zone.y + 10, zone.w - padX * 2, zone.h - 38, radius, true, false);
    ctx.shadowColor = 'transparent';

    ctx.strokeStyle = hexToRgba(state.colorCorners || '#d4af37', 0.5);
    ctx.lineWidth = 1.2;
    this.roundRect(ctx, zone.x + padX, zone.y + 10, zone.w - padX * 2, zone.h - 38, radius, false, true);
    ctx.restore();
  }

  drawTopCardBackground(ctx, zone, state) {
    const opacity = state.boxOpacity !== undefined ? state.boxOpacity : 0.95;
    const radius = state.cardRadius !== undefined ? state.cardRadius : 16;
    const padX = state.paddingSide !== undefined ? Math.min(state.paddingSide, 80) : 28;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 25;
    const cardGrad = ctx.createLinearGradient(zone.x, zone.y, zone.x, zone.y + zone.h);
    cardGrad.addColorStop(0, hexToRgba(state.gradientDarkness || '#050c07', Math.min(opacity + 0.03, 1)));
    cardGrad.addColorStop(1, hexToRgba(state.gradientPrimary || '#00381c', opacity));
    ctx.fillStyle = cardGrad;
    this.roundRect(ctx, zone.x + padX, zone.y + 28, zone.w - padX * 2, zone.h - 38, radius, true, false);
    ctx.shadowColor = 'transparent';

    ctx.strokeStyle = hexToRgba(state.colorCorners || '#d4af37', 0.5);
    ctx.lineWidth = 1.2;
    this.roundRect(ctx, zone.x + padX, zone.y + 28, zone.w - padX * 2, zone.h - 38, radius, false, true);
    ctx.restore();
  }

  drawCenterCardBackground(ctx, zone, state) {
    const opacity = state.boxOpacity !== undefined ? state.boxOpacity : 0.95;
    const radius = state.cardRadius !== undefined ? state.cardRadius : 20;
    const padX = state.paddingSide !== undefined ? Math.min(state.paddingSide, 60) : 0;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 35;
    const grad = ctx.createLinearGradient(zone.x, zone.y, zone.x, zone.y + zone.h);
    grad.addColorStop(0, hexToRgba(state.gradientPrimary || '#00381c', opacity));
    grad.addColorStop(0.5, hexToRgba(state.gradientSecondary || '#008542', Math.min(opacity + 0.01, 1)));
    grad.addColorStop(1, hexToRgba(state.gradientDarkness || '#050c07', Math.min(opacity + 0.03, 1)));
    ctx.fillStyle = grad;
    this.roundRect(ctx, zone.x + padX, zone.y, zone.w - padX * 2, zone.h, radius, true, false);
    ctx.shadowColor = 'transparent';

    ctx.strokeStyle = hexToRgba(state.colorCorners || '#d4af37', 0.6);
    ctx.lineWidth = 1.5;
    this.roundRect(ctx, zone.x + padX, zone.y, zone.w - padX * 2, zone.h, radius, false, true);

    ctx.strokeStyle = hexToRgba(state.colorCorners || '#d4af37', 0.25);
    ctx.lineWidth = 0.8;
    this.roundRect(ctx, zone.x + padX + 6, zone.y + 6, zone.w - padX * 2 - 12, zone.h - 12, Math.max(radius - 4, 4), false, true);
    ctx.restore();
  }

  drawGradientFadeBackground(ctx, W, H, zone, state) {
    const intensity = state.gradientIntensity || 0.88;
    ctx.save();
    if (state.layout === 'bottom') {
      const startY = Math.max(0, zone.y - 80);
      const grad = ctx.createLinearGradient(0, startY, 0, H);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      grad.addColorStop(0.25, hexToRgba(state.gradientPrimary || '#00381c', 0.55 * intensity));
      grad.addColorStop(0.65, hexToRgba(state.gradientSecondary || '#008542', 0.85 * intensity));
      grad.addColorStop(1, hexToRgba(state.gradientDarkness || '#050c07', Math.min(intensity + 0.08, 1)));
      ctx.fillStyle = grad;
      ctx.fillRect(0, startY, W, H - startY);
    } else if (state.layout === 'top') {
      const endY = Math.min(H, zone.y + zone.h + 80);
      const grad = ctx.createLinearGradient(0, endY, 0, 0);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      grad.addColorStop(0.25, hexToRgba(state.gradientPrimary || '#00381c', 0.55 * intensity));
      grad.addColorStop(0.65, hexToRgba(state.gradientSecondary || '#008542', 0.85 * intensity));
      grad.addColorStop(1, hexToRgba(state.gradientDarkness || '#050c07', Math.min(intensity + 0.08, 1)));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, endY);
    } else if (state.layout === 'center') {
      const cx = W / 2;
      const cy = H / 2;
      const radius = Math.max(zone.w, zone.h) * 0.75;
      const radGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      radGrad.addColorStop(0, hexToRgba(state.gradientDarkness || '#050c07', 0.90 * intensity));
      radGrad.addColorStop(0.5, hexToRgba(state.gradientPrimary || '#00381c', 0.60 * intensity));
      radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, W, H);
    }
    ctx.restore();
  }

  drawGlassCardBackground(ctx, zone, state) {
    const opacity = (state.boxOpacity !== undefined ? state.boxOpacity : 0.95) * 0.45;
    const radius = state.cardRadius !== undefined ? state.cardRadius : 18;
    const pad = state.layout === 'center' ? (state.paddingSide !== undefined ? Math.min(state.paddingSide, 60) : 0) : (state.paddingSide !== undefined ? Math.min(state.paddingSide, 80) : 28);
    const rY = state.layout === 'top' ? zone.y + 28 : zone.y + 10;
    const rH = state.layout === 'center' ? zone.h : zone.h - 38;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 35;
    const grad = ctx.createLinearGradient(zone.x, zone.y, zone.x, zone.y + zone.h);
    grad.addColorStop(0, hexToRgba(state.gradientPrimary || '#00381c', opacity));
    grad.addColorStop(1, hexToRgba(state.gradientDarkness || '#050c07', Math.min(opacity + 0.2, 0.85)));
    ctx.fillStyle = grad;

    this.roundRect(ctx, zone.x + pad, rY, zone.w - pad * 2, rH, radius, true, false);
    ctx.shadowColor = 'transparent';

    ctx.strokeStyle = hexToRgba(state.colorCorners || '#d4af37', 0.45);
    ctx.lineWidth = 1.2;
    this.roundRect(ctx, zone.x + pad, rY, zone.w - pad * 2, rH, radius, false, true);
    ctx.restore();
  }

  drawFramedCardBackground(ctx, zone, state) {
    const radius = state.cardRadius !== undefined ? state.cardRadius : 16;
    const pad = state.layout === 'center' ? (state.paddingSide !== undefined ? Math.min(state.paddingSide, 60) : 0) : (state.paddingSide !== undefined ? Math.min(state.paddingSide, 80) : 28);
    const rY = state.layout === 'top' ? zone.y + 28 : zone.y + 10;
    const rH = state.layout === 'center' ? zone.h : zone.h - 38;

    ctx.save();
    // Fundo translúcido sutil para contraste
    ctx.fillStyle = 'rgba(2, 9, 4, 0.28)';
    this.roundRect(ctx, zone.x + pad, rY, zone.w - pad * 2, rH, radius, true, false);

    // Moldura dupla fina dourada
    ctx.strokeStyle = hexToRgba(state.colorCorners || '#d4af37', 0.7);
    ctx.lineWidth = 1.6;
    this.roundRect(ctx, zone.x + pad, rY, zone.w - pad * 2, rH, radius, false, true);

    ctx.strokeStyle = hexToRgba(state.colorCorners || '#d4af37', 0.25);
    ctx.lineWidth = 0.8;
    this.roundRect(ctx, zone.x + pad + 6, rY + 6, zone.w - pad * 2 - 12, rH - 12, Math.max(radius - 4, 4), false, true);
    ctx.restore();
  }

  renderCalibratedBlocks(ctx, blocks, state) {
    const isSeparated = state.textCardStyle === 'separated';
    const isTransparent = state.textCardStyle === 'transparent' || state.textCardStyle === 'gradient';

    for (const b of blocks) {
      if (b.type === 'badge') {
        this.drawBadgePill(ctx, b.x, b.y, b.text, true, state);
      } else if (b.type === 'tag') {
        ctx.save();
        ctx.textAlign = b.align;
        ctx.fillStyle = b.color;
        ctx.font = b.font;
        ctx.letterSpacing = `${b.letterSpacing}px`;
        if (isTransparent) {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
          ctx.shadowBlur = 8;
        }
        ctx.fillText(b.text, b.x, b.y);
        ctx.restore();
      } else if (b.type === 'title') {
        ctx.save();
        ctx.font = b.font;
        ctx.letterSpacing = `${b.letterSpacing || 1}px`;

        if (isSeparated && b.lines && b.lines.length > 0) {
          const align = b.align || 'center';
          let maxW = 0;
          for (const l of b.lines) {
            const w = ctx.measureText(l).width;
            if (w > maxW) maxW = w;
          }
          const boxW = Math.min(maxW + 48, (state.width || 1080) - 60);
          const boxH = b.lines.length * b.lineHeight + 16;
          const boxX = align === 'left' ? b.x - 16 : (align === 'right' ? b.x - boxW + 16 : b.x - boxW / 2);
          const boxY = b.y - b.size * 0.85;

          ctx.shadowColor = 'rgba(0,0,0,0.6)';
          ctx.shadowBlur = 18;
          ctx.fillStyle = hexToRgba(state.gradientDarkness || '#050c07', 0.82);
          this.roundRect(ctx, boxX, boxY, boxW, boxH, 12, true, false);
          ctx.shadowColor = 'transparent';

          ctx.strokeStyle = hexToRgba(state.colorCorners || '#d4af37', 0.45);
          ctx.lineWidth = 1;
          this.roundRect(ctx, boxX, boxY, boxW, boxH, 12, false, true);
        }

        ctx.textAlign = b.align;
        ctx.fillStyle = b.color;
        if (b.glow > 0) {
          ctx.shadowColor = b.glowColor;
          ctx.shadowBlur = b.glow;
        } else if (isTransparent) {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
          ctx.shadowBlur = 10;
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
        ctx.font = b.font;
        ctx.letterSpacing = `${b.letterSpacing !== undefined ? b.letterSpacing : 0}px`;

        if (isSeparated && b.lines && b.lines.length > 0) {
          const align = b.align || 'center';
          let maxW = 0;
          for (const l of b.lines) {
            const w = ctx.measureText(l).width;
            if (w > maxW) maxW = w;
          }
          const boxW = Math.min(maxW + 32, (state.width || 1080) - 70);
          const boxH = b.lines.length * b.lineHeight + 12;
          const boxX = align === 'left' ? b.x - 12 : (align === 'right' ? b.x - boxW + 12 : b.x - boxW / 2);
          const boxY = b.y - b.size * 0.85;

          ctx.fillStyle = hexToRgba(state.gradientPrimary || '#00381c', 0.72);
          this.roundRect(ctx, boxX, boxY, boxW, boxH, 8, true, false);
          ctx.strokeStyle = hexToRgba(state.colorCorners || '#d4af37', 0.3);
          ctx.lineWidth = 0.8;
          this.roundRect(ctx, boxX, boxY, boxW, boxH, 8, false, true);
        }

        ctx.textAlign = b.align;
        ctx.fillStyle = b.color;
        if (isTransparent) {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
          ctx.shadowBlur = 8;
        }
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
        ctx.font = b.font;

        if (isSeparated && b.lines && b.lines.length > 0) {
          const align = b.align || 'center';
          let maxW = 0;
          for (const l of b.lines) {
            const w = ctx.measureText(l).width;
            if (w > maxW) maxW = w;
          }
          const boxW = Math.min(maxW + 36, (state.width || 1080) - 60);
          const boxH = b.lines.length * b.lineHeight + 16;
          const boxX = align === 'left' ? b.x - 14 : (align === 'right' ? b.x - boxW + 14 : b.x - boxW / 2);
          const boxY = b.y - b.size * 0.85;

          ctx.fillStyle = hexToRgba(state.gradientDarkness || '#050c07', 0.78);
          this.roundRect(ctx, boxX, boxY, boxW, boxH, 10, true, false);
          ctx.strokeStyle = hexToRgba(state.colorCorners || '#d4af37', 0.35);
          ctx.lineWidth = 0.8;
          this.roundRect(ctx, boxX, boxY, boxW, boxH, 10, false, true);
        }

        ctx.textAlign = b.align;
        ctx.fillStyle = b.color;
        if (isTransparent) {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
          ctx.shadowBlur = 6;
        }
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
        if (isTransparent) {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
          ctx.shadowBlur = 8;
        }
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
