# ✦ Pedaço do Céu: Fábrica de Conteúdo & Studio Místico

[![CI Suite](https://github.com/gitreginato/pedaco-do-ceu/actions/workflows/ci.yml/badge.svg)](https://github.com/gitreginato/pedaco-do-ceu/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-gold.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org)

Plataforma de design automatizado, estúdio interativo HTML5 Canvas 2D (High-DPI 2x) e esteira de geração de conteúdo orientada a dados para o acervo de bem-estar, pedras naturais, perfumaria botânica, arte sacra e lembrancinhas da **Pedaço do Céu** em São Luís (Maranhão).

---

## 🌟 Visão Geral

A **Pedaço do Céu** é um espaço de acolhimento físico em São Luís com um acervo vivo de **mais de 1.000 itens**, abrangendo a cultura das pedras naturais, perfumaria botânica, imagens de diversas tradições de fé, apetrechos para a casa e lembrancinhas com significado.

O Studio Canvas e a esteira automatizada resolvem o desafio de produzir criativos digitais com refinamento estético clássico em escala para qualquer item do acervo, mantendo o tom acolhedor e a proibição de comercialismo agressivo.

### Pilares Fundamentais:
1. **Documentação de Marca & Briefings (`brand/` e `briefing/`):** Brand Book, diretrizes de curadoria, identidade verbal e briefings estratégicos para os 6 grandes eixos do catálogo (+1.000 itens).
2. **Studio Canvas 2D Interativo (`design-system/`):** Renderizador multicamadas de alta resolução (2x) com suporte a formatos Feed 1:1, Feed 4:5, Story 9:16 e TikTok 9:16.
3. **Catálogo Estruturado de Dados (`catalogo/`):** Base em JSON validada por schema para amostragem e automação de itens.
4. **Skills Especializadas dos Agentes:** Conhecimento encapsulado para cultura mineral, SEO local, narrativas sobre o aconchego do lar e redação poética.
5. **Esteira de Geração em Lote (`scripts/generate_posts.mjs`):** Automação com Playwright headless que consome o catálogo e gera artes finais, legendas, textos alternativos e metadados.

---

## 📐 Arquitetura do Studio Canvas

O motor visual opera sobre o paradigma de renderização em camadas com profundidade z-index estrita:

```
[ Canvas Viewport ]
       │
  ┌────┴──────────────────────────┐
  │  (Z: 50) Cantoneiras Clássicas│ ➔ CornersLayer
  │  (Z: 40) Tipografia Sagrada   │ ➔ TextLayer (Auto Text-Fit & Safe Areas)
  │  (Z: 35) Degradê de Contraste │ ➔ OverlayLayer (Modos Bottom / Top / Center)
  │  (Z: 30) Geometrias & Padrões │ ➔ PatternLayer (Path2D Vetorizado)
  │  (Z: 20) Foto de Qualquer Item│ ➔ ImageLayer (Split Áureo 60/40 ou Full)
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

## 📂 Estrutura do Repositório

* **`brand/`**: Brand Book, Identidade Verbal, Identidade Visual e Diretrizes de Curadoria de Produtos.
* **`briefing/`**: Briefing Institucional, Briefing de Conteúdo e Matriz dos 6 Grandes Eixos (+1.000 Itens).
* **`catalogo/`**: Catálogo estruturado regido por `schema.json` para amostragem de dados.
* **`skills/`**: Skills dos agentes para pesquisa holística, análise de imagem, temas e redação.
* **`Fotos/`**: Amostras do acervo fotográfico real organizado por categorias.

---

## 🛡️ Diretrizes de Conteúdo & Regras da Marca

* **Sem Preços ou Promoções:** Nunca exibir cifrões, números de valor ou chamadas agressivas ("compre já", "desconto").
* **Experiência Presencial em São Luís (MA):** CTAs convidam o cliente ao acolhimento e à vivência sensorial no espaço físico da loja.
* **Ética Terapêutica:** Apresentação dos itens como práticas de bem-estar integrativo e complementar (conformidade ANVISA).

---

## 📜 Licença

Distribuído sob a licença [MIT](LICENSE).
