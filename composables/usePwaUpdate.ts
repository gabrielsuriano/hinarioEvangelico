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
          console.log('🔍 Forçando verificação de atualização...')
          registration.value = reg

          // Força atualização do SW
          await reg.update()

          // Verifica se já tem update disponível (waiting ou installing)
          if (reg.waiting) {
            console.log('✅ Atualização encontrada (waiting)!')
            updateAvailable.value = true
            return true
          }

          if (reg.installing) {
            console.log('⏳ Atualização encontrada (installing)... aguardando...')
            // Aguarda o SW installing virar waiting
            return new Promise((resolve) => {
              reg.installing!.addEventListener('statechange', function checkState() {
                if (this.state === 'installed') {
                  console.log('✅ Atualização pronta!')
                  updateAvailable.value = true
                  resolve(true)
                }
              })

              // Timeout de 5 segundos
              setTimeout(() => {
                if (reg.waiting) {
                  console.log('✅ Atualização disponível!')
                  updateAvailable.value = true
                  resolve(true)
                } else {
                  console.log('⏱️ Timeout - verificando status...')
                  resolve(reg.waiting !== null)
                }
              }, 5000)
            })
          }

          // Aguarda um pouco mais para detectar mudanças
          console.log('⏳ Aguardando detecção de atualizações...')
          return new Promise((resolve) => {
            let checkCount = 0
            const checkInterval = setInterval(async () => {
              checkCount++
              const latestReg = await navigator.serviceWorker.getRegistration()

              if (latestReg && (latestReg.waiting || latestReg.installing)) {
                console.log('✅ Atualização detectada!')
                updateAvailable.value = true
                clearInterval(checkInterval)
                resolve(true)
                return
              }

              if (checkCount >= 10) { // 10 verificações = 5 segundos
                console.log('ℹ️ Nenhuma atualização encontrada')
                clearInterval(checkInterval)
                resolve(false)
              }
            }, 500) // Verifica a cada 500ms
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

        // Força verificação de update ao abrir o app (se online)
        if (navigator.onLine && reg) {
          console.log('Verificando atualizações automaticamente...')
          reg.update().catch((err) => {
            console.error('Erro ao verificar atualização:', err)
          })
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
