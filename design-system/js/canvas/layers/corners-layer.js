// Camada de Cantoneiras Barrocas Sagradas - Pedaço do Céu Studio v2.0
import { BaseLayer } from './base.js';

export class CornersLayer extends BaseLayer {
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
