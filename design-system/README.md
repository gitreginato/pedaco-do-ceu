# Pedaço do Céu (Espaço Artes): Design System & Template Studio

Este repositório contém a especificação completa de identidade visual, o estúdio interativo de criação de posts para redes sociais (Instagram e TikTok), suíte de automação e acervo de fotos da loja.

---

## Estrutura Organizada do Projeto

```
Pedaço do ceu/
├── Fotos/                          # Acervo fotográfico original categorizado
│   ├── Arcanjo Miguel/
│   ├── Bem Estar/
│   ├── Kailash/
│   ├── NOA/
│   ├── TIbate/
│   ├── zodiaco/
│   └── Logo/                       # Marca e logotipo oficial
│
└── design-system/                  # Studio Web e Ferramental de Design
    ├── index.html                  # Aplicação web do Template Studio
    ├── styles.css                  # Folha de estilos e layout com abas
    ├── app.js                      # Motor de renderização Canvas 2D e estado
    ├── assets/                     # Biblioteca de vetores e tokens de design
    │   ├── svg-library.js          # Biblioteca de Geometria Sagrada (SVG Path2D)
    │   └── tokens.css              # Tokens oficiais (cores, tipografia, sombras)
    ├── docs/                       # Documentação técnica e pesquisas
    │   ├── design-system.md        # Manual de identidade visual e regras de marca
    │   ├── raio-x-roadmap.md       # Arquitetura do sistema e mapa de evolução
    │   └── tibet-pesquisa-cultural.md # Pesquisa cultural sobre o Tibete e compaixão
    ├── scripts/                    # Scripts de automação e renderização em lote
    │   ├── generate_samples.py     # Gerador Python de exemplos em alta resolução
    │   ├── update_presets.py       # Utilitário de atualização de presets
    │   └── app.js.update.py        # Utilitário de migração de fontes
    ├── tests/                      # Suíte de testes automatizados E2E (Playwright)
    │   ├── run_all.mjs             # Runner mestre consolidado (63 testes)
    │   ├── last_report.json        # Relatório detalhado da última execução
    │   ├── screenshots/            # Capturas de tela dos testes automatizados
    │   └── e2e/                    # Especificações e diagnósticos individuais
    ├── exemplos-prontos/           # Posts gerados em alta resolução prontos para uso
    ├── package.json                # Dependências de teste e tooling
    ├── playwright.config.js        # Configuração do Playwright
    └── README.md                   # Guia mestre do projeto
```

---

## Como Usar o Template Studio

1. Abra o arquivo `index.html` em qualquer navegador web moderno (Firefox, Google Chrome, Brave, Edge).
2. **Abas de Controle**:
   - **[ACERVO]**: Escolha entre as 15 peças reais do catálogo fotográfico da loja. Ajuste o estilo de enquadramento (Portal Nobre, Fusão Imersiva ou Preenchimento) e controles de Zoom/Pan.
   - **[TIPOGRAFIA]**: Edite textos de título, subtítulo, descrição energética, slot de destaque e selos. Controle fontes, pesos, alinhamentos, brilho (aura/glow) e espaçamento/entrelinha das caixas.
   - **[CORES & FUNDO]**: Personalize o degradê místico em 3 pontos, envie uma imagem de fundo/textura própria e ative geometrias sagradas (Flor da Vida, Metatron, Sri Yantra, Mandala Lunar).
   - **[LAYOUT]**: Alterne entre os formatos de publicação (Feed 1:1, Feed 4:5, Stories 9:16 e TikTok) e posições de layout (Lateral, Rodapé, Topo, Centro).
3. **Exportação**:
   - Clique em **"✦ Exportar em Alta Resolução (PNG)"** no canto superior direito para baixar a arte final renderizada em 1080px.

---

## Execução dos Testes Automatizados

Para executar a suíte mestre de testes E2E e validar todos os componentes:

```bash
cd design-system
node tests/run_all.mjs
```

Para gerar os exemplos em lote via Python (Pillow):

```bash
cd design-system
python3 scripts/generate_samples.py
```
