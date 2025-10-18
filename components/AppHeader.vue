<template>
  <ion-header :translucent="true">
    <ion-toolbar>
      <!-- Botão de voltar (quando não é a home) -->
      <ion-buttons v-if="showBackButton" slot="start">
        <ion-button @click="handleBack">
          <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
        </ion-button>
      </ion-buttons>

      <!-- Título -->
      <ion-title>{{ title }}</ion-title>

      <!-- Botões da direita -->
      <ion-buttons slot="end">
        <!-- Botão de favorito (opcional) -->
        <ion-button v-if="showFavoriteButton" @click="$emit('toggleFavorite')">
          <ion-icon
            slot="icon-only"
            :icon="isFavorite ? heart : heartOutline"
          ></ion-icon>
        </ion-button>

        <!-- Botão de tema -->
        <ion-button @click="toggleTheme">
          <ion-icon slot="icon-only" :icon="themeStore.isDark ? sunny : moon"></ion-icon>
        </ion-button>

        <!-- Botão de configurações -->
        <ion-button @click="$emit('openSettings')">
          <ion-icon slot="icon-only" :icon="settings"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>

    <!-- Barra de busca (opcional) -->
    <ion-toolbar v-if="showSearch">
      <ion-searchbar
        :model-value="searchValue"
        @update:model-value="$emit('update:searchValue', $event)"
        :placeholder="searchPlaceholder"
        animated
        @ionClear="$emit('update:searchValue', '')"
      ></ion-searchbar>
    </ion-toolbar>
  </ion-header>
</template>

<script setup lang="ts">
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonSearchbar,
} from '@ionic/vue'
import {
  arrowBack,
  settings,
  moon,
  sunny,
  heart,
  heartOutline
} from 'ionicons/icons'
import { useThemeStore } from '~/stores/theme'

// Props
const props = defineProps<{
  title: string
  showBackButton?: boolean
  showFavoriteButton?: boolean
  isFavorite?: boolean
  showSearch?: boolean
  searchValue?: string
  searchPlaceholder?: string
}>()

// Emits
defineEmits<{
  toggleFavorite: []
  openSettings: []
  'update:searchValue': [value: string]
  back: []
}>()

const themeStore = useThemeStore()
const router = useRouter()

const toggleTheme = () => {
  themeStore.toggleTheme()
}

const handleBack = () => {
  router.back()
}
</script>

<style scoped>
/* Estilos adicionais se necessário */
</style>
