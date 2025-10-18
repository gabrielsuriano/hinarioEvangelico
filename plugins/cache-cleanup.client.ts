export default defineNuxtPlugin(() => {
  if (process.client && 'serviceWorker' in navigator && 'caches' in window) {
    // Aguarda o Service Worker estar pronto
    navigator.serviceWorker.ready.then(async () => {
      try {
        console.log('🧹 Verificando caches antigos...')

        // Lista de caches antigos que devem ser removidos
        const oldCacheNames = [
          'hymnal-data-cache', // Cache antigo (v1)
          'hymnal-data-cache-v1',
        ]

        const cacheNames = await caches.keys()

        for (const cacheName of cacheNames) {
          // Remove caches com nomes antigos
          if (oldCacheNames.includes(cacheName)) {
            console.log(`🗑️ Removendo cache antigo: ${cacheName}`)
            await caches.delete(cacheName)
          }

          // Remove caches de versões antigas do workbox
          if (cacheName.includes('workbox-precache') && !cacheName.includes('workbox-precache-v2')) {
            console.log(`🗑️ Removendo cache antigo: ${cacheName}`)
            await caches.delete(cacheName)
          }
        }

        console.log('✅ Limpeza de cache concluída!')
      } catch (error) {
        console.error('❌ Erro ao limpar caches:', error)
      }
    })
  }
})
