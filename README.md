# 🎵 Hinário Evangélico Metodista

Aplicação web, mobile e PWA do Hinário Evangélico Metodista.

## 🚀 Início Rápido

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev
```

Acesse: http://localhost:3000

## 📚 Documentação

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Guia completo de configuração e uso
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Resumo do projeto e arquivos criados
- **[README_APP.md](./README_APP.md)** - Documentação técnica detalhada
- **[docs/HTTPS-TAILSCALE.md](./docs/HTTPS-TAILSCALE.md)** - Configuração HTTPS com Tailscale para PWA

## 🛠️ Tecnologias

- Nuxt 3 + Vue 3
- Ionic Vue
- Pinia (estado)
- TypeScript
- PWA

## ✨ Funcionalidades

- ✅ Hinos, Antifonas e Ritos
- ✅ Busca em tempo real
- ✅ Sistema de favoritos
- ✅ Controle de fonte
- ✅ PWA (instalável)
- ✅ Persistência local

## 📁 Estrutura

```
├── components/      # Componentes reutilizáveis
├── pages/           # Páginas/rotas
├── stores/          # Stores Pinia
├── types/           # Tipos TypeScript
├── hymnals/         # Dados JSON
├── layouts/         # Layouts
├── plugins/         # Plugins Nuxt
├── scripts/         # Scripts de build e configuração
└── docs/            # Documentação adicional
```

## 🔒 Segurança

Este projeto **não inclui** certificados SSL no repositório. Os certificados do Tailscale são armazenados na pasta **`personal/`**, que é ignorada pelo git e deve ser gerada localmente por cada desenvolvedor.

Para configurar HTTPS:
```bash
./scripts/setup-https.sh
```

A pasta `personal/` está no `.gitignore` e é usada para:
- 🔐 Certificados SSL (`.crt`, `.key`)
- 📝 Configurações pessoais
- 🔑 Dados sensíveis locais

**Nunca commite a pasta `personal/` ou arquivos sensíveis!**

## 🎯 Scripts

```bash
# Desenvolvimento
npm run dev                 # Servidor dev com hot-reload

# Build e Produção
npm run generate           # Build estático PWA (recomendado)
npm run build              # Build SSR
npm run preview            # Preview do build

# PWA com HTTPS (teste em dispositivos móveis)
npm run serve:https        # Servidor HTTPS com certificados Tailscale
./scripts/setup-https.sh   # Configurar certificados (primeira vez)

# Utilitários
npm run generate-icons     # Gerar ícones PWA
```

### 📱 Testar PWA no Celular

Para testar o PWA em dispositivos móveis, você precisa de HTTPS. Consulte **[docs/HTTPS-TAILSCALE.md](./docs/HTTPS-TAILSCALE.md)** para instruções completas.

**Resumo rápido:**
```bash
# 1. Configurar certificados HTTPS (apenas uma vez)
./scripts/setup-https.sh

# 2. Gerar build estático
npm run generate

# 3. Servir com HTTPS
npm run serve:https

# 4. Acessar no celular via Tailscale
# Use a URL mostrada no terminal
```

## 📖 Mais Informações

Consulte os arquivos de documentação listados acima para mais detalhes.

---

Desenvolvido com ❤️ usando Vue 3 + Nuxt 3 + Ionic
Hinário Evangélico Metodista feito em Vue 3 + Nuxt + Ionic
