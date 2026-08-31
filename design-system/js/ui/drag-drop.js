// Interação WYSIWYG Drag-and-Drop & Pan no Canvas - Pedaço do Céu Studio v2.0
import { SnappingManager } from './snapping.js';

export class CanvasDragDrop {
  constructor(canvasElement, renderer, store) {
    this.canvas = canvasElement;
    this.renderer = renderer;
    this.store = store;
    this.snapper = new SnappingManager(15);

    this.isDragging = false;
    this.dragMode = null; // 'text' | 'image'
    this.dragTarget = null;
    this.startPointer = { x: 0, y: 0 };
    this.initialPaddingTop = 100;
    this.initialPaddingSide = 20;
    this.initialPanX = 0;
    this.initialPanY = 0;

    this.initEvents();
  }

  initEvents() {
    this.canvas.addEventListener('pointerdown', this.onPointerDown.bind(this));
    window.addEventListener('pointermove', this.onPointerMove.bind(this));
    window.addEventListener('pointerup', this.onPointerUp.bind(this));
    window.addEventListener('pointercancel', this.onPointerUp.bind(this));
    this.canvas.addEventListener('wheel', this.onWheel.bind(this), { passive: false });
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
    
    // 1. Hit-testing nas caixas de texto
    let hit = null;
    if (textLayer && textLayer.boundingBoxes) {
      hit = textLayer.boundingBoxes.find(b => 
        coords.x >= b.x && coords.x <= b.x + b.w &&
        coords.y >= b.y && coords.y <= b.y + b.h
      );
    }

    this.isDragging = true;
    this.startPointer = coords;

    if (hit) {
      this.dragMode = 'text';
      this.dragTarget = hit;
      this.initialPaddingTop = this.store.state.paddingTop || 90;
      this.initialPaddingSide = this.store.state.paddingSide || 60;
      this.canvas.style.cursor = 'grabbing';
    } else {
      // 2. Arrastar/Mover Fotografia (Pan X / Pan Y)
      this.dragMode = 'image';
      this.dragTarget = null;
      this.initialPanX = this.store.state.imgPanX || 0;
      this.initialPanY = this.store.state.imgPanY || 0;
      this.canvas.style.cursor = 'move';
    }
  }

  onPointerMove(e) {
    if (!this.isDragging) {
      // Atualiza cursor de hover contextual
      const coords = this.getCanvasCoordinates(e);
      const textLayer = this.renderer.getTextLayer();
      if (textLayer && textLayer.boundingBoxes) {
        const hoverText = textLayer.boundingBoxes.some(b => 
          coords.x >= b.x && coords.x <= b.x + b.w &&
          coords.y >= b.y && coords.y <= b.y + b.h
        );
        this.canvas.style.cursor = hoverText ? 'grab' : (this.store.state.imgObj ? 'move' : 'default');
      }
      return;
    }

    const coords = this.getCanvasCoordinates(e);
    const deltaX = coords.x - this.startPointer.x;
    const deltaY = coords.y - this.startPointer.y;

    if (this.dragMode === 'text') {
      const W = this.store.state.width || 1080;
      const H = this.store.state.height || 1080;

      let newTop = Math.max(20, Math.min(220, this.initialPaddingTop + deltaY));
      let newSide = Math.max(10, Math.min(120, this.initialPaddingSide - deltaX));

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

    } else if (this.dragMode === 'image') {
      // Movimento suave da Foto
      let newPanX = Math.round(Math.max(-400, Math.min(400, this.initialPanX + deltaX)));
      let newPanY = Math.round(Math.max(-400, Math.min(400, this.initialPanY + deltaY)));

      this.store.state.imgPanX = newPanX;
      this.store.state.imgPanY = newPanY;

      // Sincroniza sliders da UI de Pan
      const panXSlider = document.getElementById('imgPanXRange');
      const panXVal = document.getElementById('imgPanXVal');
      if (panXSlider) panXSlider.value = newPanX;
      if (panXVal) panXVal.textContent = newPanX + 'px';

      const panYSlider = document.getElementById('imgPanYRange');
      const panYVal = document.getElementById('imgPanYVal');
      if (panYSlider) panYSlider.value = newPanY;
      if (panYVal) panYVal.textContent = newPanY + 'px';
    }
  }

  onWheel(e) {
    if (!this.store.state.imgObj) return;
    e.preventDefault();

    const zoomStep = e.deltaY < 0 ? 0.05 : -0.05;
    let currentZoom = this.store.state.imgZoom || 1.0;
    let newZoom = Math.max(0.8, Math.min(2.5, currentZoom + zoomStep));
    newZoom = Math.round(newZoom * 100) / 100;

    this.store.state.imgZoom = newZoom;

    const zoomSlider = document.getElementById('imgZoomRange');
    const zoomVal = document.getElementById('imgZoomVal');
    if (zoomSlider) zoomSlider.value = Math.round(newZoom * 100);
    if (zoomVal) zoomVal.textContent = newZoom.toFixed(1) + 'x';
  }

  onPointerUp() {
    if (this.isDragging) {
      this.isDragging = false;
      this.dragMode = null;
      this.dragTarget = null;
      this.renderer.setSnappingGuide(null);
      this.canvas.style.cursor = 'default';
    }
  }
}

