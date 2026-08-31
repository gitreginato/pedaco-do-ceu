#!/usr/bin/env node
/**
 * ESTEIRA AUTOMATIZADA DE GERAÇÃO DE POSTS EM LOTE
 * Pedaço do Céu — Fábrica de Conteúdo Sagrado v2.0
 *
 * Consome catalogo/itens.json e renderiza criativos em alta resolução (2x)
 * para Feed (1080x1350) e Story (1080x1920), gerando artes, legendas,
 * alt_text e metadados organizados em dist/posts/AAAA-MM-DD-<id-item>/
 */

import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const CATALOGO_PATH = path.join(ROOT_DIR, 'catalogo/itens.json');
const DIST_DIR = path.join(ROOT_DIR, 'dist/posts');
const STUDIO_URL = 'file://' + path.join(ROOT_DIR, 'design-system/index.html');

async function main() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║   ✦ ESTEIRA DE GERAÇÃO EM LOTE — PEDAÇO DO CÉU (v2.0)        ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  if (!fs.existsSync(CATALOGO_PATH)) {
    console.error(`❌ Arquivo do catálogo não encontrado: ${CATALOGO_PATH}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(CATALOGO_PATH, 'utf-8');
  const catalog = JSON.parse(rawData);

  // Filtra itens prontos para renderizar
  const itensParaRender = catalog.filter(
    item => item.status_fluxo === 'pronto_para_render' || item.status_fluxo === 'revisado'
  );

  if (itensParaRender.length === 0) {
    console.log('ℹ️  Nenhum item com status "pronto_para_render" ou "revisado" encontrado no catálogo.');
    console.log('   Para gerar posts, atualize o status dos itens em catalogo/itens.json.');
    process.exit(0);
  }

  console.log(`📦 Itens selecionados para processamento: ${itensParaRender.length}`);

  // Garante que a pasta dist/posts existe
  fs.mkdirSync(DIST_DIR, { recursive: true });

  const today = new Date().toISOString().split('T')[0];

  // Inicia o navegador Playwright
  console.log('🚀 Inicializando motor headless Playwright (Device Scale: 2x)...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1080 },
    devicePixelRatio: 2
  });
  const page = await context.newPage();

  console.log(`📍 Carregando Studio Canvas: ${STUDIO_URL}`);
  await page.goto(STUDIO_URL, { waitUntil: 'networkidle' });
  await page.waitForFunction('window.pedacoStudio && window.pedacoStudio.store');
  await page.waitForTimeout(500);

  let processados = 0;

  for (const item of itensParaRender) {
    const postDirName = `${today}-${item.id}`;
    const postOutputDir = path.join(DIST_DIR, postDirName);
    fs.mkdirSync(postOutputDir, { recursive: true });

    console.log(`\n──────────────────────────────────────────────────────────────`);
    console.log(`🔮 Processando item: [${item.id}] ${item.item}`);
    console.log(`📁 Pasta de saída: ${postOutputDir}`);

    const fotoPathAbs = path.join(ROOT_DIR, item.arquivo_foto);
    const fotoRelativaAoStudio = '../' + item.arquivo_foto;

    // 1. Configura dados do Studio via state
    const studioConfig = {
      title: item.item.toUpperCase(),
      subtitle: item.dados_post.gancho.replace(/^[✦🌸🌿ॐ\s]+/, ''),
      description: item.dados_post.corpo_legenda,
      categoryTag: item.categoria.toUpperCase(),
      highlightText: item.atributos_holisticos.palavras_chave.slice(0, 2).join(' • '),
      showHighlightBox: true,
      badgeText: item.atributos_holisticos.chakra ? item.atributos_holisticos.chakra.split(' ')[0] : 'Sagrado',
      showBadge: true,
      showBaroqueCorners: true,
      showSafeAreaGuide: false,
      sacredPattern: item.atributos_visuais.simbolo_layout || 'flowerOfLife',
      gradientPrimary: item.atributos_visuais.fundo_sugerido.gradientPrimary || '#2b0042',
      gradientSecondary: item.atributos_visuais.fundo_sugerido.gradientSecondary || '#581c87',
      gradientDarkness: item.atributos_visuais.fundo_sugerido.gradientDarkness || '#0d0216',
      colorTitleGlow: item.atributos_visuais.fundo_sugerido.colorTitleGlow || '#f5d77f',
      colorHighlight: '#f5d77f',
      colorHighlightBorder: '#d4af37',
      colorTag: '#d4af37',
      colorBadge: '#f5d77f',
      colorCta: '#d4af37',
      colorPattern: '#d4af37',
      colorCorners: '#d4af37',
      colorDividers: '#d4af37',
      ctaText: 'Pedaço do Céu • São Luís',
      fontTitle: "'Cinzel Decorative', serif",
      weightTitle: '700',
      sizeTitle: 48,
      fontSubtitle: "'Cormorant Garamond', serif",
      styleSubtitle: 'italic 500',
      sizeSubtitle: 24,
      fontDesc: "'Montserrat', sans-serif",
      sizeDesc: 18,
      lineHeightDesc: 1.6
    };

    // -------------------------------------------------------------
    // RENDER 1: FEED (1080x1350 - Formato 4:5 - Layout Lateral Right)
    // -------------------------------------------------------------
    console.log('   🎨 Renderizando Arte para Feed (1080x1350 4:5)...');
    await page.evaluate(async ({ cfg, imgSrc }) => {
      const studio = window.pedacoStudio;
      Object.assign(studio.store.state, {
        ...cfg,
        format: '4:5',
        width: 1080,
        height: 1350,
        layout: 'right'
      });
      await new Promise((resolve) => {
        studio.loadImage(imgSrc, resolve);
      });
      studio.syncUI();
      studio.renderer.requestRender();
    }, { cfg: studioConfig, imgSrc: fotoRelativaAoStudio });

    await page.waitForTimeout(600);

    const canvasFeed = await page.$('#renderCanvas');
    const feedPath = path.join(postOutputDir, 'arte_feed.png');
    if (canvasFeed) {
      await canvasFeed.screenshot({ path: feedPath });
      console.log('   ✅ arte_feed.png gerada com sucesso.');
    }

    // -------------------------------------------------------------
    // RENDER 2: STORY (1080x1920 - Formato 9:16 - Layout Bottom)
    // -------------------------------------------------------------
    console.log('   📱 Renderizando Arte para Story / Reels (1080x1920 9:16)...');
    await page.evaluate(async ({ cfg, imgSrc }) => {
      const studio = window.pedacoStudio;
      Object.assign(studio.store.state, {
        ...cfg,
        format: '9:16-story',
        width: 1080,
        height: 1920,
        layout: 'bottom',
        sizeTitle: 52,
        sizeSubtitle: 26,
        sizeDesc: 20
      });
      await new Promise((resolve) => {
        studio.loadImage(imgSrc, resolve);
      });
      studio.syncUI();
      studio.renderer.requestRender();
    }, { cfg: studioConfig, imgSrc: fotoRelativaAoStudio });

    await page.waitForTimeout(600);

    const canvasStory = await page.$('#renderCanvas');
    const storyPath = path.join(postOutputDir, 'arte_story.png');
    if (canvasStory) {
      await canvasStory.screenshot({ path: storyPath });
      console.log('   ✅ arte_story.png gerada com sucesso.');
    }

    // -------------------------------------------------------------
    // GERAÇÃO DOS ARQUIVOS DE TEXTO E METADADOS
    // -------------------------------------------------------------
    // 1. legenda.txt
    const legendaContent = `${item.dados_post.gancho}\n\n` +
      `${item.dados_post.corpo_legenda}\n\n` +
      `✦ ${item.dados_post.cta}\n\n` +
      `${item.dados_post.hashtags.join(' ')}\n`;
    fs.writeFileSync(path.join(postOutputDir, 'legenda.txt'), legendaContent, 'utf-8');
    console.log('   📝 legenda.txt criada.');

    // 2. alt_text.txt
    fs.writeFileSync(path.join(postOutputDir, 'alt_text.txt'), item.dados_post.alt_text + '\n', 'utf-8');
    console.log('   ♿ alt_text.txt criado.');

    // 3. post.html (Página autônoma de visualização e publicação)
    const feedBase64 = fs.readFileSync(feedPath).toString('base64');
    const htmlPageContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${item.item} | Pedaço do Céu</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Cinzel+Decorative:wght@700&family=Cormorant+Garamond:ital,wght@0,500;1,500&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-darkness: ${item.atributos_visuais.fundo_sugerido.gradientDarkness || '#0d0216'};
      --primary: ${item.atributos_visuais.fundo_sugerido.gradientPrimary || '#2b0042'};
      --secondary: ${item.atributos_visuais.fundo_sugerido.gradientSecondary || '#581c87'};
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
    }
  </style>
</head>
<body>
  <article class="post-container">
    <header class="post-header">
      <span class="post-brand">✦ PEDAÇO DO CÉU</span>
      <span class="post-badge">${item.categoria}</span>
    </header>
    
    <div class="post-image-wrapper">
      <img src="data:image/png;base64,${feedBase64}" alt="${item.dados_post.alt_text}">
    </div>

    <div class="post-content">
      <div class="post-tag">${item.categoria.toUpperCase()}</div>
      <h1 class="post-title">${item.item}</h1>
      <h2 class="post-subtitle">${item.dados_post.gancho}</h2>
      <p class="post-desc">${item.dados_post.corpo_legenda}</p>
      <div class="post-highlight">✦ ${item.atributos_holisticos.palavras_chave.join(' • ')}</div>
      <div class="post-cta">
        <span>📍</span>
        <span>${item.dados_post.cta}</span>
      </div>
    </div>

    <footer class="post-footer">
      <span>Fábrica de Conteúdo • São Luís (MA)</span>
      <button class="btn-copy" onclick="navigator.clipboard.writeText(document.querySelector('.post-desc').innerText).then(() => alert('Texto copiado!'))">Copiar Texto</button>
    </footer>
  </article>
</body>
</html>`;
    fs.writeFileSync(path.join(postOutputDir, 'post.html'), htmlPageContent, 'utf-8');
    console.log('   🌐 post.html criada.');

    // 4. metadados.json
    const metadata = {
      id: item.id,
      item: item.item,
      categoria: item.categoria,
      data_geracao: new Date().toISOString(),
      arquivos_gerados: {
        feed: 'arte_feed.png',
        story: 'arte_story.png',
        html: 'post.html',
        legenda: 'legenda.txt',
        alt_text: 'alt_text.txt'
      },
      dimensoes: {
        feed: '1080x1350',
        story: '1080x1920'
      },
      atributos_holisticos: item.atributos_holisticos,
      atributos_visuais: item.atributos_visuais
    };
    fs.writeFileSync(path.join(postOutputDir, 'metadados.json'), JSON.stringify(metadata, null, 2), 'utf-8');
    console.log('   📊 metadados.json criado.');

    // Atualiza status no objeto em memória
    item.status_fluxo = 'renderizado';
    item.data_ultima_renderizacao = new Date().toISOString();
    processados++;
  }

  await browser.close();

  // Salva o catálogo com os status atualizados
  fs.writeFileSync(CATALOGO_PATH, JSON.stringify(catalog, null, 2), 'utf-8');
  console.log(`\n💾 Catálogo atualizado: catalogo/itens.json (${processados} itens marcados como 'renderizado').`);

  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log(`║   🎉 ESTEIRA CONCLUÍDA: ${processados} POSTS COMPLETOS GERADOS!       ║`);
  console.log('╚══════════════════════════════════════════════════════════════╝');
}

main().catch(err => {
  console.error('\n❌ Erro fatal durante a esteira de geração:', err);
  process.exit(1);
});
