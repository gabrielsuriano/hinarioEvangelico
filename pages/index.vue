<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Hinário Evangélico</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="toggleTheme">
            <ion-icon slot="icon-only" :icon="themeStore.isDark ? sunny : moon"></ion-icon>
          </ion-button>
          <ion-button @click="openSettings">
            <ion-icon slot="icon-only" :icon="settings"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-list lines="full">
        <ion-item v-if="hymnalStore.hymns.length > 0" button @click="navigateTo('/hinos')">
          <ion-icon slot="start" :icon="musicalNotesOutline"></ion-icon>
          <ion-label>
            <h2>Hinos</h2>
            <p>{{ hymnalStore.hymns.length }} hinos disponíveis</p>
          </ion-label>
          <ion-icon slot="end" :icon="chevronForward"></ion-icon>
        </ion-item>

        <ion-item v-if="hymnalStore.antiphons.length > 0" button @click="navigateTo('/antifonas')">
          <ion-icon slot="start" :icon="prismOutline"></ion-icon>
          <ion-label>
            <h2>Antifonas</h2>
            <p>{{ hymnalStore.antiphons.length }} antifonas disponíveis</p>
          </ion-label>
          <ion-icon slot="end" :icon="chevronForward"></ion-icon>
        </ion-item>

        <ion-item v-if="hymnalStore.rituals.length > 0" button @click="navigateTo('/ritos')">
          <ion-icon slot="start" :icon="bookOutline"></ion-icon>
          <ion-label>
            <h2>Ritos</h2>
            <p>{{ hymnalStore.rituals.length }} ritos disponíveis</p>
          </ion-label>
          <ion-icon slot="end" :icon="chevronForward"></ion-icon>
        </ion-item>
      </ion-list>
    </ion-content>

    <SettingsMenu ref="settingsMenu" />
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
} from '@ionic/vue'
import { musicalNotesOutline, prismOutline, bookOutline, chevronForward, settings, moon, sunny } from 'ionicons/icons'
import { useThemeStore } from '~/stores/theme'
import SettingsMenu from '~/components/SettingsMenu.vue'

const hymnalStore = useHymnalStore()
const themeStore = useThemeStore()
const router = useRouter()
const settingsMenu = ref()

// Carrega dados do hinário
await hymnalStore.loadHymnal()

const navigateTo = (path: string) => {
  router.push(path)
}

const toggleTheme = () => {
  themeStore.toggleTheme()
}

const openSettings = () => {
  settingsMenu.value?.present()
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
</style>
