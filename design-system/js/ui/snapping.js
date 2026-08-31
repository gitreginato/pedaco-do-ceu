// Guias de Alinhamento Magnético (Snapping) - Pedaço do Céu Studio v2.0
export class SnappingManager {
  constructor(threshold = 12) {
    this.threshold = threshold;
  }

  getSnapPoints(width, height) {
    return {
      vertical: [
        { x: width / 2, label: 'center-x' },
        { x: width * 0.333, label: 'third-left' },
        { x: width * 0.667, label: 'third-right' },
        { x: width * 0.618, label: 'golden-ratio-x' }
      ],
      horizontal: [
        { y: height / 2, label: 'center-y' },
        { y: height * 0.333, label: 'third-top' },
        { y: height * 0.667, label: 'third-bottom' }
      ]
    };
  }

  applySnapping(x, y, width, height) {
    const points = this.getSnapPoints(width, height);
    let snappedX = x;
    let snappedY = y;
    let activeGuide = null;

    // Snapping vertical
    for (const p of points.vertical) {
      if (Math.abs(x - p.x) <= this.threshold) {
        snappedX = p.x;
        activeGuide = { type: 'vertical', x: p.x };
        break;
      }
    }

    // Snapping horizontal
    for (const p of points.horizontal) {
      if (Math.abs(y - p.y) <= this.threshold) {
        snappedY = p.y;
        activeGuide = { type: 'horizontal', y: p.y };
        break;
      }
    }

    return { x: snappedX, y: snappedY, guide: activeGuide };
  }
}
