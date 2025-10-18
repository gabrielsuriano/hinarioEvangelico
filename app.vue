<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const hymnalStore = useHymnalStore()
const router = useRouter()

onMounted(async () => {
  // Carrega o hinário primeiro
  await hymnalStore.loadHymnal()
  
  // Força o pré-carregamento das rotas principais para funcionamento offline
  if (process.client && 'serviceWorker' in navigator) {
    // Aguarda SW estar pronto
    navigator.serviceWorker.ready.then(() => {
      console.log('📦 Pré-carregando rotas para uso offline...')
      
      // Força o Vue Router a carregar os componentes das rotas principais
      const criticalRoutes = ['/hinos', '/antifonas', '/ritos']
      
      criticalRoutes.forEach(route => {
        // Resolve a rota para forçar o carregamento do componente
        router.resolve(route)
      })
      
      console.log('✅ Rotas pré-carregadas')
    })
  }
})
</script>
