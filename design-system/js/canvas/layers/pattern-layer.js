// Camada de Geometria Sagrada Vetorial Procedural em Alta Definição - Pedaço do Céu Studio v2.0
import { BaseLayer } from './base.js';

export class PatternLayer extends BaseLayer {
  constructor() {
    super('pattern', 30);
  }

  draw(ctx, width, height, state) {
    const patternKey = state.sacredPattern;
    if (!patternKey || patternKey === 'none') return;

    let cx = width / 2;
    let cy = height / 2;
    let radius = Math.min(width, height) * 0.38;

    if (state.layout === 'right') {
      const splitX = Math.round(width * 0.60);
      cx = splitX + (width - splitX) / 2;
      cy = height / 2;
      radius = (width - splitX) * 0.48;
    } else if (state.layout === 'left') {
      const splitX = Math.round(width * 0.40);
      cx = splitX / 2;
      cy = height / 2;
      radius = splitX * 0.48;
    } else if (state.layout === 'bottom') {
      const cardH = state.format.startsWith('9:16') ? Math.round(height * 0.40) : Math.round(height * 0.44);
      cx = width / 2;
      cy = height - cardH / 2;
      radius = Math.min(width * 0.35, cardH * 0.42);
    } else if (state.layout === 'top') {
      const barH = Math.round(height * 0.38);
      cx = width / 2;
      cy = barH / 2;
      radius = barH * 0.45;
    } else if (state.layout === 'center') {
      const cardW = Math.min(width * 0.86, 740);
      cx = width / 2;
      cy = height / 2;
      radius = cardW * 0.38;
    }

    const strokeColor = state.colorPattern || state.colorDividers || '#d4af37';
    const opacity = state.patternOpacity !== undefined ? state.patternOpacity : 0.35;
    if (opacity <= 0.01) return;

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = strokeColor;
    ctx.lineWidth = 1.2;
    ctx.shadowColor = strokeColor;
    ctx.shadowBlur = 6;

    switch (patternKey) {
      case 'flowerOfLife':
        this.drawFlowerOfLife(ctx, cx, cy, radius);
        break;
      case 'metatronCube':
        this.drawMetatronCube(ctx, cx, cy, radius);
        break;
      case 'sriYantra':
        this.drawSriYantra(ctx, cx, cy, radius);
        break;
      case 'lunarMandala':
        this.drawLunarMandala(ctx, cx, cy, radius);
        break;
      case 'logoPattern':
        this.drawLogoPattern(ctx, cx, cy, radius);
        break;
      case 'seedOfLife':
        this.drawSeedOfLife(ctx, cx, cy, radius);
        break;
      case 'merkaba':
        this.drawMerkaba(ctx, cx, cy, radius);
        break;
      case 'torus':
        this.drawTorus(ctx, cx, cy, radius);
        break;
      default:
        this.drawFlowerOfLife(ctx, cx, cy, radius);
    }

    ctx.restore();
  }

  // 1. Flor da Vida (Flower of Life)
  drawFlowerOfLife(ctx, cx, cy, R) {
    const step = R * 0.32;

    // Círculos externos de contenção
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.arc(cx, cy, R * 1.04, 0, Math.PI * 2);
    ctx.stroke();

    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.96, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Círculo central
    ctx.beginPath();
    ctx.arc(cx, cy, step, 0, Math.PI * 2);
    ctx.stroke();

    // Primeiro anel (6 círculos)
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60) * (Math.PI / 180);
      const x = cx + step * Math.cos(angle);
      const y = cy + step * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(x, y, step, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Segundo anel (12 círculos)
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60) * (Math.PI / 180);
      const x = cx + 2 * step * Math.cos(angle);
      const y = cy + 2 * step * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(x, y, step, 0, Math.PI * 2);
      ctx.stroke();

      const angle2 = (i * 60 + 30) * (Math.PI / 180);
      const dist = Math.sqrt(3) * step;
      const x2 = cx + dist * Math.cos(angle2);
      const y2 = cy + dist * Math.sin(angle2);
      ctx.beginPath();
      ctx.arc(x2, y2, step, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // 2. Cubo de Metatron (Metatron's Cube)
  drawMetatronCube(ctx, cx, cy, R) {
    const nodes = [];
    const rNode = R * 0.12;

    // Centro
    nodes.push({ x: cx, y: cy });

    // 6 nós internos
    const rInner = R * 0.45;
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60 - 30) * (Math.PI / 180);
      nodes.push({ x: cx + rInner * Math.cos(angle), y: cy + rInner * Math.sin(angle) });
    }

    // 6 nós externos
    const rOuter = R * 0.85;
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60 - 30) * (Math.PI / 180);
      nodes.push({ x: cx + rOuter * Math.cos(angle), y: cy + rOuter * Math.sin(angle) });
    }

    // 78 linhas de conexão completas entre todos os 13 centros esféricos
    ctx.save();
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
      }
    }
    ctx.stroke();
    ctx.restore();

    // 13 Círculos nos nós
    ctx.save();
    ctx.lineWidth = 1.4;
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, rNode, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.restore();

    // Anel externo delimitador
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.arc(cx, cy, R * 1.04, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 3. Sri Yantra Sagrado
  drawSriYantra(ctx, cx, cy, R) {
    // Moldura externa Bhupura (Portal dos 4 Portões)
    const bSize = R * 0.98;
    ctx.strokeRect(cx - bSize, cy - bSize, bSize * 2, bSize * 2);
    ctx.strokeRect(cx - bSize * 0.95, cy - bSize * 0.95, bSize * 1.9, bSize * 1.9);

    // Círculos concêntricos e anéis de pétalas de lótus
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.88, 0, Math.PI * 2);
    ctx.arc(cx, cy, R * 0.82, 0, Math.PI * 2);
    ctx.stroke();

    // Anel de 16 Pétalas Externas
    for (let i = 0; i < 16; i++) {
      const angle = (i * 22.5) * (Math.PI / 180);
      const px = cx + R * 0.85 * Math.cos(angle);
      const py = cy + R * 0.85 * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(px, py, R * 0.08, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Anel de 8 Pétalas Internas
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.68, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 8; i++) {
      const angle = (i * 45) * (Math.PI / 180);
      const px = cx + R * 0.68 * Math.cos(angle);
      const py = cy + R * 0.68 * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(px, py, R * 0.10, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 9 Triângulos Entrelaçados (4 apontando para cima, 5 para baixo)
    const drawTri = (topY, bottomY, leftX, rightX, pointUp) => {
      ctx.beginPath();
      if (pointUp) {
        ctx.moveTo(cx, topY);
        ctx.lineTo(rightX, bottomY);
        ctx.lineTo(leftX, bottomY);
      } else {
        ctx.moveTo(cx, bottomY);
        ctx.lineTo(rightX, topY);
        ctx.lineTo(leftX, topY);
      }
      ctx.closePath();
      ctx.stroke();
    };

    const s = R * 0.55;
    drawTri(cy - s * 0.95, cy + s * 0.70, cx - s * 0.85, cx + s * 0.85, true);
    drawTri(cy - s * 0.65, cy + s * 0.95, cx - s * 0.82, cx + s * 0.82, false);
    drawTri(cy - s * 0.80, cy + s * 0.50, cx - s * 0.70, cx + s * 0.70, true);
    drawTri(cy - s * 0.45, cy + s * 0.80, cx - s * 0.68, cx + s * 0.68, false);
    drawTri(cy - s * 0.60, cy + s * 0.35, cx - s * 0.55, cx + s * 0.55, true);
    drawTri(cy - s * 0.30, cy + s * 0.60, cx - s * 0.52, cx + s * 0.52, false);
    drawTri(cy - s * 0.40, cy + s * 0.20, cx - s * 0.38, cx + s * 0.38, true);
    drawTri(cy - s * 0.15, cy + s * 0.42, cx - s * 0.36, cx + s * 0.36, false);
    drawTri(cy - s * 0.05, cy + s * 0.25, cx - s * 0.22, cx + s * 0.22, false);

    // Bindu Central (Ponto Sagrado de Consciência Cósmica)
    ctx.beginPath();
    ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // 4. Mandala Lunar & Estelar Cósmica
  drawLunarMandala(ctx, cx, cy, R) {
    // Anéis concêntricos orbitais
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.98, 0, Math.PI * 2);
    ctx.arc(cx, cy, R * 0.92, 0, Math.PI * 2);
    ctx.arc(cx, cy, R * 0.65, 0, Math.PI * 2);
    ctx.arc(cx, cy, R * 0.38, 0, Math.PI * 2);
    ctx.stroke();

    // 24 Raios Solares/Estelares Radiantes
    for (let i = 0; i < 24; i++) {
      const angle = (i * 15) * (Math.PI / 180);
      const isMajor = i % 2 === 0;
      const r1 = isMajor ? R * 0.68 : R * 0.74;
      const r2 = isMajor ? R * 0.90 : R * 0.88;
      ctx.beginPath();
      ctx.moveTo(cx + r1 * Math.cos(angle), cy + r1 * Math.sin(angle));
      ctx.lineTo(cx + r2 * Math.cos(angle), cy + r2 * Math.sin(angle));
      ctx.stroke();
    }

    // 8 Fases Lunares distribuídas na órbita
    for (let i = 0; i < 8; i++) {
      const angle = (i * 45) * (Math.PI / 180);
      const lx = cx + R * 0.52 * Math.cos(angle);
      const ly = cy + R * 0.52 * Math.sin(angle);
      const moonR = R * 0.07;

      ctx.beginPath();
      ctx.arc(lx, ly, moonR, 0, Math.PI * 2);
      ctx.stroke();

      // Crescente interna estilizada
      if (i % 2 !== 0) {
        ctx.beginPath();
        ctx.arc(lx + moonR * 0.35, ly, moonR * 0.85, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();
      }
    }

    // Estrela de 12 Pontas no Núcleo
    this.drawStar(ctx, cx, cy, 12, R * 0.28, R * 0.14);
  }

  // 5. Símbolo da Marca Pedaço do Céu (Lua + 3 Estrelas)
  drawLogoPattern(ctx, cx, cy, R) {
    // Anel externo com filigranas
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.98, 0, Math.PI * 2);
    ctx.arc(cx, cy, R * 0.94, 0, Math.PI * 2);
    ctx.stroke();

    // 36 Raios de luz estelar em 360 graus
    for (let i = 0; i < 36; i++) {
      const angle = (i * 10) * (Math.PI / 180);
      const r1 = (i % 3 === 0) ? R * 0.80 : R * 0.86;
      const r2 = R * 0.92;
      ctx.beginPath();
      ctx.moveTo(cx + r1 * Math.cos(angle), cy + r1 * Math.sin(angle));
      ctx.lineTo(cx + r2 * Math.cos(angle), cy + r2 * Math.sin(angle));
      ctx.stroke();
    }

    // Lua Crescente Central
    ctx.save();
    ctx.beginPath();
    const moonR = R * 0.48;
    ctx.arc(cx - moonR * 0.1, cy, moonR, -Math.PI * 0.65, Math.PI * 0.65, false);
    ctx.arc(cx + moonR * 0.35, cy, moonR * 0.82, Math.PI * 0.55, -Math.PI * 0.55, true);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 3 Estrelas Sagradas de 8 Pontas
    this.drawStar(ctx, cx + R * 0.22, cy - R * 0.26, 8, R * 0.12, R * 0.05, true);
    this.drawStar(ctx, cx + R * 0.35, cy, 8, R * 0.15, R * 0.06, true);
    this.drawStar(ctx, cx + R * 0.22, cy + R * 0.26, 8, R * 0.12, R * 0.05, true);
  }

  // 6. Semente da Vida (Seed of Life)
  drawSeedOfLife(ctx, cx, cy, R) {
    const step = R * 0.45;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.arc(cx, cy, R * 1.05, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, step, 0, Math.PI * 2);
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60) * (Math.PI / 180);
      ctx.arc(cx + step * Math.cos(angle), cy + step * Math.sin(angle), step, 0, Math.PI * 2);
    }
    ctx.stroke();
  }

  // 7. Veículo de Luz Merkaba
  drawMerkaba(ctx, cx, cy, R) {
    this.drawStar(ctx, cx, cy, 6, R * 0.85, R * 0.45);
    this.drawStar(ctx, cx, cy, 6, R * 0.65, R * 0.32);

    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.95, 0, Math.PI * 2);
    ctx.arc(cx, cy, R * 0.22, 0, Math.PI * 2);
    ctx.stroke();

    // Linhas de facetas tridimensionais
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60) * (Math.PI / 180);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + R * 0.85 * Math.cos(angle), cy + R * 0.85 * Math.sin(angle));
      ctx.stroke();
    }
  }

  // 8. Toro Cósmico (Torus Energy Field)
  drawTorus(ctx, cx, cy, R) {
    const rings = 12;
    for (let i = 0; i < rings; i++) {
      const angle = (i * (360 / rings)) * (Math.PI / 180);
      const ox = cx + (R * 0.35) * Math.cos(angle);
      const oy = cy + (R * 0.35) * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(ox, oy, R * 0.55, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.95, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Helper para desenhar estrelas de N pontas
  drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, fill = false) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    if (fill) ctx.fill();
    ctx.stroke();
  }
}
