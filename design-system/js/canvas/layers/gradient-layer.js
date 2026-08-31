// Camada de Fundo & Degradê Místico em 3 Pontos - Pedaço do Céu Studio v2.0
import { BaseLayer } from './base.js';
import { hexToRgba } from '../../tokens.js';

export class GradientLayer extends BaseLayer {
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
