export default defineNuxtPlugin(async () => {
  if (process.client) {
    // Aguarda um pouco para não bloquear a renderização inicial
    setTimeout(async () => {
      console.log('🔄 Pré-carregando páginas para uso offline...')
      
      try {
        // Força o carregamento de todas as páginas principais
        const pages = [
          '/hinos',
          '/antifonas',
          '/ritos'
        ]
        
        // Usa link prefetch para forçar o download
        for (const page of pages) {
          const link = document.createElement('link')
          link.rel = 'prefetch'
          link.href = page
          document.head.appendChild(link)
        }
        
        console.log('✅ Páginas pré-carregadas para uso offline')
      } catch (error) {
        console.warn('⚠️ Erro ao pré-carregar páginas:', error)
      }
    }, 2000)
  }
})
