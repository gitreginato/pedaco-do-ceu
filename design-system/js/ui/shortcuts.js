// Gerenciador de Atalhos de Teclado - Pedaço do Céu Studio v2.0
export class ShortcutManager {
  constructor(store, renderer, onResetCallback) {
    this.store = store;
    this.renderer = renderer;
    this.onReset = onResetCallback;
    this.initEvents();
  }

  initEvents() {
    window.addEventListener('keydown', (e) => {
      // Ignora atalhos se o foco estiver digitando em um input ou textarea
      const target = e.target;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT';

      const isCtrl = e.ctrlKey || e.metaKey;

      // Undo: Ctrl+Z (não em inputs de texto para não conflitar com undo nativo do input)
      if (isCtrl && !e.shiftKey && e.key.toLowerCase() === 'z') {
        if (!isInput) {
          e.preventDefault();
          this.store.undo();
        }
      }

      // Redo: Ctrl+Shift+Z ou Ctrl+Y
      if ((isCtrl && e.shiftKey && e.key.toLowerCase() === 'z') || (isCtrl && e.key.toLowerCase() === 'y')) {
        if (!isInput) {
          e.preventDefault();
          this.store.redo();
        }
      }

      // Exportar PNG: Ctrl+E
      if (isCtrl && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        const cleanTitle = (this.store.state.title || 'post')
          .toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]/g, '-');
        this.renderer.exportImage(`pedaco-do-ceu-${this.store.state.format}-${cleanTitle}.png`);
      }
    });
  }
}
