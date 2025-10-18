<template>
  <!-- Não renderiza nada visualmente, apenas gerencia o action sheet -->
</template>

<script setup lang="ts">
import {
  actionSheetController,
  toastController,
} from '@ionic/vue'
import { add, remove, text, cloudDownloadOutline, refreshOutline, informationCircleOutline, downloadOutline } from 'ionicons/icons'
import { usePwaUpdate } from '~/composables/usePwaUpdate'
import packageJson from '~/package.json'

const hymnalStore = useHymnalStore()
const { updateAvailable, isNativeApp, applyUpdate, forceCheckUpdate, forceReload } = usePwaUpdate()

// Importa a versão dinamicamente do package.json
const appVersion = packageJson.version

// Estado para controlar o prompt de instalação
const deferredPrompt = ref<any>(null)
const isInstalled = ref(false)
const isIOS = ref(false)

// Detecta se o app já está instalado
onMounted(() => {
  // Detecta se é iOS
  isIOS.value = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream

  // Verifica se está rodando em modo standalone (instalado)
  if (window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true) {
    isInstalled.value = true
  }

  // Escuta o evento beforeinstallprompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e
    isInstalled.value = false // Se o evento disparou, não está instalado
  })

  // Escuta quando o app é instalado
  window.addEventListener('appinstalled', () => {
    isInstalled.value = true
    deferredPrompt.value = null
  })
})

const installApp = async () => {
  if (!deferredPrompt.value) return

  deferredPrompt.value.prompt()
  const { outcome } = await deferredPrompt.value.userChoice

  if (outcome === 'accepted') {
    const toast = await toastController.create({
      message: 'App instalado com sucesso!',
      duration: 2000,
      position: 'bottom',
      color: 'success'
    })
    await toast.present()
  }

  deferredPrompt.value = null
}

const showIOSInstructions = async () => {
  const toast = await toastController.create({
    message: 'Toque em "Compartilhar" e depois em "Adicionar à Tela de Início"',
    duration: 5000,
    position: 'bottom',
    color: 'primary',
    buttons: [
      {
        text: 'OK',
        role: 'cancel'
      }
    ]
  })
  await toast.present()
}

const present = async () => {
  const buttons: any[] = []

  // Botão de informação da versão
  buttons.push({
    text: `Versão ${appVersion}`,
    icon: informationCircleOutline,
    cssClass: 'version-info',
    handler: () => {
      return false // Mantém o menu aberto
    },
  })

  // Botão de instalar app (só aparece se NÃO estiver instalado)
  if (!isInstalled.value) {
    if (deferredPrompt.value) {
      // Chrome/Edge - usa o prompt nativo
      buttons.push({
        text: 'Instalar App',
        icon: downloadOutline,
        cssClass: 'install-button',
        handler: () => {
          installApp()
          return true // Fecha o menu
        },
      })
    } else if (isIOS.value) {
      // iOS - mostra instruções
      buttons.push({
        text: 'Instalar App',
        icon: downloadOutline,
        cssClass: 'install-button',
        handler: () => {
          showIOSInstructions()
          return true // Fecha o menu
        },
      })
    }
  }

  // Adiciona botão de aplicar update se houver update disponível e não for app nativo
  if (updateAvailable.value && !isNativeApp) {
    buttons.push({
      text: 'Atualizar App',
      icon: cloudDownloadOutline,
      cssClass: 'update-button',
      handler: () => {
        applyUpdate()
        return true // Fecha o menu
      },
    })
  }

  // Adiciona botão de verificar atualizações (apenas online)
  if (navigator.onLine && !isNativeApp) {
    buttons.push({
      text: 'Verificar Atualizações',
      icon: cloudDownloadOutline,
      handler: async () => {
        const hasUpdate = await forceCheckUpdate()
        if (hasUpdate) {
          // Fecha e reabre o menu para mostrar o botão de atualizar
          actionSheet.dismiss()
          present()
        } else {
          // Mostra toast informando que não há atualizações
          const toast = await toastController.create({
            message: 'Nenhuma atualização disponível',
            duration: 2000,
            position: 'bottom',
            color: 'medium'
          })
          await toast.present()
        }
        return false // Mantém o menu aberto
      },
    })
  }

  // Adiciona botões de fonte
  buttons.push(
    {
      text: 'Aumentar Fonte',
      icon: add,
      handler: () => {
        hymnalStore.increaseFontSize()
        return false // Mantém o menu aberto
      },
    },
    {
      text: 'Diminuir Fonte',
      icon: remove,
      handler: () => {
        hymnalStore.decreaseFontSize()
        return false // Mantém o menu aberto
      },
    },
    {
      text: 'Fonte Padrão',
      icon: text,
      handler: () => {
        hymnalStore.resetFontSize()
        return false // Mantém o menu aberto
      },
    },
    {
      text: 'Recarregar App',
      icon: refreshOutline,
      handler: () => {
        forceReload()
        return true
      },
    },
    {
      text: 'Cancelar',
      role: 'cancel',
    }
  )
  const actionSheet = await actionSheetController.create({
    header: 'Configurações',
    buttons,
  })
  await actionSheet.present()
}

// Expõe a função present para ser chamada pelos pais
defineExpose({
  present
})
</script>

<style>
.version-info {
  color: var(--ion-color-medium) !important;
  font-size: 0.9em !important;
  pointer-events: none !important;
  opacity: 0.7 !important;
}

.install-button {
  color: var(--ion-color-primary) !important;
  font-weight: 600 !important;
}

.update-button {
  color: var(--ion-color-success) !important;
  font-weight: 600 !important;
}
</style>
