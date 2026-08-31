// Renderizador Principal e Orquestrador de Camadas - Pedaço do Céu Studio v2.0
import { HighDPICanvas } from './high-dpi.js';
import { GradientLayer } from './layers/gradient-layer.js';
import { ImageLayer } from './layers/image-layer.js';
import { PatternLayer } from './layers/pattern-layer.js';
import { OverlayLayer } from './layers/overlay-layer.js';
import { TextLayer } from './layers/text-layer.js';
import { CornersLayer } from './layers/corners-layer.js';
import { SAFE_AREAS } from './layout-engine.js';

export class Renderer {
  constructor(canvasElement, store) {
    this.canvasElement = canvasElement;
    this.store = store;
    this.highDPICanvas = new HighDPICanvas(canvasElement, store.state.width || 1080, store.state.height || 1080);
    
    // Instancia as camadas modulares ordenadas por zIndex
    this.layers = [
      new GradientLayer(),
      new ImageLayer(),
      new PatternLayer(),
      new OverlayLayer(),
      new TextLayer(),
      new CornersLayer()
    ];
    this.layers.sort((a, b) => a.zIndex - b.zIndex);

    this.rafId = null;
    this.snappingGuide = null; // Para guias WYSIWYG
    
    // Inscreve no Store para renderizar quando o estado mudar
    this.store.subscribe((prop) => {
      if (prop === 'width' || prop === 'height' || prop === 'format') {
        this.highDPICanvas.resize(this.store.state.width, this.store.state.height);
      }
      this.markAllDirty();
      this.requestRender();
    });
  }

  markAllDirty() {
    this.layers.forEach(l => l.markDirty());
  }

  requestRender() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(() => this.render());
  }

  render() {
    const ctx = this.highDPICanvas.getContext();
    if (!ctx) return;

    const width = this.store.state.width || 1080;
    const height = this.store.state.height || 1080;
    const state = this.store.state;

    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // Renderiza cada camada na ordem correta
    for (const layer of this.layers) {
      layer.render(ctx, width, height, state);
    }

    // Desenha linhas guia de Safe Area se ativado
    if (state.showSafeAreaGuide) {
      this.drawSafeAreaGuide(ctx, width, height, state);
    }

    // Desenha linhas guia magnéticas (snapping) se houver arrasto ativo
    if (this.snappingGuide) {
      this.drawSnappingGuide(ctx, width, height, this.snappingGuide);
    }

    ctx.restore();
  }

  drawSafeAreaGuide(ctx, W, H, state) {
    const safe = SAFE_AREAS[state.format] || SAFE_AREAS['1:1'];

    ctx.save();
    ctx.strokeStyle = 'rgba(245, 215, 127, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([8, 6]);

    // Linha Top Safe
    ctx.beginPath();
    ctx.moveTo(0, safe.top);
    ctx.lineTo(W, safe.top);
    ctx.stroke();

    // Linha Bottom Safe
    ctx.beginPath();
    ctx.moveTo(0, H - safe.bottom);
    ctx.lineTo(W, H - safe.bottom);
    ctx.stroke();

    // Linhas Laterais
    ctx.beginPath();
    ctx.moveTo(safe.left, 0);
    ctx.lineTo(safe.left, H);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(W - safe.right, 0);
    ctx.lineTo(W - safe.right, H);
    ctx.stroke();

    // Legenda discreta
    ctx.fillStyle = 'rgba(245, 215, 127, 0.7)';
    ctx.font = '500 12px "Montserrat", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Safe Area (${state.format})`, safe.left + 10, safe.top > 40 ? safe.top - 8 : safe.top + 18);

    ctx.restore();
  }

  setSnappingGuide(guide) {
    this.snappingGuide = guide;
    this.requestRender();
  }

  drawSnappingGuide(ctx, W, H, guide) {
    ctx.save();
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 6]);

    if (guide.type === 'vertical') {
      ctx.beginPath();
      ctx.moveTo(guide.x, 0);
      ctx.lineTo(guide.x, H);
      ctx.stroke();
    } else if (guide.type === 'horizontal') {
      ctx.beginPath();
      ctx.moveTo(0, guide.y);
      ctx.lineTo(W, guide.y);
      ctx.stroke();
    }
    ctx.restore();
  }

  getTextLayer() {
    return this.layers.find(l => l.name === 'text');
  }

  exportImage(filename = 'pedaco-do-ceu-post.png') {
    const dataUrl = this.highDPICanvas.getExportDataURL('image/png', 1.0);
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (link.parentNode) link.parentNode.removeChild(link);
    }, 100);
  }
}
