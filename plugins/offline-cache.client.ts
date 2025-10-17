export default defineNuxtPlugin(async () => {
  if (process.client && 'serviceWorker' in navigator) {
    // Aguarda o Service Worker estar pronto
    navigator.serviceWorker.ready.then(async (registration) => {
      console.log('🔄 Service Worker pronto, pré-carregando dados...')
      
      // Função para garantir cache dos dados
      const cacheHymnalData = async () => {
        try {
          // Busca os dados do hinário
          const response = await fetch('/api/hymnal', {
            method: 'GET',
            headers: {
              'Accept': 'application/json'
            }
          })
          
          if (response.ok) {
            const data = await response.json()
            console.log(`✅ ${data.length} itens do hinário em cache para uso offline`)
            
            // Armazena no cache manualmente para garantir
            if ('caches' in window) {
              const cache = await caches.open('hymnal-data-cache')
              await cache.put('/api/hymnal', new Response(JSON.stringify(data), {
                status: 200,
                headers: {
                  'Content-Type': 'application/json',
                  'Cache-Control': 'public, max-age=31536000'
                }
              }))
              console.log('✅ Dados explicitamente salvos no cache')
            }
          }
        } catch (error) {
          console.warn('⚠️ Não foi possível pré-carregar dados do hinário:', error)
        }
      }
      
      // Tenta carregar imediatamente
      await cacheHymnalData()
      
      // E também agenda para tentar novamente depois
      setTimeout(cacheHymnalData, 5000)
    })
  }
})
