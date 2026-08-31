// Camada de Fundo & Degradê Cósmico Luxo com Luz Atmosférica e Poeira Estelar - Pedaço do Céu Studio v2.0
import { BaseLayer } from './base.js';
import { hexToRgba } from '../../tokens.js';

export class GradientLayer extends BaseLayer {
  constructor() {
    super('gradient', 10);
    // Gera partículas estelares fixas determinísticas (sem cintilação aleatória)
    this.stars = this.generateDeterministicStars(90);
  }

  generateDeterministicStars(count) {
    const stars = [];
    let seed = 432; // Frequência Sagrada 432Hz como seed
    const pseudoRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let i = 0; i < count; i++) {
      stars.push({
        xRatio: pseudoRandom(),
        yRatio: pseudoRandom(),
        radius: 0.6 + pseudoRandom() * 1.6,
        alpha: 0.15 + pseudoRandom() * 0.45,
        isCross: pseudoRandom() > 0.82
      });
    }
    return stars;
  }

  draw(ctx, width, height, state) {
    // 1. Imagem de Fundo Personalizada (se carregada pelo usuário)
    if (state.bgImageObj) {
      ctx.save();
      ctx.drawImage(state.bgImageObj, 0, 0, width, height);
      ctx.fillStyle = hexToRgba(state.gradientDarkness, 1 - (state.bgImageOpacity || 0.6));
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
      return;
    }

    const intensity = state.gradientIntensity || 0.88;
    const cPrimary = state.gradientPrimary || '#00381c';
    const cSecondary = state.gradientSecondary || '#008542';
    const cDarkness = state.gradientDarkness || '#050c07';
    const cGold = state.colorDividers || '#d4af37';

    // 2. Fundo Base Obsidian Profundo
    ctx.fillStyle = cDarkness;
    ctx.fillRect(0, 0, width, height);

    // 3. Degradê Atmosférico Radial Superior/Central (Nebulosa de Luz)
    const focalX = state.layout === 'right' ? width * 0.35 : (state.layout === 'left' ? width * 0.65 : width * 0.5);
    const focalY = state.layout === 'bottom' ? height * 0.35 : (state.layout === 'top' ? height * 0.65 : height * 0.45);
    const focalRadius = Math.max(width, height) * 0.85;

    const radialGrad = ctx.createRadialGradient(focalX, focalY, 20, focalX, focalY, focalRadius);
    radialGrad.addColorStop(0, hexToRgba(cSecondary, 0.95 * intensity));
    radialGrad.addColorStop(0.35, hexToRgba(cPrimary, 0.85 * intensity));
    radialGrad.addColorStop(0.75, hexToRgba(cDarkness, 0.92 * intensity));
    radialGrad.addColorStop(1, hexToRgba('#010402', 0.98));

    ctx.fillStyle = radialGrad;
    ctx.fillRect(0, 0, width, height);

    // 4. Feixe Celestial de Luz Superior (Luz Dourada Divina Descendente)
    const celestialBeam = ctx.createRadialGradient(width * 0.5, 0, 10, width * 0.5, 0, height * 0.7);
    celestialBeam.addColorStop(0, hexToRgba(cGold, 0.22 * intensity));
    celestialBeam.addColorStop(0.3, hexToRgba(cSecondary, 0.12 * intensity));
    celestialBeam.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
    celestialBeam.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = celestialBeam;
    ctx.fillRect(0, 0, width, height);

    // 5. Vinheta e Profundidade nos Cantos (Aveludado Místico)
    const cornerVignette = ctx.createRadialGradient(width / 2, height / 2, Math.min(width, height) * 0.45, width / 2, height / 2, Math.max(width, height) * 0.75);
    cornerVignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    cornerVignette.addColorStop(0.6, 'rgba(0, 0, 0, 0.25)');
    cornerVignette.addColorStop(1, 'rgba(0, 0, 0, 0.75)');

    ctx.fillStyle = cornerVignette;
    ctx.fillRect(0, 0, width, height);

    // 6. Poeira Cósmica & Faíscas Estelares Sagradas (Stardust Particles)
    ctx.save();
    this.stars.forEach(star => {
      const sx = star.xRatio * width;
      const sy = star.yRatio * height;
      ctx.fillStyle = hexToRgba(cGold, star.alpha * intensity * 0.85);

      if (star.isCross) {
        // Micro-estrela em cruz (+)
        ctx.strokeStyle = hexToRgba(cGold, star.alpha * intensity * 0.9);
        ctx.lineWidth = 0.8;
        const len = star.radius * 2.2;
        ctx.beginPath();
        ctx.moveTo(sx - len, sy);
        ctx.lineTo(sx + len, sy);
        ctx.moveTo(sx, sy - len);
        ctx.lineTo(sx, sy + len);
        ctx.stroke();
      } else {
        // Partícula pontual
        ctx.beginPath();
        ctx.arc(sx, sy, star.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    ctx.restore();
  }
}

