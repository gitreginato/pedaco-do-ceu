// Camada de Geometria Sagrada Vetorial - Pedaço do Céu Studio v2.0
import { BaseLayer } from './base.js';

export class PatternLayer extends BaseLayer {
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
