export default defineNuxtPlugin(() => {
  if (process.client) {
    // Injeta o manifest no head se não existir
    const manifestLink = document.querySelector('link[rel="manifest"]')
    if (!manifestLink) {
      const link = document.createElement('link')
      link.rel = 'manifest'
      link.href = '/manifest.webmanifest'
      document.head.appendChild(link)
      console.log('✅ PWA Manifest injetado')
    }

    // Registra o Service Worker manualmente se necessário
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js', { 
            scope: '/',
            updateViaCache: 'none' // Força verificação de updates
          })
          .then(registration => {
            console.log('✅ Service Worker registrado:', registration.scope)
            
            // Força atualização do SW
            registration.update()
            
            // Listener para quando houver atualização
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing
              console.log('🔄 Nova versão do Service Worker detectada')
              
              newWorker?.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('✅ Nova versão instalada! Recarregue a página.')
                  
                  // Notifica a aplicação que há update disponível
                  if (navigator.serviceWorker.controller) {
                    navigator.serviceWorker.controller.postMessage({
                      type: 'UPDATE_AVAILABLE'
                    })
                  }
                  
                  // Também dispara um evento customizado
                  window.dispatchEvent(new CustomEvent('swUpdateAvailable'))
                }
              })
            })
            
            // Adiciona listener para mensagens do SW
            navigator.serviceWorker.addEventListener('message', (event) => {
              if (event.data && event.data.type === 'CACHE_UPDATED') {
                console.log('✅ Cache atualizado:', event.data.url)
              }
            })
          })
          .catch(error => {
            console.error('❌ Erro ao registrar Service Worker:', error)
          })
      })
      
      // Listener para quando o SW está controlando a página
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('🔄 Service Worker controller mudou')
      })
    }
  }
})
