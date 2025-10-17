export default defineNuxtPlugin(() => {
  if (process.client) {
    // Força o carregamento da API assim que o app abre
    // Isso garante que os dados estejam cacheados para uso offline
    const preloadAPI = async () => {
      try {
        console.log('🔄 Pré-carregando dados da API para cache offline...')
        
        // Faz requisição que será cacheada pelo Service Worker
        const response = await fetch('/api/hymnal', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          console.log('✅ API pré-carregada e cacheada com sucesso!')
          
          // Marca que já foi feito o preload
          sessionStorage.setItem('api-preloaded', 'true')
        } else {
          console.warn('⚠️ Erro ao pré-carregar API:', response.status)
        }
      } catch (error) {
        console.warn('⚠️ Erro ao pré-carregar API (normal se offline):', error)
      }
    }

    // Só faz preload se não foi feito ainda nesta sessão
    if (typeof window !== 'undefined' && navigator.onLine) {
      const alreadyPreloaded = sessionStorage.getItem('api-preloaded')
      if (!alreadyPreloaded) {
        // Aguarda um pouco para não bloquear a renderização inicial
        setTimeout(preloadAPI, 100)
      }
    }
  }
})
