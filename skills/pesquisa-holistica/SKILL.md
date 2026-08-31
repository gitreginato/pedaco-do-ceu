---
name: pesquisa-holistica
description: Extrai propriedades metafísicas, correspondências energéticas, chakras e elementos para itens do acervo sagrado e holístico.
---

# Pesquisa Holística & Correspondências Energéticas

Esta skill define o protocolo de extração, validação e estruturação do conhecimento metafísico, litoterapêutico, botânico e arquetípico para os itens do catálogo **Pedaço do Céu**.

---

## 1. Regra Inegociável de Conformidade & Ética (ANVISA / Ética Terapêutica)

> [!IMPORTANT]
> **PROIBIÇÃO DE PROMESSAS DE CURA FÍSICA OU MÉDICA:**
> É estritamente proibido afirmar ou insinuar que cristais, incensos, banhos de ervas, frequências sonoras ou símbolos sagrados "curam doenças", "substituem tratamentos alopáticos/médicos", "eliminam dores físicas" ou possuem propriedades farmacológicas.

* **Linguagem Permitida e Estimulada:** Ressonância vibracional, ancoramento de paz interior, harmonização do campo áurico, suporte meditativo, transmutação energética, conexão com a sabedoria ancestral, bem-estar sutil, equilíbrio dos chakras.
* **Fontes Dogmáticas de Referência:** Tradições védicas e tântricas, litoterapia clássica (Judy Hall, Robert Simmons), botânica oculta e fitoenergia tradicional brasileira, tradições tibetanas (Vajrayana) e angelologia dos Sete Raios.

---

## 2. Matriz de Correspondências Energéticas

### 2.1 Chakras Principais
1. **Muladhara (Básico / Raiz):** Aterramento, sobrevivência, firmeza. *Cores:* Vermelho / Preto. *Cristais:* Turmalina Negra, Jaspe Vermelho, Ônix. *Elemento:* Terra.
2. **Svadhisthana (Sacral / Sexual):** Criatividade, sensualidade, fluxo. *Cores:* Laranja. *Cristais:* Cornalina, Calcita Laranja. *Elemento:* Água.
3. **Manipura (Plexo Solar):** Poder pessoal, vontade, autoconfiança. *Cores:* Amarelo / Dourado. *Cristais:* Citrino, Olho de Tigre, Pirita. *Elemento:* Fogo.
4. **Anahata (Cardíaco):** Amor incondicional, compaixão, perdão. *Cores:* Rosa / Verde. *Cristais:* Quartzo Rosa, Quartzo Verde, Esmeralda. *Elemento:* Ar.
5. **Vishuddha (Laríngeo):** Expressão autêntica, comunicação da alma, verdade. *Cores:* Azul Claro / Turquesa. *Cristais:* Água Marinha, Quartzo Azul, Cianita Azul. *Elemento:* Éter / Som.
6. **Ajna (Frontal / 3º Olho):** Intuição, clarividência, discernimento sutil. *Cores:* Índigo / Azul Noite. *Cristais:* Sodalita, Lápis Lazúli. *Elemento:* Luz.
7. **Sahasrara (Coronário):** Conexão com o divino, transcendência, iluminação. *Cores:* Violeta / Branco Cristalino / Dourado. *Cristais:* Ametista, Selenita, Quartzo Transparente. *Elemento:* Consciência Cósmica.

### 2.2 Elementos Primordiais
* **Fogo (Tejas):** Transmutação, entusiasmo, dinamismo, coragem. Associado a incensos solares, velas rituais, resinas aromáticas.
* **Terra (Prithvi):** Estrutura, estabilidade, prosperidade, firmeza mineral. Associado a pedras brutas e pontas de ancoramento.
* **Ar (Vayu):** Intelecto, clareza, movimento, sopro sagrado. Associado a fumaça de ervas secas, sinos de vento e penas rituais.
* **Água (Apas):** Emoção, fluidez, intuição profunda, purificação. Associado a banhos de ervas, águas florais e cristais marítimos.

---

## 3. Protocolos de Limpeza e Energização de Instrumentos Sagrados

Cada ficha de produto no catálogo deve informar o método adequado:
* **Água e Sal Marinho:** Para cristais densos não porosos (Quartzo, Ametista, Jaspe). *Evitar em Selenita, Pirita, Malaquita, Turquesa e metais.*
* **Fumaça Sagrada (Defumação):** Método universal e seguro para todos os minerais, metais, taças e estátuas (Sálvia Branca, Palo Santo, Breu Branco).
* **Placa de Selenita:** Limpeza passiva por ressonância (colocar a peça sobre a selenita por 2 a 6 horas).
* **Luz Solar:** Energização ativa (15 a 30 minutos na manhã suave). *Cuidado com Ametista e Quartzo Rosa (podem desbotar ao sol forte).*
* **Luz Lunar:** Energização suave e intuitiva (noite de Lua Cheia ou Crescente).

---

## 4. Esquema de Saída para o Catálogo

Ao pesquisar um novo item para catalogar em `catalogo/itens.json`, extraia:
```json
{
  "chakra": "Coronário (Sahasrara)",
  "elemento": "Ar / Consciência",
  "signos_afins": ["Peixes", "Aquário", "Sagitário"],
  "palavras_chave": ["Transmutação", "Paz Interior", "Elevação Espiritual", "Meditação"],
  "metodo_limpeza": "Defumação com Sálvia ou sobre placa de Selenita (evitar sol direto prolongado)"
}
```
