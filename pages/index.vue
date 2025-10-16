<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Hinário Evangélico Metodista</ion-title>
        <ion-buttons slot="end">
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
} from '@ionic/vue'
import { musicalNotesOutline, prismOutline, bookOutline, chevronForward, settings, add, remove, text } from 'ionicons/icons'

const hymnalStore = useHymnalStore()
const router = useRouter()

const navigateTo = (path: string) => {
  router.push(path)
}

const presentActionSheet = async () => {
  const actionSheet = await actionSheetController.create({
    header: 'Configurações',
    buttons: [
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
      },
    ],
  })
  await actionSheet.present()
}
</script>

<style scoped>
ion-content {
  --background: #f5f5f5;
}

ion-list {
  padding: 0 !important;
  width: 100% !important;
  display: block !important;
  background: transparent !important;
}

ion-item {
  --background: white;
  --border-color: #dedede;
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
  color: #000 !important;
}

ion-label p {
  font-size: 0.9em !important;
  margin: 0 !important;
  color: #666 !important;
}
</style>
