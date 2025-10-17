export default defineNuxtPlugin(() => {
  if (process.client && 'serviceWorker' in navigator) {
    // Detecta quando o app vai para offline
    window.addEventListener('offline', () => {
      console.log('📴 App offline - Service Worker assumirá o controle')
      
      // Força o Service Worker a assumir controle imediatamente
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.active) {
          registration.active.postMessage({ type: 'CLIENTS_CLAIM' })
        }
      })
    })

    // Intercepta erros de navegação offline
    window.addEventListener('error', (event) => {
      if (!navigator.onLine && event.message?.includes('fetch')) {
        console.warn('⚠️ Erro de fetch offline detectado, recarregando...')
        // Aguarda um pouco e recarrega para o SW assumir controle
        setTimeout(() => {
          window.location.reload()
        }, 100)
      }
    })

    // Garante que o SW está ativo antes de qualquer navegação
    navigator.serviceWorker.ready.then((registration) => {
      console.log('✅ Service Worker pronto:', {
        state: registration.active?.state,
        scope: registration.scope,
        online: navigator.onLine
      })

      // Se está offline e SW não está controlando, força reload
      if (!navigator.onLine && !navigator.serviceWorker.controller) {
        console.warn('⚠️ Offline mas SW não está controlando, recarregando...')
        window.location.reload()
      }
    })
  }
})
