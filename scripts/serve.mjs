import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '/design-system' || reqPath === '/design-system/') {
    reqPath = '/design-system/index.html';
  }

  let filePath = path.join(rootDir, reqPath);

  // Se não existir diretamente na raiz, procura dentro do subdiretório design-system
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    const fallbackPath = path.join(rootDir, 'design-system', reqPath.replace(/^\//, ''));
    if (fs.existsSync(fallbackPath) && fs.statSync(fallbackPath).isFile()) {
      filePath = fallbackPath;
    }
  }

  // Prevenção contra Directory Traversal
  if (!filePath.startsWith(rootDir)) {
    res.writeHead(403);
    res.end('Acesso Negado');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`404: Arquivo não encontrado (${reqPath})`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });

    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n╔══════════════════════════════════════════════════════════════╗`);
  console.log(`║   ✦ PEDAÇO DO CÉU — SERVIDOR LOCAL DE ALTA RESOLUÇÃO        ║`);
  console.log(`╠══════════════════════════════════════════════════════════════╣`);
  console.log(`║   📍 Acesse o Estúdio: http://localhost:${PORT}             ║`);
  console.log(`║   ⚡ Exportações em PNG (4K) e HTML 100% liberadas sem CORS   ║`);
  console.log(`╚══════════════════════════════════════════════════════════════╝\n`);
});
