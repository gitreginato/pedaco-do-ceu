// Tokens JS Compartilhados com o Canvas e CSS - Pedaço do Céu Studio v2.0 Enterprise
export const TOKENS = {
  colors: {
    sacredGold: '#d4af37',
    sacredGoldLight: '#f5d77f',
    sacredGoldBright: '#ffd700',
    sacredGoldDark: '#8c7322',
    mysticGreen: '#00381c',
    mysticGreenMid: '#008542',
    mysticGreenDeep: '#001f0f',
    mysticDarkness: '#050c07',
    obsidian: '#020503',
    textPrimary: '#f8f9fa',
    textSecondary: '#eadcb9',
    parchment: '#eadcb9',
  },
  fonts: {
    displayNoble: "'Cinzel Decorative', 'Cinzel', serif",
    serifClassic: "'Cinzel', serif",
    imperial: "'Marcellus', serif",
    editorial: "'Playfair Display', serif",
    hauteCouture: "'Bodoni Moda', serif",
    avantGarde: "'Syne', sans-serif",
    mystic: "'Cormorant Garamond', serif",
    renaissance: "'EB Garamond', serif",
    gothic: "'UnifrakturMaguntia', cursive",
    italianScript: "'Fondamento', cursive",
    runic: "'MedievalSharp', cursive",
    script: "'Great Vibes', 'Alex Brush', cursive",
    sansClean: "'Montserrat', sans-serif",
  },
  dimensions: {
    '1:1': { width: 1080, height: 1080, label: '1080 x 1080px (Feed 1:1)' },
    '4:5': { width: 1080, height: 1350, label: '1080 x 1350px (Feed 4:5)' },
    '9:16-story': { width: 1080, height: 1920, label: '1080 x 1920px (Stories)' },
    '9:16-tiktok': { width: 1080, height: 1920, label: '1080 x 1920px (TikTok)' },
  }
};

export const DESIGN_PRESETS = {
  cristal: {
    name: 'Ativação Cristalina',
    gradientPrimary: '#00381c',
    gradientSecondary: '#008542',
    gradientDarkness: '#050c07',
    colorTitle: '#f8f9fa',
    colorTitleGlow: '#d4af37',
    colorSubtitle: '#eadcb9',
    colorHighlight: '#f5d77f',
    colorHighlightBorder: '#d4af37',
    sacredPattern: 'flowerOfLife',
    fitMode: 'portal',
    fontTitle: "'Cinzel Decorative', serif",
    fontSubtitle: "'Cormorant Garamond', serif"
  },
  tibete: {
    name: 'Prece do Tibete & Nepal',
    gradientPrimary: '#140a03',
    gradientSecondary: '#241407',
    gradientDarkness: '#080401',
    colorTitle: '#ffffff',
    colorTitleGlow: '#f5d77f',
    colorSubtitle: '#f5d77f',
    colorHighlight: '#f5d77f',
    colorHighlightBorder: '#d4af37',
    sacredPattern: 'sriYantra',
    fitMode: 'portal',
    fontTitle: "'Cinzel', serif",
    fontSubtitle: "'Playfair Display', serif"
  },
  lunar: {
    name: 'Mandala Lunar 432Hz',
    gradientPrimary: '#051329',
    gradientSecondary: '#0d284f',
    gradientDarkness: '#020612',
    colorTitle: '#ffffff',
    colorTitleGlow: '#64b5f6',
    colorSubtitle: '#b0bec5',
    colorHighlight: '#90caf9',
    colorHighlightBorder: '#64b5f6',
    sacredPattern: 'lunarMandala',
    fitMode: 'fusion',
    fontTitle: "'Marcellus', serif",
    fontSubtitle: "'Playfair Display', serif"
  },
  arcanjos: {
    name: 'Portal dos Arcanjos',
    gradientPrimary: '#1a0033',
    gradientSecondary: '#3d0066',
    gradientDarkness: '#0a0014',
    colorTitle: '#f8f9fa',
    colorTitleGlow: '#ffd700',
    colorSubtitle: '#e1bee7',
    colorHighlight: '#ffd700',
    colorHighlightBorder: '#ba68c8',
    sacredPattern: 'metatronCube',
    fitMode: 'portal',
    fontTitle: "'Cinzel', serif",
    fontSubtitle: "'EB Garamond', serif"
  },
  ancestral: {
    name: 'Sabedoria Ancestral',
    gradientPrimary: '#1b2612',
    gradientSecondary: '#384d20',
    gradientDarkness: '#080c05',
    colorTitle: '#fffdf5',
    colorTitleGlow: '#ffb300',
    colorSubtitle: '#d7ccc8',
    colorHighlight: '#ffe082',
    colorHighlightBorder: '#ffb300',
    sacredPattern: 'sriYantra',
    fitMode: 'cover',
    fontTitle: "'Bodoni Moda', serif",
    fontSubtitle: "'Cormorant Garamond', serif"
  },
  chama: {
    name: 'Chama Trina Sagrada',
    gradientPrimary: '#3a0007',
    gradientSecondary: '#6b0513',
    gradientDarkness: '#140003',
    colorTitle: '#ffffff',
    colorTitleGlow: '#f5d77f',
    colorSubtitle: '#ffcdd2',
    colorHighlight: '#ffd700',
    colorHighlightBorder: '#ef5350',
    sacredPattern: 'logoPattern',
    fitMode: 'portal',
    fontTitle: "'UnifrakturMaguntia', cursive",
    fontSubtitle: "'Fondamento', cursive"
  }
};

export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 31, b: 15 };
}

export function hexToRgba(hex, alpha = 1) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
