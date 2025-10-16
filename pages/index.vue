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
      <ion-list>
        <ion-item button @click="navigateTo('/hinos')">
          <ion-icon slot="start" :icon="musicalNotesOutline"></ion-icon>
          <ion-label :style="{ fontSize: hymnalStore.fontSize + 'px' }">
            <h2>Hinos</h2>
            <p>{{ hymnalStore.hymns.length }} hinos disponíveis</p>
          </ion-label>
          <ion-icon slot="end" :icon="chevronForward"></ion-icon>
        </ion-item>

        <ion-item button @click="navigateTo('/antifonas')">
          <ion-icon slot="start" :icon="prismOutline"></ion-icon>
          <ion-label :style="{ fontSize: hymnalStore.fontSize + 'px' }">
            <h2>Antifonas</h2>
            <p>{{ hymnalStore.antiphons.length }} antifonas disponíveis</p>
          </ion-label>
          <ion-icon slot="end" :icon="chevronForward"></ion-icon>
        </ion-item>

        <ion-item button @click="navigateTo('/ritos')">
          <ion-icon slot="start" :icon="bookOutline"></ion-icon>
          <ion-label :style="{ fontSize: hymnalStore.fontSize + 'px' }">
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
ion-label {
  font-size: v-bind('hymnalStore.fontSize + "px"') !important;
}

ion-label h2,
ion-label p {
  font-size: inherit !important;
}
</style>
