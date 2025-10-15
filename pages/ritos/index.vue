<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Ritos</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="showSearchbar = !showSearchbar">
            <ion-icon slot="icon-only" :icon="searchOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar v-if="showSearchbar">
        <ion-searchbar
          v-model="searchText"
          placeholder="Buscar rito..."
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
          <ion-label>
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

const filteredRituals = computed(() => {
  if (!searchText.value) {
    return hymnalStore.rituals
  }
  
  const search = searchText.value.toLowerCase()
  return hymnalStore.rituals.filter((ritual: Content) => {
    return (
      ritual.title.toLowerCase().includes(search) ||
      ritual.number?.toString().includes(search)
    )
  })
})

const navigateToRitual = (id: string) => {
  router.push(`/ritos/${id}`)
}
</script>
