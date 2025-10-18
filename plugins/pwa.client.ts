export default defineNuxtPlugin(() => {
  if (process.client) {
    let deferredPrompt: any = null
    
    console.log('🎯 Plugin PWA inicializado')
    console.log('📱 Navigator standalone:', (window.navigator as any).standalone)
    console.log('📱 Display mode:', window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser')

    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('✅ beforeinstallprompt disparado - PWA pode ser instalado!')
      e.preventDefault()
      deferredPrompt = e

      setTimeout(() => {
        console.log('⏰ Mostrando banner de instalação...')
        showInstallBanner()
      }, 3000)
    })
    
    // Força verificação após 5 segundos
    setTimeout(() => {
      if (!deferredPrompt) {
        console.warn('⚠️ beforeinstallprompt NÃO foi disparado - possíveis razões:')
        console.warn('  1. App já está instalado')
        console.warn('  2. Não está em HTTPS (localhost é permitido)')
        console.warn('  3. Navegador não suporta')
        console.warn('  4. Critérios de instalação não atendidos')
        console.warn('  5. Service Worker não está ativo ainda')
        console.log('💡 Para resetar: execute no console: localStorage.removeItem("pwa-install-banner-shown")')
        console.log('💡 Depois recarregue a página (Ctrl+Shift+R)')
      } else {
        console.log('✨ beforeinstallprompt está disponível! PWA pronto para instalação.')
      }
    }, 5000)

    function showInstallBanner() {
      if (!deferredPrompt) {
        console.warn('⚠️ Não pode mostrar banner: deferredPrompt não disponível')
        return
      }

      const hasShownBanner = localStorage.getItem('pwa-install-banner-shown')
      if (hasShownBanner === 'true') {
        console.log('ℹ️ Banner já foi mostrado anteriormente')
        return
      }
      
      console.log('🎉 Mostrando banner de instalação!')

      const banner = document.createElement('div')
      banner.style.cssText = 'position:fixed;bottom:20px;left:20px;right:20px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:16px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.15);display:flex;align-items:center;justify-content:space-between;z-index:10000'

      banner.innerHTML = '<div style="flex:1"><div style="font-weight:600;margin-bottom:4px">Instalar Hinário</div><div style="font-size:14px;opacity:0.9">Adicione à tela inicial</div></div><div style="display:flex;gap:8px"><button id="pwa-install-btn" style="background:white;color:#667eea;border:none;padding:8px 16px;border-radius:6px;font-weight:600;cursor:pointer;font-size:14px">Instalar</button><button id="pwa-dismiss-btn" style="background:rgba(255,255,255,0.2);color:white;border:none;padding:8px 16px;border-radius:6px;font-weight:600;cursor:pointer;font-size:14px">Agora não</button></div>'

      document.body.appendChild(banner)

      document.getElementById('pwa-install-btn')?.addEventListener('click', async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt()
          await deferredPrompt.userChoice
          deferredPrompt = null
          banner.remove()
          localStorage.setItem('pwa-install-banner-shown', 'true')
        }
      })

      document.getElementById('pwa-dismiss-btn')?.addEventListener('click', () => {
        banner.remove()
        localStorage.setItem('pwa-install-banner-shown', 'true')
      })
    }

    window.addEventListener('appinstalled', () => {
      console.log('PWA instalado!')
      localStorage.setItem('pwa-install-banner-shown', 'true')
    })
  }
})
