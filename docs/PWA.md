# PWA - Hinário Evangélico

## ✅ Configuração Final

### Arquivos PWA Essenciais:
- `nuxt.config.ts` - Configuração completa do PWA
- `public/manifest.webmanifest` - Manifest do PWA
- `public/icon-*.png` - Ícones do PWA (gerados)
- `plugins/pwa.client.ts` - Plugin que garante injeção do manifest
- `scripts/generate-icons.js` - Script para gerar ícones

### Pacotes Instalados:
- `@vite-pwa/nuxt` - Módulo PWA para Nuxt
- `sharp` - Geração de ícones

### Scripts Disponíveis:
```bash
npm run dev              # Desenvolvimento local (com PWA dev mode)
npm run dev:host         # Desenvolvimento com acesso de rede
npm run generate         # Build de produção (USAR ESTE PARA PWA!)
npm run generate-icons   # Gerar ícones do PWA
```

### Servir Build de Produção:
```bash
npx serve .output/public -l 3001
```

## 📱 Como Testar PWA

### Desktop (localhost):
1. Execute: `npm run generate`
2. Sirva: `npx serve .output/public -l 3001`
3. Abra `http://localhost:3001`
4. Veja o ícone ➕ na barra de endereços
5. Clique para instalar
6. Teste offline: F12 → Application → Service Workers → Marque "Offline"

### Mobile (rede local):
1. Execute: `npm run generate`
2. Sirva: `npx serve .output/public -l 3001`
3. Descubra seu IP: `hostname -I | awk '{print $1}'`
4. Acesse do celular: `http://SEU_IP:3001`
5. Navegue pelos hinos para cachear os dados
6. Clique em "Adicionar à tela inicial"
7. **Teste offline:** Ative modo avião ✈️ e abra o app
8. **Deve funcionar perfeitamente!** 🎉

### Mobile com HTTPS (para instalação):
**ATENÇÃO:** Mobile só instala PWA via HTTPS (ou localhost)
- Para testar com HTTPS, faça deploy em:
  - Vercel: `npx vercel --prod`
  - Netlify: `npx netlify-cli deploy --prod`
  - GitHub Pages (configure no repositório)

## 🚀 Deploy para Produção

### Vercel (Recomendado):
```bash
npm install -g vercel
vercel --prod
```

### Netlify:
```bash
npm run build
npx netlify-cli deploy --prod --dir=.output/public
```

## 🔧 Recursos PWA Implementados

- ✅ Instalação como app nativo
- ✅ Funciona 100% offline (todos os hinos)
- ✅ Service Worker com 50 arquivos em precache (986 KiB)
- ✅ 500 hinos disponíveis offline
- ✅ Ícones adaptáveis (maskable)
- ✅ Theme color configurado
- ✅ Standalone display mode
- ✅ Cache de fontes Google
- ✅ Cache inteligente com NetworkFirst
- ✅ Atualização automática do Service Worker

## ⚙️ Configuração Importante

**IMPORTANTE:** O PWA usa `devOptions.enabled: false` em produção.

Para desenvolvimento local com PWA ativo, altere temporariamente em `nuxt.config.ts`:
```typescript
devOptions: {
  enabled: true, // Ativar apenas para dev
  // ...
}
```

Para build de produção, **SEMPRE use:**
```bash
npm run generate  # NÃO use "npm run build"
```

## 📝 Notas

- PWA funciona em desenvolvimento (localhost)
- Para mobile via IP local, é necessário HTTPS
- Build de produção gera service worker otimizado
- Ícones são gerados automaticamente pelo script
