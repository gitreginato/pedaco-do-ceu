---
name: analise-imagem
description: Analisa imagens do acervo fotográfico, extrai metadados, identifica paletas cromáticas e sugere geometrias sagradas e textos alternativos (alt_text).
---

# Análise Visual, Cromática & Acessibilidade de Imagens

Esta skill orienta o processamento técnico e estético das fotografias do acervo real da **Pedaço do Céu** para alimentar o Studio Canvas e garantir contraste, beleza harmônica e acessibilidade universal.

---

## 1. Protocolo de Inspeção Visual da Imagem

Ao analisar um arquivo de foto na pasta `./Fotos/`:
1. **Enquadramento & Ponto Focal:**
   - Identificar se o objeto principal está centralizado, deslocado à esquerda ou à direita.
   - Avaliar se a foto possui fundo neutro (tecido de veludo, madeira rústica, luz natural) ou fundo contrastante.
2. **Cromática Predominante:**
   - Mapear a cor principal do mineral/objeto para orientar as cores do degradê de fundo (`gradientPrimary`, `gradientSecondary`, `gradientDarkness`).
   - Mapear cores de realce para títulos e molduras (`colorTitleGlow`, `colorCorners`, `colorBadge`).

---

## 2. Tabela de Mapeamento: Matiz Mineral ➔ Paleta de Degradê & Geometria

| Categoria / Matiz | Gradient Primary | Gradient Secondary | Gradient Darkness | Glow / Dourado | Símbolo Sagrado Sugerido |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Ametista / Violeta** | `#2b0042` | `#581c87` | `#0d0216` | `#e9d5ff` / `#f5d77f` | `flowerOfLife` ou `sriYantra` |
| **Quartzo Rosa / Rosa** | `#3f0022` | `#831843` | `#15010a` | `#fbcfe8` / `#f5d77f` | `flowerOfLife` |
| **Arcanjo / Azul Cobalto** | `#00173d` | `#0f3b7a` | `#020814` | `#90caf9` / `#f5d77f` | `metatronCube` |
| **Tibete / Dourado & Bronze** | `#2a1700` | `#5c3800` | `#0d0700` | `#f5d77f` / `#d4af37` | `lunarMandala` ou `flowerOfLife` |
| **Ervas & Fitoenergia / Verde** | `#002914` | `#006332` | `#020f07` | `#a7f3d0` / `#f5d77f` | `flowerOfLife` |
| **Zodíaco / Azul Noite & Estrelas** | `#080b1f` | `#1e1e4a` | `#03040c` | `#c7d2fe` / `#f5d77f` | `lunarMandala` ou `logoPattern` |
| **NOA Orixás / Terracota & Ouro** | `#2e1104` | `#632408` | `#100501` | `#fed7aa` / `#f5d77f` | `flowerOfLife` ou `sriYantra` |

---

## 3. Geração de Texto Alternativo (`alt_text`) para Acessibilidade

O texto alternativo é obrigatório para compliance WCAG e inclusão de pessoas cegas ou com baixa visão:
* **Estrutura Padrão:**
  `[Objeto/Mineral] em [formato/lapidação], exibindo tons de [cores predominantes]. A peça está [disposição/detalhe de luz e textura]. Fundo em degradê místico com ornamentos em dourado e símbolo sagrado de [geometria].`
* **Exemplo:**
  *"Drusa de ametista natural com cristais pontiagudos em tonalidades de violeta profundo e reflexos translúcidos de luz. Peça sobre base de corte bruto com ornamentos dourados nas cantoneiras e geometria da Flor da Vida ao fundo."*

---

## 4. Esquema de Saída para o Catálogo

```json
{
  "cor_predominante": "violeta_ametista",
  "simbolo_layout": "flowerOfLife",
  "fundo_sugerido": {
    "gradientPrimary": "#2b0042",
    "gradientSecondary": "#581c87",
    "gradientDarkness": "#0d0216",
    "colorTitleGlow": "#e9d5ff"
  },
  "alt_text": "Drusa de ametista natural com cristais pontiagudos em violeta profundo e brilho cristalino sob luz suave."
}
```
