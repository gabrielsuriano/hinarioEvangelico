<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-button @click="goBack">
            <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ content?.title }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="hymnalStore.toggleFavorite(id)">
            <ion-icon
              slot="icon-only"
              :icon="hymnalStore.isFavorite(id) ? heart : heartOutline"
            ></ion-icon>
          </ion-button>
          <ion-button @click="presentActionSheet">
            <ion-icon slot="icon-only" :icon="ellipsisVertical"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <div v-if="content">
        <h1 class="hymn-number">Hino {{ content.number }}</h1>
        <h2 class="hymn-title">{{ content.title }}</h2>
        <p v-if="content.author" class="hymn-author">{{ content.author }}</p>

        <div class="hymn-content" :style="{ fontSize: hymnalStore.fontSize + 'px' }">
          <template v-if="Array.isArray(content.items) && typeof content.items[0] === 'object'">
            <div
              v-for="(item, index) in content.items"
              :key="index"
              :class="['hymn-line', `type-${item.type.toLowerCase()}`]"
            >
              {{ item.text }}
            </div>
          </template>
          <template v-else>
            <div v-for="(line, index) in content.items" :key="index" class="hymn-line">
              {{ line }}
            </div>
          </template>
        </div>
      </div>

      <ion-text v-else class="ion-padding">
        <p class="ion-text-center">Hino não encontrado.</p>
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
  IonButtons,
  IonButton,
  IonIcon,
  IonText,
  actionSheetController,
} from '@ionic/vue'
import { heart, heartOutline, ellipsisVertical, add, remove, text, arrowBack } from 'ionicons/icons'
import type { Content } from '~/types/hymnal'

const route = useRoute()
const router = useRouter()
const hymnalStore = useHymnalStore()
const id = route.params.id as string

const goBack = () => {
  router.back()
}

// Carrega dados no servidor para SSR
const { data: hymnalData } = await useFetch('/api/hymnal')

// Busca o conteúdo específico para SSR
const content = computed(() => {
  const data = hymnalData.value as any
  if (data?.contents) {
    return data.contents.find((item: any) => item.id === id)
  }
  return null
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
        ? `Hino ${content.value.number}: ${content.value.title}${content.value.author ? ' - ' + content.value.author : ''}` 
        : 'Hinário Evangélico Metodista'
    },
    {
      name: 'keywords',
      content: content.value?.title 
        ? `hino ${content.value.number}, ${content.value.title}, hinário metodista, hinário evangélico${content.value.author ? ', ' + content.value.author : ''}` 
        : 'hinário, metodista, evangélico'
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
        ? `Hino ${content.value.number}: ${content.value.title}` 
        : 'Hinário Evangélico Metodista'
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

const presentActionSheet = async () => {
  const actionSheet = await actionSheetController.create({
    header: 'Opções',
    buttons: [
      {
        text: 'Aumentar Fonte',
        icon: add,
        handler: () => {
          hymnalStore.increaseFontSize()
        },
      },
      {
        text: 'Diminuir Fonte',
        icon: remove,
        handler: () => {
          hymnalStore.decreaseFontSize()
        },
      },
      {
        text: 'Fonte Padrão',
        icon: text,
        handler: () => {
          hymnalStore.resetFontSize()
        },
      },
      {
        text: 'Cancelar',
        role: 'cancel',
      },
    ],
  })
  await actionSheet.present()
}
</script>

<style scoped>
.hymn-number {
  font-size: 1.2rem;
  color: var(--ion-color-medium);
  margin-bottom: 0.5rem;
}

.hymn-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.hymn-author {
  font-style: italic;
  color: var(--ion-color-medium);
  margin-bottom: 2rem;
}

.hymn-content {
  line-height: 1.8;
}

.hymn-line {
  margin-bottom: 0.8rem;
}

.type-verse {
  margin-left: 0;
}

.type-chorus,
.type-pre_chorus {
  margin-left: 2rem;
  font-style: italic;
}

.type-bridge {
  margin-left: 1rem;
  font-weight: bold;
}
</style>
