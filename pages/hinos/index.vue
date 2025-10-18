<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="router.push('/')">
            <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Hinos</ion-title>
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
          placeholder="Buscar por título, autor ou letra..."
          animated
          @ionClear="searchText = ''"
        ></ion-searchbar>
      </ion-toolbar>
    </ion-header>

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
  if (!searchText.value) {
    return hymnalStore.hymns
  }

  const search = searchText.value.toLowerCase()
  return hymnalStore.hymns.filter((hymn: Content) => {
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
