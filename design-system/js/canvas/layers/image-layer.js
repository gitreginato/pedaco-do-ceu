// Camada de Renderização da Foto do Produto - Pedaço do Céu Studio v2.0
import { BaseLayer } from './base.js';
import { hexToRgba } from '../../tokens.js';
import { calculateZones, LAYOUT_CONFIG } from '../layout-engine.js';

export class ImageLayer extends BaseLayer {
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
    const flipH = state.imgFlipH || false;
    const flipV = state.imgFlipV || false;

    if (imgRatio > targetRatio) {
      renderH = h * zoom;
      renderW = h * imgRatio * zoom;
    } else {
      renderW = w * zoom;
      renderH = (w / imgRatio) * zoom;
    }
    offsetX = x + (w - renderW) / 2 + panX;
    offsetY = y + (h - renderH) / 2 + panY;

    if (flipH || flipV) {
      ctx.save();
      const cx = x + w / 2;
      const cy = y + h / 2;
      ctx.translate(cx, cy);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.translate(-cx, -cy);
      ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
      ctx.restore();
    } else {
      ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
    }
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
