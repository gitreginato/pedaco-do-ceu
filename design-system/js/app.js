// Pedaço do Céu — Template Studio Místico & Sagrado v2.0 Enterprise
import { Store } from './state/store.js';
import { Renderer } from './canvas/renderer.js';
import { CanvasDragDrop } from './ui/drag-drop.js';
import { ShortcutManager } from './ui/shortcuts.js';
import { A11yManager } from './ui/a11y.js';
import { TOKENS, DESIGN_PRESETS } from './tokens.js';

// Catálogo Completo de Imagens do Acervo Real
export const PHOTO_CATALOG = [
  // Categoria: Bem-Estar & Cristais
  {
    id: 'be1',
    category: 'bem-estar',
    categoryLabel: '🌿 Bem-Estar & Cristais',
    src: '../Fotos/Bem Estar/Tratadas/IMG_20260828_160836341.jpg',
    title: 'CRISTAIS & BEM-ESTAR',
    subtitle: 'A Força Primordial das Rochas Sagradas',
    description: 'Purifique a energia do seu espaço com a força vibracional dos quartzos e ametistas. Peças brutas selecionadas para ancorar paz, clareza mental e cura interior.',
    categoryTag: 'CURA & HARMONIA',
    highlightText: '✦ Transmutação Energética & Paz',
    badgeText: 'Energia Pura',
    sacredPattern: 'flowerOfLife',
    gradientPrimary: '#00381c',
    gradientSecondary: '#008542',
    gradientDarkness: '#050c07',
    colorTitle: '#f8f9fa',
    colorSubtitle: '#eadcb9',
    colorDesc: '#f8f9fa',
    colorHighlight: '#f5d77f',
    colorHighlightBorder: '#d4af37',
    colorTag: '#d4af37',
    colorBadge: '#f5d77f',
    colorCta: '#d4af37',
    colorPattern: '#d4af37',
    colorCorners: '#d4af37',
    colorDividers: '#d4af37',
    fontTitle: "'Cinzel Decorative', serif",
    weightTitle: "700",
    sizeTitle: 54,
    spacingTitle: 1,
    glowTitle: 14,
    colorTitleGlow: '#d4af37',
    fontSubtitle: "'Cormorant Garamond', serif",
    styleSubtitle: "italic 500",
    sizeSubtitle: 26,
    sizeDesc: 18,
    lineHeightDesc: 1.6
  },
  {
    id: 'be2',
    category: 'bem-estar',
    categoryLabel: '🌿 Bem-Estar & Cristais',
    src: '../Fotos/Bem Estar/Tratadas/IMG_20260828_163415579.jpg',
    title: 'SABONETES FITOENERGÉTICOS',
    subtitle: 'Alquimia Sagrada das Ervas Medicinais',
    description: 'Banhos rituais que limpam a aura e renovam a vitalidade do corpo físico e sutil. Feito com extratos naturais puros e óleos essenciais de alta vibração.',
    categoryTag: 'RITUAL DIÁRIO',
    highlightText: '✦ Limpeza Áurica & Vitalidade Natural',
    badgeText: 'Ervas Sagradas',
    sacredPattern: 'flowerOfLife',
    gradientPrimary: '#002f18',
    gradientSecondary: '#007038',
    gradientDarkness: '#030d06',
    colorTitle: '#f8f9fa',
    colorSubtitle: '#eadcb9',
    colorDesc: '#f8f9fa',
    colorHighlight: '#f5d77f',
    colorHighlightBorder: '#d4af37',
    colorTag: '#d4af37',
    colorBadge: '#f5d77f',
    colorCta: '#d4af37',
    colorPattern: '#d4af37',
    colorCorners: '#d4af37',
    colorDividers: '#d4af37',
    fontTitle: "'Cinzel Decorative', serif",
    weightTitle: "700",
    sizeTitle: 54,
    spacingTitle: 1,
    glowTitle: 12,
    colorTitleGlow: '#d4af37',
    fontSubtitle: "'Cormorant Garamond', serif",
    styleSubtitle: "italic 500",
    sizeSubtitle: 26,
    sizeDesc: 18,
    lineHeightDesc: 1.6
  },
  {
    id: 'be3',
    category: 'bem-estar',
    categoryLabel: '🌿 Bem-Estar & Cristais',
    src: '../Fotos/Bem Estar/Tratadas/IMG_20260828_160836341.jpg',
    title: 'AROMATERAPIA SAGRADA',
    subtitle: 'Gotas de Luz e Conexão Espiritual',
    description: 'Velas aromáticas e óleos essenciais que elevam o padrão vibratório do seu ambiente. Crie um santuário de serenidade para seus momentos de oração e recolhimento.',
    categoryTag: 'SANTO SANTUÁRIO',
    highlightText: '✦ Frequência Vibracional Elevada',
    badgeText: 'Aromas da Alma',
    sacredPattern: 'sriYantra',
    gradientPrimary: '#1a1005',
    gradientSecondary: '#3d2508',
    gradientDarkness: '#0a0502',
    colorTitle: '#f5d77f',
    colorSubtitle: '#ffe0b2',
    colorDesc: '#fff3e0',
    colorHighlight: '#f5d77f',
    colorHighlightBorder: '#d4af37',
    colorTag: '#d4af37',
    colorBadge: '#f5d77f',
    colorCta: '#d4af37',
    colorPattern: '#f5d77f',
    colorCorners: '#f5d77f',
    colorDividers: '#f5d77f',
    fontTitle: "'Cinzel Decorative', serif",
    weightTitle: "700",
    sizeTitle: 54,
    spacingTitle: 2,
    glowTitle: 16,
    colorTitleGlow: '#f5d77f',
    fontSubtitle: "'Cormorant Garamond', serif",
    styleSubtitle: "italic 500",
    sizeSubtitle: 26,
    sizeDesc: 18,
    lineHeightDesc: 1.6
  },
  // Categoria: Arcanjo Miguel
  {
    id: 'am1',
    category: 'arcanjo',
    categoryLabel: '⚔️ Arcanjo Miguel',
    src: '../Fotos/Arcanjo Miguel/Tratadas/IMG_20260828_145751956_HDR.jpg',
    title: 'SÃO MIGUEL ARCANJO',
    subtitle: 'Príncipe da Luz e Guardião das Almas',
    description: 'Que a Espada Flamejante de São Miguel Arcanjo corte todos os laços energéticos negativos e sele o seu lar em uma abóbada de proteção divina e justiça celeste.',
    categoryTag: 'PROTEÇÃO DIVINA',
    highlightText: '✦ Espada de Luz • Corte de Laços Negativos',
    badgeText: 'Manto Azul',
    sacredPattern: 'metatronCube',
    gradientPrimary: '#001a33',
    gradientSecondary: '#003366',
    gradientDarkness: '#000814',
    colorTitle: '#64b5f6',
    colorSubtitle: '#e3f2fd',
    colorDesc: '#f8f9fa',
    colorHighlight: '#90caf9',
    colorHighlightBorder: '#64b5f6',
    colorTag: '#64b5f6',
    colorBadge: '#90caf9',
    colorCta: '#d4af37',
    colorPattern: '#64b5f6',
    colorCorners: '#f5d77f',
    colorDividers: '#90caf9',
    fontTitle: "'Cinzel Decorative', serif",
    weightTitle: "700",
    sizeTitle: 54,
    spacingTitle: 2,
    glowTitle: 18,
    colorTitleGlow: '#64b5f6',
    fontSubtitle: "'Cinzel', serif",
    styleSubtitle: "normal 600",
    sizeSubtitle: 26,
    sizeDesc: 18,
    lineHeightDesc: 1.6
  },
  {
    id: 'am2',
    category: 'arcanjo',
    categoryLabel: '⚔️ Arcanjo Miguel',
    src: '../Fotos/Arcanjo Miguel/Tratadas/IMG_20260828_145751956_HDR.jpg',
    title: 'DEFENSOR CELESTIAL',
    subtitle: 'Coragem, Fé e Vitória Espiritual',
    description: 'Invoque a presença do Príncipe da Milícia Celeste. Imagem esculpida com riqueza de detalhes para ancorar a energia da coragem e determinação no seu altar sagrado.',
    categoryTag: 'CHAMA AZUL',
    highlightText: '✦ Escudo de Fé Inabalável & Proteção',
    badgeText: 'Presença Divina',
    sacredPattern: 'metatronCube',
    gradientPrimary: '#002b16',
    gradientSecondary: '#006633',
    gradientDarkness: '#020d06',
    colorTitle: '#f8f9fa',
    colorSubtitle: '#90caf9',
    colorDesc: '#f8f9fa',
    colorHighlight: '#f5d77f',
    colorHighlightBorder: '#d4af37',
    colorTag: '#d4af37',
    colorBadge: '#f5d77f',
    colorCta: '#d4af37',
    colorPattern: '#d4af37',
    colorCorners: '#d4af37',
    colorDividers: '#d4af37',
    fontTitle: "'Cinzel Decorative', serif",
    weightTitle: "700",
    sizeTitle: 54,
    spacingTitle: 1,
    glowTitle: 14,
    colorTitleGlow: '#d4af37',
    fontSubtitle: "'Cormorant Garamond', serif",
    styleSubtitle: "italic 600",
    sizeSubtitle: 26,
    sizeDesc: 18,
    lineHeightDesc: 1.6
  },
  {
    id: 'am3',
    category: 'arcanjo',
    categoryLabel: '⚔️ Arcanjo Miguel',
    src: '../Fotos/Arcanjo Miguel/Tratadas/IMG_20260828_152249527_HDR.jpg',
    title: 'QUEBRA DE DEMANDAS',
    subtitle: 'Sob as Asas do Guardião Maior',
    description: 'Nenhuma força contrária prevalece diante do comando de São Miguel Arcanjo. Sinta a presença pacificadora e protetora que envolve seu espírito e sua família.',
    categoryTag: 'PROTEÇÃO MÁXIMA',
    highlightText: '✦ Corte de Amarras & Libertação Espiritual',
    badgeText: 'Escudo Sagrado',
    sacredPattern: 'metatronCube',
    gradientPrimary: '#081a2e',
    gradientSecondary: '#0e2e52',
    gradientDarkness: '#02060a',
    colorTitle: '#64b5f6',
    colorSubtitle: '#f8f9fa',
    colorDesc: '#e0e0e0',
    colorHighlight: '#90caf9',
    colorHighlightBorder: '#64b5f6',
    colorTag: '#d4af37',
    colorBadge: '#64b5f6',
    colorCta: '#d4af37',
    colorPattern: '#64b5f6',
    colorCorners: '#f5d77f',
    colorDividers: '#64b5f6',
    fontTitle: "'Cinzel Decorative', serif",
    weightTitle: "700",
    sizeTitle: 54,
    spacingTitle: 1,
    glowTitle: 16,
    colorTitleGlow: '#64b5f6',
    fontSubtitle: "'Cormorant Garamond', serif",
    styleSubtitle: "italic 500",
    sizeSubtitle: 26,
    sizeDesc: 18,
    lineHeightDesc: 1.6
  },
  // Categoria: Zodíaco
  {
    id: 'zod1',
    category: 'zodiaco',
    categoryLabel: '♈ Linha Zodíaco',
    src: '../Fotos/zodiaco/Tratadas/IMG_20260828_175142446_HDR.jpg',
    title: 'SABEDORIA DOS ASTROS',
    subtitle: 'A Vibração Cósmica do Seu Signo',
    description: 'Cada signo do zodíaco ressoa com elementos e pedras específicas. Alinhe a sua essência com a geometria celeste e fortaleça os seus dons naturais.',
    categoryTag: 'ASTROLOGIA VIVA',
    highlightText: '✦ Ressonância Planetária & Essência Astral',
    badgeText: 'Luz Celestial',
    sacredPattern: 'lunarMandala',
    gradientPrimary: '#1f0d2b',
    gradientSecondary: '#421d5c',
    gradientDarkness: '#08030b',
    colorTitle: '#ce93d8',
    colorSubtitle: '#f3e5f5',
    colorDesc: '#f8f9fa',
    colorHighlight: '#f5d77f',
    colorHighlightBorder: '#ba68c8',
    colorTag: '#ce93d8',
    colorBadge: '#f5d77f',
    colorCta: '#d4af37',
    colorPattern: '#ce93d8',
    colorCorners: '#f5d77f',
    colorDividers: '#ce93d8',
    fontTitle: "'Cinzel Decorative', serif",
    weightTitle: "700",
    sizeTitle: 54,
    spacingTitle: 2,
    glowTitle: 16,
    colorTitleGlow: '#ce93d8',
    fontSubtitle: "'Cormorant Garamond', serif",
    styleSubtitle: "italic 500",
    sizeSubtitle: 26,
    sizeDesc: 18,
    lineHeightDesc: 1.6
  },
  {
    id: 'zod2',
    category: 'zodiaco',
    categoryLabel: '♈ Linha Zodíaco',
    src: '../Fotos/zodiaco/Tratadas/IMG_20260828_175100702.jpg',
    title: 'MAPA ASTRAL & CRISTAIS',
    subtitle: 'Harmonização dos 4 Elementos Sagrados',
    description: 'Fogo, Terra, Ar e Água integrados no seu campo áurico. Cristais consagrados para equilibrar a sua carta natal e abrir caminhos de realização.',
    categoryTag: '4 ELEMENTOS',
    highlightText: '✦ Equilíbrio dos Chakras & Força Planetária',
    badgeText: 'Força Cósmica',
    sacredPattern: 'lunarMandala',
    gradientPrimary: '#14142b',
    gradientSecondary: '#292954',
    gradientDarkness: '#05050d',
    colorTitle: '#9fa8da',
    colorSubtitle: '#e8eaf6',
    colorDesc: '#f8f9fa',
    colorHighlight: '#f5d77f',
    colorHighlightBorder: '#7986cb',
    colorTag: '#9fa8da',
    colorBadge: '#f5d77f',
    colorCta: '#d4af37',
    colorPattern: '#9fa8da',
    colorCorners: '#f5d77f',
    colorDividers: '#9fa8da',
    fontTitle: "'Cinzel Decorative', serif",
    weightTitle: "700",
    sizeTitle: 54,
    spacingTitle: 1,
    glowTitle: 14,
    colorTitleGlow: '#9fa8da',
    fontSubtitle: "'Cormorant Garamond', serif",
    styleSubtitle: "italic 500",
    sizeSubtitle: 26,
    sizeDesc: 18,
    lineHeightDesc: 1.6
  },
  // Categoria: Kailash Aromas
  {
    id: 'kai1',
    category: 'kailash',
    categoryLabel: '🏔️ Kailash Aromas',
    src: '../Fotos/Kailash/Tratadas/IMG_20260828_173627904.jpg',
    title: 'AROMAS DE KAILASH',
    subtitle: 'A Pureza Mística das Altas Montanhas',
    description: 'Incensos artesanais de queima suave e longa duração. Cada aroma conduz a mente para estados meditativos elevados, dissipando cansaço mental e tensões.',
    categoryTag: 'DEFUMAÇÃO PURA',
    highlightText: '✦ Limpeza de Ambientes & Purificação',
    badgeText: 'Ervas Nobres',
    sacredPattern: 'flowerOfLife',
    gradientPrimary: '#1a1f0a',
    gradientSecondary: '#3b4717',
    gradientDarkness: '#060802',
    colorTitle: '#f8f9fa',
    colorSubtitle: '#dcedc8',
    colorDesc: '#f8f9fa',
    colorHighlight: '#f5d77f',
    colorHighlightBorder: '#aed581',
    colorTag: '#d4af37',
    colorBadge: '#f5d77f',
    colorCta: '#d4af37',
    colorPattern: '#d4af37',
    colorCorners: '#d4af37',
    colorDividers: '#d4af37',
    fontTitle: "'Cinzel Decorative', serif",
    weightTitle: "700",
    sizeTitle: 54,
    spacingTitle: 1,
    glowTitle: 12,
    colorTitleGlow: '#d4af37',
    fontSubtitle: "'Cormorant Garamond', serif",
    styleSubtitle: "italic 500",
    sizeSubtitle: 26,
    sizeDesc: 18,
    lineHeightDesc: 1.6
  },
  {
    id: 'kai2',
    category: 'kailash',
    categoryLabel: '🏔️ Kailash Aromas',
    src: '../Fotos/Kailash/Tratadas/IMG_20260828_174047079_HDR.jpg',
    title: 'ESSÊNCIA DOS HIMALAIS',
    subtitle: 'Onde a Fumaça Sobe, o Espírito se Eleva',
    description: 'Notas olfativas nobres extraídas da botânica sagrada para acalmar a mente agitada, facilitar a concentração na meditação e atrair boas energias.',
    categoryTag: 'BEM-ESTAR OLFATIVO',
    highlightText: '✦ Resinas Sagradas & Defumação Serena',
    badgeText: 'Alta Frequência',
    sacredPattern: 'flowerOfLife',
    gradientPrimary: '#002614',
    gradientSecondary: '#00592e',
    gradientDarkness: '#030805',
    colorTitle: '#f8f9fa',
    colorSubtitle: '#eadcb9',
    colorDesc: '#f8f9fa',
    colorHighlight: '#f5d77f',
    colorHighlightBorder: '#d4af37',
    colorTag: '#d4af37',
    colorBadge: '#f5d77f',
    colorCta: '#d4af37',
    colorPattern: '#d4af37',
    colorCorners: '#d4af37',
    colorDividers: '#d4af37',
    fontTitle: "'Cinzel Decorative', serif",
    weightTitle: "700",
    sizeTitle: 54,
    spacingTitle: 1,
    glowTitle: 10,
    colorTitleGlow: '#d4af37',
    fontSubtitle: "'Cormorant Garamond', serif",
    styleSubtitle: "italic 500",
    sizeSubtitle: 26,
    sizeDesc: 18,
    lineHeightDesc: 1.6
  },
  // Categoria: NOA Orixás
  {
    id: 'noa1',
    category: 'noa',
    categoryLabel: '✨ Linha NOA Orixás',
    src: '../Fotos/NOA/Tratadas/IMG_20260828_180047923.jpg',
    title: 'NOA ORIXÁS',
    subtitle: 'Força Vital, Axé e Ancestralidade',
    description: 'A natureza é a morada do sagrado. Conecte-se com as forças dos elementos e a sabedoria ancestral dos Orixás. Peças de respeito e devoção que acolhem a alma.',
    categoryTag: 'ANCESTRALIDADE',
    highlightText: '✦ Força dos Elementos • Axé & Proteção',
    badgeText: 'Axé & Luz',
    sacredPattern: 'none',
    gradientPrimary: '#002914',
    gradientSecondary: '#006b35',
    gradientDarkness: '#030b05',
    colorTitle: '#f8f9fa',
    colorSubtitle: '#eadcb9',
    colorDesc: '#f8f9fa',
    colorHighlight: '#f5d77f',
    colorHighlightBorder: '#d4af37',
    colorTag: '#d4af37',
    colorBadge: '#f5d77f',
    colorCta: '#d4af37',
    colorPattern: '#d4af37',
    colorCorners: '#d4af37',
    colorDividers: '#d4af37',
    fontTitle: "'Cinzel Decorative', serif",
    weightTitle: "700",
    sizeTitle: 54,
    spacingTitle: 2,
    glowTitle: 14,
    colorTitleGlow: '#d4af37',
    fontSubtitle: "'Cormorant Garamond', serif",
    styleSubtitle: "italic 500",
    sizeSubtitle: 26,
    sizeDesc: 18,
    lineHeightDesc: 1.6
  },
  // Categoria: Tibete & Homenagem Sagrada
  {
    id: 'tib_homenagem1',
    category: 'tibete',
    categoryLabel: '🕊️ Prece do Tibete (Lâmpada de Sal)',
    src: '../Fotos/TIbate/Tratadas/IMG_20260828_171759729.jpg',
    title: 'ORAÇÃO PELO TIBETE & NEPAL',
    subtitle: 'Em profunda reverência e união espiritual',
    description: 'Nossos corações e orações se voltam para os povos do Tibete e do Nepal, tocados pela recente tragédia nas montanhas sagradas. Que o poder de Karuna e a luz de Chenrezig abracem cada família, trazendo serenidade e força na reconstrução de seus lares.',
    categoryTag: '🕊️ HOMENAGEM & SOLIDARIEDADE',
    highlightText: '✦ OṂ MAṆI PADME HŪṂ ✦ Alívio, Amparo e Cura',
    badgeText: 'Prece Sagrada',
    ctaText: 'PEDAÇO DO CÉU • SOLIDARIEDADE & FÉ',
    sacredPattern: 'sriYantra',
    gradientPrimary: '#140a03',
    gradientSecondary: '#241407',
    gradientDarkness: '#080401',
    colorTitle: '#ffffff',
    colorSubtitle: '#f5d77f',
    colorDesc: '#ffffff',
    colorHighlight: '#f5d77f',
    colorHighlightBorder: '#d4af37',
    colorTag: '#f5d77f',
    colorBadge: '#f5d77f',
    colorCta: '#d4af37',
    colorPattern: '#d4af37',
    colorCorners: '#f5d77f',
    colorDividers: '#d4af37',
    fontTitle: "'Cinzel', serif",
    weightTitle: "900",
    sizeTitle: 44,
    spacingTitle: 2,
    glowTitle: 22,
    colorTitleGlow: '#f5d77f',
    fontSubtitle: "'Playfair Display', serif",
    styleSubtitle: "italic 700",
    sizeSubtitle: 24,
    fontDesc: "'Montserrat', sans-serif",
    sizeDesc: 20,
    lineHeightDesc: 1.6
  },
  {
    id: 'tib_homenagem2',
    category: 'tibete',
    categoryLabel: '🕊️ Prece do Tibete (Buda Solar)',
    src: '../Fotos/TIbate/Tratadas/IMG_20260828_172652877_HDR.jpg',
    title: 'LUZ DE CHENREZIG',
    subtitle: 'Compaixão Infinita e Amparo Divino',
    description: 'Que o sopro sagrado das bandeiras de oração espalhe paz pelos vales e eleve as almas que partiram em direção à luz divina. Em união espiritual por todas as famílias dos Himalaias.',
    categoryTag: '🕊️ PRECE PELOS HIMALAIAS',
    highlightText: '✦ KARUNA ✦ O Poder Infinito da Compaixão',
    badgeText: 'Solidariedade & Paz',
    ctaText: 'PEDAÇO DO CÉU • UNIÃO ESPIRITUAL',
    sacredPattern: 'sriYantra',
    gradientPrimary: '#1c0e04',
    gradientSecondary: '#381d09',
    gradientDarkness: '#080401',
    colorTitle: '#ffffff',
    colorSubtitle: '#f5d77f',
    colorDesc: '#ffffff',
    colorHighlight: '#f5d77f',
    colorHighlightBorder: '#d4af37',
    colorTag: '#f5d77f',
    colorBadge: '#f5d77f',
    colorCta: '#d4af37',
    colorPattern: '#d4af37',
    colorCorners: '#f5d77f',
    colorDividers: '#d4af37',
    fontTitle: "'Cinzel', serif",
    weightTitle: "900",
    sizeTitle: 44,
    spacingTitle: 2,
    glowTitle: 22,
    colorTitleGlow: '#f5d77f',
    fontSubtitle: "'Playfair Display', serif",
    styleSubtitle: "italic 700",
    sizeSubtitle: 24,
    fontDesc: "'Montserrat', sans-serif",
    sizeDesc: 20,
    lineHeightDesc: 1.6
  },
  {
    id: 'tib_homenagem3',
    category: 'tibete',
    categoryLabel: '🕊️ Prece do Tibete (Pirâmide de Sal)',
    src: '../Fotos/TIbate/Tratadas/IMG_20260828_165849966.jpg',
    title: 'RECONSTRUÇÃO & FÉ',
    subtitle: 'A Força Imutável das Montanhas Sagradas',
    description: 'Que o poder de Chenrezig abrace cada coração ferido. Que a serenidade dos mosteiros e a força das rochas sagradas sustentem a reconstrução de lares e vidas com coragem e esperança.',
    categoryTag: '🕊️ HOMENAGEM AO TIBETE',
    highlightText: '✦ OṂ MAṆI PADME HŪṂ ✦ Alívio, Amparo e Cura',
    badgeText: 'Esperança & Cura',
    ctaText: 'PEDAÇO DO CÉU • SOLIDARIEDADE & FÉ',
    sacredPattern: 'sriYantra',
    gradientPrimary: '#140a03',
    gradientSecondary: '#2a1607',
    gradientDarkness: '#080401',
    colorTitle: '#ffffff',
    colorSubtitle: '#f5d77f',
    colorDesc: '#ffffff',
    colorHighlight: '#f5d77f',
    colorHighlightBorder: '#d4af37',
    colorTag: '#f5d77f',
    colorBadge: '#f5d77f',
    colorCta: '#d4af37',
    colorPattern: '#d4af37',
    colorCorners: '#f5d77f',
    colorDividers: '#d4af37',
    fontTitle: "'Cinzel', serif",
    weightTitle: "900",
    sizeTitle: 44,
    spacingTitle: 2,
    glowTitle: 22,
    colorTitleGlow: '#f5d77f',
    fontSubtitle: "'Playfair Display', serif",
    styleSubtitle: "italic 700",
    sizeSubtitle: 24,
    fontDesc: "'Montserrat', sans-serif",
    sizeDesc: 20,
    lineHeightDesc: 1.6
  },
  {
    id: 'tib4_tacas',
    category: 'tibete',
    categoryLabel: '🧘 Tibete & Taças Sagradas',
    src: '../Fotos/TIbate/Tratadas/IMG_20260828_172439605_HDR.jpg',
    title: 'TAÇAS TIBETANAS',
    subtitle: 'A Cura Vibracional dos 7 Metais Sagrados',
    description: 'Forjadas à mão sob rituais ancestrais. As ondas sonoras em harmonia produzem frequências Alfa e Teta, alinhando os 7 chakras e dissipando bloqueios etéricos profundos.',
    categoryTag: 'CURA SONORA',
    highlightText: '✦ Frequência Harmônica 432Hz • 7 Metais',
    badgeText: 'Cura Vibracional',
    ctaText: 'PEDAÇO DO CÉU • HARMONIA & PAZ',
    sacredPattern: 'sriYantra',
    gradientPrimary: '#261a0e',
    gradientSecondary: '#52371d',
    gradientDarkness: '#0d0804',
    colorTitle: '#f5d77f',
    colorSubtitle: '#ffe0b2',
    colorDesc: '#fff3e0',
    colorHighlight: '#f5d77f',
    colorHighlightBorder: '#d4af37',
    colorTag: '#d4af37',
    colorBadge: '#f5d77f',
    colorCta: '#f5d77f',
    colorPattern: '#f5d77f',
    colorCorners: '#f5d77f',
    colorDividers: '#f5d77f',
    fontTitle: "'Cinzel Decorative', serif",
    weightTitle: "700",
    sizeTitle: 54,
    spacingTitle: 2,
    glowTitle: 18,
    colorTitleGlow: '#f5d77f',
    fontSubtitle: "'Cormorant Garamond', serif",
    styleSubtitle: "italic 500",
    sizeSubtitle: 26,
    fontDesc: "'Montserrat', sans-serif",
    sizeDesc: 18,
    lineHeightDesc: 1.6
  }
];

// Estado Inicial Padrão
const INITIAL_STATE = {
  format: '1:1',
  width: 1080,
  height: 1080,
  layout: 'right',
  align: 'center',
  fitMode: 'portal',

  imgSrc: PHOTO_CATALOG[0].src,
  imgObj: null,
  imgZoom: 1.0,
  imgPanX: 0,
  imgPanY: 0,
  imgFlipH: false,
  imgFlipV: false,

  bgImageSrc: null,
  bgImageObj: null,
  bgImageOpacity: 0.6,

  gradientPrimary: PHOTO_CATALOG[0].gradientPrimary,
  gradientSecondary: PHOTO_CATALOG[0].gradientSecondary,
  gradientDarkness: PHOTO_CATALOG[0].gradientDarkness,
  gradientIntensity: 0.88,

  categoryTag: PHOTO_CATALOG[0].categoryTag,
  title: PHOTO_CATALOG[0].title,
  subtitle: PHOTO_CATALOG[0].subtitle,
  description: PHOTO_CATALOG[0].description,
  highlightText: PHOTO_CATALOG[0].highlightText,
  showHighlightBox: true,
  ctaText: 'Visite nossa loja • Pedaço do Céu',
  badgeText: PHOTO_CATALOG[0].badgeText,

  fontTitle: PHOTO_CATALOG[0].fontTitle,
  weightTitle: PHOTO_CATALOG[0].weightTitle,
  sizeTitle: 54,
  spacingTitle: PHOTO_CATALOG[0].spacingTitle,
  glowTitle: PHOTO_CATALOG[0].glowTitle,
  colorTitleGlow: PHOTO_CATALOG[0].colorTitleGlow,

  fontSubtitle: PHOTO_CATALOG[0].fontSubtitle,
  styleSubtitle: PHOTO_CATALOG[0].styleSubtitle,
  sizeSubtitle: 26,

  fontDesc: "'Montserrat', sans-serif",
  sizeDesc: 18,
  lineHeightDesc: PHOTO_CATALOG[0].lineHeightDesc,

  colorTitle: PHOTO_CATALOG[0].colorTitle,
  colorSubtitle: PHOTO_CATALOG[0].colorSubtitle,
  colorDesc: PHOTO_CATALOG[0].colorDesc,
  colorHighlight: PHOTO_CATALOG[0].colorHighlight,
  colorHighlightBorder: PHOTO_CATALOG[0].colorHighlightBorder,
  colorTag: PHOTO_CATALOG[0].colorTag,
  colorBadge: PHOTO_CATALOG[0].colorBadge,
  colorCta: PHOTO_CATALOG[0].colorCta,
  colorPattern: PHOTO_CATALOG[0].colorPattern,
  colorCorners: PHOTO_CATALOG[0].colorCorners,
  colorDividers: PHOTO_CATALOG[0].colorDividers,

  sacredPattern: PHOTO_CATALOG[0].sacredPattern,
  patternOpacity: 0.35,

  showBaroqueCorners: true,
  showBadge: true,
  showSafeAreaGuide: false,

  paddingTop: 90,
  blockGap: 20,
  paddingSide: 60,
  globalLineGap: 12,

  sideBySideMode: false
};

// Classe Principal do Estúdio Místico
export class PedacoDoCeuStudio {
  constructor() {
    this.store = new Store(INITIAL_STATE);
    this.canvasEl = document.getElementById('renderCanvas');
    this.renderer = new Renderer(this.canvasEl, this.store);
    this.dragDrop = new CanvasDragDrop(this.canvasEl, this.renderer, this.store);
    this.shortcuts = new ShortcutManager(this.store, this.renderer, () => this.syncUI());
    this.a11y = new A11yManager();

    this.init();
  }

  init() {
    this.initPhotoGallery();
    this.bindEvents();
    this.syncUI();

    // Carrega a primeira foto
    this.loadImage(this.store.state.imgSrc, () => {
      this.renderer.requestRender();
    });

    // Atualiza status dos botões de Undo/Redo no Store
    this.store.subscribe(() => {
      this.updateUndoRedoButtons();
    });
  }

  updateUndoRedoButtons() {
    const btnUndo = document.getElementById('btnUndo');
    const btnRedo = document.getElementById('btnRedo');
    if (btnUndo) btnUndo.disabled = !this.store.canUndo();
    if (btnRedo) btnRedo.disabled = !this.store.canRedo();
  }

  loadImage(src, callback) {
    const img = new Image();
    img.onload = () => {
      this.store.state.imgObj = img;
      const orig = document.getElementById('originalPhotoImg');
      if (orig) orig.src = src;
      if (callback) callback();
    };
    img.onerror = () => {
      console.warn('Erro ao carregar imagem local, aplicando gerador sagrado:', src);
      this.store.state.imgObj = this.createFallbackImage();
      const orig = document.getElementById('originalPhotoImg');
      if (orig) orig.src = this.store.state.imgObj.toDataURL();
      if (callback) callback();
    };
    img.src = encodeURI(src);
  }

  createFallbackImage() {
    const c = document.createElement('canvas');
    c.width = 1000;
    c.height = 1000;
    const ctx = c.getContext('2d');
    
    // Fundo esmeralda profundo
    const g = ctx.createLinearGradient(0, 0, 1000, 1000);
    g.addColorStop(0, '#001f0f');
    g.addColorStop(0.5, '#004d25');
    g.addColorStop(1, '#00140a');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 1000, 1000);

    // Borda interna dourada
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, 940, 940);

    // Geometria mística central
    ctx.strokeStyle = '#f5d77f';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(500, 500, 260, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#f5d77f';
    ctx.font = '700 36px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.fillText('✦ PEDAÇO DO CÉU ✦', 500, 480);

    ctx.font = 'italic 500 24px "Cormorant Garamond", serif';
    ctx.fillText('Espaço Artes • Sagrado & Místico', 500, 530);

    return c;
  }

  initPhotoGallery() {
    const galleryEl = document.getElementById('photoGallery');
    if (!galleryEl) return;

    galleryEl.innerHTML = '';
    PHOTO_CATALOG.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = `gallery-thumb-item ${this.store.state.imgSrc === item.src ? 'active' : ''}`;
      card.setAttribute('data-id', item.id);
      card.innerHTML = `
        <img src="${item.src}" alt="${item.title}" loading="lazy" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'80\\' height=\\'80\\' fill=\\'%2300381c\\'><rect width=\\'100%\\' height=\\'100%\\'/><text x=\\'50%\\' y=\\'50%\\' fill=\\'%23d4af37\\' font-family=\\'serif\\' font-size=\\'12\\' text-anchor=\\'middle\\' dy=\\'.3em\\'>✦ Peça ${idx+1}</text></svg>'">
        <div class="thumb-info">
          <span class="thumb-title">${item.title}</span>
          <span class="thumb-category">${item.categoryLabel}</span>
        </div>
      `;
      card.addEventListener('click', () => {
        document.querySelectorAll('.gallery-thumb-item').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        this.applyCatalogItem(item);
      });
      galleryEl.appendChild(card);
    });
  }

  applyCatalogItem(item) {
    Object.keys(item).forEach(key => {
      if (key !== 'id' && key !== 'categoryLabel') {
        this.store.state[key] = item[key];
      }
    });
    this.store.state.imgSrc = item.src;
    this.syncUI();
    this.loadImage(item.src, () => {
      this.renderer.requestRender();
    });
  }

  applyPreset(presetKey) {
    const p = DESIGN_PRESETS[presetKey];
    if (!p) return;

    Object.keys(p).forEach(k => {
      if (k !== 'name') {
        this.store.state[k] = p[k];
      }
    });
    this.syncUI();
    this.renderer.requestRender();
    A11yManager.announce(`Preset ${p.name} aplicado com sucesso!`);
  }

  updateGradientLivePreview() {
    const previewEl = document.getElementById('gradientLivePreview');
    if (!previewEl) return;
    const s = this.store.state;
    previewEl.style.background = `linear-gradient(135deg, ${s.gradientPrimary || '#00381c'}, ${s.gradientSecondary || '#008542'}, ${s.gradientDarkness || '#050c07'})`;
  }

  bindEvents() {
    // Tabs Navigation
    document.querySelectorAll('.tabs-nav .tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tabs-nav .tab-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
          b.setAttribute('tabindex', '-1');
        });
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        btn.setAttribute('tabindex', '0');

        const targetId = btn.getAttribute('data-target');
        const targetPane = document.getElementById(targetId);
        if (targetPane) targetPane.classList.add('active');
      });
    });

    // Presets Grid
    document.querySelectorAll('#presetsGrid .preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#presetsGrid .preset-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const presetKey = btn.getAttribute('data-preset');
        this.applyPreset(presetKey);
      });
    });

    // Bind Helpers
    const bindInput = (id, prop, isNum = false) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          this.store.state[prop] = isNum ? parseFloat(e.target.value) : e.target.value;
          const valEl = document.getElementById(id.replace('Range', 'Val'));
          if (valEl) valEl.textContent = e.target.value + (id.includes('lineHeight') ? 'x' : 'px');
          if (prop.startsWith('gradient')) this.updateGradientLivePreview();
        });
      }
    };

    // Textos e Cores
    ['title', 'subtitle', 'description', 'categoryTag', 'highlightText', 'ctaText', 'badgeText'].forEach(key => {
      let id = key + 'Input';
      if (key === 'categoryTag') id = 'categoryTagInput';
      if (key === 'highlightText') id = 'highlightInput';
      if (key === 'ctaText') id = 'ctaInput';
      if (key === 'badgeText') id = 'badgeInput';
      bindInput(id, key);
    });

    const colors = [
      'colorTitle', 'colorTitleGlow', 'colorSubtitle', 'colorDesc', 'colorHighlight',
      'colorHighlightBorder', 'colorTag', 'colorBadge', 'colorCta', 'colorPattern',
      'colorCorners', 'colorDividers', 'gradientPrimary', 'gradientSecondary', 'gradientDarkness'
    ];
    colors.forEach(key => bindInput(key + 'Input', key));

    // Sliders de Tipografia com tamanhos ampliados
    bindInput('sizeTitleRange', 'sizeTitle', true);
    bindInput('spacingTitleRange', 'spacingTitle', true);
    bindInput('glowTitleRange', 'glowTitle', true);
    bindInput('sizeSubtitleRange', 'sizeSubtitle', true);
    bindInput('sizeDescRange', 'sizeDesc', true);
    bindInput('paddingTopRange', 'paddingTop', true);
    bindInput('blockGapRange', 'blockGap', true);
    bindInput('paddingSideRange', 'paddingSide', true);
    bindInput('globalLineGapRange', 'globalLineGap', true);

    const lhRange = document.getElementById('lineHeightDescRange');
    if (lhRange) {
      lhRange.addEventListener('input', (e) => {
        this.store.state.lineHeightDesc = parseFloat(e.target.value) / 10;
        const lhVal = document.getElementById('lineHeightDescVal');
        if (lhVal) lhVal.textContent = this.store.state.lineHeightDesc.toFixed(1) + 'x';
      });
    }

    // Selects de Família de Fonte Expandidos
    ['fontTitleSelect', 'weightTitleSelect', 'fontSubtitleSelect', 'styleSubtitleSelect', 'fontDescSelect', 'sacredPatternSelect'].forEach(id => {
      const el = document.getElementById(id);
      const prop = id.replace('Select', '');
      if (el) el.addEventListener('change', (e) => { 
        this.store.state[prop] = e.target.value; 
        this.renderer.requestRender();
        // Garante que se a fonte web não foi baixada, ele força e re-renderiza
        if (prop.includes('font') || prop.includes('fontTitle')) {
          const fontStr = e.target.value.replace(/'/g, '');
          if (document.fonts) {
            document.fonts.load(`16px ${fontStr}`).then(() => this.renderer.requestRender());
          }
        }
      });
    });

    // Enquadramento
    document.querySelectorAll('[data-fit]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-fit]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.store.state.fitMode = btn.getAttribute('data-fit');
      });
    });

    // Alinhamento
    document.querySelectorAll('[data-align]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-align]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.store.state.align = btn.getAttribute('data-align');
      });
    });

    // Formato
    document.querySelectorAll('[data-format]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-format]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.setFormat(btn.getAttribute('data-format'));
      });
    });

    // Layout
    document.querySelectorAll('[data-layout]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-layout]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.store.state.layout = btn.getAttribute('data-layout');
      });
    });

    // Modo Split
    document.querySelectorAll('[data-view-mode]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-view-mode]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.getAttribute('data-view-mode');
        const photoCard = document.getElementById('originalPhotoCard');
        if (photoCard) {
          if (mode === 'split') {
            photoCard.classList.add('show');
            this.store.state.sideBySideMode = true;
          } else {
            photoCard.classList.remove('show');
            this.store.state.sideBySideMode = false;
          }
        }
      });
    });

    // Sliders de Foto
    const bindRangeHelper = (id, prop, transformFn, valId, unit = '') => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          this.store.state[prop] = transformFn(parseFloat(e.target.value));
          const disp = document.getElementById(valId);
          if (disp) disp.textContent = (this.store.state[prop] * (unit === 'x' ? 1 : 1)).toFixed(unit === 'x' ? 1 : 0) + unit;
        });
      }
    };
    bindRangeHelper('imgZoomRange', 'imgZoom', v => v / 100, 'imgZoomVal', 'x');
    bindRangeHelper('imgPanXRange', 'imgPanX', v => v, 'imgPanXVal', 'px');
    bindRangeHelper('imgPanYRange', 'imgPanY', v => v, 'imgPanYVal', 'px');
    bindRangeHelper('patternOpacityRange', 'patternOpacity', v => v / 100, 'patternOpacityVal', '%');
    bindRangeHelper('boxOpacityRange', 'boxOpacity', v => v / 100, 'boxOpacityVal', '%');
    bindRangeHelper('gradientIntensityRange', 'gradientIntensity', v => v / 100, 'gradientIntensityVal', '%');

    // Checkboxes
    const bindCheck = (id, prop) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', (e) => { 
        this.store.state[prop] = e.target.checked; 
        this.renderer.requestRender();
      });
    };
    bindCheck('showBadgeCheck', 'showBadge');
    bindCheck('showCornersCheck', 'showBaroqueCorners');
    bindCheck('showHighlightBoxCheck', 'showHighlightBox');
    bindCheck('showSafeAreaGuideCheck', 'showSafeAreaGuide');
    bindCheck('imgFlipHCheck', 'imgFlipH');
    bindCheck('imgFlipVCheck', 'imgFlipV');

    // Upload Foto Principal
    const imgUpload = document.getElementById('imageUploadInput');
    if (imgUpload) {
      imgUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            this.loadImage(evt.target.result, () => this.renderer.requestRender());
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Upload Imagem de Fundo
    const bgUpload = document.getElementById('bgImageUploadInput');
    if (bgUpload) {
      bgUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            const img = new Image();
            img.onload = () => {
              this.store.state.bgImageObj = img;
              this.store.state.bgImageSrc = evt.target.result;
              this.renderer.requestRender();
            };
            img.src = evt.target.result;
          };
          reader.readAsDataURL(file);
        }
      });
    }

    const bgOpRange = document.getElementById('bgImageOpacityRange');
    if (bgOpRange) {
      bgOpRange.addEventListener('input', (e) => {
        this.store.state.bgImageOpacity = parseInt(e.target.value) / 100;
        const disp = document.getElementById('bgImageOpacityVal');
        if (disp) disp.textContent = e.target.value + '%';
      });
    }

    const btnRemoveBg = document.getElementById('btnRemoveBgImage');
    if (btnRemoveBg) {
      btnRemoveBg.addEventListener('click', () => {
        this.store.state.bgImageObj = null;
        this.store.state.bgImageSrc = null;
        if (bgUpload) bgUpload.value = '';
        this.renderer.requestRender();
      });
    }

    // Undo / Redo Botões no Header
    const btnUndo = document.getElementById('btnUndo');
    if (btnUndo) btnUndo.addEventListener('click', () => { this.store.undo(); this.syncUI(); });

    const btnRedo = document.getElementById('btnRedo');
    if (btnRedo) btnRedo.addEventListener('click', () => { this.store.redo(); this.syncUI(); });

    // Exportar
    const btnExport = document.getElementById('btnExport');
    if (btnExport) {
      btnExport.addEventListener('click', () => {
        const cleanTitle = (this.store.state.title || 'post')
          .toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]/g, '-');
        this.renderer.exportImage(`pedaco-do-ceu-${this.store.state.format}-${cleanTitle}.png`);
        A11yManager.announce('Exportação PNG concluída com sucesso!');
      });
    }

    // Exportar HTML
    const btnExportHtml = document.getElementById('btnExportHtml');
    if (btnExportHtml) {
      btnExportHtml.addEventListener('click', () => {
        this.exportHTML();
        A11yManager.announce('Exportação HTML concluída com sucesso!');
      });
    }
  }

  setFormat(fmt) {
    this.store.state.format = fmt;
    const dim = TOKENS.dimensions[fmt] || TOKENS.dimensions['1:1'];
    this.store.state.width = dim.width;
    this.store.state.height = dim.height;

    const dimDisplay = document.getElementById('formatDimDisplay');
    if (dimDisplay) dimDisplay.textContent = dim.label;
  }

  syncUI() {
    const s = this.store.state;
    const setVal = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined) el.value = val; };

    setVal('titleInput', s.title);
    setVal('subtitleInput', s.subtitle);
    setVal('descriptionInput', s.description);
    setVal('categoryTagInput', s.categoryTag);
    setVal('highlightInput', s.highlightText);
    setVal('ctaInput', s.ctaText);
    setVal('badgeInput', s.badgeText);

    // Cores
    setVal('colorTitleInput', s.colorTitle);
    setVal('colorTitleGlowInput', s.colorTitleGlow);
    setVal('colorSubtitleInput', s.colorSubtitle);
    setVal('colorDescInput', s.colorDesc);
    setVal('colorHighlightInput', s.colorHighlight);
    setVal('colorHighlightBorderInput', s.colorHighlightBorder);
    setVal('colorTagInput', s.colorTag);
    setVal('colorBadgeInput', s.colorBadge);
    setVal('colorCtaInput', s.colorCta);
    setVal('colorPatternInput', s.colorPattern);
    setVal('colorCornersInput', s.colorCorners);
    setVal('colorDividersInput', s.colorDividers);
    setVal('gradientPrimaryInput', s.gradientPrimary);
    setVal('gradientSecondaryInput', s.gradientSecondary);
    setVal('gradientDarknessInput', s.gradientDarkness);

    // Selects
    setVal('fontTitleSelect', s.fontTitle);
    setVal('weightTitleSelect', s.weightTitle);
    setVal('fontSubtitleSelect', s.fontSubtitle);
    setVal('styleSubtitleSelect', s.styleSubtitle);
    setVal('fontDescSelect', s.fontDesc);
    setVal('sacredPatternSelect', s.sacredPattern);

    // Sliders
    setVal('sizeTitleRange', s.sizeTitle);
    const sizeTitleVal = document.getElementById('sizeTitleVal');
    if (sizeTitleVal) sizeTitleVal.textContent = s.sizeTitle + 'px';

    setVal('spacingTitleRange', s.spacingTitle);
    const spacingTitleVal = document.getElementById('spacingTitleVal');
    if (spacingTitleVal) spacingTitleVal.textContent = s.spacingTitle + 'px';

    setVal('glowTitleRange', s.glowTitle);
    const glowTitleVal = document.getElementById('glowTitleVal');
    if (glowTitleVal) glowTitleVal.textContent = s.glowTitle + 'px';

    setVal('sizeSubtitleRange', s.sizeSubtitle);
    const sizeSubVal = document.getElementById('sizeSubtitleVal');
    if (sizeSubVal) sizeSubVal.textContent = s.sizeSubtitle + 'px';

    setVal('sizeDescRange', s.sizeDesc);
    const sizeDescVal = document.getElementById('sizeDescVal');
    if (sizeDescVal) sizeDescVal.textContent = s.sizeDesc + 'px';

    setVal('paddingTopRange', s.paddingTop);
    const pTopVal = document.getElementById('paddingTopVal');
    if (pTopVal) pTopVal.textContent = s.paddingTop + 'px';

    setVal('blockGapRange', s.blockGap);
    const bgVal = document.getElementById('blockGapVal');
    if (bgVal) bgVal.textContent = s.blockGap + 'px';

    setVal('paddingSideRange', s.paddingSide);
    const pSideVal = document.getElementById('paddingSideVal');
    if (pSideVal) pSideVal.textContent = s.paddingSide + 'px';

    setVal('globalLineGapRange', s.globalLineGap);
    const glgVal = document.getElementById('globalLineGapVal');
    if (glgVal) glgVal.textContent = s.globalLineGap + 'px';

    setVal('gradientIntensityRange', (s.gradientIntensity || 0.88) * 100);
    const giVal = document.getElementById('gradientIntensityVal');
    if (giVal) giVal.textContent = Math.round((s.gradientIntensity || 0.88) * 100) + '%';

    setVal('boxOpacityRange', (s.boxOpacity || 0.95) * 100);
    const boVal = document.getElementById('boxOpacityVal');
    if (boVal) boVal.textContent = Math.round((s.boxOpacity || 0.95) * 100) + '%';

    setVal('lineHeightDescRange', (s.lineHeightDesc || 1.4) * 10);
    const lhVal = document.getElementById('lineHeightDescVal');
    if (lhVal) lhVal.textContent = (s.lineHeightDesc || 1.4).toFixed(1) + 'x';
    
    setVal('imgZoomRange', (s.imgZoom || 1) * 100);
    const zoomVal = document.getElementById('imgZoomVal');
    if (zoomVal) zoomVal.textContent = (s.imgZoom || 1).toFixed(1) + 'x';

    setVal('imgPanXRange', s.imgPanX || 0);
    const panXVal = document.getElementById('imgPanXVal');
    if (panXVal) panXVal.textContent = (s.imgPanX || 0) + 'px';

    setVal('imgPanYRange', s.imgPanY || 0);
    const panYVal = document.getElementById('imgPanYVal');
    if (panYVal) panYVal.textContent = (s.imgPanY || 0) + 'px';

    setVal('patternOpacityRange', (s.patternOpacity || 0.15) * 100);
    const poVal = document.getElementById('patternOpacityVal');
    if (poVal) poVal.textContent = Math.round((s.patternOpacity || 0.15) * 100) + '%';

    setVal('bgImageOpacityRange', (s.bgImageOpacity || 0.6) * 100);
    const bgOpVal = document.getElementById('bgImageOpacityVal');
    if (bgOpVal) bgOpVal.textContent = Math.round((s.bgImageOpacity || 0.6) * 100) + '%';

    // Checkboxes
    const setCheck = (id, val) => { const el = document.getElementById(id); if (el) el.checked = !!val; };
    setCheck('showBadgeCheck', s.showBadge);
    setCheck('showCornersCheck', s.showBaroqueCorners);
    setCheck('showHighlightBoxCheck', s.showHighlightBox);
    setCheck('showSafeAreaGuideCheck', s.showSafeAreaGuide);
    setCheck('imgFlipHCheck', s.imgFlipH);
    setCheck('imgFlipVCheck', s.imgFlipV);

    // Live Gradient Preview Bar
    this.updateGradientLivePreview();
  }

  exportHTML(filename) {
    const s = this.store.state;
    const cleanTitle = (s.title || 'post')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '-');
    const actualFilename = filename || `pedaco-do-ceu-${s.format}-${cleanTitle}.html`;
    
    // Obtém imagem em alta resolução
    const imgDataUrl = this.renderer.highDPICanvas.getExportDataURL('image/png', 1.0);
    
    const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${s.title || 'Pedaço do Céu'} | ${s.subtitle || 'Artes Místicas & Sagradas'}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Cinzel+Decorative:wght@700&family=Cormorant+Garamond:ital,wght@0,500;1,500&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-darkness: ${s.gradientDarkness || '#0d0216'};
      --primary: ${s.gradientPrimary || '#2b0042'};
      --secondary: ${s.gradientSecondary || '#581c87'};
      --gold: #f5d77f;
      --gold-dark: #d4af37;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: radial-gradient(circle at center, var(--secondary) 0%, var(--primary) 50%, var(--bg-darkness) 100%);
      color: #f8f9fa;
      font-family: 'Montserrat', sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 30px 15px;
    }
    .post-container {
      max-width: 680px;
      width: 100%;
      background: rgba(10, 5, 20, 0.85);
      backdrop-filter: blur(16px);
      border: 1.5px solid var(--gold-dark);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(212, 175, 55, 0.2);
    }
    .post-header {
      padding: 18px 24px;
      border-bottom: 1px solid rgba(212, 175, 55, 0.25);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .post-brand {
      font-family: 'Cinzel', serif;
      font-weight: 700;
      color: var(--gold);
      letter-spacing: 1.5px;
      font-size: 15px;
    }
    .post-badge {
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--gold);
      border: 1px solid var(--gold);
      padding: 4px 10px;
      border-radius: 20px;
      font-weight: 600;
    }
    .post-image-wrapper {
      width: 100%;
      background: #000;
      display: flex;
      justify-content: center;
      align-items: center;
      border-bottom: 1px solid rgba(212, 175, 55, 0.25);
    }
    .post-image-wrapper img {
      width: 100%;
      height: auto;
      display: block;
    }
    .post-content {
      padding: 28px 24px;
    }
    .post-tag {
      font-family: 'Cinzel', serif;
      font-size: 12px;
      letter-spacing: 3px;
      color: var(--gold-dark);
      margin-bottom: 8px;
    }
    .post-title {
      font-family: 'Cinzel Decorative', 'Cinzel', serif;
      font-size: 26px;
      color: #fff;
      text-shadow: 0 0 16px rgba(245, 215, 127, 0.4);
      margin-bottom: 8px;
    }
    .post-subtitle {
      font-family: 'Cormorant Garamond', serif;
      font-style: italic;
      font-size: 19px;
      color: #eadcb9;
      margin-bottom: 18px;
    }
    .post-desc {
      font-size: 15px;
      line-height: 1.7;
      color: #e2e8f0;
      margin-bottom: 22px;
      white-space: pre-line;
    }
    .post-highlight {
      background: rgba(212, 175, 55, 0.1);
      border-left: 3px solid var(--gold);
      padding: 12px 16px;
      border-radius: 0 8px 8px 0;
      font-size: 14px;
      color: var(--gold);
      margin-bottom: 24px;
      font-weight: 500;
    }
    .post-cta {
      border-top: 1px dashed rgba(212, 175, 55, 0.3);
      padding-top: 18px;
      font-size: 14px;
      color: var(--gold);
      font-style: italic;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .post-footer {
      padding: 16px 24px;
      background: rgba(5, 2, 10, 0.9);
      border-top: 1px solid rgba(212, 175, 55, 0.2);
      font-size: 12px;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .btn-copy {
      background: var(--gold-dark);
      color: #1a0826;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 12px;
      cursor: pointer;
      letter-spacing: 0.5px;
      transition: opacity 0.2s;
    }
    .btn-copy:hover { opacity: 0.9; }
  </style>
</head>
<body>
  <article class="post-container">
    <header class="post-header">
      <span class="post-brand">✦ PEDAÇO DO CÉU</span>
      ${s.badgeText ? `<span class="post-badge">${s.badgeText}</span>` : ''}
    </header>
    
    <div class="post-image-wrapper">
      <img src="${imgDataUrl}" alt="${s.title || 'Criativo Sagrado Pedaço do Céu'}">
    </div>

    <div class="post-content">
      ${s.categoryTag ? `<div class="post-tag">${s.categoryTag}</div>` : ''}
      <h1 class="post-title">${s.title || ''}</h1>
      ${s.subtitle ? `<h2 class="post-subtitle">${s.subtitle}</h2>` : ''}
      <p class="post-desc">${s.description || ''}</p>
      ${s.highlightText ? `<div class="post-highlight">✦ ${s.highlightText}</div>` : ''}
      <div class="post-cta">
        <span>📍</span>
        <span>${s.ctaText || 'Visite nosso espaço sagrado em São Luís • Pedaço do Céu'}</span>
      </div>
    </div>

    <footer class="post-footer">
      <span>Fábrica de Conteúdo • São Luís (MA)</span>
      <button class="btn-copy" onclick="navigator.clipboard.writeText(document.querySelector('.post-desc').innerText).then(() => alert('Texto copiado com sucesso!'))">Copiar Texto</button>
    </footer>
  </article>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const link = document.createElement('a');
    link.download = actualFilename;
    link.href = URL.createObjectURL(blob);
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }
}

// Inicializa quando o DOM estiver pronto
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.pedacoStudio = new PedacoDoCeuStudio();
  });
}
