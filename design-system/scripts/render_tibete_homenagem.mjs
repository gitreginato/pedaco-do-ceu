import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const baseDir = '/home/mat77/Projetos/Pedaço do ceu /design-system';
const outDirProject = path.join(baseDir, 'exemplos-prontos/tibete-homenagem');
const outDirOutputs = '/home/mat77/Outputs/relatorios/tibete-homenagem';
const fileUrl = 'file://' + path.join(baseDir, 'index.html');

fs.mkdirSync(outDirProject, { recursive: true });
fs.mkdirSync(outDirOutputs, { recursive: true });

const textFull = `Em profunda reverência e união espiritual, nossos corações e orações se voltam para os povos do Tibete e do Nepal, tocados pela recente tragédia nas montanhas sagradas.

Que o poder infinito da compaixão (Karuna) e a luz de Chenrezig abracem cada família que perdeu seus entes queridos, trazendo conforto, serenidade e força na reconstrução de seus lares e vidas.

Que o sopro sagrado das bandeiras de oração espalhe paz pelos vales e eleve as almas que partiram em direção à luz divina.`;

const textShort1 = `Nossos corações e orações se voltam para os povos do Tibete e do Nepal, tocados pela recente tragédia nas montanhas sagradas.

Que o poder de Karuna e a luz de Chenrezig abracem cada família, trazendo serenidade e força na reconstrução de seus lares e vidas.

Que o sopro sagrado das bandeiras de oração eleve as almas que partiram em direção à luz divina.`;

const textShort2 = `Em profunda união e prece, nossos corações abraçam os povos do Tibete e do Nepal.

Que a compaixão infinita e a luz de Chenrezig consolem todas as famílias, trazendo paz, alívio e amparo aos corações.

Que as bandeiras sagradas soprem serenidade sobre os vales e montanhas sagradas.`;

const variations = [
  // FOTO 1: IMG_20260828_171759729.jpg (Lâmpada de Sal dos Himalaias & Bandeiras de Oração)
  {
    id: 'foto1_var1_feed1x1',
    name: 'Foto 1 - Variação 1 (Feed Quadrado 1:1 - Layout Lateral Split Áureo)',
    photoSrc: '../Fotos/TIbate/Tratadas/IMG_20260828_171759729.jpg',
    format: '1:1',
    width: 1080,
    height: 1080,
    layout: 'right',
    fitMode: 'portal',
    showBadge: false,
    categoryTag: '🕊️ HOMENAGEM & SOLIDARIEDADE',
    title: 'ORAÇÃO PELO TIBETE & NEPAL',
    subtitle: 'Em profunda reverência e união espiritual',
    description: textShort1,
    highlightText: '✦ Oṃ Maṇi Padme Hūṃ • Karuna & Luz Divina',
    showHighlightBox: true,
    ctaText: 'Pedaço do Céu • Solidariedade & Fé',
    fontTitle: "'Cinzel Decorative', serif",
    weightTitle: '700',
    sizeTitle: 34,
    fontSubtitle: "'Playfair Display', serif",
    styleSubtitle: 'italic 600',
    sizeSubtitle: 19,
    fontDesc: "'Montserrat', sans-serif",
    sizeDesc: 14.5,
    lineHeightDesc: 1.45,
    paddingTop: 80,
    blockGap: 16,
    paddingSide: 20,
    gradientPrimary: '#1a1005',
    gradientSecondary: '#3d2508',
    gradientDarkness: '#080401',
    colorTitle: '#ffffff',
    colorTitleGlow: '#f5d77f',
    colorSubtitle: '#f5d77f',
    colorDesc: '#ffffff',
    colorHighlight: '#f5d77f',
    colorHighlightBorder: '#f5d77f',
    colorTag: '#f5d77f',
    colorBadge: '#f5d77f',
    colorCta: '#f5d77f',
    colorPattern: '#f5d77f',
    colorCorners: '#f5d77f',
    colorDividers: '#f5d77f',
    sacredPattern: 'sriYantra',
    patternOpacity: 0.28,
    glowTitle: 16
  },
  {
    id: 'foto1_var2_feed4x5',
    name: 'Foto 1 - Variação 2 (Feed Vertical 4:5 - Layout Rodapé Nobre)',
    photoSrc: '../Fotos/TIbate/Tratadas/IMG_20260828_171759729.jpg',
    format: '4:5',
    width: 1080,
    height: 1350,
    layout: 'bottom',
    fitMode: 'fusion',
    showBadge: false,
    categoryTag: '🕊️ PRECE PELOS HIMALAIAS',
    title: 'LUZ & COMPAIXÃO AO TIBETE',
    subtitle: 'Nossos corações se unem em oração e amparo',
    description: textFull,
    highlightText: '✦ Oṃ Maṇi Padme Hūṃ • Que todos os seres encontrem cura',
    showHighlightBox: true,
    ctaText: 'Pedaço do Céu • União Espiritual',
    fontTitle: "'Playfair Display', serif",
    weightTitle: '700',
    sizeTitle: 36,
    fontSubtitle: "'Cormorant Garamond', serif",
    styleSubtitle: 'italic 600',
    sizeSubtitle: 21,
    fontDesc: "'Montserrat', sans-serif",
    sizeDesc: 15.5,
    lineHeightDesc: 1.5,
    paddingTop: 40,
    blockGap: 18,
    gradientPrimary: '#140c04',
    gradientSecondary: '#2d1a08',
    gradientDarkness: '#050301',
    colorTitle: '#ffffff',
    colorTitleGlow: '#f5d77f',
    colorSubtitle: '#f5d77f',
    colorDesc: '#ffffff',
    colorHighlight: '#f5d77f',
    colorHighlightBorder: '#d4af37',
    colorTag: '#f5d77f',
    colorBadge: '#f5d77f',
    colorCta: '#f5d77f',
    colorPattern: '#f5d77f',
    colorCorners: '#f5d77f',
    colorDividers: '#f5d77f',
    sacredPattern: 'flowerOfLife',
    patternOpacity: 0.25,
    glowTitle: 18
  },
  {
    id: 'foto1_var3_story9x16',
    name: 'Foto 1 - Variação 3 (Stories/TikTok 9:16 - Layout Centro Imersivo)',
    photoSrc: '../Fotos/TIbate/Tratadas/IMG_20260828_171759729.jpg',
    format: '9:16-story',
    width: 1080,
    height: 1920,
    layout: 'center',
    fitMode: 'portal',
    showBadge: false,
    categoryTag: '🕊️ HOMENAGEM & SOLIDARIEDADE',
    title: 'ORAÇÃO PELO TIBETE & NEPAL',
    subtitle: 'A Força Sagrada de Karuna e Chenrezig',
    description: textFull,
    highlightText: '✦ Oṃ Maṇi Padme Hūṃ • Paz, amparo e consolo às famílias',
    showHighlightBox: true,
    ctaText: 'Pedaço do Céu • União & Luz Divina',
    fontTitle: "'Cinzel', serif",
    weightTitle: '700',
    sizeTitle: 40,
    fontSubtitle: "'Playfair Display', serif",
    styleSubtitle: 'italic 600',
    sizeSubtitle: 23,
    fontDesc: "'Montserrat', sans-serif",
    sizeDesc: 16.5,
    lineHeightDesc: 1.55,
    paddingTop: 50,
    blockGap: 20,
    gradientPrimary: '#191006',
    gradientSecondary: '#38220a',
    gradientDarkness: '#080502',
    colorTitle: '#ffffff',
    colorTitleGlow: '#f5d77f',
    colorSubtitle: '#f5d77f',
    colorDesc: '#ffffff',
    colorHighlight: '#f5d77f',
    colorHighlightBorder: '#f5d77f',
    colorTag: '#f5d77f',
    colorBadge: '#f5d77f',
    colorCta: '#f5d77f',
    colorPattern: '#f5d77f',
    colorCorners: '#f5d77f',
    colorDividers: '#f5d77f',
    sacredPattern: 'sriYantra',
    patternOpacity: 0.30,
    glowTitle: 20
  },

  // FOTO 2: IMG_20260828_172652877_HDR.jpg (Buda Radiante de Chenrezig & Cascata Sagrada)
  {
    id: 'foto2_var1_feed1x1',
    name: 'Foto 2 - Variação 1 (Feed Quadrado 1:1 - Layout Lateral Áureo)',
    photoSrc: '../Fotos/TIbate/Tratadas/IMG_20260828_172652877_HDR.jpg',
    format: '1:1',
    width: 1080,
    height: 1080,
    layout: 'right',
    fitMode: 'portal',
    showBadge: false,
    categoryTag: '🕊️ COMPAIXÃO (KARUNA)',
    title: 'SOLIDARIEDADE AO TIBETE',
    subtitle: 'Nossas orações pelas vidas nas montanhas',
    description: textShort2,
    highlightText: '✦ Oṃ Maṇi Padme Hūṃ • Vibração de Paz e Cura',
    showHighlightBox: true,
    ctaText: 'Pedaço do Céu • Solidariedade',
    fontTitle: "'Bodoni Moda', serif",
    weightTitle: '700',
    sizeTitle: 34,
    fontSubtitle: "'Cormorant Garamond', serif",
    styleSubtitle: 'italic 600',
    sizeSubtitle: 19,
    fontDesc: "'Montserrat', sans-serif",
    sizeDesc: 14.5,
    lineHeightDesc: 1.45,
    paddingTop: 80,
    blockGap: 16,
    paddingSide: 20,
    gradientPrimary: '#1a1005',
    gradientSecondary: '#40270b',
    gradientDarkness: '#070401',
    colorTitle: '#ffffff',
    colorTitleGlow: '#f5d77f',
    colorSubtitle: '#f5d77f',
    colorDesc: '#ffffff',
    colorHighlight: '#f5d77f',
    colorHighlightBorder: '#d4af37',
    colorTag: '#f5d77f',
    colorBadge: '#f5d77f',
    colorCta: '#f5d77f',
    colorPattern: '#f5d77f',
    colorCorners: '#f5d77f',
    colorDividers: '#f5d77f',
    sacredPattern: 'lunarMandala',
    patternOpacity: 0.26,
    glowTitle: 16
  },
  {
    id: 'foto2_var2_feed4x5',
    name: 'Foto 2 - Variação 2 (Feed Vertical 4:5 - Layout Rodapé Suave)',
    photoSrc: '../Fotos/TIbate/Tratadas/IMG_20260828_172652877_HDR.jpg',
    format: '4:5',
    width: 1080,
    height: 1350,
    layout: 'bottom',
    fitMode: 'fusion',
    showBadge: false,
    categoryTag: '🕊️ HOMENAGEM & SOLIDARIEDADE',
    title: 'ORAÇÃO PELO TIBETE & NEPAL',
    subtitle: 'Que o sopro das bandeiras sagradas leve paz aos vales',
    description: textFull,
    highlightText: '✦ Karuna & Chenrezig • Conforto e força a todas as famílias',
    showHighlightBox: true,
    ctaText: 'Pedaço do Céu • Paz e Oração',
    fontTitle: "'Cinzel Decorative', serif",
    weightTitle: '700',
    sizeTitle: 36,
    fontSubtitle: "'Playfair Display', serif",
    styleSubtitle: 'italic 600',
    sizeSubtitle: 21,
    fontDesc: "'Montserrat', sans-serif",
    sizeDesc: 15.5,
    lineHeightDesc: 1.5,
    paddingTop: 40,
    blockGap: 18,
    gradientPrimary: '#160d04',
    gradientSecondary: '#331e0a',
    gradientDarkness: '#050301',
    colorTitle: '#ffffff',
    colorTitleGlow: '#f5d77f',
    colorSubtitle: '#f5d77f',
    colorDesc: '#ffffff',
    colorHighlight: '#f5d77f',
    colorHighlightBorder: '#f5d77f',
    colorTag: '#f5d77f',
    colorBadge: '#f5d77f',
    colorCta: '#f5d77f',
    colorPattern: '#f5d77f',
    colorCorners: '#f5d77f',
    colorDividers: '#f5d77f',
    sacredPattern: 'sriYantra',
    patternOpacity: 0.28,
    glowTitle: 18
  },
  {
    id: 'foto2_var3_story9x16',
    name: 'Foto 2 - Variação 3 (Stories/TikTok 9:16 - Layout Solene)',
    photoSrc: '../Fotos/TIbate/Tratadas/IMG_20260828_172652877_HDR.jpg',
    format: '9:16-story',
    width: 1080,
    height: 1920,
    layout: 'bottom',
    fitMode: 'portal',
    showBadge: false,
    categoryTag: '🕊️ PRECE PELOS HIMALAIAS',
    title: 'LUZ, FORÇA E COMPAIXÃO',
    subtitle: 'Nossos corações unidos aos povos do Tibete e Nepal',
    description: textFull,
    highlightText: '✦ Oṃ Maṇi Padme Hūṃ • Alívio, amparo e cura divina',
    showHighlightBox: true,
    ctaText: 'Pedaço do Céu • Solidariedade & Fé',
    fontTitle: "'Playfair Display', serif",
    weightTitle: '700',
    sizeTitle: 40,
    fontSubtitle: "'Cormorant Garamond', serif",
    styleSubtitle: 'italic 600',
    sizeSubtitle: 23,
    fontDesc: "'Montserrat', sans-serif",
    sizeDesc: 16.5,
    lineHeightDesc: 1.55,
    paddingTop: 50,
    blockGap: 20,
    gradientPrimary: '#1b1105',
    gradientSecondary: '#42280d',
    gradientDarkness: '#070401',
    colorTitle: '#ffffff',
    colorTitleGlow: '#f5d77f',
    colorSubtitle: '#f5d77f',
    colorDesc: '#ffffff',
    colorHighlight: '#f5d77f',
    colorHighlightBorder: '#d4af37',
    colorTag: '#f5d77f',
    colorBadge: '#f5d77f',
    colorCta: '#f5d77f',
    colorPattern: '#f5d77f',
    colorCorners: '#f5d77f',
    colorDividers: '#f5d77f',
    sacredPattern: 'flowerOfLife',
    patternOpacity: 0.30,
    glowTitle: 20
  },

  // FOTO 3: IMG_20260828_165849966.jpg (Pirâmide de Cristal & Sal dos Himalaias com Buda)
  {
    id: 'foto3_var1_feed1x1',
    name: 'Foto 3 - Variação 1 (Feed Quadrado 1:1 - Layout Lateral Split Áureo)',
    photoSrc: '../Fotos/TIbate/Tratadas/IMG_20260828_165849966.jpg',
    format: '1:1',
    width: 1080,
    height: 1080,
    layout: 'right',
    fitMode: 'portal',
    showBadge: false,
    categoryTag: '🕊️ PAZ & RECONSTRUÇÃO',
    title: 'ORAÇÃO PELO TIBETE & NEPAL',
    subtitle: 'A interdependência de todos os seres em oração',
    description: textShort1,
    highlightText: '✦ Oṃ Maṇi Padme Hūṃ • Luz aos povos do Tibete e Nepal',
    showHighlightBox: true,
    ctaText: 'Pedaço do Céu • Solidariedade',
    fontTitle: "'Cinzel', serif",
    weightTitle: '700',
    sizeTitle: 34,
    fontSubtitle: "'Playfair Display', serif",
    styleSubtitle: 'italic 600',
    sizeSubtitle: 19,
    fontDesc: "'Montserrat', sans-serif",
    sizeDesc: 14.5,
    lineHeightDesc: 1.45,
    paddingTop: 80,
    blockGap: 16,
    paddingSide: 20,
    gradientPrimary: '#1c1206',
    gradientSecondary: '#42280d',
    gradientDarkness: '#080502',
    colorTitle: '#ffffff',
    colorTitleGlow: '#f5d77f',
    colorSubtitle: '#f5d77f',
    colorDesc: '#ffffff',
    colorHighlight: '#f5d77f',
    colorHighlightBorder: '#f5d77f',
    colorTag: '#f5d77f',
    colorBadge: '#f5d77f',
    colorCta: '#f5d77f',
    colorPattern: '#f5d77f',
    colorCorners: '#f5d77f',
    colorDividers: '#f5d77f',
    sacredPattern: 'sriYantra',
    patternOpacity: 0.28,
    glowTitle: 16
  },
  {
    id: 'foto3_var2_feed4x5',
    name: 'Foto 3 - Variação 2 (Feed Vertical 4:5 - Layout Rodapé Suave)',
    photoSrc: '../Fotos/TIbate/Tratadas/IMG_20260828_165849966.jpg',
    format: '4:5',
    width: 1080,
    height: 1350,
    layout: 'bottom',
    fitMode: 'fusion',
    showBadge: false,
    categoryTag: '🕊️ HOMENAGEM & SOLIDARIEDADE',
    title: 'ORAÇÃO PELO TIBETE & NEPAL',
    subtitle: 'Paz, serenidade e acolhimento às montanhas sagradas',
    description: textFull,
    highlightText: '✦ Karuna & Chenrezig • Conforto e amparo divino',
    showHighlightBox: true,
    ctaText: 'Pedaço do Céu • União Espiritual',
    fontTitle: "'Bodoni Moda', serif",
    weightTitle: '700',
    sizeTitle: 36,
    fontSubtitle: "'Cormorant Garamond', serif",
    styleSubtitle: 'italic 600',
    sizeSubtitle: 21,
    fontDesc: "'Montserrat', sans-serif",
    sizeDesc: 15.5,
    lineHeightDesc: 1.5,
    paddingTop: 40,
    blockGap: 18,
    gradientPrimary: '#140d04',
    gradientSecondary: '#301c09',
    gradientDarkness: '#050301',
    colorTitle: '#ffffff',
    colorTitleGlow: '#f5d77f',
    colorSubtitle: '#f5d77f',
    colorDesc: '#ffffff',
    colorHighlight: '#f5d77f',
    colorHighlightBorder: '#d4af37',
    colorTag: '#f5d77f',
    colorBadge: '#f5d77f',
    colorCta: '#f5d77f',
    colorPattern: '#f5d77f',
    colorCorners: '#f5d77f',
    colorDividers: '#f5d77f',
    sacredPattern: 'lunarMandala',
    patternOpacity: 0.26,
    glowTitle: 18
  },
  {
    id: 'foto3_var3_story9x16',
    name: 'Foto 3 - Variação 3 (Stories/TikTok 9:16 - Layout Centro Imersivo)',
    photoSrc: '../Fotos/TIbate/Tratadas/IMG_20260828_165849966.jpg',
    format: '9:16-story',
    width: 1080,
    height: 1920,
    layout: 'center',
    fitMode: 'portal',
    showBadge: false,
    categoryTag: '🕊️ PRECE PELOS HIMALAIAS',
    title: 'ORAÇÃO PELO TIBETE & NEPAL',
    subtitle: 'Que as bandeiras de oração espalhem paz e consolo',
    description: textFull,
    highlightText: '✦ Oṃ Maṇi Padme Hūṃ • Que todos os seres encontrem cura',
    showHighlightBox: true,
    ctaText: 'Pedaço do Céu • Solidariedade & Fé',
    fontTitle: "'Cinzel Decorative', serif",
    weightTitle: '700',
    sizeTitle: 40,
    fontSubtitle: "'Playfair Display', serif",
    styleSubtitle: 'italic 600',
    sizeSubtitle: 23,
    fontDesc: "'Montserrat', sans-serif",
    sizeDesc: 16.5,
    lineHeightDesc: 1.55,
    paddingTop: 50,
    blockGap: 20,
    gradientPrimary: '#1a1005',
    gradientSecondary: '#3e260c',
    gradientDarkness: '#070401',
    colorTitle: '#ffffff',
    colorTitleGlow: '#f5d77f',
    colorSubtitle: '#f5d77f',
    colorDesc: '#ffffff',
    colorHighlight: '#f5d77f',
    colorHighlightBorder: '#f5d77f',
    colorTag: '#f5d77f',
    colorBadge: '#f5d77f',
    colorCta: '#f5d77f',
    colorPattern: '#f5d77f',
    colorCorners: '#f5d77f',
    colorDividers: '#f5d77f',
    sacredPattern: 'sriYantra',
    patternOpacity: 0.30,
    glowTitle: 20
  }
];

async function main() {
  console.log('✨ Iniciando renderização calibrada das 9 variações de homenagem...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1200 } });
  const page = await context.newPage();

  await page.goto(fileUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  const results = [];

  for (let i = 0; i < variations.length; i++) {
    const v = variations[i];
    console.log(`\n[${i + 1}/9] 🎨 Configurando e renderizando: ${v.name}`);

    await page.evaluate(async (varConfig) => {
      const studio = window.pedacoStudio || window.studioInstance;
      if (!studio) throw new Error('pedacoStudio não encontrado');

      // Limpa badgeText se showBadge for false
      if (!varConfig.showBadge) {
        studio.store.state.badgeText = '';
      }

      // Aplica configurações no estado
      Object.keys(varConfig).forEach(k => {
        if (k !== 'id' && k !== 'name' && k !== 'photoSrc') {
          studio.store.state[k] = varConfig[k];
        }
      });

      // Carrega a foto
      await new Promise((resolve) => {
        studio.store.state.imgSrc = varConfig.photoSrc;
        studio.loadImage(varConfig.photoSrc, () => {
          studio.renderer.requestRender();
          resolve();
        });
      });

      await document.fonts.ready;
      studio.renderer.render();
    }, v);

    await page.waitForTimeout(450);

    const canvas = await page.$('#renderCanvas');
    const filename = `${v.id}.png`;
    const projPath = path.join(outDirProject, filename);
    const outPath = path.join(outDirOutputs, filename);

    await canvas.screenshot({ path: projPath });
    fs.copyFileSync(projPath, outPath);

    const sizeKb = (fs.statSync(projPath).size / 1024).toFixed(0);
    console.log(`   ✅ Renderizado com sucesso: ${filename} (${sizeKb} KB)`);
    results.push({ ...v, filename, projPath, outPath, sizeKb });
  }

  const htmlReport = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pedaço do Céu — Homenagem ao Tibete & Nepal</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Montserrat:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #070a09;
      --bg-card: #0e1411;
      --border-gold: #d4af37;
      --gold-light: #f5d77f;
      --text-main: #f8f9fa;
      --text-muted: #d0c4a8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg-dark);
      color: var(--text-main);
      font-family: 'Montserrat', sans-serif;
      padding: 40px 24px;
      line-height: 1.6;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    header {
      text-align: center;
      margin-bottom: 48px;
      border-bottom: 1px solid rgba(212, 175, 55, 0.3);
      padding-bottom: 32px;
    }
    .badge-top {
      display: inline-block;
      padding: 6px 18px;
      border: 1px solid var(--border-gold);
      border-radius: 999px;
      color: var(--gold-light);
      font-size: 13px;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    h1 {
      font-family: 'Cinzel', serif;
      font-size: 36px;
      color: #ffffff;
      margin-bottom: 12px;
      letter-spacing: 1px;
    }
    .subtitle {
      font-family: 'Playfair Display', serif;
      font-style: italic;
      font-size: 20px;
      color: var(--gold-light);
      max-width: 800px;
      margin: 0 auto 20px;
    }
    .message-box {
      background: rgba(212, 175, 55, 0.08);
      border: 1px solid rgba(212, 175, 55, 0.4);
      border-radius: 12px;
      padding: 24px;
      max-width: 860px;
      margin: 0 auto;
      text-align: left;
      font-size: 15px;
      color: #ffffff;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
      gap: 32px;
      margin-top: 40px;
    }
    .card {
      background: var(--bg-card);
      border: 1px solid rgba(212, 175, 55, 0.3);
      border-radius: 12px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .card-img-container {
      background: #000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12px;
    }
    .card img {
      max-width: 100%;
      height: auto;
      border-radius: 6px;
      border: 1px solid rgba(212, 175, 55, 0.2);
    }
    .card-body {
      padding: 20px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .card-title {
      font-family: 'Cinzel', serif;
      font-size: 18px;
      color: var(--gold-light);
      margin-bottom: 8px;
    }
    .card-desc {
      font-size: 13px;
      color: var(--text-muted);
      margin-bottom: 16px;
    }
    .card-meta {
      font-size: 12px;
      color: rgba(255,255,255,0.6);
      border-top: 1px solid rgba(255,255,255,0.1);
      padding-top: 12px;
    }
    footer {
      text-align: center;
      margin-top: 60px;
      color: var(--text-muted);
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="badge-top">✦ Pedaço do Céu • Solidariedade & Fé ✦</div>
      <h1>Prece Sagrada pelo Tibete & Nepal</h1>
      <div class="subtitle">"Oṃ Maṇi Padme Hūṃ • Que todos os seres encontrem alívio, amparo e cura"</div>
      <div class="message-box">
        <p><strong>Mensagem Oficial da Peça:</strong></p>
        <p style="margin-top: 8px;"><em>Em profunda reverência e união espiritual, nossos corações e orações se voltam para os povos do Tibete e do Nepal, tocados pela recente tragédia nas montanhas sagradas.</em></p>
        <p style="margin-top: 8px;"><em>Que o poder infinito da compaixão (Karuna) e a luz de Chenrezig abracem cada família que perdeu seus entes queridos, trazendo conforto, serenidade e força na reconstrução de seus lares e vidas.</em></p>
        <p style="margin-top: 8px;"><em>Que o sopro sagrado das bandeiras de oração espalhe paz pelos vales e eleve as almas que partiram em direção à luz divina.</em></p>
      </div>
    </header>

    <div class="grid">
      ${results.map(r => `
        <div class="card">
          <div class="card-img-container">
            <a href="${r.filename}" target="_blank">
              <img src="${r.filename}" alt="${r.name}">
            </a>
          </div>
          <div class="card-body">
            <div>
              <h2 class="card-title">${r.name}</h2>
              <p class="card-desc"><strong>Layout:</strong> ${r.layout} | <strong>Formato:</strong> ${r.format} (${r.width}x${r.height}px)</p>
            </div>
            <div class="card-meta">
              <span>Arquivo: <code>${r.filename}</code> (${r.sizeKb} KB)</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>

    <footer>
      <p>Pedaço do Céu Studio Místico & Sagrado v2.0 • Gerado com Contraste Robusto e Calibração High-DPI</p>
    </footer>
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(outDirOutputs, 'index.html'), htmlReport, 'utf8');
  fs.writeFileSync(path.join(outDirProject, 'index.html'), htmlReport, 'utf8');
  console.log(`\n🎉 Concluído! Relatório HTML interativo salvo em: ${path.join(outDirOutputs, 'index.html')}`);

  await browser.close();
}

main().catch(err => {
  console.error('❌ Erro na geração:', err);
  process.exit(1);
});
