# ✦ Identidade Visual & Diretrizes de Design: Pedaço do Céu

## 1. Conceito Visual

A identidade visual da **Pedaço do Céu** combina requinte clássico, tons naturais da terra e dos minerais, e a harmonia estética da proporção áurea. O sistema visual foi projetado para ser versátil, emoldurando com nobreza e legibilidade qualquer um dos mais de mil itens do acervo (de pedras brutas e perfumaria natural a estatuária sacra, lembrancinhas e apetrechos para a casa).

---

## 2. Paleta Cromática Versátil

A paleta de cores reflete a nobreza dos elementos naturais, o brilho dourado e a serenidade dos ambientes de paz:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PALETA CROMÁTICA MESTRE                         │
├───────────────────┬───────────────────┬────────────────────────────────┤
│ Cor / Nome        │ HEX / Código      │ Aplicação e Atmosfera          │
├───────────────────┼───────────────────┼────────────────────────────────┤
│ Ouro Nobre        │ #d4af37 / #f5d77f │ Títulos, cantoneiras e molduras│
│ Ouro Brilhante    │ #ffd700           │ Pontos de luz e destaque       │
│ Verde Botânico    │ #00381c / #008542 │ Ervas, perfumaria e natureza   │
│ Azul Profundo     │ #0a0e27 / #1c2758 │ Noite, serenidade e águas      │
│ Violeta & Púrpura │ #1a052b / #3d125e │ Pedras minerais e contemplação │
│ Terracota & Rubi  │ #2b080c / #5c121c │ Vitalidade, cerâmicas e fogo   │
│ Âmbar & Madeiras  │ #2a1700 / #5c3800 │ Incensos, resinas e aconchego  │
│ Fundo Pergaminho  │ #eadcb9           │ Subtítulos e textos de apoio   │
│ Branco Luz        │ #f8f9fa           │ Textos de leitura e realce     │
│ Fundo Escuro Safe │ #040c07 / #020503 │ Base profunda para contraste   │
└───────────────────┴───────────────────┴────────────────────────────────┘
```

---

## 3. Tipografia Clássica e Acolhedora

1. **Títulos Principais:** `Cinzel Decorative` (Google Fonts, serifada, caixa alta). Traz presença e acabamento nobre para qualquer categoria de produto.
2. **Subtítulos e Categorias:** `Cinzel` clássica ou `Playfair Display` (serifada). Elegância e clareza para destacar temas do cotidiano e tradições culturais.
3. **Reflexões e Poética:** `Cormorant Garamond` (serifada leve). Traz suavidade para textos que falam sobre o cuidado com o lar e a beleza das pedras.
4. **Assinaturas e Detalhes:** `Great Vibes` ou `Alex Brush` (cursiva fluida). Usada pontualmente para toques afetuosos e artesanais.
5. **Corpo de Texto e Acessibilidade:** `Montserrat` (sem serifa, pesos 300 a 500). Garante leitura clara e limpa em qualquer tamanho de tela mobile.

---

## 4. Geometrias e Elementos de Composição

O Studio visual disponibiliza padrões gráficos e ornamentos clássicos que funcionam como molduras para as peças:

*   **Padrões da Natureza e Florais (`flowerOfLife`):** Ideais para pedras naturais, perfumaria e elementos botânicos.
*   **Mandalas Cósmicas e Lunares (`lunarMandala`):** Perfeitas para peças astrológicas, calendários e momentos de recolhimento.
*   **Geometrias de Proteção (`metatronCube`):** Aplicáveis a imagens de devoção, anjos e amuletos do lar.
*   **Harmonias Clássicas (`sriYantra` / `brandSacredSymbol`):** Símbolos universais de prosperidade, decoração e peças institucionais.

---

## 5. Arquitetura em Camadas do Studio Canvas 2D

O renderizador opera em resolução High-DPI 2x, garantindo nitidez para fotos de qualquer item do acervo:

```
[ Camada Superior: Z-Index 50 ] ➔ Cantoneiras Clássicas Douradas (CornersLayer)
[ Camada Textual:  Z-Index 40 ] ➔ Tipografia com Quebra Automática e Text-Fit (TextLayer)
[ Camada Gradiente: Z-Index 35] ➔ Degradê de Contraste para Leitura Perfeita (OverlayLayer)
[ Camada Geométrica: Z-Index 30]➔ Padrões e Mandalas Vetorizadas (PatternLayer)
[ Camada de Imagem: Z-Index 20] ➔ Foto de Qualquer Item do Acervo (ImageLayer)
[ Camada de Fundo: Z-Index 10 ] ➔ Atmosfera em Gradiente de 3 Cores (GradientLayer)
```

---

## 6. Formatos Suportados

*   **Feed Quadrado (1:1):** 1080 x 1080 px (Renderizado em 2160 x 2160 px).
*   **Feed Retrato (4:5):** 1080 x 1350 px (Renderizado em 2160 x 2700 px).
*   **Stories & TikTok (9:16):** 1080 x 1920 px (Renderizado em 2160 x 3840 px com safe areas).
