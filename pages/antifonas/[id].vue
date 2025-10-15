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
        <h1 class="content-number">Antifona {{ content.number }}</h1>
        <h2 class="content-title">{{ content.title }}</h2>

        <div class="content-text" :style="{ fontSize: hymnalStore.fontSize + 'px' }">
          <div v-for="(line, index) in content.items" :key="index" class="content-line">
            {{ line }}
          </div>
        </div>
      </div>

      <ion-text v-else class="ion-padding">
        <p class="ion-text-center">Antifona não encontrada.</p>
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

const route = useRoute()
const router = useRouter()
const hymnalStore = useHymnalStore()
const id = route.params.id as string

const goBack = () => {
  router.back()
}

const content = computed(() => hymnalStore.getContentById(id))

watch(content, (newContent) => {
  if (newContent) {
    hymnalStore.setCurrentContent(newContent)
  }
}, { immediate: true })

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
  line-height: 1.8;
  text-align: center;
}

.content-line {
  margin-bottom: 0.8rem;
}
</style>
