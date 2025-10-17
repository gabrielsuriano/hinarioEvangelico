#!/bin/sh

# Script de Instalação dos Git Hooks
# Execute após clonar o repositório: npm run install:hooks

echo "🔧 Instalando Git Hooks..."

HOOKS_DIR=".git/hooks"
SOURCE_DIR="hooks"

# Verificar se a pasta hooks existe
if [ ! -d "$SOURCE_DIR" ]; then
  echo "❌ Pasta 'hooks/' não encontrada!"
  exit 1
fi

# Copiar hooks
cp "$SOURCE_DIR/pre-commit" "$HOOKS_DIR/pre-commit"
cp "$SOURCE_DIR/prepare-commit-msg" "$HOOKS_DIR/prepare-commit-msg"
cp "$SOURCE_DIR/post-commit" "$HOOKS_DIR/post-commit"

# Tornar executáveis
chmod +x "$HOOKS_DIR/pre-commit"
chmod +x "$HOOKS_DIR/prepare-commit-msg"
chmod +x "$HOOKS_DIR/post-commit"

echo "✅ Hooks instalados com sucesso!"
echo ""
echo "📋 Hooks ativos:"
echo "   • pre-commit: Sincroniza versão antes do commit"
echo "   • prepare-commit-msg: Versionamento automático via [FIX], [FEAT], [MAJOR]"
echo "   • post-commit: Adiciona package.json atualizado ao commit via amend"
echo ""
echo "🎯 Uso:"
echo "   git commit -m \"[FIX] Descrição\"   → patch (1.3.0 → 1.3.1)"
echo "   git commit -m \"[FEAT] Descrição\"  → minor (1.3.0 → 1.4.0)"
echo "   git commit -m \"[MAJOR] Descrição\" → major (1.3.0 → 2.0.0)"
