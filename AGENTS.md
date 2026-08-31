# ✦ Pedaço do Céu: Fábrica de Conteúdo & Template Studio Místico v2.0 Enterprise

Documentação de arquitetura, contexto, diretrizes de marca, ecossistema de skills e briefings operacionais para o projeto **Pedaço do Céu** (São Luís, Maranhão).

---

## 1. Visão Geral do Projeto & Missão

O **Pedaço do Céu** é um ecossistema holístico que une um estúdio visual interativo High-DPI 2x (HTML5 Canvas 2D) com uma esteira orientada a dados para geração de criativos e textos inspiradores para redes sociais (Instagram Feed 1:1, Feed 4:5, Story 9:16 e TikTok).

A loja física em São Luís reúne um acervo diversificado de **mais de 1.000 itens**, abrangendo a cultura das pedras naturais, imagens de diversas religiões, perfumaria botânica, apetrechos para a casa, lembrancinhas e itens para o dia a dia holístico. As fotos catalogadas no sistema representam apenas uma pequena fração dessa rica tapeçaria de produtos.

### Princípios da Marca & Regras Inegociáveis
1. **Ausência Total de Preços e Comercialismo Agressivo:** Os criativos e textos nunca exibem cifrões ("R$"), números de preço ou termos como "compre já", "promoção" ou "desconto". O foco de toda peça é o valor cultural, a beleza das pedras, o aconchego do lar e o bem-estar diário.
2. **Convite Presencial para São Luís (MA):** As chamadas para ação (CTAs) convidam o seguidor a vivenciar uma experiência acolhedora no espaço físico da loja em São Luís para explorar a imensa variedade de produtos.
3. **Respeito à Pluralidade Espiritual:** Espaço ecumênico que acolhe com reverência a devoção a santos, orixás, anjos, mestres e símbolos de todas as tradições de fé.
4. **Ética Terapêutica:** Apresentação de pedras e aromas como práticas integrativas e complementares de bem-estar e relaxamento (em conformidade com a ANVISA e a ética da saúde).
5. **Robustez e Versatilidade de Layout:** O motor visual foi desenhado para emoldurar com excelência qualquer um dos mais de mil itens, aplicando safe areas, proporção áurea e auto text-fit.

---

## 2. Estrutura do Repositório

```
./
├── AGENTS.md                          # Documento mestre de referência e ecossistema
├── README.md                          # Guia geral de uso e inicialização
├── LICENSE                            # Licença MIT
├── package.json                       # Scripts npm de build, test e generate
├── brand/                             # Diretrizes de Marca e Identidade
│   ├── brand-book.md                  # Manifesto, Missão, Visão, Valores e Arquétipos
│   ├── identidade-verbal.md           # Tom de voz, léxico sagrado e conformidade
│   ├── identidade-visual.md           # Paleta cromática, tipografia e geometrias
│   └── diretrizes-artesanato.md       # Curadoria das pedras, aromas, estatuária e presentes
├── briefing/                          # Briefings Estratégicos do Negócio (+1.000 Itens)
│   ├── briefing-institucional.md      # Ficha técnica, posicionamento e personas
│   ├── briefing-conteudo.md           # 6 pilares de conteúdo e esteira editorial
│   └── matriz-acervo.md               # Detalhamento dos 6 grandes eixos de produtos
├── catalogo/                          # Base de dados orientada a schema (exemplos representativos)
│   ├── schema.json                    # JSON Schema de validação dos produtos
│   └── itens.json                     # Itens catalogados com atributos e status
├── skills/                            # Skills especializadas dos agentes
│   ├── pesquisa-holistica/SKILL.md    # Propriedades metafísicas e conformidade ética
│   ├── analise-imagem/SKILL.md        # Análise cromática, geometrias e alt_text
│   ├── temas-editoriais/SKILL.md      # Calendário lunar e conexão com São Luís (MA)
│   ├── copywriter-mistico/SKILL.md    # Arquétipos Mago+Sábio+Criador e CTAs
│   ├── holistic-mystic-wisdom/SKILL.md# Compêndio geral dos pilares do acervo
│   └── tibetan-wisdom/SKILL.md        # Tradições orientais e harmonia sonora
├── scripts/
│   ├── generate_posts.mjs             # Script da esteira de geração em lote
│   └── enhance_photos.py              # Script executável de tratamento de fotos
├── dist/                              # Saída da esteira geradora
│   └── posts/                         # Pastas de posts gerados por data/item
├── Fotos/                             # Amostras do acervo fotográfico real
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

## 3. Matriz de Skills do Sistema & Composição da Marca

| Área Estratégica | Skills Integradas | Função Direcionada à Pedaço do Céu |
| :--- | :--- | :--- |
| **SEO & Descoberta Local** | `seo-engine`, `geo-optimizer` | SEO local para São Luís (MA), Schema LocalBusiness / Store / Artisan, palavras-chave amplas ("pedras naturais são luís", "artigos holísticos maranhão", "incensos naturais são luís", "presentes afetivos são luís"). |
| **Copywriting Cultural** | `copywriter-mistico`, `copy-architect`, `copy-gate` | Arquétipos Mago+Sábio+Criador, ganchos sobre a cultura das pedras e o aconchego do lar, sem clichês comerciais e com total conformidade ética. |
| **CTA & Acolhimento** | `cta-forge`, `behavior-lever`, `cro-master` | Convites afetuosos para visitar a loja e conhecer a variedade de mais de mil itens ("Venha conhecer nossa casa em São Luís e sentir os aromas de perto"). |
| **Conteúdo & Cotidiano** | `content-strategist`, `temas-editoriais`, `data-storytelling` | Planejamento de conteúdo focado em bem-estar no lar, curiosidades geológicas, datas especiais e ideias de presentes com significado. |
| **Curadoria & Conhecimento**| `holistic-mystic-wisdom`, `pesquisa-holistica`, `tibetan-wisdom` | Conhecimento sobre cultura mineral, tradições religiosas plurais, botânica aromática e práticas de relaxamento. |
| **Design & Prompts Visuais**| `nano-banana-prompt-engine`, `jewelry-prompt-engine`, `analise-imagem` | Prompts em JSON para realce estético de qualquer item do acervo (pedras, imagens, incensos, lembrancinhas), extração de paletas e alt-text acessível. |
| **Qualidade & Linguagem** | `nlp-gate`, `ponytail`, `improve`, `secure-code` | Redação esmerada em português do Brasil, sem travessões, foco na clareza e elegância. |

---

## 4. Presets Místicos Disponíveis no Studio

*   **✦ Ativação Cristalina:** Fundo Esmeralda Sagrado (`#00381c` a `#008542`), Flor da Vida, Moldura Portal de Ouro, Cinzel Decorative + Cormorant Garamond.
*   **🌙 Mandala Lunar 432Hz:** Fundo Azul Meia-Noite Cósmico (`#0a0e27` a `#1c2758`), Mandala Lunar, Marcellus + Playfair Display.
*   **🔮 Portal dos Arcanjos:** Fundo Púrpura Celestial (`#1a052b` a `#3d125e`), Cubo de Metatron, Cinzel + EB Garamond.
*   **🌿 Sabedoria Ancestral:** Fundo Verde Floresta & Âmbar Dourado (`#1b2e15` a `#3b5e28`), Sri Yantra, Bodoni Moda + Montserrat.
*   **🔥 Chama Trina Sagrada:** Fundo Rubi Sagrado & Ouro Puro (`#2b080c` a `#5c121c`), Símbolo Sagrado da Marca, UnifrakturMaguntia + Fondamento.

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
