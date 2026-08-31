# Pedaço do Céu — Fábrica de Conteúdo & Template Studio Místico v2.0 Enterprise

Documentação de arquitetura, contexto, skills dos agentes e diretrizes operacionais para o projeto **Pedaço do Céu** (São Luís, Maranhão).

---

## 1. Visão Geral do Projeto & Missão

O **Pedaço do Céu** é um ecossistema holístico que une um estúdio visual interativo High-DPI 2x (HTML5 Canvas 2D) com uma esteira orientada a dados para geração em lote de criativos e cópias poéticas para redes sociais (Instagram Feed 1:1, Feed 4:5, Story 9:16 e TikTok).

### Princípios Sagrados & Regras de Negócio Inegociáveis
1. **Ausência Total de Preços e Comercialismo Agressivo:** Os criativos e textos nunca exibem cifrões ("R$"), números de preço ou termos como "compre já", "promoção" ou "desconto". O foco de toda peça é a vibração energética, litoterapia, sabedoria ancestral e bem-estar espiritual.
2. **Convite Presencial para São Luís (MA):** As chamadas para ação (CTAs) convidam o seguidor a vivenciar uma experiência sensorial e acolhedora no espaço físico da loja em São Luís.
3. **Ética & Conformidade Terapêutica:** Proibição estrita de promessas de cura física ou médica (conformidade com ANVISA e diretrizes éticas integrativas).
4. **Regra de Ouro da Engine de Layout:** O layout **Lateral (`right` / `left`)** aplica a proporção áurea (split 60/40). Os layouts **Rodapé (`bottom`)**, **Topo (`top`)** e **Centro (`center`)** utilizam camadas de sobreposição em degradê suave (`OverlayLayer`, z-index 35) para assegurar legibilidade perfeita sobre qualquer foto.
5. **Robustez de Renderização:** O texto nunca vaza da área segura (*Safe Areas*). A engine possui cálculo automático de quebra de linha (`measureWrappedText`) e auto text-fit.

---

## 2. Estrutura do Repositório

```
./
├── AGENTS.md                          # Documento mestre de referência
├── README.md                          # Guia geral de uso e inicialização
├── LICENSE                            # Licença MIT
├── package.json                       # Scripts npm de build, test e generate
├── catalogo/                          # Base de dados orientada a schema
│   ├── schema.json                    # JSON Schema de validação dos produtos
│   └── itens.json                     # Itens catalogados com atributos e status
├── skills/                            # Skills especializadas dos agentes
│   ├── pesquisa-holistica/SKILL.md    # Propriedades metafísicas e conformidade ética
│   ├── analise-imagem/SKILL.md        # Análise cromática, geometrias e alt_text
│   ├── temas-editoriais/SKILL.md      # Calendário lunar e conexão com São Luís (MA)
│   ├── copywriter-mistico/SKILL.md    # Arquétipos Mago+Sábio+Criador e CTAs
│   ├── holistic-mystic-wisdom/SKILL.md# Compêndio geral dos 6 pilares do acervo
│   └── tibetan-wisdom/SKILL.md        # Tradição dos Himalaias, taças e mantras
├── scripts/
│   ├── generate_posts.mjs             # Script da esteira de geração em lote
│   └── enhance_photos.py              # Script executável de tratamento de fotos
├── dist/                              # Saída da esteira geradora
│   └── posts/                         # Pastas de posts gerados por data/item
├── Fotos/                             # Acervo fotográfico real catalogado
│   ├── Arcanjo Miguel/                # Imagens da linha São Miguel
│   ├── Bem Estar/                     # Cristais, sabonetes fitoenergéticos e velas
│   ├── Kailash/                       # Incensos artesanais e defumadores nobres
│   ├── Logo/                          # Logomarca oficial Pedaço do Céu
│   ├── NOA/                           # Imagens e peças da Linha NOA Orixás
│   ├── TIbate/                        # Taças tibetanas e símbolos sagrados
│   └── zodiaco/                       # Peças dos signos e mapas astrais
└── design-system/                     # Aplicação web do Studio Canvas
    ├── index.html                     # Interface SPA do estúdio com abas e canvas
    ├── styles.css                     # Folha de estilo principal integrada
    ├── app.js                         # Bundle compilado do estúdio
    ├── package.json                   # Dependências e scripts locais
    ├── css/                           # Tokens e componentes modulares
    ├── js/                            # Código-fonte modular ESM do Canvas Studio
    └── tests/                         # Suíte de testes em 3 camadas e E2E
```

---

## 3. Skills dos Agentes de Automação

O ecossistema opera através de 6 skills integradas:
1. **`pesquisa-holistica`** (`./skills/pesquisa-holistica/SKILL.md`): Mapeia chakras, elementos primordiais e métodos de limpeza com rigor ético.
2. **`analise-imagem`** (`./skills/analise-imagem/SKILL.md`): Extrai paleta cromática de degradê e gera `alt_text` acessível.
3. **`temas-editoriais`** (`./skills/temas-editoriais/SKILL.md`): Conecta fases lunares com marés equatoriais e festas populares de São Luís (MA).
4. **`copywriter-mistico`** (`./skills/copywriter-mistico/SKILL.md`): Redige cópias inspiradoras e convites presenciais.
5. **`holistic-mystic-wisdom`** (`./skills/holistic-mystic-wisdom/SKILL.md`): Conhecimento dos 6 pilares do acervo.
6. **`tibetan-wisdom`** (`./skills/tibetan-wisdom/SKILL.md`): Sabedoria Vajrayana e cura sonora em 432Hz.

---

## 4. Presets Místicos Disponíveis no Studio

* **✦ Ativação Cristalina:** Fundo Esmeralda Sagrado (`#00381c` a `#008542`), Flor da Vida, Moldura Portal de Ouro, Cinzel Decorative + Cormorant Garamond.
* **🌙 Mandala Lunar 432Hz:** Fundo Azul Meia-Noite Cósmico (`#0a0e27` a `#1c2758`), Mandala Lunar, Marcellus + Playfair Display.
* **🔮 Portal dos Arcanjos:** Fundo Púrpura Celestial (`#1a052b` a `#3d125e`), Cubo de Metatron, Cinzel + EB Garamond.
* **🌿 Sabedoria Ancestral:** Fundo Verde Floresta & Âmbar Dourado (`#1b2e15` a `#3b5e28`), Sri Yantra, Bodoni Moda + Montserrat.
* **🔥 Chama Trina Sagrada:** Fundo Rubi Sagrado & Ouro Puro (`#2b080c` a `#5c121c`), Símbolo Sagrado da Marca, UnifrakturMaguntia + Fondamento.

---

## 5. Comandos e Ciclo de Vida do Projeto

### Compilação do Bundle do Studio (esbuild)
```bash
npm run build
```

### Execução da Suíte Completa de Testes
```bash
npm test
```

### Geração Automatizada de Posts em Lote
```bash
npm run generate
```

### Tratamento de Fotos com Python
```bash
python3 scripts/enhance_photos.py
```
