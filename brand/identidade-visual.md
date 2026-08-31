# ✦ Identidade Visual & Diretrizes de Design: Pedaço do Céu

## 1. Conceito Visual Central

A estética da **Pedaço do Céu** une a sofisticação da arte sacra barroca, a harmonia matemática da proporção áurea e a profundidade cósmica das tradições espirituais. Cada criativo é tratado como uma obra de arte contemplativa.

---

## 2. Paleta Cromática Sagrada

A paleta de cores reflete a nobreza dos materiais sagrados e a vibração dos centros energéticos:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PALETA CROMÁTICA MESTRE                         │
├───────────────────┬───────────────────┬────────────────────────────────┤
│ Cor / Nome        │ HEX / Código      │ Aplicação e Significado        │
├───────────────────┼───────────────────┼────────────────────────────────┤
│ Ouro Sagrado      │ #d4af37 / #f5d77f │ Títulos, cantoneiras e molduras│
│ Ouro Brilhante    │ #ffd700           │ Realces e pontos de luz focal  │
│ Esmeralda Místico │ #00381c / #008542 │ Ativação de cura e botânica    │
│ Azul Meia-Noite   │ #0a0e27 / #1c2758 │ Vibração lunar e sabedoria     │
│ Púrpura Celestial │ #1a052b / #3d125e │ Transmutação, ametista e arcanjos│
│ Rubi Sagrado      │ #2b080c / #5c121c │ Chama Trina e vitalidade       │
│ Âmbar & Madeira   │ #2a1700 / #5c3800 │ Taças tibetanas e ancestralidade│
│ Fundo Pergaminho  │ #eadcb9           │ Subtítulos e textos de apoio   │
│ Branco Puro Luz   │ #f8f9fa           │ Textos principais de destaque  │
│ Obsidiana / Noite │ #040c07 / #020503 │ Fundos profundos e safe-zones  │
└───────────────────┴───────────────────┴────────────────────────────────┘
```

---

## 3. Tipografia Sagrada

A hierarquia tipográfica foi desenhada para transmitir nobreza, clareza e ritmo contemplativo:

1. **Títulos Principais:** `Cinzel Decorative` (Google Fonts, serifada, caixa alta, peso 700). Traz imponência, solenidade e acabamento clássico.
2. **Subtítulos e Conceitos:** `Cinzel` clássica ou `Playfair Display` (serifada, peso 600). Confere elegância e autoridade editorial.
3. **Reflexões e Poética:** `Cormorant Garamond` (serifada leve, itálico opcional). Transmite profundidade mística e suavidade.
4. **Toques Artesanais e Assinatura:** `Great Vibes` ou `Alex Brush` (cursiva refinada). Usada pontualmente para assinaturas e detalhes visuais.
5. **Corpo de Texto e Leitura Rápida:** `Montserrat` (sem serifa, pesos 300 a 500). Garante legibilidade técnica e clareza absoluta em telas mobile.

---

## 4. Geometrias Sagradas & Vetores

O Studio utiliza 5 geometrias sagradas vetorizadas de alta precisão em formato `Path2D`:

*   **Flor da Vida (`flowerOfLife`):** Padrão primordial da criação. Ideal para cristais, ametistas e harmonização de ambientes.
*   **Cubo de Metatron (`metatronCube`):** Escudo multidimensional de proteção. Utilizado para Linha Arcanjo Miguel e purificação áurica.
*   **Mandala Lunar (`lunarMandala`):** Ciclos cósmicos e marés. Perfeito para sabedoria tibetana, astrologia e rituais femininos.
*   **Sri Yantra (`sriYantra`):** Prosperidade cósmica e equilíbrio dos chakras. Empregado em peças de abundância e altar pessoal.
*   **Símbolo Sagrado da Marca (`brandSacredSymbol`):** Geometria exclusiva Pedaço do Céu para peças de assinatura e institucional.

---

## 5. Arquitetura em Camadas do Studio Canvas 2D

Para garantir qualidade gráfica em telas Retina e monitores de alta definição, o Studio renderiza em resolução 2x (High-DPI) com ordenação estrita de camadas:

```
[ Camada Superior: Z-Index 50 ] ➔ Cantoneiras Barrocas Douradas (CornersLayer)
[ Camada Textual:  Z-Index 40 ] ➔ Tipografia Sagrada com Auto Text-Fit (TextLayer)
[ Camada Gradiente: Z-Index 35] ➔ Degradê de Contraste e Leitura (OverlayLayer)
[ Camada Geométrica: Z-Index 30]➔ Geometria Sagrada Vetorizada (PatternLayer)
[ Camada de Imagem: Z-Index 20] ➔ Foto do Produto Tratada (ImageLayer: Split ou Full)
[ Camada de Fundo: Z-Index 10 ] ➔ Fundo Atmosférico 3 Pontos de Cor (GradientLayer)
```

---

## 6. Formatos e Resoluções Suportadas

*   **Feed Instagram Quadrado (1:1):** 1080 x 1080 px (Renderizado em 2160 x 2160 px para ultra nitidez).
*   **Feed Instagram Retrato (4:5):** 1080 x 1350 px (Renderizado em 2160 x 2700 px).
*   **Stories & TikTok (9:16):** 1080 x 1920 px (Renderizado em 2160 x 3840 px com safe areas superiores e inferiores de 180px).
