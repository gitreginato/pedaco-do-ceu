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

    // 3. metadados.json
    const metadata = {
      id: item.id,
      item: item.item,
      categoria: item.categoria,
      data_geracao: new Date().toISOString(),
      arquivos_gerados: {
        feed: 'arte_feed.png',
        story: 'arte_story.png',
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
