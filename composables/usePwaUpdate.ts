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

    // Só verifica se está online
    if (!navigator.onLine) {
      console.log('Offline - pulando verificação de updates')
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

  const forceCheckUpdate = async () => {
    // Força verificação de update mesmo offline
    if (isNativeApp) {
      return false
    }

    if (!navigator.onLine) {
      console.log('Sem conexão - impossível verificar updates')
      return false
    }

    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.getRegistration()
        if (reg) {
          registration.value = reg
          await reg.update()
          
          // Verifica se tem update disponível
          if (reg.waiting) {
            updateAvailable.value = true
            return true
          }
          
          // Aguarda um pouco para ver se detecta update
          return new Promise((resolve) => {
            setTimeout(() => {
              if (reg.waiting) {
                updateAvailable.value = true
                resolve(true)
              } else {
                resolve(false)
              }
            }, 1000)
          })
        }
      } catch (error) {
        console.error('Erro ao forçar verificação de update:', error)
        return false
      }
    }
    return false
  }

  const applyUpdate = async () => {
    if (!registration.value || !registration.value.waiting) {
      return
    }

    // Envia mensagem para o SW waiting ativar
    registration.value.waiting.postMessage({ type: 'SKIP_WAITING' })
    
    // Aguarda um pouco e força reload
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  const forceReload = () => {
    // Força reload completo, limpando cache do browser
    window.location.reload()
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
    forceCheckUpdate,
    applyUpdate,
    forceReload,
  }
}
