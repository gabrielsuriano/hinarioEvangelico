<template>
  <ion-page>
    <AppHeader
      title="Antifonas"
      show-back-button
      show-search
      v-model:search-value="searchText"
      search-placeholder="Buscar por título ou texto..."
      @open-settings="openSettings"
    />

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
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonText,
} from '@ionic/vue'
import { heart, heartOutline } from 'ionicons/icons'
import SettingsMenu from '~/components/SettingsMenu.vue'
import AppHeader from '~/components/AppHeader.vue'
import type { Content } from '~/types/hymnal'

const hymnalStore = useHymnalStore()
const router = useRouter()
const searchText = ref('')
const settingsMenu = ref()

// Carrega dados do hinário
await hymnalStore.loadHymnal()

// Progressive loading
const INITIAL_LOAD = 30
const displayedAntiphons = ref<Content[]>([])

const loadRemainingAntiphons = () => {
  if (displayedAntiphons.value.length >= hymnalStore.antiphons.length) return

  console.log('[Antifonas] Loading remaining antiphons in background...')
  displayedAntiphons.value = [...hymnalStore.antiphons]
  console.log('[Antifonas] All antiphons loaded:', displayedAntiphons.value.length)
}

onMounted(() => {
  // Carrega primeiras 30 antífonas imediatamente
  displayedAntiphons.value = hymnalStore.antiphons.slice(0, INITIAL_LOAD)
  console.log('[Antifonas] Initial load:', displayedAntiphons.value.length, 'antiphons')

  // Carrega o resto quando o navegador estiver ocioso
  if (hymnalStore.antiphons.length > INITIAL_LOAD) {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadRemainingAntiphons, { timeout: 2000 })
    } else {
      setTimeout(loadRemainingAntiphons, 100)
    }
  }
})

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
  // Se está buscando, busca em todas as antífonas
  if (searchText.value) {
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
  }

  // Se não está buscando, usa apenas as antífonas carregadas
  return displayedAntiphons.value
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
