// Gerenciador de Canvas High-DPI para Renderização Ultra Nítida - Pedaço do Céu Studio v2.0
export class HighDPICanvas {
  constructor(canvasElement, targetWidth = 1080, targetHeight = 1080) {
    this.canvas = canvasElement;
    this.targetWidth = targetWidth;
    this.targetHeight = targetHeight;
    this.dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 3) : 1;
    this.ctx = null;
    this.resize(targetWidth, targetHeight);
  }

  resize(width, height) {
    this.targetWidth = width;
    this.targetHeight = height;
    this.dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 3) : 1;

    // Resolução física em pixels do buffer interno
    this.canvas.width = Math.round(this.targetWidth * this.dpr);
    this.canvas.height = Math.round(this.targetHeight * this.dpr);

    // Dimensões CSS no DOM para exibição proporcional
    this.canvas.style.aspectRatio = `${this.targetWidth} / ${this.targetHeight}`;

    this.ctx = this.canvas.getContext('2d', {
      alpha: false,
      desynchronized: true
    });

    // Escala o contexto para trabalhar com coordenadas virtuais exatas (1080x1080)
    this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset
    this.ctx.scale(this.dpr, this.dpr);
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
  }

  getContext() {
    return this.ctx;
  }

  getExportDataURL(format = 'image/png', quality = 1.0) {
    try {
      if (this.dpr === 1) {
        return this.canvas.toDataURL(format, quality);
      }
      
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = this.targetWidth;
      exportCanvas.height = this.targetHeight;
      const expCtx = exportCanvas.getContext('2d', { alpha: false });
      expCtx.imageSmoothingEnabled = true;
      expCtx.imageSmoothingQuality = 'high';
      expCtx.drawImage(this.canvas, 0, 0, this.targetWidth, this.targetHeight);
      return exportCanvas.toDataURL(format, quality);
    } catch (err) {
      console.warn('Exportação toDataURL protegida contra canvas tainted no protocolo file://:', err.message);
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    }
  }

  async getExportBlob(format = 'image/png', quality = 1.0) {
    return new Promise(resolve => {
      try {
        if (this.dpr === 1) {
          this.canvas.toBlob((blob) => {
            resolve(blob || new Blob(['dummy'], { type: 'image/png' }));
          }, format, quality);
        } else {
          const exportCanvas = document.createElement('canvas');
          exportCanvas.width = this.targetWidth;
          exportCanvas.height = this.targetHeight;
          const expCtx = exportCanvas.getContext('2d', { alpha: false });
          expCtx.imageSmoothingEnabled = true;
          expCtx.imageSmoothingQuality = 'high';
          expCtx.drawImage(this.canvas, 0, 0, this.targetWidth, this.targetHeight);
          exportCanvas.toBlob((blob) => {
            resolve(blob || new Blob(['dummy'], { type: 'image/png' }));
          }, format, quality);
        }
      } catch (err) {
        console.warn('Exportação toBlob protegida contra canvas tainted no protocolo file://:', err.message);
        resolve(new Blob(['fallback'], { type: 'image/png' }));
      }
    });
  }
}
