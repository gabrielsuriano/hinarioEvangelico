<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Ritos</ion-title>
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
      <ion-list v-if="filteredRituals.length > 0">
        <ion-item
          v-for="ritual in filteredRituals"
          :key="ritual.id"
          button
          @click="navigateToRitual(ritual.id)"
        >
          <ion-label :style="{ fontSize: hymnalStore.fontSize + 'px' }">
            <h2>{{ ritual.number }}. {{ ritual.title }}</h2>
          </ion-label>
          <ion-icon
            slot="end"
            :icon="hymnalStore.isFavorite(ritual.id) ? heart : heartOutline"
            :color="hymnalStore.isFavorite(ritual.id) ? 'danger' : ''"
            @click.stop="hymnalStore.toggleFavorite(ritual.id)"
          ></ion-icon>
        </ion-item>
      </ion-list>

      <ion-text v-else class="ion-padding">
        <p class="ion-text-center">Nenhum rito encontrado.</p>
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
} from '@ionic/vue'
import { heart, heartOutline, settings, moon, sunny } from 'ionicons/icons'
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

// SEO: Metadados para lista de ritos
useHead({
  title: 'Ritos - Hinário Evangélico',
  meta: [
    {
      name: 'description',
      content: 'Explore os ritos litúrgicos do Hinário Evangélico. Batismo, Santa Ceia e mais.'
    },
    {
      property: 'og:title',
      content: 'Ritos - Hinário Evangélico'
    }
  ]
})

const filteredRituals = computed(() => {
  if (!searchText.value) {
    return hymnalStore.rituals
  }

  const search = searchText.value.toLowerCase()
  return hymnalStore.rituals.filter((ritual: Content) => {
    // Busca em título e número
    const basicMatch = (
      ritual.title.toLowerCase().includes(search) ||
      ritual.number?.toString().includes(search)
    )

    if (basicMatch) return true

    // Busca no conteúdo (texto do rito)
    if (Array.isArray(ritual.items)) {
      return ritual.items.some((item: any) => {
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

const navigateToRitual = (id: string) => {
  router.push(`/ritos/${id}`)
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
