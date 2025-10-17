import { ref, onMounted, onUnmounted } from 'vue'
import { isPlatform } from '@ionic/vue'

export const usePwaUpdate = () => {
  const updateAvailable = ref(false)
  const registration = ref<ServiceWorkerRegistration | null>(null)
  const isNativeApp = isPlatform('capacitor') || isPlatform('cordova')

  const checkForUpdate = async () => {
    // Não verifica updates em apps nativos
    if (isNativeApp) {
      return
    }

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      try {
        const reg = await navigator.serviceWorker.getRegistration()
        if (reg) {
          registration.value = reg
          await reg.update()
        }
      } catch (error) {
        console.error('Erro ao verificar update:', error)
      }
    }
  }

  const applyUpdate = async () => {
    if (!registration.value || !registration.value.waiting) {
      return
    }

    // Envia mensagem para o SW waiting ativar
    registration.value.waiting.postMessage({ type: 'SKIP_WAITING' })
    
    // Recarrega a página após o novo SW estar ativo
    registration.value.waiting.addEventListener('statechange', (e: Event) => {
      const target = e.target as ServiceWorker
      if (target.state === 'activated') {
        window.location.reload()
      }
    })
  }

  onMounted(() => {
    // Não configura listeners em apps nativos
    if (isNativeApp) {
      return
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload()
      })

      // Listener para detectar novo SW waiting
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
          updateAvailable.value = true
        }
      })

      // Verifica se já existe um SW waiting
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg && reg.waiting) {
          updateAvailable.value = true
          registration.value = reg
        }
      })
    }
  })

  return {
    updateAvailable,
    isNativeApp,
    checkForUpdate,
    applyUpdate,
  }
}
