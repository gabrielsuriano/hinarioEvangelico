export default defineNuxtPlugin(() => {
  if (process.client) {
    // Injeta o manifest no head se não existir
    const manifestLink = document.querySelector('link[rel="manifest"]')
    if (!manifestLink) {
      const link = document.createElement('link')
      link.rel = 'manifest'
      link.href = '/manifest.webmanifest'
      document.head.appendChild(link)
      console.log('✅ PWA Manifest injetado manualmente')
    }
  }
})
