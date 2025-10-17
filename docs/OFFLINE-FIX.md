# Correções para Funcionamento Offline do PWA

## 🐛 Problema Identificado

O PWA instalado não estava funcionando quando offline, especialmente quando hospedado na Vercel.

## ✅ Correções Implementadas

### 1. **nuxt.config.ts** - Configuração do Service Worker

```typescript
navigateFallback: '/index.html',  // Mudado de '/' para '/index.html'
navigateFallbackDenylist: [/^\/api\//, /\/_nuxt\/.*\.hot-update\.json$/],
additionalManifestEntries: [
  { url: '/', revision: null },
  { url: '/index.html', revision: null }
],
```

**Por quê?**
- Garante que o index.html seja precacheado explicitamente
- Navigate fallback agora aponta diretamente para o arquivo HTML
- Exclui hot-update files do fallback (desenvolvimento)

### 2. **vercel.json** - Configuração da Vercel (NOVO)

Criado arquivo de configuração específico para a Vercel:

```json
{
  "buildCommand": "npm run generate",
  "outputDirectory": ".output/public",
  "rewrites": [
    {
      "source": "/api/hymnal",
      "destination": "/api/hymnal"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        },
        {
          "key": "Service-Worker-Allowed",
          "value": "/"
        }
      ]
    }
  ]
}
```

**Por quê?**
- Garante que todas as rotas sejam redirecionadas para index.html (SPA)
- Service Worker é servido com cache correto (sempre atualizado)
- Header `Service-Worker-Allowed` permite que o SW controle toda a aplicação

### 3. **plugins/pwa.client.ts** - Registro do Service Worker

Adicionado:
```typescript
register('/sw.js', { 
  scope: '/',
  updateViaCache: 'none' // Força verificação de updates
})
```

**Por quê?**
- `updateViaCache: 'none'` garante que o SW seja sempre verificado por updates
- Adiciona listener para controllerchange

### 4. **plugins/offline-cache.client.ts** - Cache Offline

Melhorado:
```typescript
navigator.serviceWorker.ready.then(async () => {
  const response = await fetch('/api/hymnal', {
    cache: 'force-cache'
  })
})
```

**Por quê?**
- Aguarda o SW estar pronto antes de pré-carregar dados
- Usa `force-cache` para garantir que use o cache quando offline

### 5. **public/offline.html** - Página Offline Aprimorada

Adicionada página offline moderna com:
- Design atraente e responsivo
- Indicador visual de status offline
- Lista de funcionalidades disponíveis offline
- Auto-reload quando conexão voltar

## 📋 Checklist de Deploy na Vercel

1. ✅ Criar arquivo `vercel.json` na raiz
2. ✅ Fazer build: `npm run generate`
3. ✅ Verificar que `.output/public` contém:
   - `index.html`
   - `sw.js`
   - `/api/hymnal` (arquivo JSON)
   - Todos os assets em `/_nuxt/`
4. ✅ Deploy na Vercel
5. ✅ Testar:
   - Acessar a URL
   - Instalar o PWA
   - Desconectar da internet
   - Abrir o PWA instalado
   - Deve funcionar offline! 🎉

## 🔍 Como Testar Localmente

```bash
# 1. Gerar build
npm run generate

# 2. Servir localmente com HTTPS (necessário para PWA)
npm run serve:https

# 3. Acessar no navegador
# https://localhost:3001

# 4. Instalar o PWA (ícone na barra de endereço)

# 5. Ativar modo avião ou desconectar internet

# 6. Abrir o PWA instalado - deve funcionar offline!
```

## 🎯 O Que Funciona Offline

✅ Navegação entre todas as páginas (Hinos, Antifonas, Ritos)
✅ Busca completa (busca em cache local)
✅ Leitura de todos os 506 hinos/ritos/antífonas
✅ Favoritos (salvos no localStorage)
✅ Configurações de fonte
✅ Tema escuro/claro
✅ Histórico de navegação

## 🚨 Importante

- O Service Worker precisa ser registrado pelo menos UMA VEZ online
- Após isso, tudo funciona offline
- A Vercel serve os arquivos com os headers corretos
- O `vercel.json` garante que as rotas funcionem como SPA

## 📊 Estatísticas do Build

```
PWA v1.1.0
mode      generateSW
precache  53 entries (990.00 KiB)
- sw.js
- workbox-40c80ae4.js
- index.html
- /api/hymnal (506 items)
- Todos os assets necessários
```

## 🔄 Sistema de Updates (Implementado)

Além das correções offline, foi implementado:

✅ Botão "Atualizar App" nas configurações
✅ Aparece apenas quando há nova versão disponível
✅ Não aparece em apps nativos (só PWA/Web)
✅ Detecta automaticamente updates do Service Worker
✅ Aplica update e recarrega automaticamente

Veja: `composables/usePwaUpdate.ts`
