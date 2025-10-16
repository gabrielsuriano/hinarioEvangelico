# PWA - Hinário Evangélico Metodista

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
npm run dev              # Desenvolvimento (PWA habilitado)
npm run dev:host         # Desenvolvimento com acesso de rede
npm run build            # Build de produção
npm run preview          # Preview do build
npm run preview:host     # Preview com acesso de rede
npm run generate-icons   # Gerar ícones do PWA
```

## 📱 Como Testar PWA

### Desktop (localhost):
1. Abra `http://localhost:3000`
2. Veja o ícone ➕ na barra de endereços
3. Clique para instalar

### Mobile (rede local):
1. Execute: `npm run dev:host`
2. Acesse do celular: `http://SEU_IP:3000`
3. **ATENÇÃO:** PWA só instala via HTTPS em mobile
4. Para testar em mobile com HTTPS:
   - Deploy em produção (Vercel, Netlify, etc)
   - Ou use túnel HTTPS (localtunnel, ngrok, etc)

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
- ✅ Funciona offline
- ✅ Service Worker com cache automático
- ✅ 500 hinos disponíveis offline
- ✅ Ícones adaptáveis (maskable)
- ✅ Theme color configurado
- ✅ Standalone display mode
- ✅ Cache de fontes Google
- ✅ Cache do endpoint /api/hymnal

## 📝 Notas

- PWA funciona em desenvolvimento (localhost)
- Para mobile via IP local, é necessário HTTPS
- Build de produção gera service worker otimizado
- Ícones são gerados automaticamente pelo script
