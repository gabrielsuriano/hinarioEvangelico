<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Hinário Evangélico Metodista</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-list>
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
} from '@ionic/vue'
import { musicalNotesOutline, prismOutline, bookOutline, chevronForward } from 'ionicons/icons'

const hymnalStore = useHymnalStore()
const router = useRouter()

const navigateTo = (path: string) => {
  router.push(path)
}
</script>
