<template>
  <ion-page>
    <AppHeader
      :title="content?.title || 'Rito'"
      show-back-button
      show-favorite-button
      :is-favorite="hymnalStore.isFavorite(id)"
      @toggle-favorite="hymnalStore.toggleFavorite(id)"
      @open-settings="openSettings"
    />

    <ion-content :fullscreen="true" class="ion-padding">
      <div v-if="content">
        <h1 class="content-number">Rito {{ content.number }}</h1>
        <h2 class="content-title">{{ content.title }}</h2>

        <div class="content-text" :style="{ fontSize: hymnalStore.fontSize + 'px' }">
          <div v-for="(line, index) in content.items" :key="index" class="content-line">
            {{ line }}
          </div>
        </div>
      </div>

      <ion-text v-else class="ion-padding">
        <p class="ion-text-center">Rito não encontrado.</p>
      </ion-text>
    </ion-content>

    <SettingsMenu ref="settingsMenu" />
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonText,
} from '@ionic/vue'
import SettingsMenu from '~/components/SettingsMenu.vue'
import AppHeader from '~/components/AppHeader.vue'
import type { Content } from '~/types/hymnal'

const route = useRoute()
const router = useRouter()
const hymnalStore = useHymnalStore()
const id = route.params.id as string
const settingsMenu = ref()

const openSettings = () => {
  settingsMenu.value?.present()
}

// Carrega dados da store (funciona offline)
await hymnalStore.loadHymnal()

// Busca o conteúdo específico da store
const content = computed(() => {
  return hymnalStore.getContentById(id)
})

// SEO: Metadados dinâmicos para SSR
useHead(() => ({
  title: content.value?.title
    ? `${content.value.title} - Hinário Evangélico`
    : 'Hinário Evangélico',
  meta: [
    {
      name: 'description',
      content: content.value?.title
        ? `Rito ${content.value.number}: ${content.value.title}`
        : 'Hinário Evangélico'
    },
    {
      name: 'keywords',
      content: content.value?.title
        ? `rito ${content.value.number}, ${content.value.title}, hinário evangélico`
        : 'ritos, hinário, evangélico'
    },
    {
      property: 'og:title',
      content: content.value?.title
        ? `${content.value.title} - Hinário Evangélico`
        : 'Hinário Evangélico'
    },
    {
      property: 'og:description',
      content: content.value?.title
        ? `Rito ${content.value.number}: ${content.value.title}`
        : 'Hinário Evangélico'
    },
    {
      property: 'og:type',
      content: 'article'
    }
  ]
}))

onMounted(() => {
  if (content.value) {
    hymnalStore.setCurrentContent(content.value as Content)
  }
})
</script>

<style scoped>
.content-number {
  font-size: 1.2rem;
  color: var(--ion-color-medium);
  margin-bottom: 0.5rem;
}

.content-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 2rem;
}

.content-text {
  line-height: 2;
}

.content-line {
  margin-bottom: 1rem;
}
</style>
