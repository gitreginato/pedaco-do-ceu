// Interação WYSIWYG Drag-and-Drop no Canvas - Pedaço do Céu Studio v2.0
import { SnappingManager } from './snapping.js';

export class CanvasDragDrop {
  constructor(canvasElement, renderer, store) {
    this.canvas = canvasElement;
    this.renderer = renderer;
    this.store = store;
    this.snapper = new SnappingManager(15);

    this.isDragging = false;
    this.dragTarget = null;
    this.startPointer = { x: 0, y: 0 };
    this.initialPaddingTop = 100;
    this.initialPaddingSide = 20;

    this.initEvents();
  }

  initEvents() {
    this.canvas.addEventListener('pointerdown', this.onPointerDown.bind(this));
    window.addEventListener('pointermove', this.onPointerMove.bind(this));
    window.addEventListener('pointerup', this.onPointerUp.bind(this));
    window.addEventListener('pointercancel', this.onPointerUp.bind(this));
  }

  getCanvasCoordinates(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = (this.store.state.width || 1080) / rect.width;
    const scaleY = (this.store.state.height || 1080) / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }

  onPointerDown(e) {
    const coords = this.getCanvasCoordinates(e);
    const textLayer = this.renderer.getTextLayer();
    if (!textLayer) return;

    // Hit-testing nas caixas de texto
    const hit = textLayer.boundingBoxes.find(b => 
      coords.x >= b.x && coords.x <= b.x + b.w &&
      coords.y >= b.y && coords.y <= b.y + b.h
    );

    if (hit) {
      this.isDragging = true;
      this.dragTarget = hit;
      this.startPointer = coords;
      this.initialPaddingTop = this.store.state.paddingTop || 100;
      this.initialPaddingSide = this.store.state.paddingSide || 20;
      this.canvas.classList.add('cursor-grabbing');
    }
  }

  onPointerMove(e) {
    if (!this.isDragging) {
      // Atualiza cursor de hover
      const coords = this.getCanvasCoordinates(e);
      const textLayer = this.renderer.getTextLayer();
      if (textLayer) {
        const hover = textLayer.boundingBoxes.some(b => 
          coords.x >= b.x && coords.x <= b.x + b.w &&
          coords.y >= b.y && coords.y <= b.y + b.h
        );
        this.canvas.style.cursor = hover ? 'grab' : 'default';
      }
      return;
    }

    const coords = this.getCanvasCoordinates(e);
    const deltaY = coords.y - this.startPointer.y;
    const deltaX = coords.x - this.startPointer.x;

    const W = this.store.state.width || 1080;
    const H = this.store.state.height || 1080;

    let newTop = Math.max(40, Math.min(220, this.initialPaddingTop + deltaY));
    let newSide = Math.max(10, Math.min(80, this.initialPaddingSide - deltaX));

    // Aplica snapping magnético
    const snapped = this.snapper.applySnapping(coords.x, newTop, W, H);
    this.renderer.setSnappingGuide(snapped.guide);

    this.store.state.paddingTop = Math.round(snapped.y);
    this.store.state.paddingSide = Math.round(newSide);

    // Sincroniza sliders da UI
    const topSlider = document.getElementById('paddingTopRange');
    const topVal = document.getElementById('paddingTopVal');
    if (topSlider) topSlider.value = this.store.state.paddingTop;
    if (topVal) topVal.textContent = this.store.state.paddingTop + 'px';

    const sideSlider = document.getElementById('paddingSideRange');
    const sideVal = document.getElementById('paddingSideVal');
    if (sideSlider) sideSlider.value = this.store.state.paddingSide;
    if (sideVal) sideVal.textContent = this.store.state.paddingSide + 'px';
  }

  onPointerUp() {
    if (this.isDragging) {
      this.isDragging = false;
      this.dragTarget = null;
      this.renderer.setSnappingGuide(null);
      this.canvas.classList.remove('cursor-grabbing');
    }
  }
}
