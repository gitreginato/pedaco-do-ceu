// Camada de Gradient Overlay Intermediário - Pedaço do Céu Studio v2.0
import { BaseLayer } from './base.js';
import { calculateZones, renderGradientOverlay, LAYOUT_CONFIG } from '../layout-engine.js';

export class OverlayLayer extends BaseLayer {
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
