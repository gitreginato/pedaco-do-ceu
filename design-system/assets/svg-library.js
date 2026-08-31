/**
 * SVG LIBRARY: PEDAÇO DO CÉU
 * Geometria Sagrada, Ornamentos Barrocos, Filigranas e Símbolos da Marca
 */

const SVGLibrary = {
  // Símbolo Oficial da Marca: Lua Crescente com 3 Estrelas
  brandLogo: (size = 120, color = "#d4af37") => `
    <svg width="${size}" height="${size}" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="glow-logo" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <path d="M100 15 C145 15 180 52 180 100 C180 148 145 185 100 185 C85 185 71 181 58 174 C90 162 118 133 118 100 C118 67 90 38 58 26 C71 19 85 15 100 15 Z" 
            fill="${color}" filter="url(#glow-logo)"/>
      <polygon points="76,46 79,56 90,56 81,62 84,72 76,66 68,72 71,62 62,56 73,56" fill="${color}"/>
      <polygon points="102,90 105,100 116,100 107,106 110,116 102,110 94,116 97,106 88,100 99,100" fill="${color}"/>
      <polygon points="76,134 79,144 90,144 81,150 84,160 76,154 68,160 71,150 62,144 73,144" fill="${color}"/>
    </svg>
  `,

  // Flor da Vida (Geometria Sagrada)
  flowerOfLife: (size = 400, color = "rgba(212, 175, 55, 0.35)") => {
    const R = 45;
    const cx = 200;
    const cy = 200;
    let circles = '';
    
    circles += `<circle cx="${cx}" cy="${cy}" r="${R}" stroke="${color}" stroke-width="1.5" fill="none"/>`;
    
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60) * (Math.PI / 180);
      const x = cx + R * Math.cos(angle);
      const y = cy + R * Math.sin(angle);
      circles += `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${R}" stroke="${color}" stroke-width="1.2" fill="none"/>`;
    }
    
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60) * (Math.PI / 180);
      const x = cx + 2 * R * Math.cos(angle);
      const y = cy + 2 * R * Math.sin(angle);
      circles += `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${R}" stroke="${color}" stroke-width="1" fill="none"/>`;
      
      const angle2 = (i * 60 + 30) * (Math.PI / 180);
      const dist = Math.sqrt(3) * R;
      const x2 = cx + dist * Math.cos(angle2);
      const y2 = cy + dist * Math.sin(angle2);
      circles += `<circle cx="${x2.toFixed(2)}" cy="${y2.toFixed(2)}" r="${R}" stroke="${color}" stroke-width="1" fill="none"/>`;
    }
    
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="200" cy="200" r="145" stroke="${color}" stroke-width="2" stroke-dasharray="4 2" fill="none"/>
        <circle cx="200" cy="200" r="150" stroke="${color}" stroke-width="1" fill="none"/>
        ${circles}
      </svg>
    `;
  },

  // Cubo de Metatron (Proteção & Arcanjo Miguel)
  metatronCube: (size = 400, color = "rgba(212, 175, 55, 0.4)") => {
    const cx = 200;
    const cy = 200;
    const rSmall = 80;
    const rBig = 150;
    
    let nodes = [{x: cx, y: cy}];
    for (let i = 0; i < 6; i++) {
      const a = (i * 60 - 30) * (Math.PI / 180);
      nodes.push({ x: cx + rSmall * Math.cos(a), y: cy + rSmall * Math.sin(a) });
      nodes.push({ x: cx + rBig * Math.cos(a), y: cy + rBig * Math.sin(a) });
    }
    
    let lines = '';
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        lines += `<line x1="${nodes[i].x.toFixed(1)}" y1="${nodes[i].y.toFixed(1)}" x2="${nodes[j].x.toFixed(1)}" y2="${nodes[j].y.toFixed(1)}" stroke="${color}" stroke-width="0.8"/>`;
      }
    }
    
    let nodeCircles = nodes.map(n => `<circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="18" stroke="${color}" stroke-width="1.2" fill="none"/>`).join('');

    return `
      <svg width="${size}" height="${size}" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="200" cy="200" r="185" stroke="${color}" stroke-width="1.5" stroke-dasharray="6 4" fill="none"/>
        ${lines}
        ${nodeCircles}
      </svg>
    `;
  },

  // Sri Yantra (Abundância & Meditação Sagrada)
  sriYantra: (size = 400, color = "rgba(212, 175, 55, 0.4)") => `
    <svg width="${size}" height="${size}" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="25" width="350" height="350" stroke="${color}" stroke-width="1.5" fill="none"/>
      <rect x="40" y="40" width="320" height="320" stroke="${color}" stroke-width="1" fill="none"/>
      <circle cx="200" cy="200" r="145" stroke="${color}" stroke-width="1.5" fill="none"/>
      <circle cx="200" cy="200" r="135" stroke="${color}" stroke-width="1" stroke-dasharray="3 3" fill="none"/>
      <polygon points="200,80 310,290 90,290" stroke="${color}" stroke-width="1.5" fill="none"/>
      <polygon points="200,320 310,110 90,110" stroke="${color}" stroke-width="1.5" fill="none"/>
      <polygon points="200,105 285,270 115,270" stroke="${color}" stroke-width="1.2" fill="none"/>
      <polygon points="200,295 285,130 115,130" stroke="${color}" stroke-width="1.2" fill="none"/>
      <polygon points="200,135 260,250 140,250" stroke="${color}" stroke-width="1" fill="none"/>
      <polygon points="200,265 260,150 140,150" stroke="${color}" stroke-width="1" fill="none"/>
      <circle cx="200" cy="200" r="4" fill="${color}"/>
    </svg>
  `,

  // Mandala Lunar & Fases da Lua
  lunarMandala: (size = 400, color = "rgba(212, 175, 55, 0.4)") => `
    <svg width="${size}" height="${size}" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="200" cy="200" r="170" stroke="${color}" stroke-width="1.5" fill="none"/>
      <circle cx="200" cy="200" r="160" stroke="${color}" stroke-width="1" stroke-dasharray="4 4" fill="none"/>
      <circle cx="200" cy="200" r="120" stroke="${color}" stroke-width="1.2" fill="none"/>
      <circle cx="200" cy="200" r="60" stroke="${color}" stroke-width="1.5" fill="none"/>
      <line x1="200" y1="30" x2="200" y2="370" stroke="${color}" stroke-width="1" stroke-dasharray="2 4"/>
      <line x1="30" y1="200" x2="370" y2="200" stroke="${color}" stroke-width="1" stroke-dasharray="2 4"/>
      <circle cx="200" cy="48" r="12" fill="${color}"/>
      <polygon points="200,180 206,194 220,200 206,206 200,220 194,206 180,200 194,194" fill="${color}"/>
    </svg>
  `
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SVGLibrary;
}
