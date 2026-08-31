# Pedaço do Céu — Template Studio Místico & Sagrado v2.0 Enterprise

Documentação de arquitetura, contexto e diretrizes operacionais para agentes e desenvolvedores que atuam no projeto **Pedaço do Céu**.

---

## 1. Visão Geral do Projeto & Escopo

O **Pedaço do Céu Studio** é uma plataforma interativa de criação e renderização de criativos visuais em alta resolução (High-DPI 2x) baseada em HTML5 Canvas e CSS nativo. A ferramenta foi projetada exclusivamente para o acervo de artes sacras, produtos holísticos e esotéricos da loja.

### Princípios Sagrados & Regras de Negócio Inegociáveis
1. **Ausência Total de Preços e Valores Monetários:** Os criativos nunca exibem cifrões, números de preço ou termos comerciais agressivos. O foco de toda peça é a vibração energética, litoterapia, mantras, frequências harmônicas, simbologia ancestral e bem-estar espiritual.
2. **Regra de Ouro da Engine de Layout:** O layout **Lateral (`right`)** é a referência de proporção áurea (split 60/40). Os layouts **Rodapé (`bottom`)**, **Topo (`top`)** e **Centro (`center`)** utilizam camadas de sobreposição em degradê suave (`OverlayLayer`, z-index 35) para assegurar legibilidade perfeita sobre qualquer foto.
3. **Robustez de Renderização:** O texto nunca vaza da área segura. A engine possui cálculo automático de quebra de linha (`measureWrappedText`) e redução proporcional de tamanho de fonte (`Auto Text-Fit`).

---

## 2. Estrutura do Repositório

```
/home/mat77/Projetos/Pedaço do ceu /
├── AGENTS.md                          # Este documento mestre de referência
├── agent.md                           # Link simbólico para AGENTS.md
├── scripts/
│   └── enhance_photos.py              # Script executável de tratamento de fotos
├── Fotos/                             # Acervo fotográfico real catalogado
│   ├── Arcanjo Miguel/                # Imagens e imagens HDR da linha São Miguel
│   │   └── Tratadas/                  # Versões aprimoradas em alta definição (20 fotos)
│   ├── Bem Estar/                     # Cristais, sabonetes fitoenergéticos e velas
│   │   └── Tratadas/                  # Versões aprimoradas em alta definição (2 fotos)
│   ├── Kailash/                       # Incensos artesanais e defumadores nobres
│   │   └── Tratadas/                  # Versões aprimoradas em alta definição (4 fotos)
│   ├── Logo/                          # Logomarca oficial Pedaço do Céu
│   │   └── Tratadas/                  # Logomarcas aprimoradas (2 fotos)
│   ├── NOA/                           # Imagens e peças da Linha NOA Orixás
│   │   └── Tratadas/                  # Versão aprimorada em alta definição (1 foto)
│   ├── TIbate/                        # Taças tibetanas de 7 metais e símbolos sagrados
│   │   ├── DIZERES_DO_TIBETE.md       # Compêndio sagrado de provérbios e mantras
│   │   └── Tratadas/                  # Versões aprimoradas em alta definição (8 fotos)
│   └── zodiaco/                       # Peças dos signos e mapas astrais
│       └── Tratadas/                  # Versões aprimoradas em alta definição (3 fotos)
├── Fotos_Tratadas/                    # Backup consolidado das fotos tratadas
├── Fotos_Comparacao/                  # Imagens comparativas Antes/Depois lado a lado
└── design-system/                     # Aplicação web completa do estúdio
    ├── index.html                     # Interface SPA do estúdio com abas e canvas
    ├── styles.css                     # Folha de estilo principal integrada
    ├── app.js                         # Bundle universal compilado do estúdio
    ├── css/
    │   ├── tokens.css                 # Variáveis de cores místicas, fontes e raios
    │   └── components.css             # Componentes de UI, grids e anti-overflow
    ├── js/
    │   ├── tokens.js                  # Constantes JS, presets e dimensões
    │   ├── app.js                     # Classe orquestradora principal (PedacoDoCeuStudio)
    │   ├── state/
    │   │   ├── store.js               # Gerenciador de estado reativo
    │   │   └── history.js             # Pilha de Undo / Redo com persistência
    │   ├── canvas/
    │   │   ├── high-dpi.js            # Calibração de escala 2x para exportação
    │   │   ├── layout-engine.js       # Zonas espaciais, safe areas e auto text-fit
    │   │   ├── renderer.js            # Orquestrador de renderização multicamadas
    │   │   └── layers/
    │   │       ├── background-layer.js # Fundo com degradê místico e imagem de fundo
    │   │       ├── image-layer.js      # Posicionamento e recorte da foto do produto
    │   │       ├── overlay-layer.js    # Camada intermediária de degradê anti-contraste
    │   │       ├── pattern-layer.js    # Geometrias sagradas vetorizadas com cache Path2D
    │   │       ├── frame-layer.js      # Molduras barrocas e cantoneiras douradas
    │   │       └── text-layer.js       # Tipografia, auras de luz e badges
    │   └── ui/
    │       ├── drag-drop.js           # Interação WYSIWYG no canvas
    │       ├── snapping.js            # Guias magnéticas de alinhamento
    │       ├── shortcuts.js           # Atalhos de teclado (Ctrl+Z, Ctrl+Y)
    │       └── a11y.js                # Acessibilidade e live regions para leitores
    └── tests/                         # Suíte de testes em 3 camadas
        ├── atomic_suite.mjs           # Camada 1: Funções puras e asserções atômicas
        ├── massive_combinatorial_suite.mjs # Camada 2: 240 combinações no Canvas
        ├── stress_performance_suite.mjs    # Camada 3: 500 mutações e memory checks
        ├── run_all.mjs                # Orquestrador mestre dos testes
        ├── capture_layouts.mjs        # Script gerador de capturas de tela dos layouts
        └── screenshots/               # Imagens de verificação visual
```

---

## 3. Pilares Místicos & Universo do Acervo

O conteúdo editorial e os presets do estúdio seguem as duas skills criadas especificamente para este projeto:

1. **`holistic-mystic-wisdom`** (`~/.agents/skills/holistic-mystic-wisdom/SKILL.md`):
   - **Cristais & Litoterapia:** Quartzo Rosa (amor), Ametista (transmutação), Selenita (luz pura), Turmalina Negra (escudo).
   - **Angiologia:** Arcanjo Miguel, Chama Azul, Espada Flamejante, Quebra de Demandas.
   - **Zodíaco & Astrologia:** Alinhamento dos 4 Elementos Sagrados e regências planetárias.
   - **Botânica & Fitoenergia:** Sabonetes rituais, banhos de ervas, aromaterapia.
   - **Ancestralidade:** Linha NOA Orixás, conexão com as forças da natureza.
2. **`tibetan-wisdom`** (`~/.agents/skills/tibetan-wisdom/SKILL.md`):
   - **Budismo Vajrayana & Tradição dos Himalaias:** Taças tibetanas forjadas em 7 metais sagrados, afinação na frequência 432Hz, símbolo do Nó Infinito (Ashtamangala) e mantras de compaixão (Om Mani Padme Hum).
   - **Documento Local:** `Fotos/TIbate/DIZERES_DO_TIBETE.md` com compêndio completo de provérbios, mantras e tabelas de significados dos 8 símbolos auspiciosos.

---

## 4. Presets Místicos Disponíveis no Studio

Os presets aplicam combinações harmônicas de degradês, geometrias sagradas e tipografias com apenas um clique:

*   **✦ Ativação Cristalina:** Fundo Esmeralda Sagrado (`#00381c` a `#008542`), Flor da Vida, Moldura Portal de Ouro, Cinzel Decorative + Cormorant Garamond.
*   **🌙 Mandala Lunar 432Hz:** Fundo Azul Meia-Noite Cósmico (`#0a0e27` a `#1c2758`), Mandala Lunar, Marcellus + Playfair Display.
*   **🔮 Portal dos Arcanjos:** Fundo Púrpura Celestial (`#1a052b` a `#3d125e`), Cubo de Metatron, Cinzel + EB Garamond.
*   **🌿 Sabedoria Ancestral:** Fundo Verde Floresta & Âmbar Dourado (`#1b2e15` a `#3b5e28`), Sri Yantra, Bodoni Moda + Montserrat.
*   **🔥 Chama Trina Sagrada:** Fundo Rubi Sagrado & Ouro Puro (`#2b080c` a `#5c121c`), Símbolo Sagrado da Marca, UnifrakturMaguntia + Fondamento.

---

## 5. Tipografias Suportadas

O estúdio carrega 14 famílias Google Fonts com pesos e estilos variados:
*   **Barroco & Solene:** `Cinzel Decorative`, `Cinzel`, `Marcellus`, `Prata`.
*   **Editorial & Luxo:** `Playfair Display`, `Bodoni Moda`.
*   **Contemporâneo & Limpo:** `Syne`, `Montserrat`.
*   **Místico & Literário:** `Cormorant Garamond`, `EB Garamond`.
*   **Gótico & Rúnico:** `UnifrakturMaguntia`, `MedievalSharp`.
*   **Caligráfico:** `Fondamento`, `Great Vibes`, `Alex Brush`.

---

## 6. Comandos Úteis para Desenvolvimento e Testes

### Execução da Suíte Completa de Testes (3 Camadas)
```bash
node "/home/mat77/Projetos/Pedaço do ceu /design-system/tests/run_all.mjs"
```

### Análise de Complexidade Ciclomática
```bash
python3 ~/.agents/scripts/complexity-analyzer.py "/home/mat77/Projetos/Pedaço do ceu /design-system" 15
```

### Recompilação do Bundle Universal (`app.js`)
Quando alterar arquivos dentro de `design-system/js/`, execute o script de empacotamento para atualizar `design-system/app.js`:
```bash
node /tmp/bundle_app.js
```

### Tratamento Profissional de Fotos do Acervo (Python)
Para reprocessar e aprimorar todas as fotos originais (`Fotos/`), salvando automaticamente dentro da subpasta `Tratadas/` de cada categoria:
```bash
python3 "/home/mat77/Projetos/Pedaço do ceu /scripts/enhance_photos.py"
```

### Captura de Screenshots de Verificação Visual
```bash
node "/home/mat77/Projetos/Pedaço do ceu /design-system/tests/capture_layouts.mjs"
```

---

## 7. Histórico de Decisões & Trabalho Realizado

*   **Subpastas de Fotos Tratadas:** Todas as 40 fotos foram aprimoradas (recuperação de sombras, vivacidade seletiva, balanço de brancos adaptativo e nitidez) e organizadas dentro de `Fotos/<Categoria>/Tratadas/`. O estúdio web foi atualizado para consumir diretamente essas versões.
*   **Compêndio Dizeres do Tibete:** Criação de `Fotos/TIbate/DIZERES_DO_TIBETE.md` com provérbios ancestrais, ensinamentos de compaixão (Karuna), mantras traduzidos sílaba por sílaba e os 8 símbolos auspiciosos.
*   **Pipeline de Tratamento de Imagens (Python/Pillow/NumPy):** `enhance_photos.py` com perfis adaptativos por categoria e proteção contra recursão em subpastas.
*   **Calibração da Engine de Layouts:** Criação de `LAYOUT_CONFIG` e `calculateZones()` para eliminar sobreposições de fotos e textos nos modos `bottom`, `top` e `center`.
*   **Safe Areas para Redes Sociais:** Implementação de zonas seguras reservando margens para elementos de interface do Instagram Stories e TikTok.
*   **Suíte de 3 Camadas:** Cobertura total com 102 asserções unitárias/atômicas, 240 variações combinatórias no Canvas, 500 mutações de stress contínuo e 14 verificações de integração E2E (136/136 aprovados, 0 erros no console).
*   **Acessibilidade e Semântica:** Adição de `role="tabpanel"`, `role="tab"`, `aria-selected`, `aria-labelledby` e live regions para leitores de tela.
*   **Zero Erros de Console:** Sincronização estrita com os caminhos dos arquivos fotográficos reais em disco.
