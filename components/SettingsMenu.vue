<template>
  <!-- Não renderiza nada visualmente, apenas gerencia o action sheet -->
</template>

<script setup lang="ts">
import {
  actionSheetController,
  toastController,
} from '@ionic/vue'
import { add, remove, text, cloudDownloadOutline, refreshOutline, informationCircleOutline } from 'ionicons/icons'
import { usePwaUpdate } from '~/composables/usePwaUpdate'
import packageJson from '~/package.json'

const hymnalStore = useHymnalStore()
const { updateAvailable, isNativeApp, applyUpdate, forceCheckUpdate, forceReload } = usePwaUpdate()

// Importa a versão dinamicamente do package.json
const appVersion = packageJson.version

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

.update-button {
  color: var(--ion-color-success) !important;
  font-weight: 600 !important;
}
</style>
