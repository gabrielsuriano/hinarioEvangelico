# Configuração HTTPS com Tailscale

Este projeto usa certificados do Tailscale para servir o PWA via HTTPS durante o desenvolvimento e testes em dispositivos móveis.

## 🔒 Segurança

Os certificados do Tailscale são armazenados na pasta **`personal/`**, que é **ignorada pelo git** e **não deve** ser commitada no repositório.

⚠️ **Cada desenvolvedor deve gerar seus próprios certificados localmente.**

A pasta `personal/` já está incluída no `.gitignore`:
```gitignore
personal
```

## 🚀 Configuração Automática (Recomendado)

Use o script automatizado para configurar tudo de uma vez:

```bash
./scripts/setup-https.sh
```

### O que o script faz:

1. ✅ Cria a pasta `personal/` automaticamente
2. ✅ Verifica se o Tailscale está instalado e conectado
3. 🔍 Detecta automaticamente seu hostname do Tailscale
4. 📜 Gera os certificados SSL em `personal/` (.crt e .key)
5. 🛡️ Garante que `personal/` está no .gitignore

### Requisitos

- Tailscale instalado e conectado
- `jq` instalado (para parsing JSON):
  ```bash
  # Ubuntu/Debian
  sudo apt install jq

  # macOS
  brew install jq
  ```

## ⚙️ Configuração Manual

Se preferir configurar manualmente, siga os passos abaixo.

### 1. Criar pasta personal

```bash
mkdir -p personal
```

### 2. Instalar Tailscale

Se ainda não tiver o Tailscale instalado:

```bash
# Ubuntu/Debian
curl -fsSL https://tailscale.com/install.sh | sh

# macOS
brew install tailscale
```

### 3. Conectar ao Tailscale

```bash
sudo tailscale up
```

### 4. Verificar seu Hostname

```bash
tailscale status --json | jq -r '.Self.DNSName'
```

Exemplo de saída: `seu-hostname.tailXXXXXX.ts.net`

### 5. Gerar Certificados SSL

```bash
# Entrar na pasta personal
cd personal

# Gerar certificados (substitua pelo seu hostname)
tailscale cert seu-hostname.tailXXXXXX.ts.net

# Voltar para a raiz
cd ..
```

Isso criará dois arquivos em `personal/`:
- `seu-hostname.tailXXXXXX.ts.net.crt` (certificado público)
- `seu-hostname.tailXXXXXX.ts.net.key` (chave privada - **sensível!**)

### 6. Verificar Auto-detecção

O servidor HTTPS (`scripts/serve-https.js`) detecta **automaticamente** qualquer arquivo `.crt` e `.key` na pasta `personal/`. Não é necessário editar o código!

## 🏃 Usando o Servidor HTTPS

### 1. Fazer build de produção:

```bash
npm run generate
```

### 2. Iniciar servidor HTTPS:

```bash
npm run serve:https
```

Ou com porta customizada:

```bash
PORT=8443 npm run serve:https
```

### 3. Acessar o PWA:

O script mostrará automaticamente as URLs corretas:

```
🚀 Servidor HTTPS PWA rodando!

📱 Acesse:
   - HTTPS (Tailscale): https://seu-hostname.tailXXXXXX.ts.net:3001
   - Local: https://localhost:3001

✅ PWA instalável via HTTPS!
```

## 📱 Testar PWA no Celular

1. ✅ Certifique-se que o celular está na rede Tailscale
2. 🌐 Acesse a URL HTTPS mostrada no terminal
3. ➕ Clique em "Adicionar à tela inicial"
4. 🎉 PWA será instalado com HTTPS válido!
5. ✈️ Ative modo avião e teste offline

## 🔧 Troubleshooting

### Erro: "Certificados não encontrados na pasta personal/"

Execute o script de configuração:
```bash
./scripts/setup-https.sh
```

Ou verifique se os certificados existem:
```bash
ls -la personal/*.crt personal/*.key
```

### Erro: "Porta já em uso"

Use outra porta:
```bash
PORT=8443 npm run serve:https
```

### Certificado expirado

Os certificados do Tailscale expiram. Regenere-os:
```bash
# Automático
./scripts/setup-https.sh

# Ou manual
cd personal
tailscale cert seu-hostname.tailXXXXXX.ts.net
cd ..
```

### Tailscale não instalado

```bash
# Ubuntu/Debian
curl -fsSL https://tailscale.com/install.sh | sh

# macOS
brew install tailscale
```

### `jq` não instalado (necessário para script automático)

```bash
# Ubuntu/Debian
sudo apt install jq

# macOS
brew install jq
```

### Pasta personal/ commitada por engano

Se a pasta `personal/` foi commitada por engano:

```bash
# Remover do git mas manter localmente
git rm -r --cached personal/

# Commitar a remoção
git commit -m "Remove pasta personal/ do git"
```

## 📋 Detalhes Técnicos

### Estrutura de pastas:

```
hinarioEvangelico/
├── personal/                          # ← Ignorado pelo git
│   ├── seu-hostname.ts.net.crt       # Certificado SSL
│   └── seu-hostname.ts.net.key       # Chave privada
├── scripts/
│   ├── serve-https.js                # Servidor HTTPS (busca em personal/)
│   └── setup-https.sh                # Configuração automática
└── .gitignore                         # Inclui: personal
```

### O que o servidor faz:

- ✅ HTTPS nativo com certificados do Tailscale
- ✅ Busca certificados automaticamente em `personal/`
- ✅ Serve arquivos estáticos de `.output/public`
- ✅ Rewrites para SPA (todas rotas → `index.html`)
- ✅ Serve dados da API de `/api/hymnal` (506 hinos/ritos/antífonas)
- ✅ Porta configurável via variável de ambiente `PORT`
- ✅ Graceful shutdown com Ctrl+C

### Arquivos envolvidos:

- `personal/` - Pasta com certificados (ignorada pelo git)
- `scripts/serve-https.js` - Servidor Node.js com HTTPS
- `scripts/setup-https.sh` - Script de configuração automatizada
- `scripts/copy-api-data.js` - Copia dados da API para build estático
- `.gitignore` - Exclui pasta `personal/` do controle de versão

## ❓ Por que pasta `personal/`?

1. **Segurança**: Todo conteúdo pessoal/sensível em um único lugar
2. **Simplicidade**: Um único item no `.gitignore` (`personal`)
3. **Flexibilidade**: Pode adicionar outros arquivos pessoais na mesma pasta
4. **Clareza**: Nome genérico sem referências a usuários específicos no código
5. **Padrão**: Comum em projetos open-source (similar a `.env.local`, `config.local`, etc.)
