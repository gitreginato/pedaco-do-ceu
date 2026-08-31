// Classe Base para Camadas de Renderização - Pedaço do Céu Studio v2.0
export class BaseLayer {
  constructor(name, zIndex = 0) {
    this.name = name;
    this.zIndex = zIndex;
    this.visible = true;
    this.dirty = true;
  }

  markDirty() {
    this.dirty = true;
  }

  render(ctx, width, height, state) {
    if (!this.visible) return;
    this.draw(ctx, width, height, state);
    this.dirty = false;
  }

  draw(ctx, width, height, state) {
    // Implementado nas subclasses
  }
}
