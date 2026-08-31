import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const baseDir = '/home/mat77/Projetos/Pedaço do ceu /design-system';
const outDirFotos = '/home/mat77/Projetos/Pedaço do ceu /Fotos/TIbate/Homenagem_Criativos';
const outDirOutputs = '/home/mat77/Outputs/relatorios/tibete-homenagem';
const outDirExemplos = path.join(baseDir, 'exemplos-prontos/tibete-homenagem');

fs.mkdirSync(outDirFotos, { recursive: true });
fs.mkdirSync(outDirOutputs, { recursive: true });
fs.mkdirSync(outDirExemplos, { recursive: true });

// As 3 Melhores Fotos do Acervo do Tibete
const photos = [
  {
    key: 'foto1',
    name: 'Altar com Lâmpada de Sal dos Himalaias & Bandeiras de Oração',
    src: '/home/mat77/Projetos/Pedaço do ceu /Fotos/TIbate/Tratadas/IMG_20260828_171759729.jpg'
  },
  {
    key: 'foto2',
    name: 'Buda Solar de Chenrezig & Cascata Sagrada',
    src: '/home/mat77/Projetos/Pedaço do ceu /Fotos/TIbate/Tratadas/IMG_20260828_172652877_HDR.jpg'
  },
  {
    key: 'foto3',
    name: 'Pirâmide de Sal dos Himalaias & Buda da Compaixão',
    src: '/home/mat77/Projetos/Pedaço do ceu /Fotos/TIbate/Tratadas/IMG_20260828_165849966.jpg'
  }
];

// Layouts Aprimorados: Imagens Maiores (45-50% da área) e Disposição Tipográfica Perfeita
const layouts = [
  {
    id: 'var1_feed1x1',
    formatLabel: 'Feed Quadrado 1:1 (1080x1080px)',
    width: 1080,
    height: 1080,
    type: 'split_50_50',
    renderHtml: (photoBase64) => `
      <div class="canvas-root layout-1x1">
        <div class="photo-side" style="background-image: url('${photoBase64}');">
          <div class="photo-frame-border"></div>
          <div class="photo-corner-tl"></div>
          <div class="photo-corner-tr"></div>
          <div class="photo-corner-bl"></div>
          <div class="photo-corner-br"></div>
        </div>
        <div class="text-side">
          <div class="header-group">
            <div class="tag-header">🕊️ HOMENAGEM & SOLIDARIEDADE</div>
            <h1 class="title-main">ORAÇÃO PELO TIBETE & NEPAL</h1>
            <div class="subtitle-text">Em profunda reverência e união espiritual</div>
            <div class="divider-gold"><span>✦</span></div>
          </div>
          
          <div class="body-content">
            <p>Nossos corações e orações se voltam para os povos do Tibete e do Nepal, tocados pela recente tragédia nas montanhas sagradas.</p>
            <p>Que o poder infinito de <strong>Karuna</strong> e a luz de <strong>Chenrezig</strong> abracem cada família, trazendo conforto, serenidade e força na reconstrução de suas vidas.</p>
            <p>Que o sopro sagrado das bandeiras de oração espalhe paz pelos vales e eleve as almas em direção à luz divina.</p>
          </div>

          <div class="footer-group">
            <div class="mantra-box">
              <div class="mantra-title">✦ OṂ MAṆI PADME HŪṂ ✦</div>
              <div class="mantra-sub">Que todos os seres encontrem alívio, amparo e cura.</div>
            </div>
            <div class="footer-brand">PEDAÇO DO CÉU • SOLIDARIEDADE & FÉ</div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'var2_feed4x5',
    formatLabel: 'Feed Vertical 4:5 (1080x1350px)',
    width: 1080,
    height: 1350,
    type: 'vertical_card_large_img',
    renderHtml: (photoBase64) => `
      <div class="canvas-root layout-4x5">
        <div class="photo-header" style="background-image: url('${photoBase64}');">
          <div class="photo-gradient-fade"></div>
          <div class="photo-border-top"></div>
        </div>
        <div class="text-container-large">
          <div class="header-group">
            <div class="tag-header">🕊️ PRECE SAGRADA PELOS HIMALAIAS</div>
            <h1 class="title-main">ORAÇÃO PELO TIBETE & NEPAL</h1>
            <div class="subtitle-text">Em profunda reverência e união espiritual</div>
            <div class="divider-gold"><span>✦ ✦ ✦</span></div>
          </div>

          <div class="body-content">
            <p>Nossos corações e orações se voltam para os povos do Tibete e do Nepal, tocados pela recente tragédia nas montanhas sagradas.</p>
            <p>Que o poder infinito da compaixão (Karuna) e a luz de Chenrezig abracem cada família que perdeu seus entes queridos, trazendo conforto, serenidade e força na reconstrução de seus lares e vidas.</p>
            <p>Que o sopro sagrado das bandeiras de oração espalhe paz pelos vales e eleve as almas que partiram em direção à luz divina.</p>
          </div>

          <div class="footer-group">
            <div class="mantra-box-highlight">
              <div class="mantra-title">✦ OṂ MAṆI PADME HŪṂ ✦</div>
              <div class="mantra-meaning">Que todos os seres encontrem alívio, amparo e cura.</div>
            </div>
            <div class="footer-brand">PEDAÇO DO CÉU • UNIÃO ESPIRITUAL</div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'var3_story9x16',
    formatLabel: 'Stories & TikTok 9:16 (1080x1920px)',
    width: 1080,
    height: 1920,
    type: 'story_large_img',
    renderHtml: (photoBase64) => `
      <div class="canvas-root layout-9x16">
        <div class="photo-header-story" style="background-image: url('${photoBase64}');">
          <div class="photo-gradient-fade-story"></div>
          <div class="photo-border-story"></div>
        </div>
        <div class="text-container-story">
          <div class="header-group">
            <div class="tag-header">🕊️ HOMENAGEM & SOLIDARIEDADE</div>
            <h1 class="title-main">ORAÇÃO PELO TIBETE & NEPAL</h1>
            <div class="subtitle-text">Em profunda reverência e união espiritual</div>
            <div class="divider-gold"><span>✦ ✦ ✦</span></div>
          </div>

          <div class="body-content">
            <p>Nossos corações e orações se voltam para os povos do Tibete e do Nepal, tocados pela recente tragédia nas montanhas sagradas.</p>
            <p>Que o poder infinito da compaixão (Karuna) e a luz de Chenrezig abracem cada família que perdeu seus entes queridos, trazendo conforto, serenidade e força na reconstrução de seus lares e vidas.</p>
            <p>Que o sopro sagrado das bandeiras de oração espalhe paz pelos vales e eleve as almas que partiram em direção à luz divina.</p>
          </div>

          <div class="footer-group">
            <div class="mantra-box-highlight">
              <div class="mantra-title">✦ OṂ MAṆI PADME HŪṂ ✦</div>
              <div class="mantra-meaning">Que todos os seres encontrem alívio, amparo e cura.</div>
            </div>
            <div class="footer-brand">PEDAÇO DO CÉU • SOLIDARIEDADE & FÉ</div>
          </div>
        </div>
      </div>
    `
  }
];

const templateBaseHtml = (contentHtml, width, height) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=Montserrat:ital,wght@0,500;0,600;0,700;0,800;1,600&family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: ${width}px;
      height: ${height}px;
      overflow: hidden;
      background: #000;
      font-family: 'Montserrat', sans-serif;
      color: #ffffff;
      -webkit-font-smoothing: antialiased;
    }
    .canvas-root {
      width: ${width}px;
      height: ${height}px;
      position: relative;
      background: #080502;
    }

    /* === LAYOUT 1:1 (SPLIT EQUILIBRADO 520px IMAGEM / 560px TEXTO) === */
    .layout-1x1 {
      display: flex;
      flex-direction: row;
      width: 1080px;
      height: 1080px;
    }
    .layout-1x1 .photo-side {
      width: 510px;
      height: 1080px;
      background-size: cover;
      background-position: center;
      position: relative;
      border-right: 3px solid #d4af37;
    }
    .layout-1x1 .photo-frame-border {
      position: absolute;
      top: 24px; left: 24px; right: 24px; bottom: 24px;
      border: 1.5px solid rgba(245, 215, 127, 0.45);
      pointer-events: none;
    }
    .layout-1x1 .photo-corner-tl, .layout-1x1 .photo-corner-tr,
    .layout-1x1 .photo-corner-bl, .layout-1x1 .photo-corner-br {
      position: absolute;
      width: 14px; height: 14px;
      border-color: #f5d77f;
    }
    .layout-1x1 .photo-corner-tl { top: 20px; left: 20px; border-top: 3px solid #f5d77f; border-left: 3px solid #f5d77f; }
    .layout-1x1 .photo-corner-tr { top: 20px; right: 20px; border-top: 3px solid #f5d77f; border-right: 3px solid #f5d77f; }
    .layout-1x1 .photo-corner-bl { bottom: 20px; left: 20px; border-bottom: 3px solid #f5d77f; border-left: 3px solid #f5d77f; }
    .layout-1x1 .photo-corner-br { bottom: 20px; right: 20px; border-bottom: 3px solid #f5d77f; border-right: 3px solid #f5d77f; }

    .layout-1x1 .text-side {
      width: 570px;
      height: 1080px;
      padding: 44px 38px 36px;
      background: linear-gradient(145deg, #130903 0%, #221206 50%, #0a0502 100%);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border-left: 1px solid rgba(212, 175, 55, 0.25);
    }
    .layout-1x1 .header-group {
      text-align: left;
    }
    .layout-1x1 .tag-header {
      font-family: 'Cinzel', serif;
      font-size: 14px;
      font-weight: 800;
      color: #f5d77f;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .layout-1x1 .title-main {
      font-family: 'Cinzel', serif;
      font-size: 34px;
      font-weight: 900;
      color: #ffffff;
      line-height: 1.18;
      letter-spacing: 1px;
      text-shadow: 0 0 25px rgba(245, 215, 127, 0.5);
    }
    .layout-1x1 .subtitle-text {
      font-family: 'Playfair Display', serif;
      font-style: italic;
      font-weight: 700;
      font-size: 20px;
      color: #f5d77f;
      margin-top: 6px;
    }
    .layout-1x1 .divider-gold {
      display: flex;
      align-items: center;
      margin: 12px 0 10px;
      color: #d4af37;
      font-size: 16px;
    }
    .layout-1x1 .divider-gold::before, .layout-1x1 .divider-gold::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid rgba(212, 175, 55, 0.4);
    }
    .layout-1x1 .divider-gold span {
      padding: 0 10px;
    }
    .layout-1x1 .body-content {
      font-family: 'Montserrat', sans-serif;
      font-size: 18.5px;
      font-weight: 600;
      color: #ffffff;
      line-height: 1.52;
    }
    .layout-1x1 .body-content p {
      margin-bottom: 12px;
    }
    .layout-1x1 .body-content strong {
      color: #f5d77f;
      font-weight: 700;
    }
    .layout-1x1 .footer-group {
      margin-top: auto;
    }
    .layout-1x1 .mantra-box {
      background: rgba(212, 175, 55, 0.14);
      border: 2px solid #d4af37;
      border-radius: 10px;
      padding: 14px 18px;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.6);
      margin-bottom: 12px;
    }
    .layout-1x1 .mantra-title {
      font-family: 'Cinzel', serif;
      font-size: 19px;
      font-weight: 900;
      color: #ffffff;
      letter-spacing: 2px;
      margin-bottom: 3px;
      text-shadow: 0 0 15px rgba(245, 215, 127, 0.7);
    }
    .layout-1x1 .mantra-sub {
      font-size: 14px;
      font-weight: 700;
      color: #f5d77f;
    }
    .layout-1x1 .footer-brand {
      font-family: 'Cinzel', serif;
      font-size: 13px;
      font-weight: 800;
      color: #d4af37;
      letter-spacing: 2px;
      text-align: center;
      padding-top: 8px;
      border-top: 1px solid rgba(212, 175, 55, 0.3);
    }

    /* === LAYOUT 4:5 (FOTO GRANDE 580px / TEXTO AREJADO 770px) === */
    .layout-4x5 {
      display: flex;
      flex-direction: column;
      width: 1080px;
      height: 1350px;
    }
    .layout-4x5 .photo-header {
      width: 1080px;
      height: 560px;
      background-size: cover;
      background-position: center;
      position: relative;
    }
    .layout-4x5 .photo-gradient-fade {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(to bottom, rgba(8,5,2,0.1) 0%, rgba(8,5,2,0.3) 60%, #0c0602 100%);
    }
    .layout-4x5 .photo-border-top {
      position: absolute;
      top: 24px; left: 24px; right: 24px; bottom: 24px;
      border: 1.5px solid rgba(245, 215, 127, 0.4);
      pointer-events: none;
    }
    .layout-4x5 .text-container-large {
      width: 1080px;
      height: 790px;
      background: linear-gradient(180deg, #0c0602 0%, #1a0d04 50%, #080401 100%);
      padding: 24px 50px 36px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: center;
      border-top: 3px solid #d4af37;
    }
    .layout-4x5 .tag-header {
      font-family: 'Cinzel', serif;
      font-size: 15px;
      font-weight: 800;
      color: #f5d77f;
      letter-spacing: 3px;
      margin-bottom: 4px;
    }
    .layout-4x5 .title-main {
      font-family: 'Cinzel', serif;
      font-size: 38px;
      font-weight: 900;
      color: #ffffff;
      line-height: 1.15;
      letter-spacing: 1.5px;
      text-shadow: 0 0 25px rgba(245, 215, 127, 0.6);
    }
    .layout-4x5 .subtitle-text {
      font-family: 'Playfair Display', serif;
      font-style: italic;
      font-weight: 700;
      font-size: 22px;
      color: #f5d77f;
      margin-top: 4px;
    }
    .layout-4x5 .divider-gold {
      display: flex;
      align-items: center;
      margin: 10px 0 12px;
      color: #d4af37;
      font-size: 16px;
    }
    .layout-4x5 .divider-gold::before, .layout-4x5 .divider-gold::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid rgba(212, 175, 55, 0.4);
    }
    .layout-4x5 .divider-gold span {
      padding: 0 12px;
    }
    .layout-4x5 .body-content {
      font-family: 'Montserrat', sans-serif;
      font-size: 20px;
      font-weight: 600;
      color: #ffffff;
      line-height: 1.55;
      text-align: justify;
      text-align-last: center;
      padding: 0 16px;
    }
    .layout-4x5 .body-content p {
      margin-bottom: 12px;
    }
    .layout-4x5 .mantra-box-highlight {
      background: rgba(212, 175, 55, 0.16);
      border: 2px solid #d4af37;
      border-radius: 12px;
      padding: 16px 20px;
      box-shadow: 0 6px 25px rgba(0,0,0,0.7);
      margin-bottom: 12px;
    }
    .layout-4x5 .mantra-title {
      font-family: 'Cinzel', serif;
      font-size: 22px;
      font-weight: 900;
      color: #ffffff;
      letter-spacing: 2px;
      margin-bottom: 4px;
      text-shadow: 0 0 15px rgba(245, 215, 127, 0.8);
    }
    .layout-4x5 .mantra-meaning {
      font-size: 16px;
      font-weight: 700;
      color: #f5d77f;
    }
    .layout-4x5 .footer-brand {
      font-family: 'Cinzel', serif;
      font-size: 14px;
      font-weight: 800;
      color: #d4af37;
      letter-spacing: 2px;
      border-top: 1px solid rgba(212, 175, 55, 0.3);
      padding-top: 10px;
    }

    /* === LAYOUT 9:16 (FOTO GRANDE 860px / TEXTO IMERSIVO 1060px) === */
    .layout-9x16 {
      display: flex;
      flex-direction: column;
      width: 1080px;
      height: 1920px;
      background: #080502;
    }
    .layout-9x16 .photo-header-story {
      width: 1080px;
      height: 840px;
      background-size: cover;
      background-position: center;
      position: relative;
    }
    .layout-9x16 .photo-gradient-fade-story {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(to bottom, rgba(8,5,2,0.1) 0%, rgba(8,5,2,0.35) 60%, #0c0602 100%);
    }
    .layout-9x16 .photo-border-story {
      position: absolute;
      top: 36px; left: 36px; right: 36px; bottom: 36px;
      border: 1.5px solid rgba(245, 215, 127, 0.45);
      pointer-events: none;
    }
    .layout-9x16 .text-container-story {
      width: 1080px;
      height: 1080px;
      background: linear-gradient(180deg, #0c0602 0%, #1c0e04 50%, #080401 100%);
      padding: 30px 52px 48px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: center;
      border-top: 3px solid #d4af37;
    }
    .layout-9x16 .tag-header {
      font-family: 'Cinzel', serif;
      font-size: 16px;
      font-weight: 800;
      color: #f5d77f;
      letter-spacing: 3px;
      margin-bottom: 4px;
    }
    .layout-9x16 .title-main {
      font-family: 'Cinzel', serif;
      font-size: 42px;
      font-weight: 900;
      color: #ffffff;
      line-height: 1.15;
      letter-spacing: 1.5px;
      text-shadow: 0 0 30px rgba(245, 215, 127, 0.7);
    }
    .layout-9x16 .subtitle-text {
      font-family: 'Playfair Display', serif;
      font-style: italic;
      font-weight: 700;
      font-size: 24px;
      color: #f5d77f;
      margin-top: 4px;
    }
    .layout-9x16 .divider-gold {
      display: flex;
      align-items: center;
      margin: 12px 0 16px;
      color: #d4af37;
      font-size: 18px;
    }
    .layout-9x16 .divider-gold::before, .layout-9x16 .divider-gold::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid rgba(212, 175, 55, 0.4);
    }
    .layout-9x16 .divider-gold span {
      padding: 0 14px;
    }
    .layout-9x16 .body-content {
      font-family: 'Montserrat', sans-serif;
      font-size: 22px;
      font-weight: 600;
      color: #ffffff;
      line-height: 1.62;
      text-align: justify;
      text-align-last: center;
      padding: 0 16px;
    }
    .layout-9x16 .body-content p {
      margin-bottom: 16px;
    }
    .layout-9x16 .mantra-box-highlight {
      background: rgba(212, 175, 55, 0.18);
      border: 2px solid #d4af37;
      border-radius: 14px;
      padding: 20px 24px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.8);
      margin-bottom: 14px;
    }
    .layout-9x16 .mantra-title {
      font-family: 'Cinzel', serif;
      font-size: 24px;
      font-weight: 900;
      color: #ffffff;
      letter-spacing: 2px;
      margin-bottom: 6px;
      text-shadow: 0 0 20px rgba(245, 215, 127, 0.9);
    }
    .layout-9x16 .mantra-meaning {
      font-size: 18px;
      font-weight: 700;
      color: #f5d77f;
    }
    .layout-9x16 .footer-brand {
      font-family: 'Cinzel', serif;
      font-size: 15px;
      font-weight: 800;
      color: #d4af37;
      letter-spacing: 2.5px;
      border-top: 1px solid rgba(212, 175, 55, 0.3);
      padding-top: 14px;
    }
  </style>
</head>
<body>
  ${contentHtml}
</body>
</html>
`;

async function main() {
  console.log('🚀 Iniciando renderização APRIMORADA com IMAGENS AMPLIADAS e DISPOSIÇÃO TIPOGRÁFICA HARMONIOSA...');
  const browser = await chromium.launch({ headless: true });

  const generatedFiles = [];

  for (let pIdx = 0; pIdx < photos.length; pIdx++) {
    const photo = photos[pIdx];
    console.log(`\n📸 Processando Foto ${pIdx + 1}/3: ${photo.name}`);

    for (let lIdx = 0; lIdx < layouts.length; lIdx++) {
      const layout = layouts[lIdx];
      const filename = `${photo.key}_${layout.id}.png`;
      console.log(`   🎨 Renderizando Variação ${lIdx + 1}/3: ${layout.formatLabel}`);

      const photoBase64 = `data:image/jpeg;base64,${fs.readFileSync(photo.src).toString('base64')}`;

      const context = await browser.newContext({
        viewport: { width: layout.width, height: layout.height },
        deviceScaleFactor: 1
      });
      const page = await context.newPage();

      const htmlContent = templateBaseHtml(layout.renderHtml(photoBase64), layout.width, layout.height);
      await page.setContent(htmlContent, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(400);

      const pathFotos = path.join(outDirFotos, filename);
      const pathOutputs = path.join(outDirOutputs, filename);
      const pathExemplos = path.join(outDirExemplos, filename);

      await page.screenshot({ path: pathFotos, fullPage: true });
      fs.copyFileSync(pathFotos, pathOutputs);
      fs.copyFileSync(pathFotos, pathExemplos);

      const sizeKb = (fs.statSync(pathFotos).size / 1024).toFixed(0);
      console.log(`   ✅ Salvo com sucesso: ${filename} (${sizeKb} KB)`);

      generatedFiles.push({
        filename,
        photoName: photo.name,
        format: layout.formatLabel,
        dimensions: `${layout.width}x${layout.height}px`,
        sizeKb,
        pathFotos
      });

      await context.close();
    }
  }

  // Gera o relatório visual em HTML
  const reportHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pedaço do Céu — Prece pelo Tibete & Nepal (Imagens Ampliadas & Tipografia Harmoniosa)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=Montserrat:wght@400;600;700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #060908;
      color: #f8f9fa;
      font-family: 'Montserrat', sans-serif;
      padding: 40px 24px;
      line-height: 1.6;
    }
    .container { max-width: 1300px; margin: 0 auto; }
    header {
      text-align: center;
      margin-bottom: 40px;
      border-bottom: 1px solid rgba(212, 175, 55, 0.3);
      padding-bottom: 30px;
    }
    .badge {
      display: inline-block;
      padding: 6px 18px;
      border: 1px solid #d4af37;
      border-radius: 999px;
      color: #f5d77f;
      font-size: 13px;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    h1 {
      font-family: 'Cinzel', serif;
      font-size: 34px;
      color: #ffffff;
      margin-bottom: 10px;
    }
    .subtitle {
      font-family: 'Playfair Display', serif;
      font-style: italic;
      font-size: 20px;
      color: #f5d77f;
      margin-bottom: 20px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
      gap: 32px;
    }
    .card {
      background: #0d120f;
      border: 1px solid rgba(212, 175, 55, 0.4);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.6);
      display: flex;
      flex-direction: column;
    }
    .card-img-wrap {
      background: #000;
      padding: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card-img-wrap img {
      max-width: 100%;
      height: auto;
      border-radius: 6px;
      border: 1px solid rgba(212, 175, 55, 0.3);
    }
    .card-info {
      padding: 20px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .card-title {
      font-family: 'Cinzel', serif;
      font-size: 18px;
      color: #f5d77f;
      margin-bottom: 6px;
    }
    .card-desc {
      font-size: 14px;
      color: #d0c4a8;
      margin-bottom: 12px;
    }
    .card-meta {
      font-size: 12px;
      color: rgba(255,255,255,0.6);
      border-top: 1px solid rgba(255,255,255,0.1);
      padding-top: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="badge">✦ Pedaço do Céu • Solidariedade & Fé ✦</div>
      <h1>Prece Sagrada pelo Tibete & Nepal</h1>
      <div class="subtitle">9 Criativos de Alta Resolução com Imagens Ampliadas e Disposição Tipográfica Harmoniosa</div>
    </header>
    <div class="grid">
      ${generatedFiles.map(f => `
        <div class="card">
          <div class="card-img-wrap">
            <a href="${f.filename}" target="_blank">
              <img src="${f.filename}" alt="${f.photoName}">
            </a>
          </div>
          <div class="card-info">
            <div>
              <h2 class="card-title">${f.photoName}</h2>
              <p class="card-desc"><strong>${f.format}</strong> (${f.dimensions})</p>
            </div>
            <div class="card-meta">
              Arquivo: <code>${f.filename}</code> (${f.sizeKb} KB)
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(outDirFotos, 'index.html'), reportHtml, 'utf8');
  fs.writeFileSync(path.join(outDirOutputs, 'index.html'), reportHtml, 'utf8');
  fs.writeFileSync(path.join(outDirExemplos, 'index.html'), reportHtml, 'utf8');

  console.log(`\n🎉 Todas as 9 peças renderizadas com sucesso absoluto, imagens ampliadas e disposição harmoniosa!`);
  await browser.close();
}

main().catch(err => {
  console.error('❌ Erro na renderização:', err);
  process.exit(1);
});
