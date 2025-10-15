<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Hinos</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="showSearchbar = !showSearchbar">
            <ion-icon slot="icon-only" :icon="searchOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar v-if="showSearchbar">
        <ion-searchbar
          v-model="searchText"
          placeholder="Buscar hino..."
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
          <ion-label>
            <h2>{{ hymn.number }}. {{ hymn.title }}</h2>
            <p v-if="hymn.author">{{ hymn.author }}</p>
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
  IonButtons,
  IonButton,
  IonText,
} from '@ionic/vue'
import { searchOutline, heart, heartOutline } from 'ionicons/icons'
import type { Content } from '~/types/hymnal'

const hymnalStore = useHymnalStore()
const router = useRouter()
const searchText = ref('')
const showSearchbar = ref(false)

// SEO: Metadados para lista de hinos
useHead({
  title: 'Hinos - Hinário Evangélico Metodista',
  meta: [
    {
      name: 'description',
      content: 'Explore os hinos do Hinário Evangélico Metodista. Busque por título, número ou autor.'
    },
    {
      property: 'og:title',
      content: 'Hinos - Hinário Evangélico Metodista'
    },
    {
      property: 'og:description',
      content: 'Explore os hinos do Hinário Evangélico Metodista'
    }
  ]
})

const filteredHymns = computed(() => {
  if (!searchText.value) {
    return hymnalStore.hymns
  }
  
  const search = searchText.value.toLowerCase()
  return hymnalStore.hymns.filter((hymn: Content) => {
    return (
      hymn.title.toLowerCase().includes(search) ||
      hymn.number?.toString().includes(search) ||
      hymn.author?.toLowerCase().includes(search)
    )
  })
})

const navigateToHymn = (id: string) => {
  router.push(`/hinos/${id}`)
}
</script>
