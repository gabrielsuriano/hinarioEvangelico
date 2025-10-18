export default defineNuxtPlugin(() => {
  if (process.client) {
    // Apenas monitora status online/offline
    window.addEventListener('offline', () => {
      console.log('📴 App offline - Service Worker ativo')
    })

    window.addEventListener('online', () => {
      console.log('📶 App online')
    })
  }
})
