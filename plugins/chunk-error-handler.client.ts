export default defineNuxtPlugin((nuxtApp) => {
  // Captura erros de chunks dinâmicos
  nuxtApp.hook('app:error', (error) => {
    const chunkFailedMessage = /Failed to fetch dynamically imported module|Loading chunk [\d]+ failed/i

    if (chunkFailedMessage.test(error.message)) {
      console.warn('⚠️ Chunk loading failed:', error.message)

      // Se está offline, NÃO recarrega (vai falhar de novo)
      if (!navigator.onLine) {
        console.error('❌ Offline: não é possível carregar chunks. Você precisa visitar esta página online primeiro.')
        return
      }

      // Evita loop infinito de reloads quando online
      const hasReloaded = sessionStorage.getItem('chunk-reload-attempted')

      if (!hasReloaded) {
        sessionStorage.setItem('chunk-reload-attempted', 'true')
        console.log('🔄 Recarregando página...')
        window.location.reload()
      } else {
        console.error('❌ Chunk loading failed after reload. Please clear cache and try again.')
        sessionStorage.removeItem('chunk-reload-attempted')
      }
    }
  })

  // Limpa flag de reload após carregar com sucesso
  if (process.client) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        sessionStorage.removeItem('chunk-reload-attempted')
      }, 1000)
    })
  }

  // Captura erros não tratados de importação de módulos
  if (process.client) {
    window.addEventListener('error', (event) => {
      if (event.message.includes('Failed to fetch dynamically imported module')) {
        event.preventDefault()

        // Se está offline, não tenta recarregar
        if (!navigator.onLine) {
          console.error('❌ Offline: Página não visitada antes. Conecte-se e tente novamente.')
          return
        }

        const hasReloaded = sessionStorage.getItem('chunk-reload-attempted')
        if (!hasReloaded) {
          sessionStorage.setItem('chunk-reload-attempted', 'true')
          console.warn('⚠️ Module loading failed, reloading...')
          window.location.reload()
        }
      }
    })

    // Captura erros de Promise rejeitada (chunks)
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason?.message?.includes('Failed to fetch dynamically imported module')) {
        event.preventDefault()

        // Se está offline, não tenta recarregar
        if (!navigator.onLine) {
          console.error('❌ Offline: Módulo não está em cache. Visite esta página online primeiro.')
          return
        }

        const hasReloaded = sessionStorage.getItem('chunk-reload-attempted')
        if (!hasReloaded) {
          sessionStorage.setItem('chunk-reload-attempted', 'true')
          console.warn('⚠️ Module loading failed, reloading...')
          window.location.reload()
        }
      }
    })
  }
})
