export default defineNuxtPlugin(() => {
  if (process.client) {
    // Debug do Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        console.log('✅ Service Worker ativo:', registration.active?.state)
        console.log('📦 Scope:', registration.scope)
      })

      // Log de eventos de fetch
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('📨 Mensagem do SW:', event.data)
      })

      // Detecta quando fica offline/online
      window.addEventListener('offline', () => {
        console.log('📴 App ficou OFFLINE')
      })

      window.addEventListener('online', () => {
        console.log('📶 App ficou ONLINE')
      })

      // Log do estado atual
      console.log('🌐 Navigator online:', navigator.onLine)
    }

    // Debug de erros de rede
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason?.message?.includes('fetch') || event.reason?.message?.includes('network')) {
        console.error('❌ Erro de rede não tratado:', event.reason)
      }
    })
  }
})
