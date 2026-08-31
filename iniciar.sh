#!/usr/bin/env bash
# ==============================================================================
# Pedaço do Céu - Script de Inicialização do Studio Canvas & Servidor Local
# ==============================================================================

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

echo "======================================================"
echo "  ✦ PEDAÇO DO CÉU - ESTÚDIO DE DESIGN & CRIAÇÃO"
echo "======================================================"
echo ""
echo "Compilando os módulos JavaScript com esbuild..."
npm run build

echo ""
echo "Iniciando o servidor local em http://localhost:3000..."
echo "Pressione Ctrl+C para encerrar o estúdio a qualquer momento."
echo ""

# Tenta abrir o navegador padrão no Linux se houver interface gráfica
if [ -n "$DISPLAY" ] || [ -n "$WAYLAND_DISPLAY" ]; then
  if command -v xdg-open > /dev/null 2>&1; then
    (sleep 1 && xdg-open "http://localhost:3000") &
  elif command -v google-chrome > /dev/null 2>&1; then
    (sleep 1 && google-chrome "http://localhost:3000") &
  fi
fi

exec node scripts/serve.mjs
