#!/bin/bash

echo "🔐 Configuração de Certificados HTTPS - Tailscale"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Criar pasta personal se não existir
PERSONAL_DIR="./personal"
mkdir -p "$PERSONAL_DIR"

# Verificar se Tailscale está instalado
if ! command -v tailscale &> /dev/null; then
    echo -e "${RED}❌ Tailscale não está instalado!${NC}"
    echo ""
    echo "📦 Instale o Tailscale primeiro:"
    echo "   - Linux: https://tailscale.com/download/linux"
    echo "   - macOS: brew install tailscale"
    echo ""
    exit 1
fi

# Verificar se jq está instalado
if ! command -v jq &> /dev/null; then
    echo -e "${RED}❌ jq não está instalado!${NC}"
    echo ""
    echo "📦 Instale o jq primeiro:"
    echo "   - Linux: sudo apt install jq"
    echo "   - macOS: brew install jq"
    echo ""
    exit 1
fi

# Verificar se está conectado ao Tailscale
if ! tailscale status &> /dev/null; then
    echo -e "${RED}❌ Tailscale não está rodando!${NC}"
    echo ""
    echo "🚀 Inicie o Tailscale:"
    echo "   sudo tailscale up"
    echo ""
    exit 1
fi

# Pegar o hostname do Tailscale
TAILSCALE_HOSTNAME=$(tailscale status --json | jq -r '.Self.DNSName' | sed 's/\.$//')

if [ -z "$TAILSCALE_HOSTNAME" ]; then
    echo -e "${RED}❌ Não foi possível obter o hostname do Tailscale${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Hostname Tailscale detectado:${NC} $TAILSCALE_HOSTNAME"
echo -e "${BLUE}📁 Certificados serão salvos em:${NC} $PERSONAL_DIR/"
echo ""

# Verificar se já existem certificados
CERT_FILE="$PERSONAL_DIR/${TAILSCALE_HOSTNAME}.crt"
KEY_FILE="$PERSONAL_DIR/${TAILSCALE_HOSTNAME}.key"

if [ -f "$CERT_FILE" ] && [ -f "$KEY_FILE" ]; then
    echo -e "${YELLOW}⚠️  Certificados já existem em personal/!${NC}"
    echo ""
    read -p "Deseja gerar novos certificados? (s/N): " REGENERATE
    
    if [[ ! $REGENERATE =~ ^[Ss]$ ]]; then
        echo ""
        echo -e "${GREEN}✅ Certificados existentes mantidos!${NC}"
        echo ""
        echo "Para usar o servidor HTTPS:"
        echo "  1. npm run generate"
        echo "  2. npm run serve:https"
        echo ""
        exit 0
    fi
    
    echo ""
    echo "��️  Removendo certificados antigos..."
    rm -f "$CERT_FILE" "$KEY_FILE"
fi

# Gerar certificados
echo "📜 Gerando certificados SSL..."
echo ""

cd "$PERSONAL_DIR" || exit 1
tailscale cert "$TAILSCALE_HOSTNAME"
CERT_RESULT=$?
cd - > /dev/null || exit 1

if [ $CERT_RESULT -ne 0 ]; then
    echo ""
    echo -e "${RED}❌ Erro ao gerar certificados!${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Certificados gerados com sucesso!${NC}"
echo ""
echo "📁 Arquivos criados em personal/:"
echo "   - ${TAILSCALE_HOSTNAME}.crt"
echo "   - ${TAILSCALE_HOSTNAME}.key"
echo ""

# Adicionar personal/ ao .gitignore se não existir
if ! grep -q "^personal$" .gitignore 2>/dev/null; then
    echo ""
    echo "🛡️  Adicionando personal/ ao .gitignore..."
    echo "personal" >> .gitignore
    echo -e "${GREEN}✅ .gitignore atualizado!${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Configuração completa!${NC}"
echo ""
echo "Para usar o servidor HTTPS:"
echo "  ${BLUE}1.${NC} npm run generate"
echo "  ${BLUE}2.${NC} npm run serve:https"
echo ""
echo "Acesse:"
echo "  ${BLUE}HTTPS (Tailscale):${NC} https://${TAILSCALE_HOSTNAME}:3001"
echo "  ${BLUE}Local:${NC} https://localhost:3001"
echo ""
