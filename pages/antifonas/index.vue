<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="router.push('/')">
            <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Antifonas</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="toggleTheme">
            <ion-icon slot="icon-only" :icon="themeStore.isDark ? sunny : moon"></ion-icon>
          </ion-button>
          <ion-button @click="openSettings">
            <ion-icon slot="icon-only" :icon="settings"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar
          v-model="searchText"
          placeholder="Buscar por título ou texto..."
          animated
          @ionClear="searchText = ''"
        ></ion-searchbar>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-list v-if="filteredAntiphons.length > 0">
        <ion-item
          v-for="antiphon in filteredAntiphons"
          :key="antiphon.id"
          button
          @click="navigateToAntiphon(antiphon.id)"
        >
          <ion-label :style="{ fontSize: hymnalStore.fontSize + 'px' }">
            <h2>{{ antiphon.number }}. {{ antiphon.title }}</h2>
          </ion-label>
          <ion-icon
            slot="end"
            :icon="hymnalStore.isFavorite(antiphon.id) ? heart : heartOutline"
            :color="hymnalStore.isFavorite(antiphon.id) ? 'danger' : ''"
            @click.stop="hymnalStore.toggleFavorite(antiphon.id)"
          ></ion-icon>
        </ion-item>
      </ion-list>

      <ion-text v-else class="ion-padding">
        <p class="ion-text-center">Nenhuma antifona encontrada.</p>
      </ion-text>
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
  IonSearchbar,
  IonText,
  IonButtons,
  IonButton,
  IonBackButton,
} from '@ionic/vue'
import { heart, heartOutline, settings, moon, sunny, arrowBack } from 'ionicons/icons'
import { useThemeStore } from '~/stores/theme'
import SettingsMenu from '~/components/SettingsMenu.vue'
import type { Content } from '~/types/hymnal'

const hymnalStore = useHymnalStore()
const themeStore = useThemeStore()
const router = useRouter()
const searchText = ref('')
const settingsMenu = ref()

// Carrega dados do hinário
await hymnalStore.loadHymnal()

const toggleTheme = () => {
  themeStore.toggleTheme()
}

const openSettings = () => {
  settingsMenu.value?.present()
}

// SEO: Metadados para lista de antifonas
useHead({
  title: 'Antifonas - Hinário Evangélico',
  meta: [
    {
      name: 'description',
      content: 'Explore as antifonas do Hinário Evangélico. Textos litúrgicos para adoração.'
    },
    {
      property: 'og:title',
      content: 'Antifonas - Hinário Evangélico'
    }
  ]
})

const filteredAntiphons = computed(() => {
  if (!searchText.value) {
    return hymnalStore.antiphons
  }

  const search = searchText.value.toLowerCase()
  return hymnalStore.antiphons.filter((antiphon: Content) => {
    // Busca em título e número
    const basicMatch = (
      antiphon.title.toLowerCase().includes(search) ||
      antiphon.number?.toString().includes(search)
    )

    if (basicMatch) return true

    // Busca no conteúdo (texto da antífona)
    if (Array.isArray(antiphon.items)) {
      return antiphon.items.some((item: any) => {
        if (typeof item === 'string') {
          return item.toLowerCase().includes(search)
        }
        if (typeof item === 'object' && item.text) {
          return item.text.toLowerCase().includes(search)
        }
        return false
      })
    }

    return false
  })
})

const navigateToAntiphon = (id: string) => {
  router.push(`/antifonas/${id}`)
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

:deep(.update-button) {
  color: var(--ion-color-success) !important;
  font-weight: 600 !important;
}
</style>
