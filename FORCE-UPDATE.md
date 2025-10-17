# Como Forçar Atualização do PWA

## Problema
O Service Worker antigo pode estar cacheado no navegador/celular, impedindo que a nova versão seja carregada.

## Soluções

### Opção 1: Desinstalar e Reinstalar o PWA (RECOMENDADO)
1. No celular, **desinstale** o app do Hinário
2. Limpe o cache do navegador:
   - Chrome Android: Configurações > Privacidade > Limpar dados de navegação > Cache
3. Acesse novamente: https://hinario-evangelico.vercel.app/
4. **Reinstale** o PWA

### Opção 2: Limpar Service Workers manualmente
1. Abra o Chrome no celular
2. Digite na barra de endereços: `chrome://serviceworker-internals/`
3. Procure por `hinario-evangelico.vercel.app`
4. Clique em **Unregister** em todos os Service Workers
5. Recarregue a página do app

### Opção 3: Usar o DevTools (Chrome Android)
1. Conecte o celular ao computador via USB
2. Ative "Depuração USB" nas Opções do Desenvolvedor
3. No Chrome desktop: `chrome://inspect/#devices`
4. Selecione o app
5. Application > Service Workers > Unregister
6. Application > Clear storage > Clear site data

### Opção 4: Via Código (Já implementado)
No menu de configurações do app, use o botão **"Recarregar App"** para forçar reload.

## Verificar Versão Atual
1. Abra o app
2. Abra o Console do navegador (se possível)
3. Procure por: `"Hinário carregado com sucesso do arquivo local!"`
4. Deve mostrar a quantidade de hinos/antifonas/ritos

## Mudanças Implementadas
- ✅ Versão atualizada para 1.1.0
- ✅ Headers de cache mais agressivos (no-cache)
- ✅ Verificação automática de updates ao abrir o app
- ✅ Botão "Recarregar App" no menu de configurações
- ✅ Logs de debug para identificar problemas
- ✅ Start URL com versão para forçar refresh

## Após Deploy
1. Faça commit e push das mudanças
2. Aguarde o deploy na Vercel (~2-3 minutos)
3. No celular, desinstale o app antigo
4. Limpe o cache
5. Reinstale o app

## Comandos úteis
```bash
# Rebuild e deploy
npm run generate
git add .
git commit -m "Force update: v1.1.0"
git push

# Verificar build local
ls -lh .output/public/_nuxt/
```
