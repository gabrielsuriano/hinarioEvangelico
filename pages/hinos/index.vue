<template>
  <ion-page>
    <AppHeader
      title="Hinos"
      show-back-button
      show-search
      v-model:search-value="searchText"
      search-placeholder="Buscar por título, autor ou letra..."
      @open-settings="openSettings"
    />

    <ion-content :fullscreen="true">
      <ion-list v-if="filteredHymns.length > 0">
        <ion-item
          v-for="hymn in filteredHymns"
          :key="hymn.id"
          button
          @click="navigateToHymn(hymn.id)"
        >
          <ion-label :style="{ fontSize: hymnalStore.fontSize + 'px' }">
            <h2>{{ hymn.number }}. {{ hymn.title }}</h2>
            <p v-if="hymn.author && hymn.author.length > 0">{{ hymn.author.join(' / ') }}</p>
          </ion-label>
          <ion-icon
            slot="end"
            :icon="hymnalStore.isFavorite(hymn.id) ? heart : heartOutline"
            :color="hymnalStore.isFavorite(hymn.id) ? 'danger' : ''"
            @click.stop="hymnalStore.toggleFavorite(hymn.id)"
          ></ion-icon>
        </ion-item>
      </ion-list>

      <ion-text v-else class="ion-padding">
        <p class="ion-text-center">Nenhum hino encontrado.</p>
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

// Carregamento progressivo: mostra 30 primeiro, depois carrega o resto
const INITIAL_LOAD = 30
const displayedHymns = ref<Content[]>([])
const allHymnsLoaded = ref(false)

// Carrega dados do hinário
await hymnalStore.loadHymnal()

// Carrega primeiros 30 hinos imediatamente
displayedHymns.value = hymnalStore.hymns.slice(0, INITIAL_LOAD)

// Carrega o resto em background (após renderização)
onMounted(() => {
  // Usa nextTick para garantir que a UI já foi renderizada
  nextTick(() => {
    // Usa requestIdleCallback se disponível, senão setTimeout
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        loadRemainingHymns()
      })
    } else {
      setTimeout(() => {
        loadRemainingHymns()
      }, 100)
    }
  })
})

const loadRemainingHymns = () => {
  console.log('📚 Carregando hinos restantes em background...')
  displayedHymns.value = hymnalStore.hymns
  allHymnsLoaded.value = true
  console.log('✅ Todos os hinos carregados!')
}

const openSettings = () => {
  settingsMenu.value?.present()
}

// SEO: Metadados para lista de hinos
useHead({
  title: 'Hinos - Hinário Evangélico',
  meta: [
    {
      name: 'description',
      content: 'Explore os hinos do Hinário Evangélico. Busque por título, número, autor ou letra do hino.'
    },
    {
      property: 'og:title',
      content: 'Hinos - Hinário Evangélico'
    },
    {
      property: 'og:description',
      content: 'Explore os hinos do Hinário Evangélico'
    }
  ]
})

const filteredHymns = computed(() => {
  // Se está buscando, sempre busca em TODOS os hinos (mesmo que não estejam carregados na tela)
  const hymnsToSearch = searchText.value ? hymnalStore.hymns : displayedHymns.value

  if (!searchText.value) {
    return hymnsToSearch
  }

  const search = searchText.value.toLowerCase()
  return hymnsToSearch.filter((hymn: Content) => {
    // Busca em título e número
    const basicMatch = (
      hymn.title.toLowerCase().includes(search) ||
      hymn.number?.toString().includes(search)
    )

    if (basicMatch) return true

    // Busca em autores (array)
    if (hymn.author && Array.isArray(hymn.author)) {
      const authorMatch = hymn.author.some((author: string) =>
        author.toLowerCase().includes(search)
      )
      if (authorMatch) return true
    }

    // Busca no conteúdo (letras dos hinos)
    if (Array.isArray(hymn.items)) {
      return hymn.items.some((item: any) => {
        if (typeof item === 'string') {
          return item.toLowerCase().includes(search)
        }
        if (typeof item === 'object' && item.lines && Array.isArray(item.lines)) {
          // Busca em cada linha do item
          return item.lines.some((line: string) =>
            line.toLowerCase().includes(search)
          )
        }
        return false
      })
    }

    return false
  })
})

const navigateToHymn = (id: string) => {
  router.push(`/hinos/${id}`)
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
