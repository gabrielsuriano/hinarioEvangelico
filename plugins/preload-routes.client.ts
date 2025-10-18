export default defineNuxtPlugin(() => {
  if (process.client && 'serviceWorker' in navigator) {
    // Aguarda o Service Worker estar pronto
    navigator.serviceWorker.ready.then(async () => {
      // Lista de rotas críticas para preload
      const criticalRoutes = [
        '/',
        '/hinos',
        '/antifonas',
        '/ritos'
      ]

      // Verifica se está online antes de tentar preload
      if (navigator.onLine) {
        console.log('🔄 Preloading rotas críticas para cache offline...')

        // Preload das rotas em background
        for (const route of criticalRoutes) {
          try {
            // Usa fetch para colocar no cache do Service Worker
            await fetch(route, {
              method: 'GET',
              cache: 'force-cache'
            })
            console.log('✅ Preload:', route)
          } catch (error) {
            console.warn('⚠️ Falha no preload de', route, error)
          }
        }

        console.log('✅ Preload de rotas concluído!')
      } else {
        console.log('📴 Offline - pulando preload de rotas')
      }
    })
  }
})
