# ✦ Pedaço do Céu — Fábrica de Conteúdo & Studio Místico

[![CI Suite](https://github.com/gitreginato/pedaco-do-ceu/actions/workflows/ci.yml/badge.svg)](https://github.com/gitreginato/pedaco-do-ceu/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-gold.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org)

Plataforma de design automatizado, estúdio interativo HTML5 Canvas 2D (High-DPI 2x) e esteira de geração de conteúdo orientada a dados para o acervo holístico, litoterapêutico e sagrado da **Pedaço do Céu** em São Luís (Maranhão).

---

## 🌟 Visão Geral

O projeto resolve o desafio de produzir criativos digitais de altíssimo requinte estético e coerência conceitual para redes sociais (Instagram e TikTok) em escala, mantendo a autenticidade das tradições espirituais e a proibição inegociável de comercialismo agressivo.

### Pilares Fundamentais:
1. **Studio Canvas 2D Interativo:** Renderizador multicamadas de alta resolução (2x) com suporte a formatos Feed 1:1, Feed 4:5, Story 9:16 e TikTok 9:16.
2. **Catálogo Estruturado de Dados (`catalogo/`):** Base central em JSON validada por JSON Schema, mapeando propriedades energéticas, cromáticas e editoriais de cada produto.
3. **Skills Especializadas dos Agentes:** Conhecimento encapsulado para pesquisa holística, análise cromática de imagens, ganchos conectados a São Luís e redação poética.
4. **Esteira de Geração em Lote (`scripts/generate_posts.mjs`):** Automação com Playwright headless que consome o catálogo e gera artes finais, legendas, textos alternativos e metadados.

---

## 📐 Arquitetura do Studio Canvas

O motor visual opera sobre o paradigma de renderização em camadas com profundidade z-index estrita:

```
[ Canvas Viewport ]
       │
  ┌────┴──────────────────────────┐
  │  (Z: 50) Cantoneiras Barrocas │ ➔ CornersLayer
  │  (Z: 40) Tipografia Sagrada   │ ➔ TextLayer (Auto Text-Fit & Safe Areas)
  │  (Z: 35) Degradê de Contraste │ ➔ OverlayLayer (Modos Bottom / Top / Center)
  │  (Z: 30) Geometrias Sagradas  │ ➔ PatternLayer (Path2D Vetorizado)
  │  (Z: 20) Foto do Produto      │ ➔ ImageLayer (Split Áureo 60/40 ou Full)
  │  (Z: 10) Fundo & Degradê      │ ➔ GradientLayer (3 Pontos de Cor)
  └───────────────────────────────┘
```

---

## 🚀 Instalação e Execução

### Pré-requisitos
* **Node.js:** versão 20.x ou superior.
* **NPM:** versão 10.x ou superior.

### 1. Clonar e Instalar Dependências
```bash
git clone https://github.com/gitreginato/pedaco-do-ceu.git
cd pedaco-do-ceu
npm install
```

### 2. Compilar o Bundle do Estúdio (esbuild)
```bash
npm run build
```

### 3. Executar a Suíte Completa de Testes
```bash
npm test
```

### 4. Executar a Esteira de Geração em Lote
Gera automaticamente criativos de alta resolução e legendas para todos os itens do catálogo marcados como `pronto_para_render` ou `revisado`:
```bash
npm run generate
```
Os arquivos gerados são salvos em `./dist/posts/AAAA-MM-DD-<id-item>/`:
* `arte_feed.png` (Resolução 2x para Feed)
* `arte_story.png` (Resolução 2x para Story/TikTok)
* `legenda.txt` (Cópia formatada para publicação)
* `alt_text.txt` (Texto alternativo para acessibilidade)
* `metadados.json` (Especificação completa de renderização)

---

## 📂 Estrutura do Catálogo (`catalogo/`)

O catálogo é regido pelo schema `./catalogo/schema.json` e armazena:
* **Identificação:** `id`, `item`, `categoria` (`cristais`, `aromatizacao`, `estatuas`, `joias`, `bem-estar`).
* **Atributos Visuais:** `cor_predominante`, `simbolo_layout`, `fundo_sugerido`.
* **Atributos Holísticos:** `chakra`, `elemento`, `signos_afins`, `palavras_chave`, `metodo_limpeza`.
* **Dados de Conteúdo:** `gancho`, `corpo_legenda`, `cta`, `hashtags`, `alt_text`.
* **Status do Fluxo:** `rascunho` ➔ `revisado` ➔ `pronto_para_render` ➔ `renderizado` ➔ `publicado`.

---

## 🛡️ Diretrizes de Conteúdo & Regras da Marca

* **Sem Preços ou Promoções:** Nunca exibir cifrões, números de valor ou chamadas agressivas ("compre já", "desconto").
* **Experiência Presencial em São Luís (MA):** CTAs convidam o cliente ao acolhimento e à vivência sensorial no espaço físico da loja.
* **Ética Terapêutica:** Nunca prometer cura médica ou física (conformidade ANVISA).

---

## 📜 Licença

Distribuído sob a licença [MIT](LICENSE).
