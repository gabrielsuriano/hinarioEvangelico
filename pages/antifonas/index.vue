<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Antifonas</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="showSearchbar = !showSearchbar">
            <ion-icon slot="icon-only" :icon="searchOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar v-if="showSearchbar">
        <ion-searchbar
          v-model="searchText"
          placeholder="Buscar antifona..."
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
          <ion-label>
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

// SEO: Metadados para lista de antifonas
useHead({
  title: 'Antifonas - Hinário Evangélico Metodista',
  meta: [
    {
      name: 'description',
      content: 'Explore as antifonas do Hinário Evangélico Metodista. Textos litúrgicos para adoração.'
    },
    {
      property: 'og:title',
      content: 'Antifonas - Hinário Evangélico Metodista'
    }
  ]
})

const filteredAntiphons = computed(() => {
  if (!searchText.value) {
    return hymnalStore.antiphons
  }
  
  const search = searchText.value.toLowerCase()
  return hymnalStore.antiphons.filter((antiphon: Content) => {
    return (
      antiphon.title.toLowerCase().includes(search) ||
      antiphon.number?.toString().includes(search)
    )
  })
})

const navigateToAntiphon = (id: string) => {
  router.push(`/antifonas/${id}`)
}
</script>
