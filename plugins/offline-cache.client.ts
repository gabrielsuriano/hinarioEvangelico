export default defineNuxtPlugin(async () => {
  if (process.client) {
    // Aguarda 2 segundos para não bloquear a renderização inicial
    setTimeout(async () => {
      try {
        // Pre-carrega dados dos hinos para garantir cache offline
        const response = await fetch('/api/hymnal')
        if (response.ok) {
          console.log('✅ Dados do hinário em cache para uso offline')
        }
      } catch (error) {
        console.warn('⚠️ Não foi possível pré-carregar dados do hinário:', error)
      }
    }, 2000)
  }
})
