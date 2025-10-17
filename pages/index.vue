<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Hinário Evangélico Metodista</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="toggleTheme">
            <ion-icon slot="icon-only" :icon="themeStore.isDark ? sunny : moon"></ion-icon>
          </ion-button>
          <ion-button @click="presentActionSheet">
            <ion-icon slot="icon-only" :icon="settings"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-list lines="full">
        <ion-item button @click="navigateTo('/hinos')">
          <ion-icon slot="start" :icon="musicalNotesOutline"></ion-icon>
          <ion-label>
            <h2>Hinos</h2>
            <p>{{ hymnalStore.hymns.length }} hinos disponíveis</p>
          </ion-label>
          <ion-icon slot="end" :icon="chevronForward"></ion-icon>
        </ion-item>

        <ion-item button @click="navigateTo('/antifonas')">
          <ion-icon slot="start" :icon="prismOutline"></ion-icon>
          <ion-label>
            <h2>Antifonas</h2>
            <p>{{ hymnalStore.antiphons.length }} antifonas disponíveis</p>
          </ion-label>
          <ion-icon slot="end" :icon="chevronForward"></ion-icon>
        </ion-item>

        <ion-item button @click="navigateTo('/ritos')">
          <ion-icon slot="start" :icon="bookOutline"></ion-icon>
          <ion-label>
            <h2>Ritos</h2>
            <p>{{ hymnalStore.rituals.length }} ritos disponíveis</p>
          </ion-label>
          <ion-icon slot="end" :icon="chevronForward"></ion-icon>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonButtons,
  IonButton,
  actionSheetController,
  toastController,
} from '@ionic/vue'
import { musicalNotesOutline, prismOutline, bookOutline, chevronForward, settings, add, remove, text, moon, sunny, cloudDownloadOutline } from 'ionicons/icons'
import { useThemeStore } from '~/stores/theme'
import { usePwaUpdate } from '~/composables/usePwaUpdate'

const hymnalStore = useHymnalStore()
const themeStore = useThemeStore()
const router = useRouter()
const { updateAvailable, isNativeApp, checkForUpdate, applyUpdate, forceCheckUpdate } = usePwaUpdate()

// Carrega dados do hinário
await hymnalStore.loadHymnal()

const navigateTo = (path: string) => {
  router.push(path)
}

const toggleTheme = () => {
  themeStore.toggleTheme()
}

const presentActionSheet = async () => {
  const buttons: any[] = []
  
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
          presentActionSheet()
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
</script>

<style scoped>
ion-list {
  padding: 0 !important;
  width: 100% !important;
  display: block !important;
  background: transparent !important;
}

ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --inner-padding-end: 8px;
  --min-height: 80px;
  display: flex !important;
  width: 100% !important;
  margin: 0 !important;
  float: none !important;
}

ion-icon[slot="start"] {
  margin-inline-end: 16px !important;
  font-size: 28px !important;
  color: var(--ion-color-primary) !important;
}

ion-label {
  font-size: v-bind('hymnalStore.fontSize + "px"') !important;
  margin: 12px 0 !important;
  display: block !important;
  width: 100% !important;
}

ion-label h2,
ion-label p {
  font-size: inherit !important;
  display: block !important;
  width: 100% !important;
}

ion-label h2 {
  font-size: 1.1em !important;
  font-weight: 600 !important;
  margin: 0 0 6px 0 !important;
}

ion-label p {
  font-size: 0.9em !important;
  margin: 0 !important;
  opacity: 0.7;
}

:deep(.update-button) {
  color: var(--ion-color-success) !important;
  font-weight: 600 !important;
}
</style>
