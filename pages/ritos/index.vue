<template>
  <ion-page>
    <AppHeader
      title="Ritos"
      show-back-button
      show-search
      v-model:search-value="searchText"
      search-placeholder="Buscar por título ou texto..."
      @open-settings="openSettings"
    />

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
const displayedRituals = ref<Content[]>([])

const loadRemainingRituals = () => {
  if (displayedRituals.value.length >= hymnalStore.rituals.length) return

  console.log('[Ritos] Loading remaining rituals in background...')
  displayedRituals.value = [...hymnalStore.rituals]
  console.log('[Ritos] All rituals loaded:', displayedRituals.value.length)
}

onMounted(() => {
  // Carrega primeiros 30 ritos imediatamente
  displayedRituals.value = hymnalStore.rituals.slice(0, INITIAL_LOAD)
  console.log('[Ritos] Initial load:', displayedRituals.value.length, 'rituals')

  // Carrega o resto quando o navegador estiver ocioso
  if (hymnalStore.rituals.length > INITIAL_LOAD) {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadRemainingRituals, { timeout: 2000 })
    } else {
      setTimeout(loadRemainingRituals, 100)
    }
  }
})

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
  // Se está buscando, busca em todos os ritos
  if (searchText.value) {
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
  }

  // Se não está buscando, usa apenas os ritos carregados
  return displayedRituals.value
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
