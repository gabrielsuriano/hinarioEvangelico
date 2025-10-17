export default defineNuxtPlugin(async () => {
  if (process.client && 'serviceWorker' in navigator) {
    // Aguarda o Service Worker estar pronto
    navigator.serviceWorker.ready.then(async () => {
      // Aguarda 2 segundos para não bloquear a renderização inicial
      setTimeout(async () => {
        try {
          // Pre-carrega dados dos hinos para garantir cache offline
          const response = await fetch('/api/hymnal', {
            cache: 'force-cache'
          })
          if (response.ok) {
            const data = await response.json()
            console.log(`✅ ${data.length} itens do hinário em cache para uso offline`)
          }
        } catch (error) {
          console.warn('⚠️ Não foi possível pré-carregar dados do hinário:', error)
        }
      }, 2000)
    })
  }
})
